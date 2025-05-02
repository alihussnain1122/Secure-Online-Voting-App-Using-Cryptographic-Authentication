const express = require('express');
const router = express.Router();

const {
  registerVoter,
  getAllVoters,
  getVoterById,
  deleteVoter,
  updateVoter,
} = require('../controllers/voterController');
const { getVoterProfile } = require('../controllers/voterController');
const { submitVote } = require("../controllers/voteController");
const { protect } = require('../middleware/authMiddleware');
const authController = require('../controllers/authController');
// Routes
router.post('/register', registerVoter);
router.post("/vote", submitVote);
router.get('/', getAllVoters);
router.put('/:id', updateVoter);

// routes/voterRoutes.js
router.post('/delete', deleteVoter); // POST because we're using req.body
router.get('/profile', protect('voter'), getVoterProfile);
router.post('/login-voter', authController.loginVoter);
//router.get('/:id', getVoterById);
router.get('/voters', getAllVoters);


module.exports = router;
