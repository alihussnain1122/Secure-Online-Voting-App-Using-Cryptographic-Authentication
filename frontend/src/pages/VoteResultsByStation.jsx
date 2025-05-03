import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, Cell, ResponsiveContainer } from 'recharts';
import { FaSearch, FaChartBar, FaChartPie, FaHome, FaList, FaTrophy, FaTimes, FaCity, FaUsers, FaVoteYea, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const VoteResultsByStation = () => {
  const [results, setResults] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredResults, setFilteredResults] = useState({});
  const [viewMode, setViewMode] = useState('list'); // 'list', 'bar', 'pie'
  const [selectedCity, setSelectedCity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Theme colors
  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/vote/results/allcities', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.data.success) {
          setResults(response.data.data);
          setFilteredResults(response.data.data);
        } else {
          setError('Failed to load results data');
        }
      } catch (error) {
        console.error('Error fetching results:', error);
        setError('Error loading voting results. Please try again.');
      } finally {
        setLoading(false);
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
    if (!candidates || Object.keys(candidates).length === 0) return { winner: null, loser: null, sorted: [] };
    
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
                labelLine={true}
                outerRadius={90}
                innerRadius={50}
                fill="#8884d8"
                dataKey="votes"
                paddingAngle={2}
                label={({ name, percent }) => `${name.substring(0, 10)}${name.length > 10 ? '...' : ''} (${(percent * 100).toFixed(0)}%)`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="#ffffff" strokeWidth={1} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value, name, props) => [`${value} votes`, props.payload.name]}
                contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: '8px', border: '1px solid #ddd', padding: '8px' }}
              />
              <Legend 
                layout="horizontal" 
                verticalAlign="bottom" 
                align="center"
                wrapperStyle={{ paddingTop: '10px' }}
                formatter={(value, entry) => <span style={{ color: '#333', fontSize: '12px' }}>{value}</span>}
              />
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

  const calculateSummaryStats = () => {
    const cities = Object.keys(filteredResults);
    const totalVotes = Object.values(filteredResults).reduce((total, candidates) => {
      return total + Object.values(candidates).reduce((sum, votes) => sum + votes, 0);
    }, 0);
    
    return {
      cityCount: cities.length,
      totalVotes,
      avgVotes: cities.length > 0 ? Math.round(totalVotes / cities.length) : 0
    };
  };

  const stats = calculateSummaryStats();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="w-full flex items-center justify-between mb-8 bg-white rounded-xl shadow-lg p-4 border border-gray-200">
        <div className="flex items-center">
          <img
            src="/src/assets/evm-logo.png"
            alt="EVM Logo"
            className="w-12 h-12 mr-3"
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
            <FaHome />
            <span>Dashboard</span>
          </button>
          <button 
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 bg-gradient-to-r from-gray-700 to-gray-900 text-white px-4 py-2 rounded-lg hover:from-gray-800 hover:to-black transition-all shadow-sm"
          >
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>
      </div>


      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        {/* Controls Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          {/* Search Bar */}
          <div className="w-full md:w-1/3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by city..."
                className="w-full p-3 pl-10 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FaSearch className="absolute left-3 top-3.5 text-gray-400" />
            </div>
          </div>

          {/* View Mode Selector */}
          <div className="flex p-1 bg-gray-100 rounded-lg shadow-inner">
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-lg transition-all flex items-center ${
                viewMode === 'list' 
                  ? 'bg-blue-600 text-white shadow' 
                  : 'text-gray-700 hover:bg-gray-200'
              }`}
            >
              <FaList className="mr-2" />
              List
            </button>
            <button
              onClick={() => setViewMode('bar')}
              className={`px-4 py-2 rounded-lg transition-all flex items-center ${
                viewMode === 'bar' 
                  ? 'bg-blue-600 text-white shadow' 
                  : 'text-gray-700 hover:bg-gray-200'
              }`}
            >
              <FaChartBar className="mr-2" />
              Bar
            </button>
            <button
              onClick={() => setViewMode('pie')}
              className={`px-4 py-2 rounded-lg transition-all flex items-center ${
                viewMode === 'pie' 
                  ? 'bg-blue-600 text-white shadow' 
                  : 'text-gray-700 hover:bg-gray-200'
              }`}
            >
              <FaChartPie className="mr-2" />
              Pie
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-50 text-red-700 rounded-lg border-l-4 border-red-500 mb-6">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center p-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-blue-700">Loading election results...</p>
          </div>
        )}

        {/* Results Display */}
        {!loading && Object.keys(filteredResults).length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(filteredResults).map(([city, candidates]) => {
                const { winner, loser, sorted } = findWinnerAndLoser(candidates);
                const totalVotes = Object.values(candidates).reduce((a, b) => a + b, 0);
                
                return (
                  <div 
                    key={city} 
                    className={`bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden ${
                      selectedCity === city ? 'ring-2 ring-blue-500' : ''
                    }`}
                    onClick={() => setSelectedCity(city === selectedCity ? null : city)}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h2 className="text-xl font-bold text-gray-800 flex items-center">
                        <FaCity className="text-blue-600 mr-2" />
                        {city}
                      </h2>
                      {winner && (
                        <span className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full flex items-center">
                          <FaTrophy className="mr-1" />
                          {winner}
                        </span>
                      )}
                    </div>

                    <div className="flex justify-between text-sm text-gray-500 mb-4">
                      <span>Total votes: {totalVotes.toLocaleString()}</span>
                      <span>Candidates: {sorted.length}</span>
                    </div>

                    {viewMode !== 'list' && selectedCity === city ? (
                      <div className="mt-4 h-64">
                        {renderChart(sorted)}
                      </div>
                    ) : (
                      <ul className="space-y-3">
                        {sorted.map(({ name, votes }, index) => {
                          const isWinner = name === winner;
                          const isLoser = name === loser;
                          const percentage = totalVotes > 0 ? (votes / totalVotes * 100).toFixed(1) : 0;
                          
                          return (
                            <li 
                              key={name} 
                              className={`p-3 rounded-lg border transition-all ${
                                isWinner 
                                  ? 'bg-green-50 border-green-200' 
                                  : isLoser 
                                    ? 'bg-red-50 border-red-200' 
                                    : 'bg-blue-50 border-blue-200'
                              }`}
                            >
                              <div className="flex justify-between items-center mb-1">
                                <span className={`font-medium ${
                                  isWinner ? 'text-green-800' : isLoser ? 'text-red-800' : 'text-blue-800'
                                }`}>
                                  {name}
                                </span>
                                <div className="flex items-center gap-2">
                                  <span className={`font-bold ${
                                    isWinner ? 'text-green-700' : isLoser ? 'text-red-700' : 'text-blue-700'
                                  }`}>{votes.toLocaleString()}</span>
                                  <span className="text-xs bg-white px-2 py-0.5 rounded-full border">
                                    {percentage}%
                                  </span>
                                </div>
                              </div>
                              
                              {/* Vote Bar */}
                              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                <div 
                                  className={`h-full ${
                                    isWinner 
                                      ? 'bg-green-500' 
                                      : isLoser 
                                        ? 'bg-red-500' 
                                        : 'bg-blue-500'
                                  }`}
                                  style={{ width: `${percentage}%` }}
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

            {/* Summary Stats */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-3 rounded-full mr-4 text-blue-600">
                    <FaCity className="text-xl" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Cities</p>
                    <p className="text-2xl font-bold text-blue-800">{stats.cityCount}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center">
                  <div className="bg-green-100 p-3 rounded-full mr-4 text-green-600">
                    <FaUsers className="text-xl" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Votes</p>
                    <p className="text-2xl font-bold text-green-800">{stats.totalVotes.toLocaleString()}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center">
                  <div className="bg-amber-100 p-3 rounded-full mr-4 text-amber-600">
                    <FaVoteYea className="text-xl" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Avg Votes/City</p>
                    <p className="text-2xl font-bold text-amber-800">{stats.avgVotes.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : !loading && (
          <div className="text-center p-12 bg-white rounded-xl shadow-md">
            <FaSearch className="w-16 h-16 mx-auto text-gray-400" />
            <p className="text-gray-500 text-xl mt-4">
              {searchTerm ? `No results found for "${searchTerm}"` : 'No voting results available'}
            </p>
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center mx-auto"
              >
                <FaTimes className="mr-2" />
                Clear search
              </button>
            )}
          </div>
        )}

        {/* Footer */}
        {/* <div className="mt-8 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} Election Commission - Last updated: {new Date().toLocaleString()}</p>
        </div> */}
      </div>
    </div>
  );
};

export default VoteResultsByStation;