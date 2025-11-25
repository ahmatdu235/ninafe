import Favorites from "@/pages/Favorites";
import CompanyProfile from "@/pages/CompanyProfile";
import { Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import SearchPage from "@/pages/Search";
import Dashboard from "@/pages/Dashboard";
import DashboardRecruiter from "@/pages/DashboardRecruiter";
import PostJob from "@/pages/PostJob";
import JobCandidates from "@/pages/JobCandidates";
import JobDetails from "@/pages/JobDetails"; // <--- On s'assure que l'import est là

function App() {
  return (
    <Routes>
      {/* Pages Publiques */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/company/:id" element={<CompanyProfile />} />
      <Route path="/favorites" element={<Favorites />} />
      
      {/* Pages Candidat */}
      <Route path="/dashboard" element={<Dashboard />} />
      
      {/* Pages Recruteur */}
      <Route path="/dashboard-recruiter" element={<DashboardRecruiter />} />
      <Route path="/post-job" element={<PostJob />} />
      <Route path="/job-candidates/:jobId" element={<JobCandidates />} />

      {/* Page Détail Offre (Celle qui est blanche chez toi) */}
      <Route path="/job/:id" element={<JobDetails />} />
    </Routes>
  );
}

export default App;