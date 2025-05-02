import React from 'react';

const ReceiptDownload = ({ voterId, name }) => {
  const handleDownload = async () => {
    try {
      const response = await fetch(`/api/vote/download-receipt?voterId=${voterId}&name=${encodeURIComponent(name)}`);
      if (!response.ok) throw new Error('Failed to download receipt');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `vote-receipt-${name}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error downloading receipt:', err);
    }
  };

  return (
    <button
      onClick={handleDownload}
      className="w-64 py-3 border border-green-500 text-green-500 hover:bg-green-500 hover:text-black transition duration-300 rounded-full"
    >
      Download Vote Receipt
    </button>
  );
};

export default ReceiptDownload;
