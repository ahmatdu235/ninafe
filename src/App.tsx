import { useEffect, useState } from "react";
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
import Onboarding from "@/pages/Onboarding"; 
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

function App() {
  const navigate = useNavigate();
  const [initialLoading, setInitialLoading] = useState(true);

  // --- LOGIQUE SIMPLIFIÉE ET DÉBLOQUÉE ---
  const handleSessionCheck = async (session: any) => {
    // Le loader doit s'arrêter avant tout le reste, qu'il y ait erreur ou non.
    setInitialLoading(false); 
    
    if (session) {
      // Si l'utilisateur est connecté, on l'envoie vers le dashboard par défaut, 
      // et on laisse les composants individuels Dashboard faire leur propre vérification de rôle.
      if (window.location.pathname === '/login' || window.location.pathname === '/register' || window.location.pathname === '/onboarding') {
          navigate('/dashboard'); 
      }
    } else {
      // Si l'utilisateur est déconnecté, on le renvoie à l'accueil ou au login
      if (window.location.pathname.startsWith('/dashboard') || window.location.pathname === '/post-job') {
          navigate('/login');
      }
    }
  };

  
  useEffect(() => {
    // Vérification initiale : on regarde si une session existe
    supabase.auth.getSession().then(({ data: { session } }) => {
        handleSessionCheck(session); 
    });

    // Listener pour les changements d'état (Login/Logout)
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
        handleSessionCheck(session);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);
  
  // Afficher un loader le temps de vérifier la session au démarrage
  if (initialLoading) {
      return (
          <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
              <Loader2 className="h-10 w-10 text-brand-orange animate-spin" />
              <p className="ml-4 text-brand-blue dark:text-white">Chargement de la session...</p>
          </div>
      );
  }

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/search" element={<SearchPage />} />
      
      <Route path="/onboarding" element={<Onboarding />} /> 

      <Route path="/dashboard" element={<Dashboard />} /> 
      <Route path="/dashboard-recruiter" element={<DashboardRecruiter />} />
      <Route path="/post-job" element={<PostJob />} />
      <Route path="/job-candidates/:jobId" element={<JobCandidates />} />
      <Route path="/messages" element={<Messages />} />
      <Route path="/favorites" element={<Favorites />} />

      <Route path="/job/:id" element={<JobDetails />} />
      <Route path="/company/:id" element={<CompanyProfile />} />
    </Routes>
  );
}

export default App;