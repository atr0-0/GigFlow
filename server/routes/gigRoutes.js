const express = require('express');
const router = express.Router();
const {
  getGigs,
  getGig,
  getMyGigs,
  createGig,
  updateGig,
  deleteGig
} = require('../controllers/gigController');
const { protect } = require('../middleware/auth');

router.get('/', getGigs);
router.get('/my/jobs', protect, getMyGigs);
router.get('/:id', getGig);
router.post('/', protect, createGig);
router.put('/:id', protect, updateGig);
router.delete('/:id', protect, deleteGig);

module.exports = router;
