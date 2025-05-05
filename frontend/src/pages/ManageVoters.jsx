import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useNavigate } from 'react-router-dom';
import { FaUserPlus, FaUserEdit, FaUserMinus, FaFilePdf, FaSearch, FaHome, FaUserCog, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const ManageVoters = () => {
  const navigate = useNavigate();
  const [voters, setVoters] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [votersPerPage] = useState(8);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchVoter = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/api/voter', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setVoters(res.data);
      } catch (err) {
        console.error('Error fetching voters:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVoter();
  }, []);

  const filteredVoters = voters.filter(voter =>
    (voter.name && voter.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (voter.voterID && voter.voterID.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (voter.CNIC && voter.CNIC.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (voter.phone && voter.phone.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (voter.city && voter.city.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const indexOfLastVoter = currentPage * votersPerPage;
  const indexOfFirstVoter = indexOfLastVoter - votersPerPage;
  const currentVoters = filteredVoters.slice(indexOfFirstVoter, indexOfLastVoter);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(20);
    doc.setTextColor(40, 180, 99);
    doc.text('Voter List Report', 105, 20, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 30, { align: 'center' });
  
    const tableColumn = ["CNIC", "Voter ID", "Name", "Phone", "City"];
    const tableRows = [];

    filteredVoters.forEach(voter => {
      const voterData = [
        voter.CNIC || 'N/A',
        voter.voterID || 'N/A',
        voter.name || 'N/A',
        voter.phone || 'N/A',
        voter.city || 'N/A'
      ];
      tableRows.push(voterData);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 40,
      theme: 'grid',
      styles: { fontSize: 9 },
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
      alternateRowStyles: { fillColor: [240, 240, 240] },
      margin: { top: 40, bottom: 20 },
    });
  
    const pageCount = doc.internal.getNumberOfPages();
    for(let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setTextColor(150);
      doc.text(`Page ${i} of ${pageCount}`, 105, doc.internal.pageSize.height - 10, { align: 'center' });
    }
  
    doc.save('voter-list-report.pdf');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
      {/* Header */}
      <div className="w-full flex flex-col md:flex-row items-center justify-between mb-6 bg-white rounded-xl shadow-md p-4 border border-gray-200">
        <div className="flex items-center mb-4 md:mb-0">
          <img
            src="/src/assets/evm-logo.png"
            alt="Logo"
            className="w-12 h-12 mr-3"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLXZvdGUiPjxwYXRoIGQ9Ik0yMCAxNHYyYTIgMiAwIDAgMSAyIDJIMyI+PC9wYXRoPjxwYXRoIGQ9Ik0yMCAxNGgtNmEyIDIgMCAwIDEtMi0yVjNhMiAyIDAgMCAxIDItMmgxLjI3YTIgMiAwIDAgMSAxLjk0IDEuNUw0Mi41MSIgLz48L3N2Zz4=';
            }}
          />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Online Voting App
          </h1>
        </div>

        <div className="flex space-x-2 w-full md:w-auto justify-center">
          <button 
            onClick={() => navigate('/commission-dashboard')}
            className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-green-700 transition-all shadow-sm"
          >
            <FaHome size={14} />
            <span>Dashboard</span>
          </button>
          <button 
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm"
          >
            <FaUserCog size={14} />
            <span>Exit</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
        {/* Title Section */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 p-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <h2 className="text-2xl font-bold text-white">Voter Management</h2>
            <div className="mt-2 md:mt-0">
               <button
                onClick={handleDownloadPDF}
                className="flex items-center space-x-2 bg-white text-green-700 px-4 py-2 rounded-lg hover:bg-gray-100 shadow-md transition-all"
              >
                <FaFilePdf />
                <span>Export as PDF</span>
              </button> 
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-4 border-b border-gray-200">
          <button
            onClick={() => navigate('/add-voter')}
            className="flex items-center justify-center space-x-3 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-3 rounded-xl hover:from-green-600 hover:to-green-700 transition-all shadow-md hover:shadow-lg"
          >
            <FaUserPlus className="text-lg" />
            <span className="font-medium">Register New Voter</span>
          </button>
          <button
            onClick={() => navigate('/edit-voter')}
            className="flex items-center justify-center space-x-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-4 py-3 rounded-xl hover:from-yellow-600 hover:to-yellow-700 transition-all shadow-md hover:shadow-lg"
          >
            <FaUserEdit className="text-lg" />
            <span className="font-medium">Update Voter</span>
          </button>
          <button
            onClick={() => navigate('/delete-voter')}
            className="flex items-center justify-center space-x-3 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-3 rounded-xl hover:from-red-600 hover:to-red-700 transition-all shadow-md hover:shadow-lg"
          >
            <FaUserMinus className="text-lg" />
            <span className="font-medium">Remove Voter</span>
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
              placeholder="Search voters by name, CNIC, voter ID, phone or city..."
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 shadow-sm transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Voter Table */}
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-12 flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-500 mb-4"></div>
              <p className="text-gray-600">Loading voter data...</p>
            </div>
          ) : (
            <>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Voter ID</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">CNIC</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Contact</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Location</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentVoters.length > 0 ? (
                    currentVoters.map((voter, index) => (
                      <tr 
                        key={voter.id || index} 
                        className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                            {voter.voterID || 'N/A'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                              <span className="text-green-600 font-medium">
                                {voter.name ? voter.name.charAt(0).toUpperCase() : '?'}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{voter.name || 'N/A'}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-mono">
                          {voter.CNIC || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {voter.phone || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                            {voter.city || 'Unknown'}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-8 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                          <h3 className="text-lg font-medium text-gray-700 mb-1">
                            {searchTerm ? 'No voters found' : 'No voters registered yet'}
                          </h3>
                          <p className="text-gray-500 max-w-md text-center">
                            {searchTerm ? 'Try adjusting your search query' : 'Click "Register New Voter" to add voters'}
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* Pagination */}
              {filteredVoters.length > votersPerPage && (
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                  <div className="flex flex-col sm:flex-row items-center justify-between">
                    <div className="mb-4 sm:mb-0">
                      <p className="text-sm text-gray-700">
                        Showing <span className="font-medium">{indexOfFirstVoter + 1}</span> to{' '}
                        <span className="font-medium">
                          {Math.min(indexOfLastVoter, filteredVoters.length)}
                        </span>{' '}
                        of <span className="font-medium">{filteredVoters.length}</span> voters
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
                          <FaChevronLeft className="h-4 w-4" />
                        </button>
                        {Array.from({ length: Math.min(5, Math.ceil(filteredVoters.length / votersPerPage)) }, (_, i) => {
                          let pageNum;
                          const totalPages = Math.ceil(filteredVoters.length / votersPerPage);
                          
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
                          onClick={() => paginate(currentPage < Math.ceil(filteredVoters.length / votersPerPage) ? currentPage + 1 : currentPage)}
                          disabled={currentPage === Math.ceil(filteredVoters.length / votersPerPage)}
                          className={`relative inline-flex items-center px-3 py-2 rounded-r-md border ${
                            currentPage === Math.ceil(filteredVoters.length / votersPerPage) 
                              ? 'bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed' 
                              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          <FaChevronRight className="h-4 w-4" />
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

export default ManageVoters;