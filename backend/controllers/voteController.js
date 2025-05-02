const crypto = require('crypto');
const Vote = require('../models/Vote');
const Voter = require('../models/Voter');
const Candidate = require('../models/Candidate'); // Top pe import karo

const algorithm = 'aes-256-cbc';

// Convert Base64 key to a 32-byte Buffer
const secretKey = Buffer.from(process.env.AES_SECRET_KEY, 'base64');

if (secretKey.length !== 32) {
  throw new Error('AES_SECRET_KEY must decode to exactly 32 bytes (256 bits)');
}
//vote encryption
const encrypt = (text) => {
  const iv = crypto.randomBytes(16); // 128-bit IV
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
  let encrypted = cipher.update(text, 'utf8');
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('base64') + ':' + encrypted.toString('base64');
};
//vote decryption
// vote decryption
const decrypt = (encryptedText) => {
  const [ivString, encryptedString] = encryptedText.split(':');
  const iv = Buffer.from(ivString, 'base64');
  const encrypted = Buffer.from(encryptedString, 'base64');
  const decipher = crypto.createDecipheriv(algorithm, secretKey, iv);
  let decrypted = decipher.update(encrypted);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString('utf8');
};

// --- Submit Vote Controller ---
exports.submitVote = async (req, res) => {
  try {
    const { voterID, voteChoice } = req.body;

    if (!voterID || !voteChoice) {
      return res.status(400).json({ message: 'voterID and voteChoice are required.' });
    }

    const voter = await Voter.findById(voterID);
    if (!voter) {
      return res.status(404).json({ message: 'Voter not found.' });
    }

    const existingVote = await Vote.findOne({ voterID });
    if (existingVote) {
      return res.status(403).json({ message: 'Voter has already cast their vote.' });
    }

    const encryptedVote = encrypt(voteChoice);

    const newVote = new Vote({
      voterID,
      city: voter.city,
      voteChoice: encryptedVote
    });
    await newVote.save();

    return res.status(201).json({ message: 'Vote successfully submitted.' });

  } catch (error) {
    console.error('Submit Vote Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

//Display votes result by city

// Fetch all unique city names
exports.getCities = async (req, res) => {
  try {
    const votes = await Vote.find({}, 'city'); // Just get city names
    const uniqueCities = [...new Set(votes.map(v => v.city))];
    res.json({ success: true, cities: uniqueCities });
  } catch (error) {
    console.error('Error fetching cities:', error);
    res.status(500).json({ success: false, message: 'Server error while fetching cities' });
  }
};

// Fetch results of a particular city
exports.getCityResults = async (req, res) => {
  const { city } = req.query;

  if (!city) {
    return res.status(400).json({ success: false, message: 'City is required' });
  }

  try {
    const result = await Vote.findOne({ city });

    if (!result) {
      return res.status(404).json({ success: false, message: 'No results found for the specified city' });
    }

    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Error fetching city results:', error);
    res.status(500).json({ success: false, message: 'Server error while fetching results' });
  }
};


//raat sunday 9:30 baje likha code result ko display karne ke liye
// Fetch all results, grouped by city

exports.getAllCityResults = async (req, res) => {
  try {
    const votes = await Vote.find(); // Sab votes uthao

    const cityResults = {};

    for (const vote of votes) {
      const city = vote.city;

      if (!cityResults[city]) {
        cityResults[city] = [];
      }

      const decryptedCandidateID = decrypt(vote.voteChoice); // Decrypt karo candidateID

      // Candidate ka naam database se fetch karo
      const candidate = await Candidate.findById(decryptedCandidateID).select('name');

      cityResults[city].push({
        voterID: vote.voterID,
        candidateName: candidate ? candidate.name : 'Unknown Candidate',
      });
    }

    // Ab votes count karo candidateName ke basis pe
    const formattedResults = {};

    for (const city in cityResults) {
      const votesArray = cityResults[city];
      const candidateCounts = {};

      votesArray.forEach(voteObj => {
        const candidateName = voteObj.candidateName;
        candidateCounts[candidateName] = (candidateCounts[candidateName] || 0) + 1;
      });

      formattedResults[city] = candidateCounts;
    }

    res.json({ success: true, data: formattedResults });

  } catch (error) {
    console.error('Error fetching all city results:', error);
    res.status(500).json({ success: false, message: 'Server error while fetching all city results' });
  }
};
