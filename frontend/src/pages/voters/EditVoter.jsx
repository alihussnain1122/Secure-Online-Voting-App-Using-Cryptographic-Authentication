import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EditVoter = () => {
  const [form, setForm] = useState({
    CNIC: '',
    voterID: '',
    name: '',
    phone: '',
    city: ''
  });

  const [error, setError] = useState('');
  const [allVoters, setAllVoters] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch all voters when component mounts
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

    try {
      const token = localStorage.getItem('token');

      // Find voter with matching CNIC and VoterID from already fetched voters
      const matchedVoter = allVoters.find(
        (v) => v.CNIC === form.CNIC && v.voterID === form.voterID
      );

      if (!matchedVoter) {
        setError('No voter found with the given CNIC and Voter ID.');
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
        return;
      }

      // Proceed with update using matched voter's ID
      await axios.put(
        `http://localhost:5000/api/voters/${matchedVoter._id}`,
        updatePayload,
        {
          headers: { Authorization: token },
        }
      );

      // Refresh the voters list after update
      fetchAllVoters();
      
      // Reset form
      setForm({
        CNIC: '',
        voterID: '',
        name: '',
        phone: '',
        city: ''
      });

      alert('Voter updated successfully!');
    } catch (err) {
      console.error('Error updating voter:', err);
      if (err.response) {
        setError(`Error: ${err.response.data.message || 'Failed to update voter.'}`);
      } else {
        setError('Network error or server not responding.');
      }
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
    
    // Scroll to top for better UX
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
        <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">Edit Voter Information</h2>

        {/* Display error message */}
        {error && (
          <div className="text-red-600 text-center mb-4 p-2 bg-red-50 border border-red-200 rounded">
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-wrap gap-6 justify-between">
          {/* Required fields for identification */}
          <div className="w-full">
            <h3 className="text-lg font-medium text-blue-800 mb-2">Identification (Required)</h3>
            <div className="flex flex-wrap gap-4">
              {['CNIC', 'voterID'].map((field) => (
                <div key={field} className="flex-1 min-w-[250px]">
                  <label htmlFor={field} className="block text-md font-medium text-black">
                    {field === 'CNIC' ? 'CNIC' : 'Voter ID'}
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

          {/* Fields to update */}
          <div className="w-full mt-4">
            <h3 className="text-lg font-medium text-blue-800 mb-2">Fields to Update (Fill at least one)</h3>
            <div className="flex flex-wrap gap-4">
              {['name', 'phone', 'city'].map((field) => (
                <div key={field} className="flex-1 min-w-[250px]">
                  <label htmlFor={field} className="block text-md font-medium text-black">
                    {field === 'name' ? 'Full Name' :
                    field === 'phone' ? 'Phone Number' : 'City'}
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
              Update Voter
            </button>
          </div>
        </form>
      </div>

      {/* Voters List Section */}
      <div className="border border-blue-600 rounded-xl p-8 max-w-6xl mx-auto shadow-md">
        <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">All Registered Voters</h2>
        
        {loading ? (
          <div className="text-center p-4">
            <p className="text-blue-700">Loading voters...</p>
          </div>
        ) : allVoters.length === 0 ? (
          <div className="text-center p-4">
            <p className="text-gray-700">No voters found in the system.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300 shadow-sm rounded-md">
              <thead className="bg-blue-100">
                <tr>
                  <th className="py-3 px-4 text-left text-blue-800">CNIC</th>
                  <th className="py-3 px-4 text-left text-blue-800">Voter ID</th>
                  <th className="py-3 px-4 text-left text-blue-800">Name</th>
                  <th className="py-3 px-4 text-left text-blue-800">Phone</th>
                  <th className="py-3 px-4 text-left text-blue-800">City</th>
                  <th className="py-3 px-4 text-left text-blue-800">Action</th>
                </tr>
              </thead>
              <tbody>
                {allVoters.map((voter, index) => (
                  <tr key={voter._id} className={index % 2 === 0 ? 'bg-white' : 'bg-blue-50'}>
                    <td className="py-2 px-4 border-t">{voter.CNIC}</td>
                    <td className="py-2 px-4 border-t">{voter.voterID}</td>
                    <td className="py-2 px-4 border-t">{voter.name}</td>
                    <td className="py-2 px-4 border-t">{voter.phone}</td>
                    <td className="py-2 px-4 border-t">{voter.city}</td>
                    <td className="py-2 px-4 border-t">
                      <button
                        onClick={() => handleFillForm(voter)}
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

export default EditVoter;