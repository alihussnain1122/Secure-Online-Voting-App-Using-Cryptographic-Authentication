import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUserTimes, FaHome, FaSignOutAlt, FaUser, FaTrash, FaSearch, FaKey } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const DeleteCandidate = () => {
  const [form, setForm] = useState({
    username: '',
    password: ''
  });

  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication required. Please log in again.');
        return;
      }

      const response = await axios.get('/api/candidates', {
        headers: { Authorization: `Bearer ${token}` }
      });

      const candidatesData = response.data.data || [];
      setCandidates(Array.isArray(candidatesData) ? candidatesData : []);
    } catch (err) {
      console.error("Error fetching candidates:", err);
      setError(err.response?.data?.message || 'Failed to load candidates. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Authentication required. Please log in again.');
      setLoading(false);
      return;
    }

    try {
      const matchedCandidate = candidates.find(
        candidate => candidate.username === form.username
      );

      if (!matchedCandidate) {
        setError('No candidate found with the given username.');
        setLoading(false);
        return;
      }

      await axios.delete('/api/candidate/delete', {
        headers: { Authorization: `Bearer ${token}` },
        data: { username: form.username, password: form.password }
      });

      setSuccess('Candidate deleted successfully!');
      setForm({ username: '', password: '' });
      fetchCandidates();
    } catch (err) {
      console.error('Delete error:', err);
      setError(err.response?.data?.message || 'Error deleting candidate. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFillForm = (candidate) => {
    setForm({
      username: candidate.username,
      password: ''
    });
    setError('');
    setSuccess('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header */}
      <div className="w-full flex items-center justify-between mb-8 bg-white rounded-xl shadow-lg p-4 border border-gray-200">
              <div className="flex items-center">
                <img
                  src="/src/assets/evm-logo.png"
                  alt="EVM Logo"
                  className="w-12 h-12 mr-3"
                />
                <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  Online Voting App
                </h1>
              </div>
      
              <div className="flex space-x-3">
                <button 
                  onClick={() => navigate('/commission-dashboard')}
                  className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-green-700 transition-all shadow-sm"
                >
                  <FaHome />
                  <span>Dashboard</span>
                </button>
                <button 
                  onClick={() => navigate('/')}
                  className="flex items-center space-x-2 bg-gradient-to-r from-gray-700 to-gray-900 text-white px-4 py-2 rounded-lg hover:from-gray-800 hover:to-black transition-all shadow-sm"
                >
                  <FaSignOutAlt />
                  <span>Logout</span>
                </button>
              </div>
            </div>
      

      {/* Main Content */}
      <div className="max-w-6xl mx-auto">
        {/* Delete Form */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 mb-8">
          <div className="bg-red-600 p-6">
            <div className="flex items-center justify-center">
              <FaUserTimes className="text-white text-3xl mr-3" />
              <h2 className="text-2xl font-bold text-white">Delete Candidate</h2>
            </div>
          </div>

          <div className="p-6">
            <form onSubmit={handleDelete} className="space-y-6">
              {/* Username Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username *
                </label>
                <div className="relative">
                  <FaUser className="absolute left-3 top-3.5 text-gray-400" />
                  <input
                    type="text"
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="Enter candidate username"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password *
                </label>
                <div className="relative">
                  <FaKey className="absolute left-3 top-3.5 text-gray-400" />
                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="Enter candidate password"
                    required
                  />
                </div>
              </div>

              {/* Messages */}
              {error && (
                <div className="p-4 bg-red-50 text-red-700 rounded-lg border-l-4 border-red-500">
                  {error}
                </div>
              )}
              
              {success && (
                <div className="p-4 bg-green-50 text-green-700 rounded-lg border-l-4 border-green-500">
                  {success}
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full flex justify-center items-center space-x-2 text-white px-6 py-4 rounded-xl transition-all ${
                    loading ? 'bg-red-400' : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  <FaUserTimes className="text-xl" />
                  <span className="font-semibold">
                    {loading ? 'Deleting...' : 'Delete Candidate'}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Candidates List */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
          <div className="bg-blue-600 p-6">
            <div className="flex items-center justify-center">
              <FaSearch className="text-white text-3xl mr-3" />
              <h2 className="text-2xl font-bold text-white">Registered Candidates</h2>
            </div>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="text-center p-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
                <p className="mt-2 text-blue-700">Loading candidates...</p>
              </div>
            ) : candidates.length === 0 ? (
              <div className="text-center p-8 text-gray-600">
                No candidates found in the system.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Username</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Party</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Position</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {candidates.map(candidate => (
                      <tr key={candidate._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{candidate.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{candidate.username}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{candidate.party}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{candidate.position}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <button
                            onClick={() => handleFillForm(candidate)}
                            className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded-md transition-colors flex items-center"
                          >
                            <FaTrash className="mr-1" /> Select
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteCandidate;