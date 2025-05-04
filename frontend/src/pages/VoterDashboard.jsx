import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const VoterDashboard = () => {
  const navigate = useNavigate();
  const [voter, setVoter] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVoter = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/voter-login');
        return;
      }

      try {
        const res = await axios.get('/api/voter/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setVoter(res.data);
      } catch (err) {
        console.error('Error fetching voter profile:', err);
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          localStorage.removeItem('token');
          navigate('/voter-login');
        } else {
          alert("An unexpected error occurred. Try again later.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchVoter();
  }, [navigate]);

  const handleVoteClick = () => {
    navigate('/cast-vote');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/voter-login');
  };

  const handleExitClick = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="h-screen w-full bg-white flex flex-col items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-green-700 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-green-800 font-medium">Loading your information...</p>
        </div>
      </div>
    );
  }

  if (!voter) {
    return (
      <div className="h-screen w-full bg-white flex flex-col items-center justify-center">
        <div className="bg-white border-2 border-green-700 rounded-xl p-8 w-full max-w-md text-center">
          <h2 className="text-2xl font-bold text-green-800 mb-4">No Voter Data Found</h2>
          <button
            onClick={() => navigate('/voter-login')}
            className="px-6 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition"
          >
            Go to Voter Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-white flex flex-col">
      {/* Header with centered title - unchanged as requested */}
      <div className="p-4 border-b-2 border-green-700 relative">
        <div className="absolute left-4 top-4">
          <img
            src="/src/assets/evm-logo.png"
            alt="EVM Logo"
            className="w-12 h-12"
          />
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-green-800">PakRaaz Voting App</h1>
        </div>
        <div className="absolute right-4 top-4">
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm bg-green-700 text-white rounded-lg hover:bg-green-800 transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Enhanced Main Content */}
      <div className="flex-1 flex flex-col items-center p-6 overflow-y-auto">
        <div className="w-full max-w-4xl space-y-8">
          {/* Welcome Section with improved styling */}
          <div className="text-center bg-gradient-to-r from-green-50 to-white p-6 rounded-xl border border-green-100 shadow-sm">
            <h2 className="text-3xl font-bold text-green-800 mb-2">Welcome, {voter.name}</h2>
            <p className="text-lg text-gray-600">Your secure voting dashboard</p>
          </div>

          {/* Enhanced Content Box */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-green-700">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              {/* Voter Info Section with card styling */}
              <div className="p-6 bg-green-50">
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-green-800">Voter Information</h3>
                </div>
                
                <div className="space-y-5 pl-14">
                  <div>
                    <p className="text-xs font-semibold text-green-600 uppercase tracking-wider">Full Name</p>
                    <p className="text-lg font-medium text-gray-800">{voter.name}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-green-600 uppercase tracking-wider">CNIC</p>
                    <p className="text-lg font-medium text-gray-800">{voter.CNIC}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-green-600 uppercase tracking-wider">Voter ID</p>
                    <p className="text-lg font-medium text-gray-800">{voter.voterID}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-green-600 uppercase tracking-wider">Phone Number</p>
                    <p className="text-lg font-medium text-gray-800">{voter.phone}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-green-600 uppercase tracking-wider">Constituency</p>
                    <p className="text-lg font-medium text-gray-800">{voter.city}</p>
                  </div>
                </div>
              </div>

              {/* Video Instruction Section with improved styling */}
              <div className="p-6 flex flex-col">
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-green-800">Voting Instructions</h3>
                </div>
                
                <div className="flex-grow flex items-center justify-center">
                  <div className="w-full aspect-w-16 aspect-h-9 bg-gray-900 rounded-lg overflow-hidden shadow-inner">
                    <video
                      src="/src/assets/Mac.mp4"
                      muted
                      controls
                      className="w-full h-full object-cover"
                      poster="/src/assets/video-poster.jpg"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Buttons Section */}
            <div className="bg-green-700 bg-opacity-10 p-6 border-t-2 border-green-700">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md mx-auto">
                <button
                  onClick={handleVoteClick}
                  className="w-full py-3 px-6 bg-green-700 hover:bg-green-800 text-white font-bold rounded-lg transition flex items-center justify-center space-x-2 shadow-md"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span>Cast Your Vote</span>
                </button>
                <button
                  onClick={handleExitClick}
                  className="w-full py-3 px-6 bg-white border-2 border-red-500 hover:bg-red-50 text-red-600 font-bold rounded-lg transition flex items-center justify-center space-x-2 shadow-md"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                  <span>Exit Portal</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoterDashboard;