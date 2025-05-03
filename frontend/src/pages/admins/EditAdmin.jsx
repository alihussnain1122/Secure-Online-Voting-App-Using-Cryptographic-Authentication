import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaUserEdit, FaHome, FaSignOutAlt } from 'react-icons/fa';

const EditAdmin = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    city: ''
  });
  const [allAdmins, setAllAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllAdmins = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/admins', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        setAllAdmins(response.data);
      } catch (error) {
        console.error('Error fetching admins:', error);
        setError('Failed to load admin data');
      } finally {
        setLoading(false);
      }
    };

    fetchAllAdmins();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, password, city } = formData;

    if (!username || !city || !password) {
      setError('Username, password and city are required');
      setSuccess('');
      return;
    }
    if (password && password.length < 6) {
      setError('Password must be at least 6 characters long');
      setSuccess('');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      await axios.put('/api/admins', formData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      setSuccess('Presiding Officer updated successfully!');
      setFormData(prev => ({ ...prev, password: '' })); // Clear password field only

      setTimeout(() => navigate('/manage-admins'), 1500);
    } catch (err) {
      console.error('Error updating admin:', err);
      setSuccess('');
      setError(err.response?.data?.message || 'Failed to update officer. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAdmin = (admin) => {
    setFormData({
      username: admin.username || '',
      password: '', // Don't populate password for security
      city: admin.city || ''
    });
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

      <div className="max-w-6xl mx-auto space-y-6">
        {/* Edit Form Card */}
        <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-200">
          {/* Title */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 flex items-center justify-center">
            <FaUserEdit className="text-white text-3xl mr-3" />
            <h2 className="text-2xl font-bold text-white">Edit Presiding Officer</h2>
          </div>

          {/* Form */}
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Username */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter admin username"
                  required
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Leave blank to keep current password"
                />
                <p className="text-xs text-gray-500 mt-1">Leave blank to keep current password</p>
              </div>

              {/* City */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter city"
                  required
                />
              </div>

              {/* Messages */}
              {error && <p className="text-red-600 text-sm text-center">{error}</p>}
              {success && <p className="text-green-600 text-sm text-center">{success}</p>}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-blue-700 text-white font-semibold text-lg rounded-full hover:bg-blue-900 transition duration-300 shadow-md"
              >
                {loading ? 'Updating...' : 'Update Officer'}
              </button>
            </form>
          </div>
        </div>

        {/* Admins List Card */}
        <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-200">
          <div className="bg-gradient-to-r from-gray-600 to-gray-800 p-6">
            <h2 className="text-2xl font-bold text-white text-center">All Presiding Officers</h2>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="text-center p-4">
                <p className="text-gray-700">Loading officers...</p>
              </div>
            ) : allAdmins.length === 0 ? (
              <div className="text-center p-4">
                <p className="text-gray-700">No presiding officers found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">City</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {allAdmins.map((admin, index) => (
                      <tr key={admin._id || index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{admin.username}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{admin.city || '-'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button
                            onClick={() => handleSelectAdmin(admin)}
                            className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded text-sm shadow-sm"
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

export default EditAdmin;