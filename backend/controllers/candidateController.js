const Candidate = require('../models/Candidate');
const bcrypt = require('bcryptjs');

//const asyncHandler = require('express-async-handler');

// @desc    Add a new candidate
// @route   POST /api/candidates
// @access  Private/Admin
exports.addCandidate = async (req, res) => {
    console.log("BODY RECEIVED:", req.body);

    try {
        const { username, name, password, party, position, city } = req.body;

        if (!username || !password || !name || !party || !position || !city) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Hash the password before saving (10 is the salt rounds)
        const hashedPassword = await bcrypt.hash(password, 10);

        const newCandidate = new Candidate({ 
            username, 
            password: hashedPassword, // Store the hashed password
            name, 
            party, 
            position, 
            city 
        });

        await newCandidate.save();

        res.status(201).json({ message: 'Candidate added successfully' });
    } catch (error) {
        console.error('Error adding candidate:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// @desc    Get all candidates
// @route   GET /api/candidates
// @access  Private/Admin
exports.getCandidates =  async (req, res) => {
  const candidates = await Candidate.find({}).select('-password');
  
  res.status(200).json({
    success: true,
    count: candidates.length,
    data: candidates
  });
};

// @desc    Get candidate by ID
// @route   GET /api/candidates/:id
// @access  Private/Admin
exports.getCandidateById = async (req, res) => {
  const candidate = await Candidate.findById(req.params.id).select('-password');
  
  if (candidate) {
    res.status(200).json({
      success: true,
      data: candidate
    });
  } else {
    res.status(404);
    throw new Error('Candidate not found');
  }
};

// @desc    Update candidate
// @route   PUT /api/candidates/:id
// @access  Private/Admin
exports.updateCandidate = async (req, res) => {
  const { username, name, party, position, password } = req.body;
  
  const candidate = await Candidate.findById(req.params.id);
  
  if (!candidate) {
    res.status(404);
    throw new Error('Candidate not found');
  }
  
  // If username is being changed, check if it already exists
  if (username && username !== candidate.username) {
    const candidateExists = await Candidate.findOne({ username });
    if (candidateExists) {
      res.status(400);
      throw new Error('Candidate with this username already exists');
    }
  }
  
  // Update fields
  candidate.username = username || candidate.username;
  candidate.name = name || candidate.name;
  candidate.party = party || candidate.party;
  candidate.position = position || candidate.position;
  
  // Only update password if provided
  if (password) {
    candidate.password = password;
  }
  
  const updatedCandidate = await candidate.save();
  
  res.status(200).json({
    success: true,
    message: 'Candidate updated successfully',
    data: {
      _id: updatedCandidate._id,
      username: updatedCandidate.username,
      name: updatedCandidate.name,
      party: updatedCandidate.party,
      position: updatedCandidate.position
    }
  });
};

// @desc    Delete a candidate
// @route   POST /api/candidate/delete
// @access  Private/Admin
exports.deleteCandidate = async (req, res) => {
  const { username, password } = req.body;

  // Validation
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    // Find candidate (include password in query)
    const candidate = await Candidate.findOne({ username }).select('+password');
    
    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }

    // Verify hashed password
    const isPasswordValid = await bcrypt.compare(password, candidate.password);
    
    // if (!isPasswordValid) {
    //   return res.status(401).json({ message: 'Incorrect password' });
    // }

    // Delete if password matches
    await Candidate.deleteOne({ username });
    return res.status(200).json({ message: 'Candidate deleted successfully' });

  } catch (error) {
    console.error('Error deleting candidate:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};