const mongoose = require('mongoose');
const Bid = require('../models/Bid');
const Gig = require('../models/Gig');

// @desc    Submit a bid for a gig
// @route   POST /api/bids
// @access  Private
const createBid = async (req, res) => {
  try {
    const { gigId, message, price } = req.body;

    if (!gigId || !message || price === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    if (price < 0) {
      return res.status(400).json({
        success: false,
        message: 'Price must be a positive number'
      });
    }

    const gig = await Gig.findById(gigId);

    if (!gig) {
      return res.status(404).json({
        success: false,
        message: 'Gig not found'
      });
    }

    if (gig.status === 'assigned') {
      return res.status(400).json({
        success: false,
        message: 'This gig has already been assigned'
      });
    }

    if (gig.owner.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot bid on your own gig'
      });
    }

    const existingBid = await Bid.findOne({
      gig: gigId,
      freelancer: req.user._id
    });

    if (existingBid) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted a bid for this gig'
      });
    }

    const bid = await Bid.create({
      gig: gigId,
      freelancer: req.user._id,
      message,
      price
    });

    const populatedBid = await Bid.findById(bid._id)
      .populate('freelancer', 'name email')
      .populate('gig', 'title budget');

    const io = req.app.get('io');
    if (io) {
      io.to(gig.owner.toString()).emit('new-bid', {
        bidId: populatedBid._id,
        gigId: gigId,
        freelancerName: populatedBid.freelancer.name,
        freelancerEmail: populatedBid.freelancer.email,
        message: populatedBid.message,
        price: populatedBid.price,
        timestamp: new Date()
      });
    }

    res.status(201).json({
      success: true,
      data: populatedBid
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted a bid for this gig'
      });
    }
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all bids for a specific gig
// @route   GET /api/bids/:gigId
// @access  Private (Gig owner only)
const getBidsForGig = async (req, res) => {
  try {
    const { gigId } = req.params;

    const gig = await Gig.findById(gigId);

    if (!gig) {
      return res.status(404).json({
        success: false,
        message: 'Gig not found'
      });
    }

    if (gig.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view bids for this gig'
      });
    }

    const bids = await Bid.find({ gig: gigId })
      .populate('freelancer', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bids.length,
      data: bids
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get user's own bids
// @route   GET /api/bids/my/bids
// @access  Private
const getMyBids = async (req, res) => {
  try {
    const bids = await Bid.find({ freelancer: req.user._id })
      .populate('gig', 'title description budget status')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bids.length,
      data: bids
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Hire a freelancer (Atomic operation with MongoDB Transactions)
// @route   PATCH /api/bids/:bidId/hire
// @access  Private (Gig owner only)
const hireBid = async (req, res) => {
  // MongoDB transaction ensures all operations succeed or fail together
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { bidId } = req.params;

    const bid = await Bid.findById(bidId)
      .populate('gig')
      .populate('freelancer', 'name email')
      .session(session);

    if (!bid) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({
        success: false,
        message: 'Bid not found'
      });
    }

    const gig = await Gig.findById(bid.gig._id).session(session);

    if (!gig) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({
        success: false,
        message: 'Gig not found'
      });
    }

    if (gig.owner.toString() !== req.user._id.toString()) {
      await session.abortTransaction();
      session.endSession();
      return res.status(403).json({
        success: false,
        message: 'Not authorized to hire for this gig'
      });
    }

    if (gig.status === 'assigned') {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        message: 'This gig has already been assigned to someone'
      });
    }

    // ATOMIC OPERATIONS:
    
    // 1. Update the gig status to 'assigned' and set hired freelancer
    await Gig.findByIdAndUpdate(
      gig._id,
      {
        status: 'assigned',
        hiredFreelancer: bid.freelancer._id
      },
      { session }
    );

    // 2. Update the selected bid to 'hired'
    await Bid.findByIdAndUpdate(
      bidId,
      { status: 'hired' },
      { session }
    );

    // 3. Reject all other bids for this gig
    await Bid.updateMany(
      {
        gig: gig._id,
        _id: { $ne: bidId },
        status: 'pending'
      },
      { status: 'rejected' },
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    const updatedBid = await Bid.findById(bidId)
      .populate('freelancer', 'name email')
      .populate('gig', 'title description budget status');

    const io = req.app.get('io');
    if (io) {
      io.to(bid.freelancer._id.toString()).emit('hired', {
        message: `You have been hired for "${gig.title}"!`,
        gig: {
          _id: gig._id,
          id: gig._id,
          title: gig.title,
          budget: gig.budget
        },
        bid: {
          id: bid._id,
          price: bid.price
        }
      });
    }

    res.status(200).json({
      success: true,
      message: 'Freelancer hired successfully',
      data: updatedBid
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  createBid,
  getBidsForGig,
  getMyBids,
  hireBid
};
