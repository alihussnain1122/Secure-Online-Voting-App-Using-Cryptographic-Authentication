import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaUserEdit, FaHome, FaSignOutAlt, FaIdCard, FaUser, FaPhone, FaCity, FaSearch } from 'react-icons/fa';

const EditVoter = () => {
  const [form, setForm] = useState({
    CNIC: '',
    voterID: '',
    name: '',
    phone: '',
    city: ''
  });

  const [allVoters, setAllVoters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  // Fetch all voters when component mounts
  useEffect(() => {
    fetchAllVoters();
  }, []);

  const fetchAllVoters = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/voters', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAllVoters(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching voters:', err);
      setLoading(false);
      setError('Failed to load voters. Please try again.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');

      // Find voter with matching CNIC and VoterID from already fetched voters
      const matchedVoter = allVoters.find(
        (v) => v.CNIC === form.CNIC && v.voterID === form.voterID
      );

      if (!matchedVoter) {
        setError('No voter found with the given CNIC and Voter ID.');
        setLoading(false);
        return;
      }

      // Only include fields that are actually filled in the form
      const updatePayload = {};
      
      if (form.name) updatePayload.name = form.name;
      if (form.phone) updatePayload.phone = form.phone;
      if (form.city) updatePayload.city = form.city;
      
      // Always include identifiers
      updatePayload.CNIC = matchedVoter.CNIC;
      updatePayload.voterID = matchedVoter.voterID;

      // Check if any fields were actually updated
      if (Object.keys(updatePayload).length <= 2) {
        setError('Please fill at least one field to update.');
        setLoading(false);
        return;
      }

      // Proceed with update using matched voter's ID
      await axios.put(
        `/api/voters/${matchedVoter._id}`,
        updatePayload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Refresh the voters list after update
      await fetchAllVoters();
      
      // Reset form
      setForm({
        CNIC: '',
        voterID: '',
        name: '',
        phone: '',
        city: ''
      });

      setSuccess('Voter updated successfully!');
    } catch (err) {
      console.error('Error updating voter:', err);
      if (err.response) {
        setError(err.response.data.message || 'Failed to update voter. Please try again.');
      } else {
        setError('Network error or server not responding.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFillForm = (voter) => {
    setForm({
      CNIC: voter.CNIC,
      voterID: voter.voterID,
      name: voter.name || '',
      phone: voter.phone || '',
      city: voter.city || ''
    });
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
      <div className="max-w-6xl mx-auto">
        {/* Form Section */}
        <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-200 mb-8">
          {/* Title Section */}
          <div className="bg-gradient-to-r from-green-600 to-blue-600 p-6">
            <div className="flex items-center justify-center">
              <FaUserEdit className="text-white text-3xl mr-3" />
              <h2 className="text-2xl font-bold text-white">Edit Voter Information</h2>
            </div>
          </div>

          {/* Form Content */}
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
                      required
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
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 shadow-sm"
                      placeholder="Enter full name"
                    />
                  </div>
                </div>

                {/* Phone Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
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
                    City
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
              {/* CNIC and Voter ID Notice */}
<div>
  <div className="bg-red-50 border-l-4 border-red-600 p-4 animate-pulse shadow-lg rounded-md">
    <div className="flex items-center">
      <div className="flex-shrink-0">
        <svg className="h-6 w-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3a1 1 0 001 1h2a1 1 0 100-2h-1V7z" clipRule="evenodd" />
        </svg>
      </div>
      <div className="ml-3">
        <h3 className="text-lg text-red-800 font-bold uppercase tracking-wide">CNIC and Voter ID cannot be changed!</h3>
      </div>
    </div>
  </div>
</div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center items-center space-x-2 bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-4 rounded-xl hover:from-green-700 hover:to-green-800 transition-all shadow-lg hover:shadow-xl disabled:opacity-70"
                >
                  <FaUserEdit className="text-xl" />
                  <span className="font-semibold">
                    {loading ? 'Updating Voter...' : 'Update Voter'}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Voters List Section */}
        <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-200">
          {/* Title Section */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6">
            <div className="flex items-center justify-center">
              <FaSearch className="text-white text-3xl mr-3" />
              <h2 className="text-2xl font-bold text-white">All Registered Voters</h2>
            </div>
          </div>

          {/* Table Section */}
          <div className="p-6">
            {loading ? (
              <div className="text-center p-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
                <p className="mt-2 text-blue-700">Loading voters...</p>
              </div>
            ) : allVoters.length === 0 ? (
              <div className="text-center p-8">
                <p className="text-gray-600">No voters found in the system.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CNIC</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Voter ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">City</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {allVoters.map((voter) => (
                      <tr key={voter._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{voter.CNIC}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{voter.voterID}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{voter.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{voter.phone}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{voter.city}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <button
                            onClick={() => handleFillForm(voter)}
                            className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            <FaUserEdit className="mr-1" /> Fill Form
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

export default EditVoter;