import React from 'react';

const CertificateDownload = ({ voterId, name }) => {
  const handleDownload = async () => {
    try {
      const response = await fetch(`/api/vote/download-certificate?voterId=${voterId}&name=${encodeURIComponent(name)}`);
      if (!response.ok) throw new Error('Failed to download certificate');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `voting-certificate-${name}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error downloading certificate:', err);
    }
  };

  return (
    <button
      onClick={handleDownload}
      className="w-64 py-3 border border-green-500 text-green-500 hover:bg-green-500 hover:text-black transition duration-300 rounded-full"
    >
      Download Voting Certificate
    </button>
  );
};

export default CertificateDownload;
