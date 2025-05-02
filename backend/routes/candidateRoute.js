const express = require('express');
const router = express.Router();
const candidateController = require('../controllers/candidateController');
const { deleteCandidate } = require('../controllers/candidateController');
const { protect } = require('../middleware/authMiddleware');
const Candidate = require('../models/Candidate');

// Add candidate
router.post('/', candidateController.addCandidate);

// Get all candidates
router.get('/', candidateController.getCandidates);

// Get candidate by ID
router.get('/:id', candidateController.getCandidateById);

// Update candidate
router.put('/:id', candidateController.updateCandidate);

// Delete candidate
router.delete('/delete', deleteCandidate);


module.exports = router;
