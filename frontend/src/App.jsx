import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SplashScreen from './pages/SplashScreen';
import UserSelection from './pages/UserSelection';
import VoterLogin from './pages/VoterLogin'; // Import VoterLogin page
import AdminLogin from './pages/AdminLogin'; // Import AdminLogin page
import VoterDashboard from './pages/VoterDashboard'; // Import VoterDashboard page
import AdminDashboard from './pages/AdminDashboard'; // Import AdminDashboard page
import CastVote from './pages/CastVote'; 
import ThankYou from './pages/ThankYou';
import CommissionLogin from './pages/CommissionLogin';
import CommissionDashboard from './pages/CommissionDashboard';
import ManageVoters from './pages/ManageVoters';
import ManageAdmins from './pages/ManageAdmin';
import AddVoter from './pages/voters/AddVoter';
import DeleteVoter from './pages/voters/DeleteVoter';
import EditVoter from './pages/voters/EditVoter';
import EditAdmin from './pages/admins/EditAdmin';
import DeleteAdmin from './pages/admins/DeleteAdmin';
import AddAdmin from './pages/admins/AddAdmin';
import Feedback from './pages/FeedBack';
import ManageCandidate from './pages/ManageCandidate';
import EditCandidate from './pages/candidates/EditCandidate';
import DeleteCandidate from './pages/candidates/DeleteCandidate';
import AddCandidate from './pages/candidates/AddCandidate';
import SearchVoter from './pages/SearchVoter';
import SearchOfficer from './pages/SearchOfficer';
import RegisteredVoterList from './pages/RegisteredVoterLisr';
import { VoteIcon } from 'lucide-react';
import VoteResultsByStation from './pages/VoteResultsByStation';
import ReviewFeedback from './pages/ReviewFeedback';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/select" element={<UserSelection />} />
        <Route path="/voter-login" element={<VoterLogin />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/commission-login" element={<CommissionLogin />} />
        <Route path="/commission-dashboard" element={<CommissionDashboard />} />
        <Route path="/voter-dashboard" element={<VoterDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/commission-dashboard" element={<CommissionDashboard />} />
        <Route path="/manage-voters" element={<ManageVoters />} />
        <Route path="/manage-admins" element={<ManageAdmins />} />
        <Route path="/cast-vote" element={<CastVote />} />
        <Route path="/thank-you" element={<ThankYou/>}/>
        <Route path="/add-voter" element={<AddVoter/>}/>
        <Route path="/delete-voter" element={<DeleteVoter/>}/>
        <Route path="/edit-voter" element={<EditVoter/>}/>
        <Route path="/add-admin" element={<AddAdmin/>}/>
        <Route path="delete-admin" element={<DeleteAdmin/>}/>
        <Route path="/edit-admin" element={<EditAdmin/>}/>
        <Route path="/manage-candidates" element={<ManageCandidate />} />
        <Route path="/add-candidate" element={<AddCandidate/>}/>
        <Route path="delete-candidate" element={<DeleteCandidate/>}/>
        <Route path="/edit-candidate" element={<EditCandidate/>}/>
        <Route path="/search-voter" element={<SearchVoter/>}/>
        <Route path="/search-officer" element={<SearchOfficer/>}/>
        <Route path="/voters-list/" element={<RegisteredVoterList/>} />
        <Route path="/vote-results-by-station" element={<VoteResultsByStation/>}/>
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/review-feedback" element={<ReviewFeedback />} />     
         </Routes>
    </Router>
  );
}

export default App;
