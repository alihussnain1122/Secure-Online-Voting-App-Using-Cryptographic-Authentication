import React, { useState } from 'react';
import axios from 'axios';

const SearchOfficer = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [officer, setOfficer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    setLoading(true);
    setError('');
    setOfficer(null);

    try {
      const res = await axios.get(`/api/officers/search?query=${searchQuery}`);
      setOfficer(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-6 lg:px-8 relative">
      {/* Logo Top Left */}
      <div className="absolute top-4 left-4">
        <img src="/src/assets/evm-logo.png" alt="Logo" className="w-12 h-auto" />
      </div>

      {/* Center Title */}
      <div className="text-center mt-4 mb-8">
        <h1 className="text-4xl font-extrabold text-green-900">SadiVote</h1>
      </div>

      <div className="max-w-xl mx-auto bg-white p-8 rounded-lg shadow-lg border border-green-600">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">🔍 Search Officer</h2>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Enter Officer Username"
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
        </div>

        {loading && <p className="text-blue-600">Searching...</p>}
        {error && <p className="text-red-500 font-semibold">{error}</p>}

        {officer && (
          <div className="mt-8 border-t pt-6">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Officer Details</h3>
            <div className="space-y-2 text-lg">
              <p><strong>Username:</strong> {officer.username}</p>
              <p><strong>Password:</strong> {officer.password}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchOfficer;
