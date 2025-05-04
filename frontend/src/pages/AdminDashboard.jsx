import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import axios from "axios";
import { FaSearch, FaChartBar, FaChartPie, FaList, FaTrophy, FaCity, FaUsers, FaVoteYea, FaCommentAlt, FaFilter, FaHome, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899", "#06b6d4"];

const AdminDashboard = () => {
  const [cityResults, setCityResults] = useState({});
  const [chartType, setChartType] = useState("bar");
  const [feedbacks, setFeedbacks] = useState([]);
  const [isLoading, setIsLoading] = useState({
    votes: true,
    feedbacks: true
  });
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredResults, setFilteredResults] = useState({});
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    fetchVotes();
    fetchFeedbacks();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredResults(cityResults);
      return;
    }

    const searchTermLower = searchTerm.toLowerCase();
    const filtered = Object.entries(cityResults).reduce((acc, [city, candidates]) => {
      if (city.toLowerCase().includes(searchTermLower)) {
        acc[city] = candidates;
      }
      return acc;
    }, {});

    setFilteredResults(filtered);
  }, [searchTerm, cityResults]);

  const filteredFeedbacks = selectedFilter === 'all' 
    ? feedbacks 
    : feedbacks.filter(feedback => {
        if (selectedFilter === 'withID') return feedback.voterID;
        if (selectedFilter === 'anonymous') return !feedback.voterID;
        if (selectedFilter === 'recent') {
          const oneWeekAgo = new Date();
          oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
          return new Date(feedback.timestamp || feedback.submittedAt) > oneWeekAgo;
        }
        return true;
      });

  const fetchVotes = async () => {
    try {
      setIsLoading(prev => ({ ...prev, votes: true }));
      const token = localStorage.getItem('token');
      const response = await axios.get("/api/vote/results/allcities", {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const data = response?.data;
      if (data?.success && data?.data) {
        setCityResults(data.data);
        setFilteredResults(data.data);
      } else if (data && typeof data === 'object' && !Array.isArray(data)) {
        setCityResults(data);
        setFilteredResults(data);
      } else {
        setCityResults({});
        setFilteredResults({});
      }
    } catch (err) {
      console.error("Error fetching votes:", err);
      setError("Failed to load voting data. Please try again.");
      setCityResults({});
      setFilteredResults({});
    } finally {
      setIsLoading(prev => ({ ...prev, votes: false }));
    }
  };

  const fetchFeedbacks = async () => {
    try {
      setIsLoading(prev => ({ ...prev, feedbacks: true }));
      const token = localStorage.getItem('token');
      const response = await axios.get("/api/feedbacks/all", {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const data = response?.data;
      if (Array.isArray(data?.feedbacks)) {
        setFeedbacks(data.feedbacks);
      } else if (Array.isArray(data)) {
        setFeedbacks(data);
      } else {
        setFeedbacks([]);
      }
    } catch (err) {
      console.error("Error fetching feedbacks:", err);
      setError("Failed to load feedback data. Please try again.");
      setFeedbacks([]);
    } finally {
      setIsLoading(prev => ({ ...prev, feedbacks: false }));
    }
  };

  const findWinnerAndLoser = (candidates) => {
    if (!candidates || Object.keys(candidates).length === 0) return { winner: null, loser: null, sorted: [] };
    
    const sorted = Object.entries(candidates).sort((a, b) => b[1] - a[1]);
    return {
      winner: sorted[0][0],
      loser: sorted[sorted.length - 1][0],
      sorted: sorted.map(([name, votes]) => ({
        candidateName: name,
        voteCount: votes
      }))
    };
  };

  const getCityChartData = (city) => {
    const candidates = cityResults[city];
    if (!candidates) return [];
    
    return Object.entries(candidates).map(([name, votes]) => ({
      candidateName: name,
      voteCount: votes
    }));
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
        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-50 text-red-700 rounded-lg border-l-4 border-red-500 mb-6">
            {error}
          </div>
        )}

        {/* Search and Controls */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
            <div className="relative w-full md:w-1/3">
              <input
                type="text"
                placeholder="Search by city..."
                className="w-full p-3 pl-10 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FaSearch className="absolute left-3 top-3.5 text-gray-400" />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setChartType("bar")}
                className={`px-4 py-2 rounded-lg transition-all flex items-center ${
                  chartType === "bar" 
                    ? 'bg-blue-600 text-white shadow' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <FaChartBar className="mr-2" />
                Bar Chart
              </button>
              <button
                onClick={() => setChartType("pie")}
                className={`px-4 py-2 rounded-lg transition-all flex items-center ${
                  chartType === "pie" 
                    ? 'bg-blue-600 text-white shadow' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <FaChartPie className="mr-2" />
                Pie Chart
              </button>
            </div>
          </div>

          {/* Loading State */}
          {isLoading.votes ? (
            <div className="h-64 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
          ) : Object.keys(filteredResults).length > 0 ? (
            <>
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <FaCity className="text-blue-600 mr-2" />
                City-wise Voting Results
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(filteredResults).map(([city, candidates]) => {
                  const { winner, loser, sorted } = findWinnerAndLoser(candidates);
                  const totalVotes = Object.values(candidates).reduce((a, b) => a + b, 0);
                  
                  return (
                    <div 
                      key={city} 
                      className={`bg-white p-6 border rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden ${
                        selectedCity === city ? 'ring-2 ring-blue-500' : ''
                      }`}
                      onClick={() => setSelectedCity(city === selectedCity ? null : city)}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-lg font-bold text-gray-800 flex items-center">
                          <FaCity className="text-blue-500 mr-2" />
                          {city}
                        </h3>
                        {winner && (
                          <span className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full flex items-center">
                            <FaTrophy className="mr-1" />
                            {winner}
                          </span>
                        )}
                      </div>

                      <div className="flex justify-between text-sm text-gray-500 mb-4">
                        <span>Total votes: {totalVotes.toLocaleString()}</span>
                        <span>{sorted.length} candidates</span>
                      </div>

                      {selectedCity === city ? (
                        <div className="h-64 mt-4">
                          <ResponsiveContainer width="100%" height="100%">
                            {chartType === "bar" ? (
                              <BarChart data={sorted}>
                                <XAxis dataKey="candidateName" />
                                <YAxis />
                                <Tooltip formatter={(value) => [`${value} votes`, 'Votes']} />
                                <Legend />
                                <Bar dataKey="voteCount" name="Votes" radius={[4, 4, 0, 0]}>
                                  {sorted.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                  ))}
                                </Bar>
                              </BarChart>
                            ) : (
                              <PieChart>
                                <Pie
                                  data={sorted}
                                  dataKey="voteCount"
                                  nameKey="candidateName"
                                  cx="50%"
                                  cy="50%"
                                  outerRadius={80}
                                  label={({ candidateName, percent }) => `${candidateName}: ${(percent * 100).toFixed(0)}%`}
                                >
                                  {sorted.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                  ))}
                                </Pie>
                                <Tooltip formatter={(value) => [`${value} votes`, 'Votes']} />
                                <Legend />
                              </PieChart>
                            )}
                          </ResponsiveContainer>
                        </div>
                      ) : (
                        <ul className="space-y-3">
                          {sorted.map(({ candidateName, voteCount }) => {
                            const isWinner = candidateName === winner;
                            const isLoser = candidateName === loser;
                            const percentage = totalVotes > 0 ? (voteCount / totalVotes * 100).toFixed(1) : 0;
                            
                            return (
                              <li 
                                key={candidateName} 
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
                                    {candidateName}
                                  </span>
                                  <div className="flex items-center gap-2">
                                    <span className={`font-bold ${
                                      isWinner ? 'text-green-700' : isLoser ? 'text-red-700' : 'text-blue-700'
                                    }`}>{voteCount.toLocaleString()}</span>
                                    <span className="text-xs bg-white px-2 py-0.5 rounded-full border">
                                      {percentage}%
                                    </span>
                                  </div>
                                </div>
                                
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
            </>
          ) : (
            <div className="text-center p-12 bg-white rounded-xl border-2 border-dashed border-gray-200">
              <FaSearch className="w-16 h-16 mx-auto text-gray-400" />
              <p className="text-gray-500 text-xl mt-4">
                {searchTerm ? `No results found for "${searchTerm}"` : 'No voting results available'}
              </p>
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center mx-auto"
                >
                  Clear search
                </button>
              )}
            </div>
          )}
        </div>

        {/* Summary Section */}
        {Object.keys(filteredResults).length > 0 && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <FaVoteYea className="text-blue-500 mr-2" />
              Election Summary
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
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
              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
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
              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
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
          </div>
        )}

        {/* Feedback Section */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <h2 className="text-xl font-bold text-gray-800 flex items-center">
              <FaCommentAlt className="text-blue-500 mr-2" />
              Voter Feedback
            </h2>
            
            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
              <div className="relative flex items-center">
                <FaFilter className="absolute left-3 text-gray-400" />
                <select
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm w-full"
                >
                  <option value="all">All Feedback</option>
                  <option value="withID">With Voter ID</option>
                  <option value="anonymous">Anonymous</option>
                  <option value="recent">Recent (7 days)</option>
                </select>
              </div>
              
              <button 
                onClick={fetchFeedbacks}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                Refresh
              </button>
            </div>
          </div>

          {/* Feedback Stats */}
          <div className="bg-blue-50 rounded-xl p-4 mb-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-sm text-blue-700 font-medium">Total</p>
              <p className="text-xl font-bold text-blue-800">{feedbacks.length}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-blue-700 font-medium">With ID</p>
              <p className="text-xl font-bold text-blue-800">
                {feedbacks.filter(f => f.voterID).length}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-blue-700 font-medium">Anonymous</p>
              <p className="text-xl font-bold text-blue-800">
                {feedbacks.filter(f => !f.voterID).length}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-blue-700 font-medium">Last 7 Days</p>
              <p className="text-xl font-bold text-blue-800">
                {feedbacks.filter(f => {
                  const oneWeekAgo = new Date();
                  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
                  return new Date(f.timestamp || f.submittedAt) > oneWeekAgo;
                }).length}
              </p>
            </div>
          </div>

          {isLoading.feedbacks ? (
            <div className="h-32 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
            </div>
          ) : filteredFeedbacks.length > 0 ? (
            <div className="space-y-4 max-h-[500px] overflow-y-auto p-2">
              {filteredFeedbacks.map((feedback, index) => (
                <div 
                  key={feedback._id || index} 
                  className="bg-white p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-wrap justify-between items-start gap-2">
                    <div>
                      <h3 className="font-medium text-gray-800">
                        {feedback.voterName || 'Anonymous Voter'}
                        {!feedback.voterName && (
                          <span className="ml-2 bg-gray-100 text-gray-500 text-xs px-2 py-0.5 rounded-full">
                            Anonymous
                          </span>
                        )}
                      </h3>
                      {feedback.voterID && (
                        <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full mt-1 inline-block">
                          Voter ID: {feedback.voterID}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(feedback.timestamp || feedback.submittedAt).toLocaleString()}
                    </div>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {feedback.message || feedback.feedback}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl p-8 text-center border-2 border-dashed border-gray-200">
              <FaCommentAlt className="w-16 h-16 mx-auto text-gray-300" />
              <p className="text-gray-500 mt-2">No feedback available for the selected filter</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;