import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CommissionLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting:", username, password);
    
    // Validate fields
    if (!username || !password) {
      setError('Please fill in both fields');
      return;
    }

    // Set loading state to true
    setLoading(true);
    setError('');  // Reset previous errors
    
    try {
      console.log('Attempting login to:', '/api/commission/login');
      
      const response = await axios.post('/api/commission/login', {
        username,
        password,
      });

      // Log the full response for debugging
      console.log('Login response:', response.data);

      // Handle success - token received
      if (response.data && response.data.token) {
        localStorage.setItem('commission_token', response.data.token);
        navigate('/commission-dashboard');
      } else {
        setError('Unexpected response. Please try again.');
      }
    } catch (err) {
      console.error('Login error:', err);
      // Show the specific error message from the response if available
      setError(
        err.response?.data?.message || 
        `Login failed (${err.response?.status || 'unknown error'}). Please try again.`
      );
    } finally {
      setLoading(false); // Set loading to false once the API call finishes
    }
  };
  return (
    <div className="h-screen w-full bg-white flex flex-col items-center justify-center relative">
      {/* Logo in top-left corner */}
      <img
        src="/src/assets/evm-logo.png"
        alt="EVM Logo"
        className="fixed top-4 left-4 w-16 h-16 z-50"
      />

      {/* Title */}
      <h1 className="text-5xl font-extrabold text-green-800 mb-6 tracking-wide">
        PakRaaz
      </h1>

      {/* Login Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white border-2 border-green-700 rounded-2xl p-8 w-[90%] max-w-md shadow-xl space-y-6"
      >
        <h2 className="text-3xl font-bold text-center text-black mb-2">
          Commission Login
        </h2>

        {/* Username Field */}
        <div>
          <label className="block text-md font-medium text-green-900 mb-1">
            Username
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 border border-green-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-800"
            placeholder="Enter Username"
          />
        </div>

        {/* Password Field */}
        <div>
          <label className="block text-md font-medium text-green-900 mb-1">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-green-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-800"
            placeholder="Enter Password"
          />
        </div>

        {/* Error Message */}
        {error && <p className="text-red-600 text-sm text-center">{error}</p>}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 bg-green-700 text-white font-semibold text-lg rounded-full hover:bg-green-900 transition duration-300 shadow-md ${
            loading ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default CommissionLogin;