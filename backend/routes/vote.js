// In your server routes file (e.g., routes/vote.js)
const express = require('express');
const router = express.Router();
const path = require('path');
// In routes/vote.js (at the bottom, after all the exports)
const { getCities, getCityResults,submitVote } = require('../controllers/voteController'); // or wherever your exports are
   const { getAllCityResults } = require('../controllers/voteController');
   
   router.get('/cities', getCities);
   router.get('/results/city', getCityResults);
router.post('/submit', submitVote);
//raat 9:31 baje likha code result ko display karne ke liye
router.get('/results/allcities', getAllCityResults);
module.exports = router;
