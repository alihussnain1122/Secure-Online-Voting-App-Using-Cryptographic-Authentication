import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import logo from '/src/assets/evm-logo.png';

const ReviewFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await axios.get('/api/feedbacks/all');
        setFeedbacks(response.data.feedbacks);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching feedback:', err);
        setError('Failed to fetch feedbacks.');
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, []);

  const handleBackToDashboard = () => {
    navigate('/commission-dashboard');
  };

  // Filter feedbacks based on selected filter
  const filteredFeedbacks = selectedFilter === 'all' 
    ? feedbacks 
    : feedbacks.filter(feedback => {
        if (selectedFilter === 'withID') return feedback.voterID;
        if (selectedFilter === 'anonymous') return !feedback.voterID;
        if (selectedFilter === 'recent') {
          const oneWeekAgo = new Date();
          oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
          return new Date(feedback.submittedAt) > oneWeekAgo;
        }
        return true;
      });

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-white">
        <img src={logo} alt="EVM Logo" className="h-20 w-20 mb-4" />
        <div className="w-12 h-12 border-4 border-green-700 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-green-800 font-medium">Loading feedback submissions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-white">
        <img src={logo} alt="EVM Logo" className="h-20 w-20 mb-4" />
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 max-w-md text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-red-700 text-lg font-medium mb-2">Error Loading Data</p>
          <p className="text-red-600">{error}</p>
          <button 
            onClick={handleBackToDashboard}
            className="mt-4 px-4 py-2 bg-green-700 text-white rounded-full hover:bg-green-800 transition duration-300 shadow-md"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white shadow-md border-b-2 border-green-700">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <img src={logo} alt="EVM Logo" className="h-12 w-12" />
            <h1 className="text-2xl font-extrabold text-green-800 tracking-wide">PakRaaz</h1>
          </div>
          
          <button
            onClick={handleBackToDashboard}
            className="py-2 px-4 bg-green-700 text-white font-semibold rounded-full hover:bg-green-900 transition duration-300 shadow-md flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-green-800 mb-3">Voter Feedback & Complaints</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">Review and address citizen feedback about their voting experience and concerns</p>
          <div className="w-24 h-1 bg-green-700 mx-auto mt-4"></div>
        </div>

        {/* Filter Controls */}
        <div className="mb-8 flex flex-wrap justify-center gap-3">
          <button 
            onClick={() => setSelectedFilter('all')} 
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              selectedFilter === 'all' 
                ? 'bg-green-700 text-white shadow-md' 
                : 'bg-green-50 text-green-800 border border-green-200 hover:bg-green-100'
            }`}
          >
            All Feedback
          </button>
          <button 
            onClick={() => setSelectedFilter('withID')} 
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              selectedFilter === 'withID' 
                ? 'bg-green-700 text-white shadow-md' 
                : 'bg-green-50 text-green-800 border border-green-200 hover:bg-green-100'
            }`}
          >
            With Voter ID
          </button>
          <button 
            onClick={() => setSelectedFilter('anonymous')} 
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              selectedFilter === 'anonymous' 
                ? 'bg-green-700 text-white shadow-md' 
                : 'bg-green-50 text-green-800 border border-green-200 hover:bg-green-100'
            }`}
          >
            Anonymous
          </button>
          <button 
            onClick={() => setSelectedFilter('recent')} 
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              selectedFilter === 'recent' 
                ? 'bg-green-700 text-white shadow-md' 
                : 'bg-green-50 text-green-800 border border-green-200 hover:bg-green-100'
            }`}
          >
            Recent (7 days)
          </button>
        </div>

        {/* Feedback Count Summary */}
        <div className="bg-green-50 rounded-xl p-4 mb-8 flex justify-center gap-8 flex-wrap">
          <div className="text-center">
            <p className="text-sm text-green-700 font-medium">Total Feedback</p>
            <p className="text-2xl font-bold text-green-800">{feedbacks.length}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-green-700 font-medium">With Voter ID</p>
            <p className="text-2xl font-bold text-green-800">
              {feedbacks.filter(f => f.voterID).length}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-green-700 font-medium">Anonymous</p>
            <p className="text-2xl font-bold text-green-800">
              {feedbacks.filter(f => !f.voterID).length}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-green-700 font-medium">Last 7 Days</p>
            <p className="text-2xl font-bold text-green-800">
              {feedbacks.filter(f => {
                const oneWeekAgo = new Date();
                oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
                return new Date(f.submittedAt) > oneWeekAgo;
              }).length}
            </p>
          </div>
        </div>

        {/* Feedback Cards */}
        <div className="space-y-6 max-w-4xl mx-auto">
          {filteredFeedbacks.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border-2 border-green-100 p-8 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-green-200 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              <p className="text-gray-600 text-lg font-medium">No feedback available</p>
              <p className="text-gray-500 mt-2">Check back later for new submissions</p>
            </div>
          ) : (
            filteredFeedbacks.map((feedback, index) => (
              <div 
                key={feedback._id || index} 
                className="bg-white rounded-xl shadow-md border-2 border-green-100 overflow-hidden transition-all hover:shadow-lg hover:border-green-200"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between flex-wrap gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                        {feedback.name || 'Anonymous Voter'}
                        {!feedback.name && (
                          <span className="ml-2 bg-gray-100 text-gray-500 text-xs px-2 py-0.5 rounded-full">
                            Anonymous
                          </span>
                        )}
                      </h3>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-gray-500">
                        {feedback.voterID ? (
                          <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded-full text-xs font-medium">
                            ID: {feedback.voterID}
                          </span>
                        ) : (
                          <span className="bg-gray-50 text-gray-500 px-2 py-0.5 rounded-full text-xs">
                            No ID provided
                          </span>
                        )}
                        {feedback.city && (
                          <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full text-xs">
                            {feedback.city}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-full">
                        {new Date(feedback.submittedAt).toLocaleDateString('en-US', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                      <span className="text-xs text-gray-400 mt-1">
                        {new Date(feedback.submittedAt).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                      {feedback.feedback}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  {/* <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end gap-3">
                    <button className="text-xs text-gray-500 hover:text-gray-700 px-3 py-1 rounded-full border border-gray-200 hover:border-gray-300 transition">
                      Mark as Reviewed
                    </button>
                    <button className="text-xs text-green-600 hover:text-green-800 px-3 py-1 rounded-full border border-green-200 hover:border-green-300 transition">
                      Add to Report
                    </button>
                  </div> */}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Footer */}
      {/* <div className="bg-white border-t-2 border-green-700 py-4 mt-10">
        <div className="container mx-auto px-6 text-center text-gray-500 text-sm">
          <p>© 2025 PakRaaz Election Commission Portal. All feedback is confidentially reviewed.</p>
        </div>
      </div> */}
    </div>
  );
};

export default ReviewFeedback;