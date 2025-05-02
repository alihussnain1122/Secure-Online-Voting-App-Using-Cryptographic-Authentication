import React from 'react';
import { useNavigate } from 'react-router-dom';

const UserSelection = () => {
  const navigate = useNavigate();

  const handlePresidingOfficerClick = () => navigate('/admin-login');
  const handleVoterClick = () => navigate('/voter-login');
  const handleElectionCommissionClick = () => navigate('/commission-login');

  return (
    <div className="h-screen w-full bg-white flex flex-col items-center justify-center relative overflow-hidden">
      {/* Fixed Logo Top-Left */}
      <img
        src="/src/assets/evm-logo.png"
        alt="EVM Logo"
        className="fixed top-4 left-4 w-16 h-16 z-50"
      />

      {/* Main Card */}
      <div className="bg-white border-2 border-green-700 rounded-3xl shadow-xl p-10 w-[90%] md:w-[500px] flex flex-col items-center z-10">
        <h1 className="text-5xl font-extrabold text-green-800 mb-3 tracking-wider">
          PakRaaz
        </h1>
        <p className="text-xl text-black font-medium mb-10 text-center">
          Choose your role to continue
        </p>

        <div className="space-y-6 w-full">
          <button
            onClick={handlePresidingOfficerClick}
            className="w-full py-3 bg-green-700 text-white text-xl rounded-full shadow-md hover:bg-green-900 transition-transform duration-300 hover:scale-105"
          >
            Presiding Officer
          </button>
          <button
            onClick={handleVoterClick}
            className="w-full py-3 bg-green-600 text-white text-xl rounded-full shadow-md hover:bg-green-800 transition-transform duration-300 hover:scale-105"
          >
            Voter
          </button>
          <button
            onClick={handleElectionCommissionClick}
            className="w-full py-3 bg-black text-white text-xl rounded-full shadow-md hover:bg-gray-900 transition-transform duration-300 hover:scale-105"
          >
            Election Commission
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserSelection;
