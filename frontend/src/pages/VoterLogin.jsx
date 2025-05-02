import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
//import axios from 'axios';

const VoterLogin = () => {
  const [CNIC, setCNIC] = useState('');
  const [voterID, setVoterID] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!CNIC || !voterID) {
      setError('Please fill in both fields');
      return;
    }
  
    try {
      const response = await fetch('api/voter/login-voter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ CNIC, voterID }),
      });
      
  
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);  // Store JWT Token
        navigate('/voter-dashboard');
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error('Login Error:', error);
      setError('Something went wrong, please try again later.');
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
        onSubmit={handleLogin}
        className="bg-white border-2 border-green-700 rounded-2xl p-8 w-[90%] max-w-md shadow-xl space-y-6"
      >
        <h2 className="text-3xl font-bold text-center text-black mb-2">
          Voter Login
        </h2>

        {/* CNIC Field */}
        <div>
          <label className="block text-md font-medium text-green-900 mb-1">
            CNIC
          </label>
          <input
            type="text"
            value={CNIC}
            onChange={(e) => setCNIC(e.target.value)}
            className="w-full px-4 py-2 border border-green-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-800"
            placeholder="Enter CNIC"
          />
        </div>

        {/* Voter ID Field */}
        <div>
          <label className="block text-md font-medium text-green-900 mb-1">
            Voter ID
          </label>
          <input
            type="text"
            value={voterID}
            onChange={(e) => setVoterID(e.target.value)}
            className="w-full px-4 py-2 border border-green-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-800"
            placeholder="Enter Voter ID"
          />
        </div>

        {/* Error Message */}
        {error && <p className="text-red-600 text-sm text-center">{error}</p>}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3 bg-green-700 text-white font-semibold text-lg rounded-full hover:bg-green-900 transition duration-300 shadow-md"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default VoterLogin;
