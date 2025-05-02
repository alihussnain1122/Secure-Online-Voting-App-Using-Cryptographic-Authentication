import React, { useEffect, useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';

const RegisteredVoterList = () => {
  const [voters, setVoters] = useState([]);

  useEffect(() => {
    const fetchVoters = async () => {
      try {
        const res = await axios.get('/api/voters');
        setVoters(res.data);
      } catch (err) {
        console.error('Error fetching voters:', err);
      }
    };

    fetchVoters();
  }, []);

  const generatePDF = async () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Registered Voter List', 14, 20);
  
    let y = 30;
  
    for (const voter of voters) {
      try {
        // Load image as base64 (assuming voter.imageURL is valid)
        // const imageData = await toDataURL(voter.imageURL || '/default-avatar.png');
  
        // // Draw image
        // doc.addImage(imageData, 'JPEG', 14, y, 20, 20); // x, y, width, height
  
        // Draw text next to it
        doc.setFontSize(12);
        doc.text(`CNIC: ${voter.CNIC}`, 38, y + 12);
        doc.text(`Voter ID: ${voter.voterID}`, 38, y + 19);
        doc.text(`Name: ${voter.name}`, 38, y + 5);
        doc.text(`Phone: ${voter.phone || 'N/A'}`, 120, y + 12);
        doc.text(`City: ${voter.city || 'N/A'}`, 120, y + 5);
  
        y += 30; // Move to next row
  
        // New page if space runs out
        if (y > 270) {
          doc.addPage();
          y = 20;
        }
      } catch (err) {
        console.error('Image load failed:', err);
      }
    }
  
    doc.save('registered-voters.pdf');
  };
  
  // Convert image URL to base64
  // const toDataURL = (url) =>
  //   fetch(url)
  //     .then((res) => res.blob())
  //     .then(
  //       (blob) =>
  //         new Promise((resolve, reject) => {
  //           const reader = new FileReader();
  //           reader.onloadend = () => resolve(reader.result);
  //           reader.onerror = reject;
  //           reader.readAsDataURL(blob);
  //         })
  //     );
  

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 relative">
      {/* Top Left Logo */}
      <div className="absolute top-4 left-4">
        <img src="/src/assets/evm-logo.png" alt="Logo" className="w-12 h-auto" />
      </div>

      {/* Center Logo Text */}
      <div className="text-center mt-4">
        <h1 className="text-4xl font-extrabold text-green-900">SadiVote</h1>
      </div>

      <div className="max-w-6xl mx-auto bg-white p-8 rounded-xl shadow-xl mt-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-green-700">📋 Registered Voter List</h2>
          <button
            onClick={generatePDF}
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg"
          >
            Download PDF
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse border border-gray-300">
            <thead className="bg-green-100 text-gray-700">
              <tr>
                {/* <th className="border p-3">Photo</th> */}
                <th className="border p-3">CNIC</th>
                <th className="border p-3">Voter ID</th>
                <th className="border p-3">Name</th>
                <th className="border p-3">Phone</th>
                <th className="border p-3">City</th>
              </tr>
            </thead>
            <tbody>
              {voters.map((voter) => (
                <tr key={voter.voterID} className="text-center">
                  {/* <td className="border p-2">
                    <img
                      src={voter.imageURL || '/default-avatar.png'}
                      alt="Voter"
                      className="w-14 h-14 object-cover rounded-full mx-auto"
                    />
                  </td> */}
                  <td className="border p-3">{voter.CNIC}</td>
                  <td className="border p-3">{voter.voterID}</td>
                  <td className="border p-3">{voter.name}</td>
                  <td className="border p-3">{voter.phone || 'N/A'}</td>
                  <td className="border p-3">{voter.city || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {voters.length === 0 && (
            <p className="text-center text-gray-500 mt-6">No voters found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegisteredVoterList;
