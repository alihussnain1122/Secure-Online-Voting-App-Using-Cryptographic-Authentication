const mongoose = require('mongoose');

const electionResultSchema = new mongoose.Schema({
  city: { type: mongoose.Schema.Types.ObjectId, ref: 'City', required: true },
  candidates: [{
    name: String,
    votes: Number,
  }],
  totalVotes: { type: Number, default: 0 },
  totalValidVotes: { type: Number, default: 0 },
  winner: { type: String },
});

const ElectionResult = mongoose.model('ElectionResult', electionResultSchema);

module.exports = ElectionResult;
