import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CastVote = () => {
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [voteSuccess, setVoteSuccess] = useState(false);
  const [userCity, setUserCity] = useState('');
  const navigate = useNavigate();
  const [voterID, setVoterID] = useState('');
  const normalizeCityName = (city) => {
    if (!city) return '';
    return city.toString().trim().toLowerCase()
      .replace(/\b(st|saint)\b/g, 'st')
      .replace(/\s+/g, ' ')
      .replace(/[^a-z\s]/g, '');
  };

  useEffect(() => {
    const fetchUserDataAndCandidates = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Authentication required. Please log in.');
          setLoading(false);
          return;
        }

        const userResponse = await axios.get('/api/voter/profile', {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        const city = normalizeCityName(userResponse.data.city);
        setUserCity(city);
        setVoterID(userResponse.data._id);
        if (!city) {
          setError('Your profile does not have a city specified. Please update your profile.');
          setLoading(false);
          return;
        }

        const candidatesResponse = await axios.get('/api/candidates', {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        const allCandidates = candidatesResponse.data.data || [];
        const cityCandidates = allCandidates.filter(candidate =>
          normalizeCityName(candidate.city) === city
        );
        setCandidates(cityCandidates);

        if (cityCandidates.length === 0) {
          setError(`No candidates found for your city (${city}). Please contact support.`);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load candidates. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserDataAndCandidates();
  }, []);

  const handleCandidateSelect = (candidate) => {
    setSelectedCandidate(candidate);
  };

  const handleVoteSubmit = async () => {
    if (!selectedCandidate) return;

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication required. Please log in.');
        setIsSubmitting(false);
        return;
      }

      await axios.post('/api/vote', {
        voterID,
        voteChoice: selectedCandidate._id
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      setVoteSuccess(true);
      setTimeout(() => {
        navigate('/thank-you');
      }, 1500);
    } catch (error) {
      console.error('Error casting vote:', error);
      if (error.response) {
        switch (error.response.status) {
          case 401:
            setError('Your session has expired. Please log in again.');
            break;
          case 403:
            setError('You have already cast your vote or are not eligible to vote.');
            break;
          case 404:
            setError('The selected candidate is no longer available.');
            break;
          default:
            setError(error.response.data.message || 'Error casting your vote.');
        }
      } else {
        setError('Network error. Please check your connection.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderCandidateCard = (candidate) => {
    const isSelected = selectedCandidate && selectedCandidate._id === candidate._id;

    return (
      <div
        key={candidate._id}
        className={`border-2 rounded-xl p-4 flex items-center space-x-4 cursor-pointer transition-all duration-200 ${
          isSelected
            ? 'border-green-600 bg-green-50 shadow-md ring-2 ring-green-200'
            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
        }`}
        onClick={() => handleCandidateSelect(candidate)}
      >
        <div className={`flex items-center justify-center h-6 w-6 rounded-full border-2 ${
          isSelected ? 'border-green-600 bg-green-600' : 'border-gray-400'
        }`}>
          {isSelected && <div className="h-3 w-3 rounded-full bg-white"></div>}
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-semibold text-gray-800">{candidate.name}</h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              candidate.party === 'PTI' ? 'bg-green-100 text-green-800' :
              candidate.party === 'PML-N' ? 'bg-yellow-100 text-yellow-800' :
              candidate.party === 'PPP' ? 'bg-red-100 text-red-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {candidate.party}
            </span>
          </div>
          {candidate.symbol && (
            <p className="text-sm text-gray-600 mt-1">Symbol: {candidate.symbol}</p>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex flex-col items-center p-6">
      {/* Header */}
      <div className="w-full max-w-4xl flex justify-between items-center mb-8">
        <div className="flex items-center space-x-3">
          <img src="/src/assets/evm-logo.png" alt="EVM Logo" className="h-12 w-12" />
          <h1 className="text-2xl font-bold text-green-800">PakRaaz EVS</h1>
        </div>
        <button onClick={() => navigate(-1)} className="text-gray-600 hover:text-gray-800">
          Back
        </button>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg overflow-hidden border border-green-100">
        <div className="bg-gradient-to-r from-green-600 to-green-700 p-6 text-center">
          <h2 className="text-2xl font-bold text-white">Cast Your Vote</h2>
          <p className="text-green-100 mt-2">Your voice matters in shaping our future</p>
        </div>

        <div className="p-6">
          {userCity && (
            <div className="mb-6 text-center">
              <p className="text-lg font-medium text-gray-700">
                Voting for candidates in <span className="font-semibold text-green-600">{userCity}</span>
              </p>
            </div>
          )}

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
          ) : error && !candidates.length ? (
            <div className="bg-red-50 text-red-700 p-4 rounded-lg text-center">
              <p>{error}</p>
            </div>
          ) : candidates.length > 0 ? (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Select your candidate:</h3>
              {candidates.map(candidate => renderCandidateCard(candidate))}
            </div>
          ) : (
            <p className="text-center py-8 text-gray-500">No candidates available for voting.</p>
          )}

          {error && candidates.length > 0 && (
            <div className="mt-4 bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded">
              <p>{error}</p>
            </div>
          )}

          {voteSuccess && (
            <div className="mt-4 bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded">
              <p>Your vote has been successfully cast! Redirecting...</p>
            </div>
          )}

          <div className="mt-8 flex justify-center">
            <button
              className={`px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg shadow-md transition-all ${
                !selectedCandidate || isSubmitting
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:from-green-700 hover:to-green-800 hover:shadow-lg transform hover:-translate-y-1'
              }`}
              onClick={handleVoteSubmit}
              disabled={!selectedCandidate || isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Processing...
                </div>
              ) : (
                'Submit Vote'
              )}
            </button>
            
          </div>
        </div>
      </div>

      {/* Footer */}
      {/* <footer className="mt-12 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} PakRaaz Electronic Voting System. All rights reserved.
      </footer> */}
    </div>
  );
};

export default CastVote;
