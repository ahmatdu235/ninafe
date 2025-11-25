import { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import SearchPage from "@/pages/Search";
import Dashboard from "@/pages/Dashboard";
import DashboardRecruiter from "@/pages/DashboardRecruiter";
import PostJob from "@/pages/PostJob";
import JobCandidates from "@/pages/JobCandidates";
import JobDetails from "@/pages/JobDetails";
import CompanyProfile from "@/pages/CompanyProfile";
import Favorites from "@/pages/Favorites";
import Messages from "@/pages/Messages";
import { supabase } from "@/lib/supabase";

function App() {
  const navigate = useNavigate();

  // --- LE CERVEAU DE NAVIGATION ---
  useEffect(() => {
    // On écoute les changements d'état (Connexion, Déconnexion)
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      
      if (event === 'SIGNED_IN' && session) {
        // 1. L'utilisateur vient de se connecter (Email ou Google)
        // On regarde son profil pour savoir où l'envoyer
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();

        // Si c'est un recruteur -> Dashboard Recruteur
        if (profile?.role === 'recruiter') {
          navigate('/dashboard-recruiter');
        } 
        // Sinon (Candidat ou Nouveau compte Google) -> Dashboard Candidat
        else {
          navigate('/dashboard');
        }
      }
      
      if (event === 'SIGNED_OUT') {
        // Si on se déconnecte, retour à l'accueil
        navigate('/');
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/search" element={<SearchPage />} />
      
      {/* Routes Privées */}
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/dashboard-recruiter" element={<DashboardRecruiter />} />
      <Route path="/post-job" element={<PostJob />} />
      <Route path="/job-candidates/:jobId" element={<JobCandidates />} />
      <Route path="/messages" element={<Messages />} />
      <Route path="/favorites" element={<Favorites />} />

      {/* Routes Publiques */}
      <Route path="/job/:id" element={<JobDetails />} />
      <Route path="/company/:id" element={<CompanyProfile />} />
    </Routes>
  );
}

export default App;