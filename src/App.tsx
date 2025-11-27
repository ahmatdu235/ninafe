import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate, BrowserRouter, Navigate } from "react-router-dom"; // AJOUT DE useNavigate et BrowserRouter
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import SearchPage from "@/pages/Search";
import Dashboard from "@/pages/Dashboard";
import RecruiterDashboard from "@/pages/RecruiterDashboard"; // Renommé pour la clarté
import PostJob from "@/pages/PostJob";
import JobCandidates from "@/pages/JobCandidates";
import JobDetails from "@/pages/JobDetails";
import CompanyProfile from "@/pages/CompanyProfile";
import Favorites from "@/pages/Favorites";
import Messages from "@/pages/Messages";
import Onboarding from "@/pages/Onboarding"; 
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";
import { AppHeader } from "@/components/AppHeader"; 

// Définition de l'état d'authentification pour résoudre les erreurs TS2559 et TS2322
interface AuthState {
    isLoggedIn: boolean;
    role: string | null;
    id: string | null;
}

function App() {
  const navigate = useNavigate(); // <-- FIX : useNavigate est maintenant initialisé
  const [initialLoading, setInitialLoading] = useState(true);
  const [isDark, setIsDark] = useState(() => localStorage.getItem("theme") === "dark");
  
  // Correction des types d'état pour accepter string | null (TS2345/TS2559)
  const [userState, setUserState] = useState<AuthState>({
    isLoggedIn: false,
    role: null,
    id: null,
  });
  
  // Ajout du state pour les notifications non lues (pour l'affichage)
  const [unreadNotifications, setUnreadNotifications] = useState(3); 

  useEffect(() => {
    // Thème
    const root = window.document.documentElement;
    root.classList.remove(isDark ? "light" : "dark");
    root.classList.add(isDark ? "dark" : "light");
  }, [isDark]);


  const handleAuthChange = async (session: any) => {
    let role = null;

    if (session) {
        // Lecture du profil
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single();
        
        if (profile) {
            role = profile.role;
        }

        setUserState({ isLoggedIn: true, role: role, id: session.user.id });

        // Redirection Onboarding
        if (!role && window.location.pathname !== '/onboarding') {
            navigate('/onboarding');
        } else if (role) {
            // Redirection Dashboard
            const targetPath = role === 'recruiter' ? '/dashboard-recruiter' : '/dashboard';
            if (['/login', '/register', '/'].includes(window.location.pathname)) {
                navigate(targetPath);
            }
        }
    } else {
        setUserState({ isLoggedIn: false, role: null, id: null });
        // Si non connecté et sur une route privée, rediriger au login
        if (window.location.pathname.startsWith('/dashboard') || window.location.pathname === '/post-job' || window.location.pathname === '/messages' || window.location.pathname === '/favorites') {
            navigate('/login');
        }
    }
    
    setInitialLoading(false);
  };
  
  useEffect(() => {
    // Listener pour les changements d'état (Login/Logout)
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
        handleAuthChange(session);
        if (event === 'SIGNED_OUT') navigate('/');
    });

    // Vérification initiale
    supabase.auth.getSession().then(({ data: { session } }) => {
        handleAuthChange(session); 
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);
  
  if (initialLoading) {
      return (
          <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
              <Loader2 className="h-10 w-10 text-brand-orange animate-spin" />
              <p className="ml-4 text-brand-blue dark:text-white">Chargement de la session...</p>
          </div>
      );
  }

  // Props complètes à passer à tous les composants
 // DANS src/App.tsx (vers la ligne 104)
const commonProps = {
    ...userState, // isLogged, role, id
    isDark,
    setIsDark,
    unreadNotifications,
    
    // FIX CRITIQUE : AJOUTER LES SETTERS
    setIsLoggedIn: (status: boolean) => setUserState(prev => ({ ...prev, isLoggedIn: status })), 
    setUserRole: (role: string | null) => setUserState(prev => ({ ...prev, role: role })), 
};
  // Composant de route protégée (vérifie la connexion et le rôle)
  const ProtectedRoute = ({ children, allowedRole }: { children: React.ReactNode, allowedRole: string | null }) => {
    if (!commonProps.isLoggedIn) {
        return <Navigate to="/login" replace />;
    }
    
    if (allowedRole && commonProps.userRole !== allowedRole) {
        // Si le rôle n'est pas bon, on renvoie au Dashboard par défaut
        return <Navigate to="/dashboard" replace />;
    }

    return children;
  };

  return (
    <BrowserRouter>
      <Routes>
        
        {/* --- ROUTES PUBLIQUES --- */}
        <Route path="/" element={<Home {...commonProps} />} />
        <Route path="/search" element={<SearchPage {...commonProps} />} />
        <Route path="/job/:id" element={<JobDetails {...commonProps} />} />
        <Route path="/company/:id" element={<CompanyProfile {...commonProps} />} />
        <Route path="/login" element={<Login {...commonProps} />} />
        <Route path="/register" element={<Register {...commonProps} />} />
        <Route path="/onboarding" element={<Onboarding {...commonProps} />} /> 
        <Route path="/favorites" element={<Favorites {...commonProps} />} />
        <Route path="/messages" element={<Messages {...commonProps} />} />

        {/* --- ROUTES PROTEGEES --- */}
        <Route path="/dashboard" element={<Dashboard {...commonProps} />} />
        
        <Route path="/dashboard-recruiter" element={
            <ProtectedRoute allowedRole="recruiter">
                <RecruiterDashboard {...commonProps} />
            </ProtectedRoute>
        } />
        
        <Route path="/job-candidates/:jobId" element={
            <ProtectedRoute allowedRole="recruiter">
                <JobCandidates {...commonProps} />
            </ProtectedRoute>
        } />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;