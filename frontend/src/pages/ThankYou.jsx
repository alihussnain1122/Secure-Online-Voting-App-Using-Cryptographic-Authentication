import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jsPDF } from "jspdf";
import QRCode from 'qrcode';

const ThankYou = () => {
  const navigate = useNavigate();
  const [voter, setVoter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qrCodeDataURL, setQrCodeDataURL] = useState('');

  useEffect(() => {
    const fetchVoter = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/voter-login');
        return;
      }

      try {
        const res = await axios.get('/api/voter/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setVoter(res.data);

        // Generate QR code data
        const qrData = JSON.stringify({
          voterId: res.data.voterID,
          timestamp: Date.now(),
          verificationUrl: `https://pakraaz.com/verify/${res.data.voterID}`
        });

        // Generate QR code
        QRCode.toDataURL(qrData, { width: 200 }, (err, url) => {
          if (err) {
            console.error('Error generating QR code:', err);
            return;
          }
          setQrCodeDataURL(url);
        });

      } catch (err) {
        console.error('Error fetching voter profile:', err);
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          localStorage.removeItem('token');
          navigate('/voter-login');
        } else {
          alert('An unexpected error occurred. Try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchVoter();
  }, [navigate]);

  const handleDownloadReceipt = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    
    // Add background color
    doc.setFillColor(240, 249, 244); // Light green background
    doc.rect(0, 0, pageWidth, pageHeight, 'F');
    
    // Add decorative border
    doc.setDrawColor(39, 174, 96); // Green border
    doc.setLineWidth(0.5);
    doc.rect(10, 10, pageWidth - 20, pageHeight - 20, 'S');
    
    // Add inner border
    doc.setDrawColor(39, 174, 96, 0.5); // Lighter green border
    doc.setLineWidth(0.3);
    doc.rect(15, 15, pageWidth - 30, pageHeight - 30, 'S');

    // Add header with background
    doc.setFillColor(39, 174, 96); // Green header background
    doc.rect(10, 10, pageWidth - 20, 25, 'F');

    // Add title
    doc.setTextColor(255, 255, 255); // White text for header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.text("OFFICIAL VOTE RECEIPT", pageWidth / 2, 25, { align: "center" });

    // Reset text color for main content
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);

    // Current date
    const currentDate = new Date().toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    doc.text(`Date: ${currentDate}`, pageWidth - 20, 45, { align: "right" });
    
    // Add PakRaaz logo
    doc.addImage('/src/assets/evm-logo.png', 'PNG', 20, 45, 35, 35);

    // Voter Info Section - Adjusted spacing
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("VOTER INFORMATION", 20, 95);
    
    // Horizontal rule
    doc.setDrawColor(39, 174, 96);
    doc.setLineWidth(0.5);
    doc.line(20, 100, pageWidth - 20, 100);
    
    // Voter Details - Adjusted spacing
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(`Voter Name: ${voter.name}`, 25, 115);
    doc.text(`CNIC: ${voter.CNIC}`, 25, 125);
    doc.text(`Voter ID: ${voter.voterID}`, 25, 135);
    doc.text(`Phone: ${voter.phone}`, 25, 145);
    doc.text(`Constituency: ${voter.city}`, 25, 155);
    
    // Vote Details Section - Adjusted spacing
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("VOTE DETAILS", 20, 175);
    
    // Horizontal rule
    doc.setDrawColor(39, 174, 96);
    doc.line(20, 180, pageWidth - 20, 180);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(`Vote Time: ${new Date().toLocaleTimeString()}`, 25, 195);
    doc.text(`Vote Date: ${currentDate}`, 25, 205);
    
    // Confirmation Section - Adjusted spacing
    doc.setFillColor(240, 249, 244);
    doc.roundedRect(20, 220, pageWidth - 40, 30, 3, 3, 'F');
    doc.setFont("helvetica", "italic");
    doc.text("Your vote has been successfully cast and securely recorded in ", 25, 235);
    doc.text("our system. Thank you for participating in the democratic process.", 25, 245);
    
    // Footer
    doc.setDrawColor(39, 174, 96);
    doc.setLineWidth(0.5);
    doc.line(10, pageHeight - 40, pageWidth - 10, pageHeight - 40);
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("OFFICIAL DOCUMENT OF PAKRAAZ VOTING SYSTEM", pageWidth / 2, pageHeight - 30, { align: "center" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text("This receipt serves as proof of your participation in the election. Please keep it for your records.", pageWidth / 2, pageHeight - 20, { align: "center" });
    
    // QR Code - Actual QR code with verification data
    if (qrCodeDataURL) {
      doc.addImage(qrCodeDataURL, 'PNG', pageWidth - 50, pageHeight - 65, 35, 35);
    } else {
      // Fallback if QR code fails to generate
      doc.setDrawColor(0, 0, 0);
      doc.setFillColor(240, 240, 240);
      doc.roundedRect(pageWidth - 50, pageHeight - 65, 35, 35, 2, 2, 'FD');
      doc.setFontSize(6);
      doc.text("Verification", pageWidth - 45, pageHeight - 55);
      doc.text("QR Code", pageWidth - 45, pageHeight - 50);
      doc.setFontSize(4);
      doc.text(`ID:${voter.voterID}`, pageWidth - 45, pageHeight - 45);
    }
    
    // Save the PDF
    doc.save(`vote-receipt-${voter.voterID}.pdf`);
  };

  const handleDownloadCertificate = () => {
    const doc = new jsPDF('landscape');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    
    // Add background pattern
    doc.setFillColor(245, 250, 247); // Very light green
    doc.rect(0, 0, pageWidth, pageHeight, 'F');
    
    // Add decorative border
    doc.setDrawColor(39, 174, 96); // Green border
    doc.setLineWidth(1);
    doc.rect(10, 10, pageWidth - 20, pageHeight - 20, 'S');
    
    // Add fancy inner border (double line)
    doc.setDrawColor(20, 120, 80); 
    doc.setLineWidth(0.5);
    doc.rect(15, 15, pageWidth - 30, pageHeight - 30, 'S');
    
    // Add certificate title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(30);
    doc.setTextColor(39, 174, 96);
    doc.text("CERTIFICATE OF PARTICIPATION", pageWidth / 2, 40, { align: "center" });
    
    // Decorative line under title
    doc.setDrawColor(39, 174, 96);
    doc.setLineWidth(0.7);
    doc.line(pageWidth / 2 - 80, 45, pageWidth / 2 + 80, 45);
    
    // Reset text color
    doc.setTextColor(0, 0, 0);
    
    // Certificate Body - Adjusted spacing
    doc.setFont("helvetica", "italic");
    doc.setFontSize(16);
    doc.text("This is to certify that", pageWidth / 2, 70, { align: "center" });
    
    // Voter name - make it prominent
    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.text(`${voter.name}`, pageWidth / 2, 90, { align: "center" });
    
    // Voter ID and details - Adjusted spacing
    doc.setFont("helvetica", "normal");
    doc.setFontSize(14);
    doc.text(`Voter ID: ${voter.voterID} | CNIC: ${voter.CNIC}`, pageWidth / 2, 110, { align: "center" });
    doc.text(`From Constituency: ${voter.city}`, pageWidth / 2, 125, { align: "center" });
    
    // Participation message - Adjusted spacing
    doc.setFont("helvetica", "italic");
    doc.setFontSize(16);
    doc.text("has successfully cast a vote in", pageWidth / 2, 145, { align: "center" });
    
    // Election title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text("General Election 2025", pageWidth / 2, 165, { align: "center" });
    
    // Current date
    const currentDate = new Date().toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(14);
    doc.text(`Date: ${currentDate}`, pageWidth / 2, 180, { align: "center" });
    
    // Signature section - Adjusted spacing
    doc.setLineWidth(0.3);
    doc.line(pageWidth / 2 - 40, 205, pageWidth / 2 + 40, 205);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("PakRaaz Voting System Official", pageWidth / 2, 215, { align: "center" });
    
    // Add decorative elements 
    // Left corner decoration
    doc.setDrawColor(39, 174, 96, 0.5);
    doc.setLineWidth(0.7);
    doc.line(20, 20, 50, 20);
    doc.line(20, 20, 20, 50);
    
    // Right corner decoration
    doc.line(pageWidth - 20, 20, pageWidth - 50, 20);
    doc.line(pageWidth - 20, 20, pageWidth - 20, 50);
    
    // Bottom left
    doc.line(20, pageHeight - 20, 50, pageHeight - 20);
    doc.line(20, pageHeight - 20, 20, pageHeight - 50);
    
    // Bottom right
    doc.line(pageWidth - 20, pageHeight - 20, pageWidth - 50, pageHeight - 20);
    doc.line(pageWidth - 20, pageHeight - 20, pageWidth - 20, pageHeight - 50);
    
    // Official Seal - more detailed
    doc.setDrawColor(200, 0, 0);
    doc.setFillColor(255, 255, 255, 0.7);
    doc.circle(pageWidth - 50, pageHeight - 60, 20, 'FD');
    doc.setDrawColor(200, 0, 0);
    doc.setLineWidth(0.5);
    doc.circle(pageWidth - 50, pageHeight - 60, 18, 'D');
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(200, 0, 0);
    doc.text("PAKRAAZ", pageWidth - 50, pageHeight - 65, { align: "center" });
    doc.setFontSize(6);
    doc.text("OFFICIAL SEAL", pageWidth - 50, pageHeight - 60, { align: "center" });
    doc.text("2025", pageWidth - 50, pageHeight - 55, { align: "center" });
    doc.setLineWidth(0.3);
    doc.line(pageWidth - 60, pageHeight - 60, pageWidth - 40, pageHeight - 60);
    
    // Add QR code to certificate
    if (qrCodeDataURL) {
      doc.addImage(qrCodeDataURL, 'PNG', 30, pageHeight - 70, 30, 30);
      doc.setFontSize(8);
      doc.text("Scan to verify", 45, pageHeight - 40);
    }
    
    // Footer
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(0, 0, 0);
    doc.text("This certificate serves as proof of participation in the democratic process of Pakistan.", pageWidth / 2, pageHeight - 25, { align: "center" });
    doc.text("PakRaaz Voting System - Secure, Transparent, Democratic", pageWidth / 2, pageHeight - 15, { align: "center" });
    
    // Save the PDF
    doc.save(`participation-certificate-${voter.voterID}.pdf`);
  };

  // ... rest of the component remains the same ...
  if (loading) {
    return (
      <div className="h-screen w-full bg-white flex flex-col items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-green-700 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-green-800 font-medium">Loading your information...</p>
        </div>
      </div>
    );
  }

  if (!voter) {
    return (
      <div className="h-screen w-full bg-white flex flex-col items-center justify-center">
        <div className="bg-white border-2 border-green-700 rounded-xl p-8 w-full max-w-md text-center">
          <h2 className="text-2xl font-bold text-green-800 mb-4">No Voter Data Found</h2>
          <button
            onClick={() => navigate('/voter-login')}
            className="px-6 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition"
          >
            Go to Voter Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-white flex flex-col">
      {/* Header with centered title */}
      <div className="p-4 border-b-2 border-green-700 relative">
        <div className="absolute left-4 top-4">
          <img src="/src/assets/evm-logo.png" alt="EVM Logo" className="w-12 h-12" />
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-green-800">PakRaaz Voting App</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center p-6 overflow-y-auto">
        <div className="w-full max-w-4xl space-y-8">
          {/* Thank You Section */}
          <div className="text-center bg-gradient-to-r from-green-50 to-white p-6 rounded-xl border border-green-100 shadow-sm">
            <h2 className="text-3xl font-bold text-green-800 mb-2">Thank You, {voter.name}!</h2>
            <p className="text-lg text-gray-600">Your vote has been successfully cast.</p>
          </div>

          {/* Voter Information Section */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-green-700 p-6">
            <h3 className="text-2xl font-bold text-green-800 mb-4">Voter Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-lg text-gray-800"><strong>Name:</strong> {voter.name}</p>
                <p className="text-lg text-gray-800"><strong>CNIC:</strong> {voter.CNIC}</p>
                <p className="text-lg text-gray-800"><strong>Voter ID:</strong> {voter.voterID}</p>
              </div>
              <div>
                <p className="text-lg text-gray-800"><strong>Phone Number:</strong> {voter.phone}</p>
                <p className="text-lg text-gray-800"><strong>Constituency:</strong> {voter.city}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
<div className="bg-green-50 p-6 border border-green-200 rounded-xl shadow-sm">
  <h3 className="text-xl font-bold text-green-800 mb-4 text-center">Download Your Documents</h3>
  <div className="flex flex-col space-y-4 max-w-md mx-auto">
    <button
      onClick={handleDownloadReceipt}
      className="w-full py-3 px-6 bg-green-700 hover:bg-green-800 text-white font-bold rounded-lg transition flex items-center justify-center"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      Download Vote Receipt
    </button>
    <button
      onClick={handleDownloadCertificate}
      className="w-full py-3 px-6 bg-green-700 hover:bg-green-800 text-white font-bold rounded-lg transition flex items-center justify-center"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
      Download Certificate
    </button>
    <button
      onClick={() => navigate('/feedback')}
      className="w-full py-3 px-6 bg-green-700 hover:bg-green-800 text-white font-bold rounded-lg transition flex items-center justify-center"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
      Give Feedback
    </button>
    <button
      onClick={() => navigate('/')}
      className="w-full py-3 px-6 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition flex items-center justify-center"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1m0-10V5m0 6H7" />
      </svg>
      Exit
    </button>
  </div>
</div>
        </div>
      </div>
    </div>
  );
};

export default ThankYou;