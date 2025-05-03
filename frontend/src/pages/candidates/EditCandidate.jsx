import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUserEdit, FaHome, FaSignOutAlt, FaUser, FaSearch, FaCity, FaUsers, FaBriefcase } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const EditCandidate = () => {
  const [form, setForm] = useState({
    username: '',
    city: '',
    name: '',
    party: '',
    position: '',
  });

  const [allCandidates, setAllCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllCandidates();
  }, []);

  const fetchAllCandidates = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/candidates', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const candidates = Array.isArray(response.data)
        ? response.data
        : Array.isArray(response.data?.data)
        ? response.data.data
        : [];

      setAllCandidates(candidates);
    } catch (err) {
      console.error('Error fetching candidates:', err);
      setError('Failed to load candidates. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const matchedCandidate = allCandidates.find(
        c => c.username === form.username && c.city === form.city
      );

      if (!matchedCandidate) {
        setError('No candidate found with the given Username and City.');
        setLoading(false);
        return;
      }

      const updatePayload = {};
      if (form.name) updatePayload.name = form.name;
      if (form.party) updatePayload.party = form.party;
      if (form.position) updatePayload.position = form.position;
      updatePayload.username = matchedCandidate.username;
      updatePayload.city = matchedCandidate.city;

      if (Object.keys(updatePayload).length <= 2) {
        setError('Please fill at least one field to update.');
        setLoading(false);
        return;
      }

      await axios.put(
        `http://localhost:5000/api/candidates/${matchedCandidate._id}`,
        updatePayload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess('Candidate updated successfully!');
      setForm({
        username: '',
        city: '',
        name: '',
        party: '',
        position: '',
      });
      fetchAllCandidates();
    } catch (err) {
      console.error('Error updating candidate:', err);
      setError(err.response?.data?.message || 'Failed to update candidate. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFillForm = (candidate) => {
    setForm({
      username: candidate.username,
      city: candidate.city,
      name: candidate.name || '',
      party: candidate.party || '',
      position: candidate.position || '',
    });
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
        {/* Edit Form */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 mb-8">
          <div className="bg-blue-600 p-6">
            <div className="flex items-center justify-center">
              <FaUserEdit className="text-white text-3xl mr-3" />
              <h2 className="text-2xl font-bold text-white">Edit Candidate</h2>
            </div>
          </div>

          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter username"
                      required
                    />
                  </div>
                </div>

                {/* City Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City *
                  </label>
                  <div className="relative">
                    <FaCity className="absolute left-3 top-3.5 text-gray-400" />
                    <input
                      type="text"
                      name="city"
                      value={form.city}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter city"
                      required
                    />
                  </div>
                </div>

                {/* Name Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <FaUser className="absolute left-3 top-3.5 text-gray-400" />
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter full name"
                    />
                  </div>
                </div>

                {/* Party Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Party
                  </label>
                  <div className="relative">
                    <FaUsers className="absolute left-3 top-3.5 text-gray-400" />
                    <input
                      type="text"
                      name="party"
                      value={form.party}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter party"
                    />
                  </div>
                </div>

                {/* Position Field */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Position
                  </label>
                  <div className="relative">
                    <FaBriefcase className="absolute left-3 top-3.5 text-gray-400" />
                    <input
                      type="text"
                      name="position"
                      value={form.position}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter position"
                    />
                  </div>
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
                    loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  <FaUserEdit className="text-xl" />
                  <span className="font-semibold">
                    {loading ? 'Updating...' : 'Update Candidate'}
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
            ) : allCandidates.length === 0 ? (
              <div className="text-center p-8 text-gray-600">
                No candidates found in the system.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Username</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Party</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Position</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">City</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {allCandidates.map(candidate => (
                      <tr key={candidate._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{candidate.username}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{candidate.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{candidate.party}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{candidate.position}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{candidate.city}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <button
                            onClick={() => handleFillForm(candidate)}
                            className="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-md transition-colors"
                          >
                            Edit
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

export default EditCandidate;