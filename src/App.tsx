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

// Pages Dashboard

import RecruiterDashboard from "@/pages/RecruiterDashboard"; // NOUVEAU
import JobCandidates from "@/pages/JobCandidates"; // NOUVEAU

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  
  // --- ÉTAT DE SIMULATION POUR LES NOTIFICATIONS RECRUTEUR ---
  // Le recruteur verra un badge "3" sur la cloche de notification.
  const [unreadNotifications, setUnreadNotifications] = useState(3); 

  useEffect(() => {
    // 1. Initialiser le thème
    const root = window.document.documentElement;
    root.classList.remove(isDark ? "light" : "dark");
    root.classList.add(isDark ? "dark" : "light");

    // 2. Vérification de l'état de la session (simplifié pour la démo)
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (session) {
        setIsLoggedIn(true);
        // Utilisation de localStorage pour simuler la persistance du rôle
        // NOTE: En production, le rôle devrait être vérifié via la DB ou les claims JWT.
        const storedRole = localStorage.getItem('userRole');
        setUserRole(storedRole || 'candidat'); 
      } else {
        setIsLoggedIn(false);
        setUserRole(null);
      }
      setLoading(false);
    };

    checkSession();
  }, [isDark]);

  // Props communes passées à tous les composants de page
  const commonProps = {
    isLoggedIn,
    setIsLoggedIn,
    userRole,
    setUserRole,
    isDark,
    setIsDark,
    unreadNotifications, // Passé à toutes les pages pour le Header
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
    
    if (!isLoggedIn || (allowedRole && userRole !== allowedRole)) {
      return <Navigate to="/login" replace />;
    }

    return children;
  };

  return (
    <BrowserRouter>
      <Routes>
        
        {/* --- ROUTES PUBLIQUES (Ouvertes à tous) --- */}
        <Route path="/" element={<HomePage {...commonProps} />} />
        <Route path="/search" element={<SearchPage {...commonProps} />} />
        <Route path="/job/:id" element={<JobDetails {...commonProps} />} />
        <Route path="/company/:id" element={<CompanyProfile {...commonProps} />} />
        <Route path="/login" element={<LoginPage {...commonProps} />} />
        <Route path="/register" element={<RegisterPage {...commonProps} />} />
        
        <Route path="/dashboard" element={
    <ProtectedRoute allowedRole="candidat">
        {/* On utilise le composant Dashboard existant */}
        <Dashboard {...commonProps} />
    </ProtectedRoute>
} />
        
        {/* --- ROUTES RECRUTEUR (NOUVELLES) --- */}
        <Route path="/dashboard-recruiter" element={
            <ProtectedRoute allowedRole="recruteur">
                <RecruiterDashboard {...commonProps} />
            </ProtectedRoute>
        } />
        
        <Route path="/job-candidates/:jobId" element={
            <ProtectedRoute allowedRole="recruteur">
                <JobCandidates {...commonProps} />
            </ProtectedRoute>
        } />
        
      </Routes>
    </BrowserRouter>
  );
}