import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaUserPlus, FaUserEdit, FaUserMinus, FaSearch, FaHome, FaSignOutAlt, FaUserTie, FaLandmark, FaCity, FaFilePdf } from 'react-icons/fa';
import { GiVote } from 'react-icons/gi';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const ManageCandidates = () => {
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [candidatesPerPage] = useState(8);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/candidates', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        const candidatesData = response.data.data || [];
        setCandidates(Array.isArray(candidatesData) ? candidatesData : []);
      } catch (err) {
        setError('Failed to fetch candidates. Please try again later.');
        console.error("Error fetching candidates:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, []);

  const filteredCandidates = candidates.filter(candidate =>
    candidate.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidate.party?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidate.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidate.position?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastCandidate = currentPage * candidatesPerPage;
  const indexOfFirstCandidate = indexOfLastCandidate - candidatesPerPage;
  const currentCandidates = filteredCandidates.slice(indexOfFirstCandidate, indexOfLastCandidate);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(20);
    doc.setTextColor(40, 180, 99);
    doc.text('Candidate List Report', 105, 20, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 30, { align: 'center' });
  
    const tableColumn = ["Name", "Party", "City", "Position"];
    const tableRows = [];

    filteredCandidates.forEach(candidate => {
      const candidateData = [
        candidate.name || 'N/A',
        candidate.party || 'N/A',
        candidate.city || 'N/A',
        candidate.position || 'N/A'
      ];
      tableRows.push(candidateData);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 40,
      theme: 'grid',
      styles: { fontSize: 10 },
      headStyles: { 
        fillColor: [34, 139, 34],
        textColor: 255,
        fontStyle: 'bold'
      },
      alternateRowStyles: { fillColor: [240, 240, 240] },
      margin: { top: 40 },
    });
  
    doc.save('candidate-list-report.pdf');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
      {/* Premium Header */}
      <div className="w-full flex items-center justify-between mb-8 bg-white rounded-xl shadow-lg p-4 border border-gray-200">
        <div className="flex items-center">
          <img
            src="/src/assets/evm-logo.png"
            alt="Logo"
            className="w-12 h-12 mr-3"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLXZvdGUiPjxwYXRoIGQ9Ik0yMCAxNHYyYTIgMiAwIDAgMSAyIDJIMyI+PC9wYXRoPjxwYXRoIGQ9Ik0yMCAxNGgtNmEyIDIgMCAwIDEtMi0yVjNhMiAyIDAgMCAxIDItMmgxLjI3YTIgMiAwIDAgMSAxLjk0IDEuNUw0Mi51MSIgLz48L3N2Zz4=';
            }}
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
            <FaHome className="text-sm" />
            <span>Dashboard</span>
          </button>
          <button 
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 bg-gradient-to-r from-gray-700 to-gray-900 text-white px-4 py-2 rounded-lg hover:from-gray-800 hover:to-black transition-all shadow-sm"
          >
            <FaSignOutAlt className="text-sm" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden border border-gray-200">
        {/* Title Section */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 p-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <FaUserTie className="text-white text-3xl mr-3" />
              <h2 className="text-2xl font-bold text-white">Candidate Management</h2>
            </div>
             <button
              onClick={handleDownloadPDF}
              className="flex items-center space-x-2 bg-white text-green-700 px-4 py-2 rounded-lg hover:bg-gray-100 shadow-md transition-all"
            >
              <FaFilePdf />
              <span>Export Report</span>
            </button> 
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4 border-b border-gray-200">
          <button
            onClick={() => navigate('/add-candidate')}
            className="flex items-center justify-center space-x-3 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-4 rounded-xl hover:from-green-600 hover:to-green-700 transition-all shadow-lg hover:shadow-xl"
          >
            <FaUserPlus className="text-xl" />
            <span className="font-semibold">Register Candidate</span>
          </button>
          <button
            onClick={() => navigate('/edit-candidate')}
            className="flex items-center justify-center space-x-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-4 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl"
          >
            <FaUserEdit className="text-xl" />
            <span className="font-semibold">Edit Candidate</span>
          </button>
          <button
            onClick={() => navigate('/delete-candidate')}
            className="flex items-center justify-center space-x-3 bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-4 rounded-xl hover:from-red-600 hover:to-red-700 transition-all shadow-lg hover:shadow-xl"
          >
            <FaUserMinus className="text-xl" />
            <span className="font-semibold">Remove Candidate</span>
          </button>
        </div>

        {/* Search Section */}
        <div className="p-6 border-b border-gray-200">
          <div className="relative max-w-2xl mx-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search candidates by name, party, city or position..."
              className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 shadow-sm transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Candidate Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-12 flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-500 mb-4"></div>
              <p className="text-gray-600 font-medium">Loading candidate data...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <div className="bg-red-50 border-l-4 border-red-500 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : filteredCandidates.length === 0 ? (
            <div className="p-8 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">
                {searchTerm ? 'No matching candidates found' : 'No candidates registered yet'}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm ? 'Try adjusting your search query' : 'Get started by registering a new candidate'}
              </p>
              <div className="mt-6">
                <button
                  onClick={() => navigate('/add-candidate')}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  <FaUserPlus className="-ml-1 mr-2 h-5 w-5" />
                  Register New Candidate
                </button>
              </div>
            </div>
          ) : (
            <>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Candidate
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      <div className="flex items-center">
                        <FaLandmark className="mr-1" /> Party
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      <div className="flex items-center">
                        <FaCity className="mr-1" /> City
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      <div className="flex items-center">
                        <GiVote className="mr-1" /> Position
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentCandidates.map((candidate, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-blue-600 font-medium">
                              {candidate.name?.charAt(0).toUpperCase() || 'C'}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{candidate.name}</div>
                            <div className="text-sm text-gray-500">{candidate.username}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          {candidate.party || 'Independent'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {candidate.city || 'Not specified'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                          {candidate.position || 'N/A'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Enhanced Pagination */}
              {filteredCandidates.length > candidatesPerPage && (
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                  <div className="flex flex-col sm:flex-row items-center justify-between">
                    <div className="mb-4 sm:mb-0">
                      <p className="text-sm text-gray-700">
                        Showing <span className="font-medium">{indexOfFirstCandidate + 1}</span> to{' '}
                        <span className="font-medium">
                          {Math.min(indexOfLastCandidate, filteredCandidates.length)}
                        </span>{' '}
                        of <span className="font-medium">{filteredCandidates.length}</span> candidates
                      </p>
                    </div>
                    <div>
                      <nav className="inline-flex rounded-md shadow-sm">
                        <button
                          onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
                          disabled={currentPage === 1}
                          className={`relative inline-flex items-center px-3 py-2 rounded-l-md border ${
                            currentPage === 1 
                              ? 'bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed' 
                              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          <span className="sr-only">Previous</span>
                          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </button>
                        
                        {Array.from({ length: Math.min(5, Math.ceil(filteredCandidates.length / candidatesPerPage)) }, (_, i) => {
                          let pageNum;
                          const totalPages = Math.ceil(filteredCandidates.length / candidatesPerPage);
                          
                          if (totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (currentPage <= 3) {
                            pageNum = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                          } else {
                            pageNum = currentPage - 2 + i;
                          }
                          
                          return (
                            <button
                              key={pageNum}
                              onClick={() => paginate(pageNum)}
                              className={`relative inline-flex items-center px-4 py-2 border ${
                                currentPage === pageNum
                                  ? 'bg-green-500 text-white border-green-500'
                                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        })}
                        
                        <button
                          onClick={() => 
                            paginate(currentPage < Math.ceil(filteredCandidates.length / candidatesPerPage) ? currentPage + 1 : currentPage)
                          }
                          disabled={currentPage === Math.ceil(filteredCandidates.length / candidatesPerPage)}
                          className={`relative inline-flex items-center px-3 py-2 rounded-r-md border ${
                            currentPage === Math.ceil(filteredCandidates.length / candidatesPerPage)
                              ? 'bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed'
                              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          <span className="sr-only">Next</span>
                          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageCandidates;