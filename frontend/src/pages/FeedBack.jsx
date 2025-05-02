// FeedBack.jsx
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const FeedBack = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [listening, setListening] = useState(false);

  const recognitionRef = useRef(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/voter/profile', {
          headers: { Authorization: token },
        });
        setUserData(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setResponseMessage('Error fetching user details. Please try again.');
        setIsError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();

    // Initialize Speech Recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setFeedback((prevFeedback) => prevFeedback + ' ' + transcript);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setListening(false);
      };

      recognitionRef.current.onend = () => {
        setListening(false);
      };
    }
  }, []);

  const handleChange = (e) => {
    setFeedback(e.target.value);
  };

  const handleVoiceInput = () => {
    if (recognitionRef.current) {
      if (listening) {
        recognitionRef.current.stop();
        setListening(false);
      } else {
        recognitionRef.current.start();
        setListening(true);
      }
    } else {
      alert('Speech Recognition is not supported in your browser.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!feedback.trim()) {
      setResponseMessage('Feedback cannot be empty.');
      setIsError(true);
      return;
    }
  
    setResponseMessage('');
    setIsError(false);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/api/feedback/submit',
        {
          feedback: feedback,
          voterID: userData?.voterID || userData?.voterId,
          name: userData?.name,
          city: userData?.city,
          date: new Date().toISOString(), // Current date added here
        },
        { headers: { Authorization: token } }
      );
      
      navigate('/thank-you', {
        state: {
          message: response.data.message || 'Feedback submitted successfully!',
          userData,
        },
      });
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setResponseMessage(
        error.response?.data?.message ||
        'An error occurred while submitting your feedback. Please try again.'
      );
      setIsError(true);
    }
  };

  if (loading) {
    return (
      <div className="bg-blue-50 text-black min-h-screen py-10 px-6 relative">
        <div className="absolute top-4 left-4">
          <img src="/src/assets/evm-logo.png" alt="Logo" className="w-12 h-auto" />
        </div>
        <div className="max-w-4xl mx-auto bg-white border border-blue-600 rounded-xl p-8 shadow-md text-center">
          <div className="text-blue-700 font-medium text-lg">Loading voter data...</div>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="bg-blue-50 text-black min-h-screen py-10 px-6 relative">
        <div className="absolute top-4 left-4">
          <img src="/src/assets/evm-logo.png" alt="Logo" className="w-12 h-auto" />
        </div>
        <div className="max-w-4xl mx-auto bg-white border border-red-500 rounded-xl p-8 shadow-md text-center">
          <div className="text-red-600 font-medium text-lg">
            Error loading voter information. Please try logging in again.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-blue-50 text-black min-h-screen py-10 px-6 relative">
      <div className="absolute top-4 left-4">
        <img src="/src/assets/evm-logo.png" alt="Logo" className="w-12 h-auto" />
      </div>

      <div className="text-center mb-6 mt-4">
        <h1 className="text-4xl font-extrabold text-blue-900">SadiVote</h1>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="border border-blue-600 rounded-xl p-8 shadow-md mb-8 bg-white">
          <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">Voter Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border-b pb-3 md:border-b-0 md:pb-0 md:border-r md:pr-6">
              <p className="mb-3">
                <span className="font-semibold text-blue-800">Name:</span> {userData.name}
              </p>
              <p className="mb-3">
                <span className="font-semibold text-blue-800">CNIC:</span> {userData.CNIC || userData.cnic}
              </p>
              <p className="mb-3">
                <span className="font-semibold text-blue-800">Voter ID:</span> {userData.voterID || userData.voterId}
              </p>
            </div>
            <div>
              <p className="mb-3">
                <span className="font-semibold text-blue-800">Phone:</span> {userData.phone}
              </p>
              <p className="mb-3">
                <span className="font-semibold text-blue-800">City:</span> {userData.city}
              </p>
            </div>
          </div>
        </div>

        <div className="border border-blue-600 rounded-xl p-8 shadow-md bg-white">
          <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">Submit Your Feedback</h2>
          
          {responseMessage && (
            <div className={`p-4 mb-6 rounded-md text-center ${
              isError ? 'bg-red-50 text-red-600 border border-red-200' 
              : 'bg-green-50 text-green-600 border border-green-200'}`}>
              {responseMessage}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="feedback" className="block text-md font-medium text-blue-800 mb-2">
                Your Feedback
              </label>
              <textarea
                id="feedback"
                name="feedback"
                value={feedback}
                onChange={handleChange}
                required
                rows="5"
                placeholder="Write your feedback here or use the mic button to speak..."
                className="w-full p-3 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical"
              />
            </div>

            <button
              type="button"
              onClick={handleVoiceInput}
              className={`w-full py-3 ${listening ? 'bg-red-500' : 'bg-blue-500'} text-white font-bold rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors`}
            >
              {listening ? 'Stop Recording' : '🎤 Start Recording'}
            </button>

            <button
              type="submit"
              className="w-full py-3 bg-green-500 text-white font-bold rounded-md shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
            >
              Submit Feedback
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FeedBack;
