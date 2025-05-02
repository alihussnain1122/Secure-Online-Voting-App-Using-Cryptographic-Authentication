import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import evmLogo from '../assets/evm-logo.png'; // make sure to place your logo here

const SplashScreen = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/select');
    }, 2500); // 3 seconds

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-white text-black transition-all duration-500">
      <img src={evmLogo} alt="EVM Logo" className="w-40 h-40 animate-pulse" />
      <h1 className="text-4xl mt-4 font-bold tracking-widest">Pakistan's Digital Democracy</h1>
      <p className="text-sm text-gray-400 mt-2">Secure • Fast • Transparent</p>
    </div>
  );
};

export default SplashScreen;
