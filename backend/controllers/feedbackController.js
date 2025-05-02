// controllers/feedbackController.js
const Feedback = require('../models/Feedback');

// Submit feedback
const submitFeedback = async (req, res) => {
  try {
    // Accept both camelCase variations to be more flexible
    const { voterID, voterId,name, city, feedback, date } = req.body;
    const voterIdentifier = voterID || voterId;
    
    if (!voterIdentifier || !feedback|| !name || !city ||!date) {
      return res.status(400).json({ message: 'missing some fields.' });
    }

    const newFeedback = new Feedback({ 
      voterID: voterIdentifier, 
        name,
        city,
        date,
      feedback
    });
    await newFeedback.save();

    res.status(201).json({ message: 'Feedback submitted successfully.' });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all feedbacks
const getAllFeedbacks = async (req, res) => {
    try {
      const feedbacks = await Feedback.find().populate('voterID', 'name');
      res.status(200).json({ feedbacks });
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };

module.exports = {
  submitFeedback,
  getAllFeedbacks,
};