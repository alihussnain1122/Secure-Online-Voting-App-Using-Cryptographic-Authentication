import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaUserPlus, FaHome, FaSignOutAlt, FaIdCard, FaUser, FaPhone, FaCity } from 'react-icons/fa';

const AddVoter = () => {
  const [form, setForm] = useState({
    CNIC: '',
    voterID: '',
    name: '',
    phone: '',
    city: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (!/^\d{13}$/.test(form.CNIC)) {
      setError('CNIC must be a 13-digit number');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/voter/register', form, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      setSuccess('Voter registered successfully!');
      setForm({
        CNIC: '',
        voterID: '',
        name: '',
        phone: '',
        city: '',
      });

      setTimeout(() => {
        navigate('/manage-voters');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register voter. Please try again.');
      console.error('Error adding voter:', err);
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
              e.target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLXZvdGUiPjxwYXRoIGQ9Ik0yMCAxNHYyYTIgMiAwIDAgMSAyIDJIMyI+PC9wYXRoPjxwYXRoIGQ9Ik0yMCAxNGgtNmEyIDIgMCAwIDEtMi0yVjNhMiAyIDAgMCAxIDItMmgxLjI3YTIgMiAwIDAgMSAxLjk0IDEuNUw0Mi51MSIgLz48L3N2Zz4=';
            }}
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
            <FaUserPlus className="text-white text-3xl mr-3" />
            <h2 className="text-2xl font-bold text-white">Register New Voter</h2>
          </div>
        </div>

        {/* Form Section */}
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* CNIC Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CNIC (13 digits) *
                </label>
                <div className="relative">
                  <FaIdCard className="absolute left-3 top-3.5 text-gray-400" />
                  <input
                    type="text"
                    name="CNIC"
                    value={form.CNIC}
                    onChange={handleChange}
                    maxLength="13"
                    pattern="\d{13}"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 shadow-sm"
                    placeholder="Enter 13-digit CNIC"
                  />
                </div>
              </div>

              {/* Voter ID Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Voter ID *
                </label>
                <div className="relative">
                  <FaIdCard className="absolute left-3 top-3.5 text-gray-400" />
                  <input
                    type="text"
                    name="voterID"
                    value={form.voterID}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 shadow-sm"
                    placeholder="Enter voter ID"
                  />
                </div>
              </div>

              {/* Name Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <FaUser className="absolute left-3 top-3.5 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 shadow-sm"
                    placeholder="Enter full name"
                  />
                </div>
              </div>

              {/* Phone Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number *
                </label>
                <div className="relative">
                  <FaPhone className="absolute left-3 top-3.5 text-gray-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 shadow-sm"
                    placeholder="Enter phone number"
                  />
                </div>
              </div>

              {/* City Field */}
              <div className="md:col-span-2">
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
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 shadow-sm"
                    placeholder="Enter city"
                  />
                </div>
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
                  {loading ? 'Registering Voter...' : 'Register Voter'}
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddVoter;