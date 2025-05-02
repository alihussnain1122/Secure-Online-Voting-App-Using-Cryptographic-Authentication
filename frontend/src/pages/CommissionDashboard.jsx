import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '/src/assets/evm-logo.png';

const dashboardOptions = [
  {
    title: 'Manage Presiding Officer',
    description: 'Add/Edit/Delete Presiding Officers accounts',
    route: '/manage-admins',
    icon: '👨‍💼',
  },
  {
    title: 'Manage Voters',
    description: 'Add/Edit/Delete voter records',
    route: '/manage-voters',
    icon: '👥',
  },
  {
    title: 'Manage Candidates',
    description: 'Add/Edit/Delete candidates',
    route: '/manage-candidates',
    icon: '🎖️',
  },
  {
    title: 'Registered Voters',
    description: 'View complete voter list',
    route: '/voters-list',
    icon: '📋',
  },
  {
    title: 'Feedback & Complaints',
    description: 'Review user feedback',
    route: '/review-feedback',
    icon: '📩',
  },
  {
    title: 'Polling Station Results',
    description: 'View vote results by station',
    route: '/vote-results-by-station',
    icon: '🏛️',
  },
];

const CommissionDashboard = () => {
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem('commission_token');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-md border-b-2 border-green-700 z-10 relative">
        <div className="container mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <img src={logo} alt="EVM Logo" className="h-14 w-14 sm:h-16 sm:w-16" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-green-700 absolute left-1/2 transform -translate-x-1/2">
            Online Voting App
          </h1>
          <button
            onClick={handleLogout}
            className="py-2 px-5 sm:py-3 sm:px-6 bg-black text-white font-semibold rounded-md hover:bg-gray-800 transition duration-300 shadow-md"
            aria-label="Logout"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="flex-grow container mx-auto px-4 sm:px-6 py-10">
        <section className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-green-800 mb-3">Commissioner's Dashboard</h2>
          <p className="text-base sm:text-lg text-gray-600">Manage all election activities in one place</p>
          <div className="w-20 h-1 bg-green-700 mx-auto mt-4"></div>
        </section>

        {/* Dashboard Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {dashboardOptions.map((item, index) => (
            <DashboardCard
              key={index}
              {...item}
              isHovered={hoveredCard === index}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
              onClick={() => navigate(item.route)}
            />
          ))}
        </section>
      </main>
    </div>
  );
};

const DashboardCard = ({ title, description, icon, isHovered, onClick, onMouseEnter, onMouseLeave }) => (
  <div
    role="button"
    tabIndex={0}
    onClick={onClick}
    onKeyDown={(e) => e.key === 'Enter' && onClick()}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
    className={`cursor-pointer bg-white border-2 ${
      isHovered ? 'border-black scale-105 shadow-2xl' : 'border-green-700 shadow-xl'
    } rounded-xl p-6 flex flex-col transition-all duration-300 ease-in-out h-full`}
  >
    <div className="flex justify-between items-center mb-4">
      <div className="text-4xl bg-green-100 p-3 rounded-lg text-green-800">{icon}</div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={`h-6 w-6 ${isHovered ? 'text-black' : 'text-gray-400'} transition-colors`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </div>
    <h3 className="text-lg sm:text-xl font-bold text-green-800 mb-2">{title}</h3>
    <p className="text-gray-600 flex-grow">{description}</p>
    <div className="mt-4">
      <span
        className={`block text-center py-2 rounded-md font-semibold transition-colors ${
          isHovered
            ? 'bg-black text-white'
            : 'bg-white text-green-800 border border-green-700'
        }`}
      >
        {isHovered ? 'Access Now' : 'Access'}
      </span>
    </div>
  </div>
);

export default CommissionDashboard;
