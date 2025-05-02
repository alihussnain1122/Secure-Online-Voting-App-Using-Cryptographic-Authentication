import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, Cell, ResponsiveContainer } from 'recharts';

const VoteResultsByStation = () => {
  const [results, setResults] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredResults, setFilteredResults] = useState({});
  const [viewMode, setViewMode] = useState('list'); // 'list', 'bar', 'pie'
  const [selectedCity, setSelectedCity] = useState(null);

  // Theme colors
  const THEME = {
    primary: '#1e40af', // deep blue
    secondary: '#10b981', // emerald green
    accent: '#f59e0b', // amber
    light: '#f3f4f6', // light gray
    dark: '#1f2937', // dark gray
    winner: '#059669', // green
    loser: '#dc2626', // red
    neutral: '#6366f1', // indigo
  };

  // Chart colors
  const COLORS = [
    THEME.primary, 
    THEME.secondary, 
    THEME.accent, 
    '#8b5cf6', // violet
    '#ec4899', // pink
    '#06b6d4', // cyan
  ];

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await axios.get('/api/vote/results/allcities');
        if (response.data.success) {
          setResults(response.data.data);
          setFilteredResults(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching results:', error);
      }
    };

    fetchResults();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredResults(results);
      return;
    }

    const searchTermLower = searchTerm.toLowerCase();
    const filtered = Object.entries(results).reduce((acc, [city, candidates]) => {
      if (city.toLowerCase().includes(searchTermLower)) {
        acc[city] = candidates;
      }
      return acc;
    }, {});

    setFilteredResults(filtered);
  }, [searchTerm, results]);

  const findWinnerAndLoser = (candidates) => {
    if (!candidates || Object.keys(candidates).length === 0) return { winner: null, loser: null };
    
    const sorted = Object.entries(candidates).sort((a, b) => b[1] - a[1]);
    return {
      winner: sorted[0][0],
      loser: sorted[sorted.length - 1][0],
      sorted: sorted.map(([name, votes]) => ({ name, votes }))
    };
  };

  const renderChart = (data) => {
    switch (viewMode) {
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                innerRadius={60}
                fill="#8884d8"
                dataKey="votes"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [value, 'Votes']} />
              <Legend layout="vertical" verticalAlign="middle" align="right" />
            </PieChart>
          </ResponsiveContainer>
        );
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => [value, 'Votes']} />
              <Legend />
              <Bar dataKey="votes" radius={[8, 8, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        );
      default:
        return null;
    }
  };
  
  // Get the highest total votes for scaling the map colors
  //const highestVotes = 0; // Placeholder if needed

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header with Logo and Title */}
      <div className="relative bg-white shadow-md">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <img src="/src/assets/evm-logo.png" alt="EVM Logo" className="h-16 mr-4" />
              <div>
                <h1 className="text-4xl font-bold text-gradient bg-gradient-to-r from-blue-800 to-emerald-600">
                  Election Results Dashboard
                </h1>
                <p className="text-gray-600 mt-1">Live voting results by polling station</p>
              </div>
            </div>
            <div className="text-right">
              <div className="inline-block bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold">
                Last updated: {new Date().toLocaleString()}
              </div>
            </div>
          </div>
          <div className="w-full mt-4 h-1 bg-gradient-to-r from-blue-700 via-green-500 to-amber-500"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        {/* Controls Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          {/* Search Bar */}
          <div className="w-full md:w-1/3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by city..."
                className="w-full p-3 pl-10 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <svg
                className="w-5 h-5 absolute left-3 top-3.5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                ></path>
              </svg>
            </div>
          </div>

          {/* View Mode Selector */}
          <div className="flex p-1 bg-gray-100 rounded-full shadow-inner">
            <button
              onClick={() => setViewMode('list')}
              className={`px-6 py-2 rounded-full transition-all ${
                viewMode === 'list' 
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow' 
                  : 'text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
                List
              </span>
            </button>
            <button
              onClick={() => setViewMode('bar')}
              className={`px-6 py-2 rounded-full transition-all ${
                viewMode === 'bar' 
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow' 
                  : 'text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
                Bar
              </span>
            </button>
            <button
              onClick={() => setViewMode('pie')}
              className={`px-6 py-2 rounded-full transition-all ${
                viewMode === 'pie' 
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow' 
                  : 'text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"></path>
                </svg>
                Pie
              </span>
            </button>
          </div>
        </div>

        {/* Results Display */}
        {Object.keys(filteredResults).length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(filteredResults).map(([city, candidates]) => {
              const { winner, loser, sorted } = findWinnerAndLoser(candidates);
              const totalVotes = Object.values(candidates).reduce((a, b) => a + b, 0);
              //const intensityFactor = totalVotes / highestVotes;
              
              return (
                <div 
                  key={city} 
                  className={`bg-white p-6 border rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden ${
                    selectedCity === city ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => setSelectedCity(city === selectedCity ? null : city)}
                >
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-400 to-green-400 opacity-10 rounded-bl-full transform translate-x-10 -translate-y-10"></div>
                  
                  <h2 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2 flex justify-between items-center">
                    <span className="flex items-center">
                      <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      </svg>
                      {city}
                    </span>
                    {winner && (
                      <span className="text-sm font-normal bg-gradient-to-r from-green-50 to-emerald-100 text-emerald-800 px-3 py-1 rounded-full border border-emerald-200 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        {winner}
                      </span>
                    )}
                  </h2>

                  <div className="flex justify-between text-sm text-gray-500 mb-3">
                    <span>Total votes: {totalVotes}</span>
                    <span>Candidates: {sorted.length}</span>
                  </div>

                  {viewMode !== 'list' && selectedCity === city ? (
                    <div className="mt-4">
                      {renderChart(sorted)}
                    </div>
                  ) : (
                    <ul className="space-y-3">
                      {sorted.map(({ name, votes }) => {
                        const isWinner = name === winner;
                        const isLoser = name === loser;
                        const percentage = totalVotes > 0 ? (votes / totalVotes * 100).toFixed(1) : 0;
                        
                        return (
                          <li 
                            key={name} 
                            className={`p-3 rounded-lg border transition-all hover:shadow-sm ${
                              isWinner 
                                ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-emerald-200' 
                                : isLoser 
                                  ? 'bg-gradient-to-r from-red-50 to-orange-50 border-red-200' 
                                  : 'bg-gradient-to-r from-gray-50 to-blue-50 border-gray-200'
                            }`}
                          >
                            <div className="flex justify-between items-center mb-1">
                              <span className={`font-medium flex items-center ${
                                isWinner ? 'text-emerald-800' : isLoser ? 'text-red-800' : 'text-blue-800'
                              }`}>
                                {isWinner && (
                                  <svg className="w-4 h-4 mr-1 text-emerald-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                                  </svg>
                                )}
                                {name}
                              </span>
                              <div className="flex items-center gap-2">
                                <span className={`font-bold ${
                                  isWinner ? 'text-emerald-700' : isLoser ? 'text-red-700' : 'text-blue-700'
                                }`}>{votes}</span>
                                <span className="text-xs bg-white bg-opacity-50 px-2 py-0.5 rounded-full border">
                                  {percentage}%
                                </span>
                              </div>
                            </div>
                            
                            {/* Vote Bar */}
                            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
                              <div 
                                className={`h-full rounded-full shadow ${
                                  isWinner 
                                    ? 'bg-gradient-to-r from-green-400 to-emerald-500' 
                                    : isLoser 
                                      ? 'bg-gradient-to-r from-red-400 to-orange-500' 
                                      : 'bg-gradient-to-r from-blue-400 to-indigo-500'
                                }`}
                                style={{ 
                                  width: `${percentage}%` 
                                }}
                              ></div>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center p-16 bg-white rounded-xl shadow-md">
            <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
            <p className="text-gray-500 text-xl mt-4">No results found for "{searchTerm}"</p>
            <button 
              onClick={() => setSearchTerm('')}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
            >
              Clear search
            </button>
          </div>
        )}

        {/* Summary Footer */}
        {Object.keys(filteredResults).length > 0 && (
          <div className="mt-12 rounded-xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-700 to-blue-900 p-4 text-white">
              <h3 className="text-lg font-semibold">Summary Statistics</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 bg-white">
              <div className="p-6 border-r border-b border-gray-100">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-3 rounded-full mr-4">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Cities Displayed</p>
                    <p className="text-3xl font-bold text-blue-800">{Object.keys(filteredResults).length}</p>
                  </div>
                </div>
              </div>
              <div className="p-6 border-r border-b border-gray-100">
                <div className="flex items-center">
                  <div className="bg-green-100 p-3 rounded-full mr-4">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Votes</p>
                    <p className="text-3xl font-bold text-green-600">
                      {Object.values(filteredResults).reduce((total, candidates) => {
                        return total + Object.values(candidates).reduce((sum, votes) => sum + votes, 0);
                      }, 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center">
                  <div className="bg-amber-100 p-3 rounded-full mr-4">
                    <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Average Votes per City</p>
                    <p className="text-3xl font-bold text-amber-600">
                      {Object.keys(filteredResults).length > 0 
                        ? Math.round(Object.values(filteredResults).reduce((total, candidates) => {
                            return total + Object.values(candidates).reduce((sum, votes) => sum + votes, 0);
                          }, 0) / Object.keys(filteredResults).length).toLocaleString()
                        : 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer with credit */}
        <div className="mt-12 text-center text-gray-500 text-sm">
          <p>© 2025 Election Commission - Dashboard updated in real-time</p>
        </div>
      </div>
    </div>
  );
};

export default VoteResultsByStation;