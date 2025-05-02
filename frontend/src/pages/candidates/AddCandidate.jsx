import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaUserPlus, FaHome, FaSignOutAlt, FaUserTie, FaLandmark, FaCity } from 'react-icons/fa';

const AddCandidate = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    name: '',
    party: '',
    position: '',
    city: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const { username, password, name, party, position, city } = formData;
    if (!username || !password || !name || !party || !position || !city) {
      setError('All fields are required');
      setSuccess('');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');
      
      const response = await axios.post('/api/candidates', formData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      console.log('Candidate added:', response.data);
      setSuccess('Candidate added successfully!');
      setError('');
      setFormData({
        username: '',
        password: '',
        name: '',
        party: '',
        position: '',
        city: ''
      });
      setTimeout(() => navigate('/manage-candidates'), 1500);
    } catch (err) {
      console.error('Error adding candidate:', err);
      setSuccess('');
      setError(err.response?.data?.message || 'Failed to add candidate. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
      {/* Premium Header */}
      <div className="w-full flex items-center justify-between mb-8 bg-white rounded-xl shadow-lg p-4 border border-gray-200">
        <div className="flex items-center">
          <img
            src="/src/assets/evm-logo.png"
            alt="Logo"
            className="w-12 h-12 mr-3"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLXZvdGUiPjxwYXRoIGQ9Ik0yMCAxNHYyYTIgMiAwIDAgMSAyIDJIMyI+PC9wYXRoPjxwYXRoIGQ9Ik0yMCAxNGgtNmEyIDIgMCAwIDEtMi0yVjNhMiAyIDAgMCAxIDItMmgxLjI3YTIgMiAwIDAgMSAxLjk0IDEuNUw0Mi41MSIgLz48L3N2Zz4=';
            }}
          />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Election Commission Portal
          </h1>
        </div>
        
        <div className="flex space-x-3">
          <button 
            onClick={() => navigate('/commission-dashboard')}
            className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-green-700 transition-all shadow-sm"
          >
            <FaHome className="text-sm" />
            <span>Dashboard</span>
          </button>
          <button 
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 bg-gradient-to-r from-gray-700 to-gray-900 text-white px-4 py-2 rounded-lg hover:from-gray-800 hover:to-black transition-all shadow-sm"
          >
            <FaSignOutAlt className="text-sm" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden border border-gray-200">
        {/* Title Section */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 p-6">
          <div className="flex items-center justify-center">
            <FaUserTie className="text-white text-3xl mr-3" />
            <h2 className="text-2xl font-bold text-white">Register New Candidate</h2>
          </div>
        </div>

        {/* Form Section */}
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 shadow-sm"
                    placeholder="Candidate's full name"
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
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 shadow-sm"
                    placeholder="Candidate's city"
                  />
                </div>
              </div>

              {/* Username Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 shadow-sm"
                    placeholder="Unique username"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password *
                </label>
                <div className="relative">
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 shadow-sm"
                    placeholder="Secure password"
                  />
                </div>
              </div>

              {/* Party Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Party/Symbol *
                </label>
                <select
                  name="party"
                  value={formData.party}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 shadow-sm"
                >
                  <option value="">Select a party</option>
                  <option value="PTI">PTI</option>
                  <option value="PML-N">PML-N</option>
                  <option value="PPP">PPP</option>
                  <option value="Independent">Independent</option>
                </select>
              </div>

              {/* Position Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Position *
                </label>
                <select
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 shadow-sm"
                >
                  <option value="">Select position</option>
                  <option value="National Assembly">National Assembly</option>
                  <option value="Provisional Assembly">Provisional Assembly</option>
                </select>
              </div>
            </div>

            {/* Messages */}
            <div className="mt-2">
              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  </div>
                </div>
              )}
              
              {success && (
                <div className="bg-green-50 border-l-4 border-green-500 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-green-700">{success}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center space-x-2 bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-4 rounded-xl hover:from-green-700 hover:to-green-800 transition-all shadow-lg hover:shadow-xl disabled:opacity-70"
              >
                <FaUserPlus className="text-xl" />
                <span className="font-semibold">
                  {loading ? 'Registering Candidate...' : 'Register Candidate'}
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddCandidate;