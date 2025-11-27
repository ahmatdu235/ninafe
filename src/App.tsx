import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

// Pages publiques
import HomePage from "@/pages/Home";
import SearchPage from "@/pages/Search";
import JobDetails from "@/pages/JobDetails";
import CompanyProfile from "@/pages/CompanyProfile";
import LoginPage from "@/pages/Login";
import RegisterPage from "@/pages/Register";

// Pages Dashboard et Protégées (Assurons-nous que les fichiers existent)
import Dashboard from "@/pages/Dashboard"; 
import RecruiterDashboard from "@/pages/RecruiterDashboard"; 
import JobCandidates from "@/pages/JobCandidates"; 
import Onboarding from "@/pages/Onboarding"; // Ajout de l'Onboarding si nécessaire
import Messages from "@/pages/Messages"; // Ajout de Messages
import Favorites from "@/pages/Favorites"; // <-- CORRECTION : un seul /pages

// Le composant AppHeader est supposé être importé ici mais il est géré dans le rendu.

export default function App() {
    const [isDark, setIsDark] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    
    // --- ÉTAT DE SIMULATION POUR LES NOTIFICATIONS ---
    const [unreadNotifications, setUnreadNotifications] = useState(3); 
    
    // --- NOUVEAU : État utilisateur complet pour le passage de props ---
    const [userState, setUserState] = useState({
        isLoggedIn: false,
        role: null,
        id: null
    });

    useEffect(() => {
        // 1. Initialiser le thème
        const root = window.document.documentElement;
        root.classList.remove(isDark ? "light" : "dark");
        root.classList.add(isDark ? "dark" : "light");
    }, [isDark]);


    const checkSession = async () => {
        const { data: { session } } = await supabase.auth.getSession();

        if (session) {
            // Récupération simplifiée du rôle (pour débloquer la navigation)
            const { data: profile } = await supabase.from('profiles').select('role, full_name, id').eq('id', session.user.id).single();
            
            let role = profile?.role || null;
            
            setUserRole(role);
            setUserState({
                isLoggedIn: true,
                role: role,
                id: session.user.id
            });

            // LOGIQUE DE REDIRECTION ONBOARDING (Si rôle manquant)
            if (!role && window.location.pathname !== '/onboarding') {
                 // Rediriger vers l'onboarding si le rôle n'est pas encore défini
                 return navigate('/onboarding');
            }
            
            // Si l'utilisateur est sur une page Auth, on le renvoie au Dashboard
            if (['/login', '/register', '/'].includes(window.location.pathname)) {
                const targetPath = role === 'recruiter' ? '/dashboard-recruiter' : '/dashboard';
                return navigate(targetPath);
            }
            
        } else {
            setUserRole(null);
            setUserState({ isLoggedIn: false, role: null, id: null });
        }
        setLoading(false);
    };

    useEffect(() => {
        // Vérification initiale
        checkSession();

        // Listener pour les changements d'état (Login/Logout)
        const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
                 // Au changement d'état, on relance la vérification complète
                 checkSession();
            }
        });

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);
    
    
    // Props complètes à passer à tous les composants
    const commonProps = {
        ...userState,
        isDark,
        setIsDark,
        unreadNotifications,
        // Ces fonctions sont nécessaires mais ne peuvent pas être passées directement via ...userState si elles sont des setters
        setIsLoggedIn: (status: boolean) => setUserState(prev => ({ ...prev, isLoggedIn: status })), 
        setUserRole: (role: string | null) => setUserState(prev => ({ ...prev, role: role })), 
    };
    
    // Composant de route protégée (vérifie la connexion et le rôle)
    const ProtectedRoute = ({ children, allowedRole }: { children: React.ReactNode, allowedRole: string | null }) => {
        if (loading) {
            return (
                <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
                    <Loader2 className="h-10 w-10 animate-spin mx-auto text-brand-orange" />
                </div>
            );
        }
        
        if (!commonProps.isLoggedIn) {
            return <Navigate to="/login" replace />;
        }
        
        // Si le rôle est spécifié (e.g. 'recruteur'), on vérifie que l'utilisateur a ce rôle.
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
                <Route path="/" element={<HomePage {...commonProps} />} />
                <Route path="/search" element={<SearchPage {...commonProps} />} />
                <Route path="/job/:id" element={<JobDetails {...commonProps} />} />
                <Route path="/company/:id" element={<CompanyProfile {...commonProps} />} />
                <Route path="/login" element={<LoginPage {...commonProps} />} />
                <Route path="/register" element={<RegisterPage {...commonProps} />} />
                <Route path="/onboarding" element={<Onboarding {...commonProps} />} /> 

                
                {/* --- ROUTES PROTEGEES --- */}
                
                {/* Dashboard Candidat (accessible par tous les connectés) */}
                <Route path="/dashboard" element={<Dashboard {...commonProps} />} />
                
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