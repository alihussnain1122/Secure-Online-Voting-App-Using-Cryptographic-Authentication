import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaUserMinus, FaHome, FaSignOutAlt, FaList } from 'react-icons/fa';

const DeleteVoter = () => {
  const [form, setForm] = useState({
    CNIC: '',
    voterID: '',
  });

  const [allVoters, setAllVoters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllVoters();
  }, []);

  const fetchAllVoters = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/voters', {
        headers: { Authorization: token },
      });
      setAllVoters(response.data);
    } catch (err) {
      console.error('Error fetching voters:', err);
      setError('Failed to load voters. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!form.CNIC || !form.voterID) {
      setError('All fields are required');
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      const matchedVoter = allVoters.find(
        (voter) =>
          voter.CNIC === form.CNIC &&
          voter.voterID === form.voterID
      );

      if (!matchedVoter) {
        setError('No voter found with the given CNIC and Voter ID.');
        return;
      }

      await axios.post(
        'http://localhost:5000/api/voter/delete',
        { cnic: matchedVoter.CNIC, voterId: matchedVoter.voterID },
        { headers: { Authorization: token } }
      );

      setMessage('Voter deleted successfully.');
      setForm({ CNIC: '', voterID: '' });

      fetchAllVoters(); // Refresh list
    } catch (error) {
      console.error('Delete error:', error);
      setError(
        error.response?.data?.message ||
          'Error deleting voter. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Function to fill the form with voter data when delete button is clicked
  const handleFillForm = (voter) => {
    setForm({
      CNIC: voter.CNIC,
      voterID: voter.voterID,
    });
    
    // Clear any previous messages
    setMessage('');
    setError('');
    
    // Scroll to top for better UX
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
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
            onClick={() => navigate('/admin-dashboard')}
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

      {/* Form Card */}
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden border border-gray-200 mb-8">
        {/* Title */}
        <div className="bg-gradient-to-r from-red-600 to-red-800 p-6 flex items-center justify-center">
          <FaUserMinus className="text-white text-3xl mr-3" />
          <h2 className="text-2xl font-bold text-white">Delete Voter</h2>
        </div>

        {/* Form */}
        <div className="p-8">
          <form onSubmit={handleDelete} className="space-y-6">
            {/* CNIC */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CNIC</label>
              <input
                type="text"
                name="CNIC"
                value={form.CNIC}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Enter CNIC"
                required
              />
            </div>

            {/* Voter ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Voter ID</label>
              <input
                type="text"
                name="voterID"
                value={form.voterID}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Enter Voter ID"
                required
              />
            </div>

            {/* Messages */}
            {error && <p className="text-red-600 text-sm text-center">{error}</p>}
            {message && <p className="text-green-600 text-sm text-center">{message}</p>}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-red-700 text-white font-semibold text-lg rounded-full hover:bg-red-900 transition duration-300 shadow-md"
            >
              {loading ? 'Deleting...' : 'Delete Voter'}
            </button>
          </form>
        </div>
      </div>

      {/* Voters List */}
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden border border-gray-200">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-4 flex items-center justify-center">
          <FaList className="text-white text-2xl mr-3" />
          <h2 className="text-xl font-bold text-white">All Registered Voters</h2>
        </div>
        
        <div className="p-4">
          {loading ? (
            <div className="text-center py-6">
              <p className="text-gray-600">Loading voters...</p>
            </div>
          ) : allVoters.length === 0 ? (
            <div className="text-center py-6 bg-gray-50 rounded-lg">
              <p className="text-gray-600">No voters found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Voter ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">CNIC</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {allVoters.map((voter) => (
                    <tr key={voter.voterID} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{voter.voterID}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{voter.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{voter.CNIC}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => handleFillForm(voter)}
                          className="bg-red-600 hover:bg-red-800 text-white py-1 px-3 rounded-lg text-sm transition duration-300"
                        >
                          Delete
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
  );
};

export default DeleteVoter;