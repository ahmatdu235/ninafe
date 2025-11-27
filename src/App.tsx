import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useNavigate, Navigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

// Pages publiques
import Home from "@/pages/Home";
import SearchPage from "@/pages/Search";
import JobDetails from "@/pages/JobDetails";
import CompanyProfile from "@/pages/CompanyProfile";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Onboarding from "@/pages/Onboarding"; 

// Pages Dashboard et Protégées
import Dashboard from "@/pages/Dashboard"; 
import RecruiterDashboard from "@/pages/RecruiterDashboard"; 
import JobCandidates from "@/pages/JobCandidates"; 
import Messages from "@/pages/Messages";
import Favorites from "@/pages/Favorites";

// Définition de l'état d'authentification pour résoudre les erreurs TS
interface AuthState {
    isLoggedIn: boolean;
    role: string | null;
    id: string | null;
}

export default function App() {
    const navigate = useNavigate();
    const [initialLoading, setInitialLoading] = useState(true);
    
    // GESTION DU THÈME
    const [isDark, setIsDark] = useState(() => localStorage.getItem("theme") === "dark");
    
    // GESTION DE LA SESSION GLOBALE
    const [userState, setUserState] = useState<AuthState>({
        isLoggedIn: false,
        role: null,
        id: null,
    });
    const [unreadNotifications, setUnreadNotifications] = useState(3); 

    useEffect(() => {
        // Initialisation du Thème
        const root = window.document.documentElement;
        root.classList.remove(isDark ? "light" : "dark");
        root.classList.add(isDark ? "dark" : "light");
    }, [isDark]);


    const handleAuthChange = async (session: any) => {
        let role = null;
        let userId = session?.user?.id || null;

        if (session) {
            // Lecture du profil
            try {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', session.user.id)
                    .single();
                
                if (profile) {
                    role = profile.role;
                }
            } catch (error) {
                console.error("Erreur de lecture RLS ou DB lors de la connexion");
            }

            setUserState({ isLoggedIn: true, role: role, id: userId });

            // LOGIQUE CRITIQUE : Redirection Onboarding si le rôle est manquant
            if (!role && window.location.pathname !== '/onboarding') {
                navigate('/onboarding');
            } else if (role) {
                // Redirection vers le Dashboard approprié
                const targetPath = role === 'recruiter' ? '/dashboard-recruiter' : '/dashboard';
                if (['/login', '/register', '/'].includes(window.location.pathname)) {
                    navigate(targetPath);
                }
            }
        } else {
            setUserState({ isLoggedIn: false, role: null, id: null });
            // Redirection vers le login si on est sur une route privée
            const isPrivateRoute = window.location.pathname.startsWith('/dashboard') || window.location.pathname === '/post-job' || window.location.pathname === '/messages' || window.location.pathname === '/favorites';
            if (isPrivateRoute) {
                navigate('/login');
            }
        }
        
        setInitialLoading(false);
    };
    
    useEffect(() => {
        const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
            handleAuthChange(session);
            if (event === 'SIGNED_OUT') navigate('/');
        });

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
    const commonProps = {
        ...userState, // isLoggedIn, role, id
        userRole: userState.role, // EXPOSE 'role' EN TANT QUE 'userRole' (FIX TS2741)
        isDark,
        setIsDark,
        unreadNotifications,
        // Fonctions nécessaires pour les boutons Logout
        setIsLoggedIn: (status: boolean) => setUserState(prev => ({ ...prev, isLoggedIn: status })), 
        setUserRole: (role: string | null) => setUserState(prev => ({ ...prev, role: role })), 
    };
    
    // Composant de route protégée (vérifie la connexion et le rôle)
    const ProtectedRoute = ({ children, allowedRole }: { children: React.ReactNode, allowedRole: string | null }) => {
        if (!commonProps.isLoggedIn) {
            return <Navigate to="/login" replace />;
        }
        
        if (allowedRole && commonProps.userRole !== allowedRole) {
            return <Navigate to="/dashboard" replace />;
        }

        return children;
    };

    return (
        <BrowserRouter>
            <Routes>
                
                {/* --- ROUTES PUBLIQUES (Auth incluses) --- */}
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
                <Route path="/post-job" element={<ProtectedRoute allowedRole="recruiter"><PostJob {...commonProps} /></ProtectedRoute>} />
                
                {/* Routes Recruteur (Restriction de Rôle) */}
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