import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const EditAdmin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [city, setCity] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [allAdmins, setAllAdmins] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch all admins
    const fetchAllAdmins = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/api/admins');
        setAllAdmins(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching admins:', error);
        setLoading(false);
        setError('Failed to load admin data');
      }
    };

    fetchAllAdmins();
  }, []);

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/admins');
        setUsername(data.username);
        setCity(data.city || '');
      } catch (error) {
        console.error(error);
        setError('Failed to load admin data');
      }
    };

    fetchAdmin();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
  
    // Replace with your actual state variables
    const adminData = {
      username,
      password,
      city,
    };
  
    try {
      await axios.put("/api/admins/", adminData); // Original PUT code kept as is
      setMessage('Admin updated successfully');
      setTimeout(() => {
        navigate('/manage-admins');
      }, 1500);
    } catch (error) {
      console.error('❌ Error updating admin:', error);
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError('Error updating admin');
      }
    }
  };
  
  // Function to fill form with selected admin data
  const handleSelectAdmin = (admin) => {
    setUsername(admin.username || '');
    setPassword(''); // Don't populate password for security
    setCity(admin.city || '');
    
    // Scroll to top for better UX
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen w-full bg-blue-50 flex flex-col items-center py-10 px-4 relative">
      {/* Logo */}
      <img
        src="/src/assets/evm-logo.png"
        alt="EVM Logo"
        className="fixed top-4 left-4 w-16 h-16 z-50"
      />

      {/* Title */}
      <h1 className="text-5xl font-extrabold text-blue-900 mb-6 tracking-wide">
        Pak Raaz
      </h1>

      {/* Edit Admin Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white border-2 border-blue-700 rounded-2xl p-8 w-[90%] max-w-md shadow-xl space-y-6 mb-8"
      >
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-2">
          Edit Presiding Information
        </h2>

        {/* Username Field */}
        <div>
          <label className="block text-md font-medium text-blue-900 mb-1">
            Username
          </label>
          <input
            type="text"
            className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
            required
          />
        </div>

        {/* Password Field */}
        <div>
          <label className="block text-md font-medium text-blue-900 mb-1">
            New Password
          </label>
          <input
            type="password"
            className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter new password"
          />
          <p className="text-xs text-gray-500 mt-1">Enter new password</p>
        </div>

        {/* City Field */}
        <div>
          <label className="block text-md font-medium text-blue-900 mb-1">
            City
          </label>
          <input
            type="text"
            className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter new city"
            required
          />
        </div>

        {/* Feedback Messages */}
        {message && (
          <p className="text-green-700 text-sm text-center bg-green-50 p-2 rounded">{message}</p>
        )}
        {error && (
          <p className="text-red-600 text-sm text-center bg-red-50 p-2 rounded">{error}</p>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full shadow-md transition-all duration-300"
        >
          Update Officer
        </button>
      </form>

      {/* Admins List Section */}
      <div className="border-2 border-blue-600 rounded-xl p-6 w-[90%] max-w-4xl shadow-xl mb-8">
        <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">
          All Presiding Officers
        </h2>
        
        {loading ? (
          <div className="text-center p-4">
            <p className="text-blue-700">Loading officers...</p>
          </div>
        ) : allAdmins.length === 0 ? (
          <div className="text-center p-4">
            <p className="text-gray-700">No presiding officers found in the system.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300 shadow-sm rounded-md">
              <thead className="bg-blue-100">
                <tr>
                  <th className="py-3 px-4 text-left text-blue-800">Username</th>
                  <th className="py-3 px-4 text-left text-blue-800">City</th>
                  <th className="py-3 px-4 text-left text-blue-800">Action</th>
                </tr>
              </thead>
              <tbody>
                {allAdmins.map((admin, index) => (
                  <tr key={admin._id || index} className={index % 2 === 0 ? 'bg-white' : 'bg-blue-50'}>
                    <td className="py-3 px-4 border-t">{admin.username}</td>
                    <td className="py-3 px-4 border-t">{admin.city || '-'}</td>
                    <td className="py-3 px-4 border-t">
                      <button
                        onClick={() => handleSelectAdmin(admin)}
                        className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded text-sm"
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
  );
};

export default EditAdmin;