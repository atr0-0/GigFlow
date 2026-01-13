const Gig = require('../models/Gig');

// @desc    Get all gigs (with search)
// @route   GET /api/gigs
// @access  Public/Private
const getGigs = async (req, res) => {
  try {
    const { search } = req.query;
    let query = { status: 'open' };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const gigs = await Gig.find(query)
      .populate('owner', 'name email')
      .populate('hiredFreelancer', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: gigs.length,
      data: gigs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single gig
// @route   GET /api/gigs/:id
// @access  Public/Private
const getGig = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id)
      .populate('owner', 'name email')
      .populate('hiredFreelancer', 'name email');

    if (!gig) {
      return res.status(404).json({
        success: false,
        message: 'Gig not found'
      });
    }

    res.status(200).json({
      success: true,
      data: gig
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get user's own gigs
// @route   GET /api/gigs/my/jobs
// @access  Private
const getMyGigs = async (req, res) => {
  try {
    const gigs = await Gig.find({ owner: req.user._id })
      .populate('hiredFreelancer', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: gigs.length,
      data: gigs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create new gig
// @route   POST /api/gigs
// @access  Private
const createGig = async (req, res) => {
  try {
    const { title, description, budget } = req.body;

    if (!title || !description || !budget) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    if (budget < 0) {
      return res.status(400).json({
        success: false,
        message: 'Budget must be a positive number'
      });
    }

    const gig = await Gig.create({
      title,
      description,
      budget,
      owner: req.user._id
    });

    const populatedGig = await Gig.findById(gig._id).populate('owner', 'name email');

    res.status(201).json({
      success: true,
      data: populatedGig
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update gig
// @route   PUT /api/gigs/:id
// @access  Private (Owner only)
const updateGig = async (req, res) => {
  try {
    let gig = await Gig.findById(req.params.id);

    if (!gig) {
      return res.status(404).json({
        success: false,
        message: 'Gig not found'
      });
    }

    if (gig.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this gig'
      });
    }

    if (gig.status === 'assigned') {
      return res.status(400).json({
        success: false,
        message: 'Cannot update an assigned gig'
      });
    }

    const { title, description, budget } = req.body;

    gig = await Gig.findByIdAndUpdate(
      req.params.id,
      { title, description, budget },
      { new: true, runValidators: true }
    ).populate('owner', 'name email');

    res.status(200).json({
      success: true,
      data: gig
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete gig
// @route   DELETE /api/gigs/:id
// @access  Private (Owner only)
const deleteGig = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id);

    if (!gig) {
      return res.status(404).json({
        success: false,
        message: 'Gig not found'
      });
    }

    if (gig.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this gig'
      });
    }

    await gig.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Gig deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getGigs,
  getGig,
  getMyGigs,
  createGig,
  updateGig,
  deleteGig
};
