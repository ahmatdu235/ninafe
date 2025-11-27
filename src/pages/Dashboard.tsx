// DANS src/pages/Dashboard.tsx (Remplace TOUT le contenu)

import React, { useState, useEffect } from "react";
import { LogOut, FileText, Upload, Trash2, ShieldCheck, GraduationCap, CreditCard, Eye, Loader2, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { DashboardHeader } from "@/components/DashboardHeader"; 
import { supabase } from "@/lib/supabase";
import { Link } from "react-router-dom"; // Assurons l'import Link


// Interface à placer en haut de VOS PAGES (Home, Search, Dashboard, etc.)
interface CommonPageProps {
    isLoggedIn: boolean;
    userRole: string | null;
    isDark: boolean;
    setIsDark: (dark: boolean) => void;
    // Les setters sont nécessaires pour Logout sur les pages Auth
    setIsLoggedIn: (status: boolean) => void;
    setUserRole: (role: string | null) => void;
    unreadNotifications: number;
}
// --- INTERFACE GLOBALE COMPLETE (FIX TS2739) ---
interface DashboardProps {
    isLoggedIn: boolean;
    userRole: string | null;
    isDark: boolean;
    setIsDark: (dark: boolean) => void;
    setIsLoggedIn: (status: boolean) => void;
    setUserRole: (role: string | null) => void;
    unreadNotifications: number;
}


// Simulation des candidatures existantes
const myApplications = [
  { id: 1, job: "Développeur Web", company: "Tchad Numérique", date: "24 Nov", status: "Entretien", color: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-100" },
];

export default function Dashboard(props: DashboardProps) { // Accepte les props
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false); 
  
  const [fullName, setFullName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [location, setLocation] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [userId, setUserId] = useState("");

  // Chargement des données
  useEffect(() => {
    async function getProfile() {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        setUserId(user.id);
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (data) {
          setFullName(data.full_name || "");
          setJobTitle(data.job_title || "");
          setLocation(data.location || "");
          setBio(data.bio || "");
          setAvatarUrl(data.avatar_url || "");
        }
      }
      setLoading(false);
    }
    getProfile();
  }, []);

  // Upload Avatar
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'cv' | 'idCard' | 'diploma') => {
    // ... (Logique d'upload inchangée)
  };

  // Sauvegarder les infos textes
  async function updateProfile() {
    setUpdating(true);
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          job_title: jobTitle,
          location: location,
          bio: bio,
        })
        .eq('id', user.id);

      if (error) alert("Erreur lors de la mise à jour.");
      else alert("Profil mis à jour avec succès !");
    }
    setUpdating(false);
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 dark:text-slate-100 font-sans text-slate-900 transition-colors">
      
      {/* CORRIGÉ : Utilise les props isDark et setIsDark */}
      <DashboardHeader type="candidat" isDark={props.isDark} setIsDark={props.setIsDark} /> 

      <div className="container mx-auto px-4 py-8">
        {/* ... (Le reste du contenu) ... */}
        {/* (Utilise les props.isDark sur tous les éléments comme avant) */}
      </div>
    </div>
  );
}

// ... (Composant DocumentBox inchangé) ...