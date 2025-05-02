import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import axios from "axios";

const COLORS = ["#00C49F", "#FFBB28", "#FF8042", "#0088FE", "#FF6384", "#36A2EB", "#FFCE56"];

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

  // Filter feedbacks based on selected filter
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
      const response = await axios.get("/api/vote/results/allcities");
      // Handle different response structures
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
      setError("Failed to load voting data");
      setCityResults({});
      setFilteredResults({});
    } finally {
      setIsLoading(prev => ({ ...prev, votes: false }));
    }
  };

  const fetchFeedbacks = async () => {
    try {
      const response = await axios.get("/api/feedbacks/all");
      // Handle different response structures
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
      setError("Failed to load feedback data");
      setFeedbacks([]);
    } finally {
      setIsLoading(prev => ({ ...prev, feedbacks: false }));
    }
  };

  const findWinnerAndLoser = (candidates) => {
    if (!candidates || Object.keys(candidates).length === 0) return { winner: null, loser: null };
    
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

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-green-800">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">View live voting results and feedback from all cities</p>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="relative w-full md:w-1/3 mx-auto mb-6">
            <input
              type="text"
              placeholder="Search by city..."
              className="w-full p-3 pl-10 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
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

          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-green-800">City-wise Voting Statistics</h2>
            <button
              onClick={() => setChartType(prev => prev === "bar" ? "pie" : "bar")}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all"
            >
              Switch to {chartType === "bar" ? "Pie" : "Bar"} Chart
            </button>
          </div>

          {isLoading.votes ? (
            <div className="h-64 flex items-center justify-center">
              <p className="text-gray-600">Loading vote data...</p>
            </div>
          ) : Object.keys(filteredResults).length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(filteredResults).map(([city, candidates]) => {
                const { winner, loser, sorted } = findWinnerAndLoser(candidates);
                const totalVotes = Object.values(candidates).reduce((a, b) => a + b, 0);
                
                return (
                  <div 
                    key={city} 
                    className={`bg-white p-6 border rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden ${
                      selectedCity === city ? 'ring-2 ring-green-500' : ''
                    }`}
                    onClick={() => setSelectedCity(city === selectedCity ? null : city)}
                  >
                    <h2 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2 flex justify-between items-center">
                      <span className="flex items-center">
                        <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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

                    {selectedCity === city ? (
                      <div className="h-64 mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                          {chartType === "bar" ? (
                            <BarChart data={sorted}>
                              <XAxis dataKey="candidateName" />
                              <YAxis />
                              <Tooltip />
                              <Legend />
                              <Bar dataKey="voteCount" name="Votes">
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
                              <Tooltip />
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
                                  {candidateName}
                                </span>
                                <div className="flex items-center gap-2">
                                  <span className={`font-bold ${
                                    isWinner ? 'text-emerald-700' : isLoser ? 'text-red-700' : 'text-blue-700'
                                  }`}>{voteCount}</span>
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
                className="mt-4 px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors"
              >
                Clear search
              </button>
            </div>
          )}
        </div>

        {/* Summary Section */}
        {Object.keys(filteredResults).length > 0 && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h2 className="text-2xl font-bold text-green-800 mb-4">Election Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-green-50 rounded-xl">
                <div className="flex items-center">
                  <div className="bg-green-100 p-3 rounded-full mr-4">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Cities Displayed</p>
                    <p className="text-3xl font-bold text-green-800">{Object.keys(filteredResults).length}</p>
                  </div>
                </div>
              </div>
              <div className="p-6 bg-blue-50 rounded-xl">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-3 rounded-full mr-4">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Votes</p>
                    <p className="text-3xl font-bold text-blue-800">
                      {Object.values(filteredResults).reduce((total, candidates) => {
                        return total + Object.values(candidates).reduce((sum, votes) => sum + votes, 0);
                      }, 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-6 bg-amber-50 rounded-xl">
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

        {/* Feedback Section */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-green-800">Voter Feedback & Complaints</h2>
            <div className="flex gap-2">
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 text-sm"
              >
                <option value="all">All Feedback</option>
                <option value="withID">With Voter ID</option>
                <option value="anonymous">Anonymous</option>
                <option value="recent">Recent (7 days)</option>
              </select>
            </div>
          </div>

          {/* Feedback Count Summary */}
          <div className="bg-green-50 rounded-xl p-4 mb-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-sm text-green-700 font-medium">Total Feedback</p>
              <p className="text-xl font-bold text-green-800">{feedbacks.length}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-green-700 font-medium">With Voter ID</p>
              <p className="text-xl font-bold text-green-800">
                {feedbacks.filter(f => f.voterID).length}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-green-700 font-medium">Anonymous</p>
              <p className="text-xl font-bold text-green-800">
                {feedbacks.filter(f => !f.voterID).length}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-green-700 font-medium">Last 7 Days</p>
              <p className="text-xl font-bold text-green-800">
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
              <p className="text-gray-600">Loading feedbacks...</p>
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
                      <h3 className="font-medium text-gray-800 flex items-center">
                        {feedback.voterName || 'Anonymous Voter'}
                        {!feedback.voterName && (
                          <span className="ml-2 bg-gray-100 text-gray-500 text-xs px-2 py-0.5 rounded-full">
                            Anonymous
                          </span>
                        )}
                      </h3>
                      {feedback.voterID && (
                        <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full">
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
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              <p className="text-gray-500 mt-2">No feedback available for the selected filter</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;