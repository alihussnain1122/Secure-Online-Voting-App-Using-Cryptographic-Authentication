import React, { useState } from 'react';
import axios from 'axios';

const SearchVoter = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [voter, setVoter] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    setLoading(true);
    setError('');
    setVoter(null);

    try {
      const res = await axios.get(`/api/voters/search?query=${searchQuery}`);
      setVoter(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setSearchQuery('');
    setVoter(null);
    setError('');
  };

  return (
    <div className="bg-white text-black min-h-screen py-10 px-6 relative">
      {/* Logo top-left */}
      <div className="absolute top-4 left-4">
        <img src="/src/assets/evm-logo.png" alt="Logo" className="w-12 h-auto" />
      </div>

      {/* Center heading */}
      <div className="text-center mb-4 mt-4">
        <h1 className="text-4xl font-extrabold text-green-900">SadiVote</h1>
      </div>

      <div className="border border-green-600 rounded-xl p-8 max-w-4xl mx-auto shadow-md">
        <h2 className="text-2xl font-bold text-center text-green-600 mb-6">🔍 Search Voter</h2>

        {/* Input and Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Enter Voter ID or CNIC"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-4 py-3 border rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            onClick={handleSearch}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md text-lg"
          >
            Search
          </button>
          <button
            onClick={handleClear}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-3 rounded-md text-lg"
          >
            Clear
          </button>
        </div>

        {/* Loading/Error Messages */}
        {loading && <p className="text-blue-600">Searching...</p>}
        {error && <p className="text-red-500 font-semibold">{error}</p>}

        {/* Voter Info Display */}
        {voter && (
          <div className="mt-8 border-t pt-6">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Voter Details</h3>
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="w-40 h-40 overflow-hidden rounded-full border shadow">
                <img
                  src={voter.imageURL || '/default-avatar.png'}
                  alt="Voter"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 space-y-2 text-lg">
                <p><strong>Name:</strong> {voter.name}</p>
                <p><strong>CNIC:</strong> {voter.cnic}</p>
                <p><strong>Voter ID:</strong> {voter._id}</p>
                <p><strong>City:</strong> {voter.city || 'N/A'}</p>
                <p><strong>Phone:</strong> {voter.phone || 'N/A'}</p>
                <p><strong>Email:</strong> {voter.email || 'N/A'}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchVoter;
