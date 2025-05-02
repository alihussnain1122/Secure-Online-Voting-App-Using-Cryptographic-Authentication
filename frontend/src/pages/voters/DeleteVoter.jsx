import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DeleteVoter = () => {
  const [form, setForm] = useState({
    CNIC: '',
    voterID: '',
  });

  const [allVoters, setAllVoters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

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

    try {
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
          Delete Voter
        </h2>

        <div>
          <label className="block text-md font-medium text-red-900 mb-1">
            CNIC
          </label>
          <input
            type="text"
            name="CNIC"
            value={form.CNIC}
            onChange={handleChange}
            placeholder="Enter CNIC"
            required
            className="w-full px-4 py-2 border border-red-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-700"
          />
        </div>

        <div>
          <label className="block text-md font-medium text-red-900 mb-1">
            Voter ID
          </label>
          <input
            type="text"
            name="voterID"
            value={form.voterID}
            onChange={handleChange}
            placeholder="Enter Voter ID"
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
          Delete Voter
        </button>
      </form>

      {/* Voters List */}
      <div className="w-[90%] max-w-4xl">
        <h2 className="text-2xl font-bold text-red-700 mb-4 text-center">
          All Registered Voters
        </h2>

        {loading ? (
          <div className="text-center py-8">
            <p className="text-red-600">Loading voters...</p>
          </div>
        ) : allVoters.length === 0 ? (
          <div className="text-center py-8 bg-white rounded-xl border-2 border-red-300">
            <p className="text-red-600">No voters found</p>
          </div>
        ) : (
          <div className="bg-white border-2 border-red-200 rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-red-200">
                <thead className="bg-red-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-red-900 uppercase tracking-wider">Voter ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-red-900 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-red-900 uppercase tracking-wider">CNIC</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-red-900 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-red-100">
                  {allVoters.map((voter) => (
                    <tr key={voter.voterID} className="hover:bg-red-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-900">{voter.voterID}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-red-800">{voter.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-red-800">{voter.CNIC}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-red-900">
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
          </div>
        )}
      </div>
    </div>
  );
};

export default DeleteVoter;