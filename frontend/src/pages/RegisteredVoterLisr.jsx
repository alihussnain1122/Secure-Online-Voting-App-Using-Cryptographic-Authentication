import React, { useEffect, useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import { FaFilePdf, FaHome, FaSignOutAlt, FaUser, FaPhone, FaCity, FaIdCard } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import 'jspdf-autotable';

const RegisteredVoterList = () => {
  const [voters, setVoters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVoters = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const res = await axios.get('/api/voters', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setVoters(res.data);
      } catch (err) {
        console.error('Error fetching voters:', err);
        setError('Failed to load voter data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchVoters();
  }, []);

  const generatePDF = () => {
    if (voters.length === 0) {
      alert('No voter data available to generate PDF');
      return;
    }

    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(18);
    doc.setTextColor(40, 167, 69); // Green color
    doc.text('Registered Voter List', 105, 15, { align: 'center' });
    
    // Current date
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 22, { align: 'center' });
    
    // Table data
    const tableData = voters.map(voter => [
      voter.CNIC || 'N/A',
      voter.voterID || 'N/A',
      voter.name || 'N/A',
      voter.phone || 'N/A',
      voter.city || 'N/A'
    ]);

    // AutoTable
    doc.autoTable({
      head: [['CNIC', 'Voter ID', 'Name', 'Phone', 'City']],
      body: tableData,
      startY: 30,
      theme: 'grid',
      headStyles: {
        fillColor: [40, 167, 69], // Green header
        textColor: 255,
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240]
      },
      margin: { top: 30 }
    });

    doc.save('registered-voters.pdf');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
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

      {/* Main Content */}
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
        <div className="bg-green-600 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FaUser className="text-white text-3xl mr-3" />
              <h2 className="text-2xl font-bold text-white">Registered Voters</h2>
            </div>
            <button
              onClick={generatePDF}
              className="flex items-center space-x-2 bg-white hover:bg-gray-100 text-green-700 px-4 py-2 rounded-lg transition-all"
            >
              <FaFilePdf className="text-sm" />
              <span>Export PDF</span>
            </button>
          </div>
        </div>

        <div className="p-6">
          {error && (
            <div className="p-4 bg-red-50 text-red-700 rounded-lg border-l-4 border-red-500 mb-6">
              {error}
            </div>
          )}

          {loading ? (
            <div className="text-center p-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-600"></div>
              <p className="mt-2 text-green-700">Loading voters...</p>
            </div>
          ) : voters.length === 0 ? (
            <div className="text-center p-8 text-gray-600">
              No voters found in the system.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <FaIdCard className="inline mr-1" /> CNIC
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <FaIdCard className="inline mr-1" /> Voter ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <FaUser className="inline mr-1" /> Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <FaPhone className="inline mr-1" /> Phone
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <FaCity className="inline mr-1" /> City
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {voters.map(voter => (
                    <tr key={voter.voterID} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{voter.CNIC}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{voter.voterID}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{voter.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{voter.phone || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{voter.city || 'N/A'}</td>
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

export default RegisteredVoterList;