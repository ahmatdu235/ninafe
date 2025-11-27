import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

// Pages
import Home from "@/pages/Home";
import SearchPage from "@/pages/Search";
import JobDetails from "@/pages/JobDetails";
import CompanyProfile from "@/pages/CompanyProfile";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Onboarding from "@/pages/Onboarding"; 
import Dashboard from "@/pages/Dashboard"; 
import RecruiterDashboard from "@/pages/RecruiterDashboard"; 
import JobCandidates from "@/pages/JobCandidates"; 
import Messages from "@/pages/Messages";
import Favorites from "@/pages/Favorites";
import PostJob from "@/pages/PostJob";

interface AuthState {
    isLoggedIn: boolean;
    role: string | null;
    id: string | null;
}

export default function App() {
    const navigate = useNavigate();
    const [initialLoading, setInitialLoading] = useState(true);
    
    const [isDark, setIsDark] = useState(() => localStorage.getItem("theme") === "dark");
    
    const [userState, setUserState] = useState<AuthState>({
        isLoggedIn: false,
        role: null,
        id: null,
    });
    const [unreadNotifications, setUnreadNotifications] = useState(3); 

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove(isDark ? "light" : "dark");
        root.classList.add(isDark ? "dark" : "light");
    }, [isDark]);

    const checkUserSession = async () => {
        const { data: { session } } = await supabase.auth.getSession();

        if (session) {
            try {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', session.user.id)
                    .single();
                
                const role = profile?.role || null;
                setUserState({ isLoggedIn: true, role: role, id: session.user.id });

                // Si pas de rôle, on force l'onboarding
                if (!role && window.location.pathname !== '/onboarding') {
                    navigate('/onboarding');
                }
            } catch (e) {
                console.error("Erreur lecture profil", e);
            }
        } else {
            setUserState({ isLoggedIn: false, role: null, id: null });
        }
        setInitialLoading(false);
    };
    
    useEffect(() => {
        checkUserSession();

        const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_OUT') {
                setUserState({ isLoggedIn: false, role: null, id: null });
                navigate('/');
            } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
                checkUserSession();
            }
        });

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, [navigate]);
    
    if (initialLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
                <Loader2 className="h-10 w-10 text-brand-orange animate-spin" />
            </div>
        );
    }

    const commonProps = {
        ...userState, 
        userRole: userState.role,
        isDark,
        setIsDark,
        unreadNotifications,
        setIsLoggedIn: (status: boolean) => setUserState(prev => ({ ...prev, isLoggedIn: status })), 
        setUserRole: (role: string | null) => setUserState(prev => ({ ...prev, role: role })), 
    };
    
    const ProtectedRoute = ({ children, allowedRole }: { children: React.ReactNode, allowedRole: string | null }) => {
        if (!commonProps.isLoggedIn) return <Navigate to="/login" replace />;
        if (allowedRole && commonProps.userRole !== allowedRole) return <Navigate to="/dashboard" replace />;
        return children;
    };

    return (
        <Routes>
            {/* Routes Publiques */}
            <Route path="/" element={<Home {...commonProps} />} />
            <Route path="/search" element={<SearchPage {...commonProps} />} />
            <Route path="/job/:id" element={<JobDetails {...commonProps} />} />
            <Route path="/company/:id" element={<CompanyProfile {...commonProps} />} />
            <Route path="/login" element={<Login {...commonProps} />} />
            <Route path="/register" element={<Register {...commonProps} />} />
            <Route path="/onboarding" element={<Onboarding {...commonProps} />} /> 
            
            {/* Routes Privées / Dashboard */}
            <Route path="/favorites" element={<Favorites {...commonProps} />} />
            <Route path="/messages" element={<Messages {...commonProps} />} />
            
            <Route path="/dashboard" element={<Dashboard {...commonProps} />} /> 
            
            <Route path="/dashboard-recruiter" element={
                <ProtectedRoute allowedRole="recruiter">
                    <RecruiterDashboard {...commonProps} />
                </ProtectedRoute>
            } />
            
            <Route path="/post-job" element={
                <ProtectedRoute allowedRole="recruiter">
                    <PostJob {...commonProps} />
                </ProtectedRoute>
            } />
            
            <Route path="/job-candidates/:jobId" element={
                <ProtectedRoute allowedRole="recruiter">
                    <JobCandidates {...commonProps} />
                </ProtectedRoute>
            } />
        </Routes>
    );
}