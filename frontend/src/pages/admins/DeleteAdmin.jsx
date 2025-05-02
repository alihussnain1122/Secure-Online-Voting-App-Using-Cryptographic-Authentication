import React, { useState } from 'react';
import axios from 'axios';

const DeleteAdmin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [city, setCity] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleDelete = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const res = await axios.post('/api/admin/delete', {
        username,
        password,
        city,
      });

      setMessage(res.data.message);
      setUsername('');
      setPassword('');
      setCity('');
    } catch (error) {
      setError(
        error.response?.data?.message || 'Error deleting admin. Please try again.'
      );
      console.error(error);
    }
  };

  return (
    <div className="h-screen w-full bg-red-50 flex flex-col items-center justify-center relative">
      <img
        src="/src/assets/evm-logo.png"
        alt="EVM Logo"
        className="fixed top-4 left-4 w-16 h-16 z-50"
      />

      <h1 className="text-5xl font-extrabold text-red-700 mb-6 tracking-wide">
        SadiVote
      </h1>

      <form
        onSubmit={handleDelete}
        className="bg-white border-2 border-red-600 rounded-2xl p-8 w-[90%] max-w-md shadow-xl space-y-6"
      >
        <h2 className="text-3xl font-bold text-center text-red-700 mb-2">
          Delete Presiding Officer
        </h2>

        <div>
          <label className="block text-md font-medium text-red-900 mb-1">
            Username
          </label>
          <input
            type="text"
            className="w-full px-4 py-2 border border-red-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-700"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter admin username"
            required
          />
        </div>

        <div>
          <label className="block text-md font-medium text-red-900 mb-1">
            Password
          </label>
          <input
            type="password"
            className="w-full px-4 py-2 border border-red-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-700"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            required
          />
        </div>

        <div>
          <label className="block text-md font-medium text-red-900 mb-1">
            City
          </label>
          <input
            type="text"
            className="w-full px-4 py-2 border border-red-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-700"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city name"
            required
          />
        </div>

        {message && <p className="text-green-700 text-sm text-center">{message}</p>}
        {error && <p className="text-red-600 text-sm text-center">{error}</p>}

        <button
          type="submit"
          className="w-full py-3 bg-red-600 text-white font-semibold text-lg rounded-full hover:bg-red-800 transition duration-300 shadow-md"
        >
          Delete Officer
        </button>
      </form>
    </div>
  );
};

export default DeleteAdmin;
