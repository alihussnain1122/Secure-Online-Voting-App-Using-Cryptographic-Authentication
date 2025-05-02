const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
  candidate: { type: String, required: true },
  votes: { type: Number, default: 0 },
});

// Vote Schema
const voteSchema = new mongoose.Schema({
  voterID: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Voter', 
    required: true 
  }, // Reference to the Voter model
  voteChoice: { 
    type: String, 
    required: true 
  }, // Voted choice or candidate
  city: { 
    type: String, 
    required: true 
  }, // City where the vote was cast
  candidates: [candidateSchema],
  totalVotes: { type: Number, default: 0 },
  totalValidVotes: { type: Number, default: 0 },
  winner: { type: String },
  timestamp: { 
    type: Date, 
    default: Date.now 
  } // Timestamp for the vote
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

module.exports = mongoose.model('Vote', voteSchema);
