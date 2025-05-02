const Voter = require('../models/Voter');
const mongoose = require('mongoose');
// ADD VOTER
exports.registerVoter = async (req, res) => {
  const { CNIC, voterID, name, phone, city, email = "" } = req.body;

  if (!CNIC || !voterID || !name || !phone || !city) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    await Voter.create({
      CNIC,
      voterID,
      name,
      phone,
      city,
      email,
    });
    res.status(201).json({ message: "Voter registered successfully!" });
  } catch (error) {
    console.error("Add Voter Error:", error);
    res.status(500).json({ message: "Failed to add voter", error: error.message });
  }
};

// LOGIN VOTER (Placeholder)
exports.loginVoter = (req, res) => {
  res.send("Login successful");
};

// UPDATE VOTER
// UPDATE VOTER
exports.updateVoter = async (req, res) => {
  try {
    const { id } = req.params;  // Get the voter ID from the URL parameter
    const { name, phone, city } = req.body;

    // Find voter by ID and update the fields
    const updatedVoter = await Voter.findByIdAndUpdate(
      id,
      { name, phone, city },
      { new: true }  // This returns the updated voter after the operation
    );

    if (!updatedVoter) {
      return res.status(404).json({ message: "Voter not found with the given ID." });
    }

    res.json({ message: "Voter updated successfully", voter: updatedVoter });
  } catch (error) {
    console.error("❌ Error updating voter:", error.message);
    res.status(500).json({ message: "Failed to update voter", error: error.message });
  }
};


// DELETE VOTER
exports.verifyVoterBeforeDelete = async (req, res) => {
  const { id } = req.params;
  const { cnic, voterId } = req.body;

  try {
    const voter = await Voter.findById(id);

    if (!voter) return res.status(404).json({ success: false, message: 'Voter not found' });

    if (voter.cnic === cnic && voter.voterId === voterId) {
      return res.status(200).json({ success: true, message: 'Verification successful' });
    } else {
      return res.status(401).json({ success: false, message: 'CNIC or Voter ID does not match' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error verifying voter', error: error.message });
  }
};

// DELETE VOTER
exports.deleteVoter = async (req, res) => {
  try {
    // Try multiple possible field name variations
    const CNIC = req.body.CNIC || req.body.cnic;
    const voterID = req.body.voterID || req.body.voterId;
    
    console.log("Received data:", {
      CNIC_received: req.body.CNIC,
      cnic_received: req.body.cnic,
      voterID_received: req.body.voterID,
      voterId_received: req.body.voterId
    });

    if (!CNIC || !voterID) {
      return res.status(400).json({ 
        message: "CNIC and Voter ID are required",
        received_body: req.body // Include received body for debugging
      });
    }

    const deletedVoter = await Voter.findOneAndDelete({ 
      CNIC: CNIC, 
      voterID: voterID 
    });

    if (!deletedVoter) {
      return res.status(404).json({ 
        message: "Voter not found",
        search_criteria: { CNIC, voterID }
      });
    }

    res.json({ message: "Voter deleted successfully" });
  } catch (error) {
    console.error("Full error:", error);
    res.status(500).json({ 
      message: "Failed to delete voter",
      error: error.message,
      stack: error.stack
    });
  }
};


// GET VOTER PROFILE
exports.getVoterById = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("🔎 Looking for voter with ID:", id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid voter ID format' });
    }

    const voter = await Voter.findById(id);

    if (!voter) {
      return res.status(404).json({ message: 'Voter not found' });
    }

    res.status(200).json(voter);

  } catch (error) {
    console.error("❌ Error fetching voter by ID:", error.message);
    res.status(500).json({ message: "Server error while fetching voter." });
  }
};



//Display all voters  
exports.getAllVoters = async (req, res) => {
  try {
    const voters = await Voter.find();
    res.status(200).json(voters);
  } catch (error) {
    console.error("Error fetching voters:", error);
    res.status(500).json({ message: "Failed to fetch voters", error: error.message });
  }
};



// GET VOTER PROFILE
exports.getVoterProfile = async (req, res) => {
  try {
    const voterId = req.user.id; // Assuming JWT token puts voter ID in req.user
    const voter = await Voter.findById(voterId).select('-password'); // Don't return password

    if (!voter) {
      return res.status(404).json({ message: 'Voter not found' });
    }

    res.json(voter);
  } catch (err) {
    console.error('Error fetching voter profile:', err);
    res.status(500).json({ message: 'Server Error' });
  }
};

