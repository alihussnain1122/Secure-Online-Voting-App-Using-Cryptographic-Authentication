import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EditCandidate = () => {
  const [form, setForm] = useState({
    username: '',
    city: '',
    name: '',
    party: '',
    position: '',
  });

  const [error, setError] = useState('');
  const [allCandidates, setAllCandidates] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAllCandidates();
  }, []);

  const fetchAllCandidates = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/candidates', {
        headers: { Authorization: token },
      });

      const candidates = Array.isArray(response.data)
        ? response.data
        : Array.isArray(response.data?.data)
        ? response.data.data
        : [];

      setAllCandidates(candidates);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching candidates:', err);
      setLoading(false);
      setError('Failed to load candidates. Please try again.');
      setAllCandidates([]);
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

    try {
      const token = localStorage.getItem('token');
      const matchedCandidate = allCandidates.find(
        (c) => c.username === form.username && c.city === form.city
      );

      if (!matchedCandidate) {
        setError('No candidate found with the given Username and City.');
        return;
      }

      const updatePayload = {};

      if (form.name) updatePayload.name = form.name;
      if (form.party) updatePayload.party = form.party;
      if (form.position) updatePayload.position = form.position;

      updatePayload.username = matchedCandidate.username;
      updatePayload.city = matchedCandidate.city;

      if (Object.keys(updatePayload).length <= 2) {
        setError('Please fill at least one field to update.');
        return;
      }

      await axios.put(
        `http://localhost:5000/api/candidates/${matchedCandidate._id}`,
        updatePayload,
        {
          headers: { Authorization: token },
        }
      );

      fetchAllCandidates();
      setForm({
        username: '',
        city: '',
        name: '',
        party: '',
        position: '',
      });

      alert('Candidate updated successfully!');
    } catch (err) {
      console.error('Error updating candidate:', err);
      if (err.response) {
        setError(`Error: ${err.response.data.message || 'Failed to update candidate.'}`);
      } else {
        setError('Network error or server not responding.');
      }
    }
  };

  const handleFillForm = (candidate) => {
    setForm({
      username: candidate.username,
      city: candidate.city,
      name: candidate.name || '',
      party: candidate.party || '',
      position: candidate.position || '',
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bg-blue-50 text-black min-h-screen py-10 px-6 relative">
      <div className="absolute top-4 left-4">
        <img src="/src/assets/evm-logo.png" alt="Logo" className="w-12 h-auto" />
      </div>

      <div className="text-center mb-4 mt-4">
        <h1 className="text-4xl font-extrabold text-blue-900">Pak Raaz</h1>
      </div>

      <div className="border border-blue-600 rounded-xl p-8 max-w-4xl mx-auto shadow-md mb-8">
        <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">Edit Candidate Information</h2>

        {error && (
          <div className="text-red-600 text-center mb-4 p-2 bg-red-50 border border-red-200 rounded">
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-wrap gap-6 justify-between">
          <div className="w-full">
            <h3 className="text-lg font-medium text-blue-800 mb-2">Identification (Required)</h3>
            <div className="flex flex-wrap gap-4">
              {['username', 'city'].map((field) => (
                <div key={field} className="flex-1 min-w-[250px]">
                  <label htmlFor={field} className="block text-md font-medium text-black">
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </label>
                  <input
                    id={field}
                    name={field}
                    type="text"
                    value={form[field] || ''}
                    onChange={handleChange}
                    className="w-full p-3 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={`Enter ${field}`}
                    required
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="w-full mt-4">
            <h3 className="text-lg font-medium text-blue-800 mb-2">Fields to Update (Fill at least one)</h3>
            <div className="flex flex-wrap gap-4">
              {['name', 'party', 'position'].map((field) => (
                <div key={field} className="flex-1 min-w-[250px]">
                  <label htmlFor={field} className="block text-md font-medium text-black">
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </label>
                  <input
                    id={field}
                    name={field}
                    type="text"
                    value={form[field] || ''}
                    onChange={handleChange}
                    className="w-full p-3 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={`Enter ${field}`}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="w-full mt-4">
            <button
              type="submit"
              className="w-full py-3 bg-blue-700 text-white font-bold rounded-md shadow-md hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Update Candidate
            </button>
          </div>
        </form>
      </div>

      <div className="border border-blue-600 rounded-xl p-8 max-w-6xl mx-auto shadow-md">
        <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">All Registered Candidates</h2>

        {loading ? (
          <div className="text-center p-4">
            <p className="text-blue-700">Loading candidates...</p>
          </div>
        ) : allCandidates.length === 0 ? (
          <div className="text-center p-4">
            <p className="text-gray-700">No candidates found in the system.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300 shadow-sm rounded-md">
              <thead className="bg-blue-100">
                <tr>
                  <th className="py-3 px-4 text-left text-blue-800">Username</th>
                  <th className="py-3 px-4 text-left text-blue-800">Name</th>
                  <th className="py-3 px-4 text-left text-blue-800">Party</th>
                  <th className="py-3 px-4 text-left text-blue-800">Position</th>
                  <th className="py-3 px-4 text-left text-blue-800">City</th>
                  <th className="py-3 px-4 text-left text-blue-800">Action</th>
                </tr>
              </thead>
              <tbody>
                {allCandidates.map((candidate, index) => (
                  <tr key={candidate._id || index} className={index % 2 === 0 ? 'bg-white' : 'bg-blue-50'}>
                    <td className="py-2 px-4 border-t">{candidate.username}</td>
                    <td className="py-2 px-4 border-t">{candidate.name}</td>
                    <td className="py-2 px-4 border-t">{candidate.party}</td>
                    <td className="py-2 px-4 border-t">{candidate.position}</td>
                    <td className="py-2 px-4 border-t">{candidate.city}</td>
                    <td className="py-2 px-4 border-t">
                      <button
                        onClick={() => handleFillForm(candidate)}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
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

export default EditCandidate;
