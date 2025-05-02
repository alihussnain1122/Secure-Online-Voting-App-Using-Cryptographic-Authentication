import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DeleteCandidate = () => {
  const [form, setForm] = useState({
    username: '',
    password: '',
  });

  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Token not found. Please log in again.');
        return;
      }

      const response = await axios.get('/api/candidates', {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Access the correct property in the response
      const candidatesData = response.data.data || [];
      setCandidates(Array.isArray(candidatesData) ? candidatesData : []);
    } catch (err) {
      console.error("Error fetching candidates:", err);
      setError('Failed to load candidates. Please try again.');
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

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Token not found. Please log in again.');
      return;
    }

    try {
      const matchedCandidate = candidates.find(
        (candidate) => candidate.username === form.username
      );

      if (!matchedCandidate) {
        setError('No candidate found with the given username.');
        return;
      }

      await axios.delete('/api/candidate/delete', {
        headers: { Authorization: `Bearer ${token}` },
        data: { username: form.username, password: form.password },
      });

      setMessage('Candidate deleted successfully.');
      setForm({ username: '', password: '' });

      // Refresh the candidate list
      fetchCandidates();
    } catch (error) {
      console.error('Delete error:', error);
      setError(
        error.response?.data?.message || 'Error deleting candidate. Please try again.'
      );
    }
  };

  const handleFillForm = (candidate) => {
    setForm({
      username: candidate.username,
      password: '',
    });

    // Clear any previous messages
    setMessage('');
    setError('');

    // Scroll to top for better UX
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen w-full bg-red-50 flex flex-col items-center py-10 px-4">
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
        className="bg-white border-2 border-red-600 rounded-2xl p-8 w-[90%] max-w-md shadow-xl space-y-6 mb-8"
      >
        <h2 className="text-3xl font-bold text-center text-red-700 mb-2">
          Delete Candidate
        </h2>

        <div>
          <label className="block text-md font-medium text-red-900 mb-1">
            Username
          </label>
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="Enter candidate username"
            required
            className="w-full px-4 py-2 border border-red-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-700"
          />
        </div>

        <div>
          <label className="block text-md font-medium text-red-900 mb-1">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Enter candidate password"
            required
            className="w-full px-4 py-2 border border-red-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-700"
          />
        </div>

        {message && <p className="text-green-700 text-sm text-center">{message}</p>}
        {error && <p className="text-red-600 text-sm text-center">{error}</p>}

        <button
          type="submit"
          className="w-full py-3 bg-red-600 text-white font-semibold text-lg rounded-full hover:bg-red-800 transition duration-300 shadow-md"
        >
          Delete Candidate
        </button>
      </form>

      {/* Candidates List */}
      <div className="w-[90%] max-w-4xl">
        <h2 className="text-2xl font-bold text-red-700 mb-4 text-center">
          All Registered Candidates
        </h2>

        {loading ? (
          <div className="text-center py-8">
            <p className="text-red-600">Loading candidates...</p>
          </div>
        ) : candidates.length === 0 ? (
          <div className="text-center py-8 bg-white rounded-xl border-2 border-red-300">
            <p className="text-red-600">No candidates found</p>
          </div>
        ) : (
          <div className="bg-white border-2 border-red-200 rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-red-200">
                <thead className="bg-red-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-red-900 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-red-900 uppercase tracking-wider">Username</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-red-900 uppercase tracking-wider">Party</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-red-900 uppercase tracking-wider">Position</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-red-900 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-red-100">
                  {candidates.map((candidate) => (
                    <tr key={candidate.username} className="hover:bg-red-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-900">{candidate.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-red-800">{candidate.username}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-red-800">{candidate.party}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-red-800">{candidate.position}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-red-900">
                        <button
                          onClick={() => handleFillForm(candidate)}
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
          </div>
        )}
      </div>
    </div>
  );
};

export default DeleteCandidate;
