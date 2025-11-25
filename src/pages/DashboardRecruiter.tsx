import React, { useState, useEffect } from "react";
import { Plus, Users, Briefcase, PlusCircle, Trash2, Edit, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { DashboardHeader } from "@/components/DashboardHeader";
import { supabase } from "@/lib/supabase";

// ... (imports restants inchangés)

export default function DashboardRecruiter() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [recruiterProfile, setRecruiterProfile] = useState<any>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [companyDesc, setCompanyDesc] = useState("");
  const [unreadNotifications, setUnreadNotifications] = useState(0); // <-- NOUVEL ÉTAT

  async function fetchRecruiterData() {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); return; }

    // 1. Récupérer le profil et le nom du recruteur
    const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
    if (profile) {
        setRecruiterProfile(profile);
        setCompanyName(profile.full_name || ""); 
        setCompanyDesc(profile.bio || "");
    }

    // 2. Récupérer les offres du recruteur
    const { data: jobsData, error } = await supabase
        .from('jobs')
        .select(`
            *, 
            applications(count),
            unread_applications:applications(count)
        `)
        .eq('recruiter_id', user.id)
        .order('created_at', { ascending: false });
        
    // ⚠️ ATTENTION : La requête 'unread_applications' doit être filtrée (voir étape 4 pour la correction de la RLS)
    // Pour l'instant, on se base sur les données récupérées pour simuler :
    
    if (!error && jobsData) {
        let totalUnread = 0;
        const formattedJobs = jobsData.map(job => {
            // Dans un scénario idéal, Supabase nous donnerait le compte filtré.
            // Vu qu'on ne peut pas encore le faire simplement, on compte tous les candidats pour l'affichage de base.
            const candidatesCount = job.applications ? job.applications[0]?.count || 0 : 0;
            
            // Simule l'affichage des notifications non lues.
            // On compte le nombre de candidatures qui n'ont pas la colonne `read_by_recruiter` à true
            // Vu qu'on ne peut pas filtrer directement ici sans RLS, on va simuler le compte global
            // En attendant de le faire dans JobCandidates.
            
            // Pour l'instant, on utilise le nombre total de candidats pour la démo
            // On retirera cette simulation à l'étape 4.
            const applications: any = job.applications || [];
            const unreadCount = applications.filter((app: any) => !app.read_by_recruiter).length || candidatesCount; 
            
            totalUnread += unreadCount;
            
            return {
                ...job,
                candidatesCount: candidatesCount,
                unreadCount: unreadCount,
            };
        });
        setJobs(formattedJobs);
        setUnreadNotifications(totalUnread); // Met à jour le total pour le header
    }
    setLoading(false);
  }

  // Assure-toi d'inclure le reste du composant DashboardRecruiter.tsx,
  // y compris le `useEffect` et la fonction `deleteJob`, 
  // ainsi que le `return` JSX (qui affiche le `DashboardHeader`).

  // ... (Fonction handleUpdateProfile inchangée)
  // ... (Fonction deleteJob inchangée)
  
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 dark:text-slate-100 font-sans text-slate-900 transition-colors">
      {/* Passe le nombre de notifications au DashboardHeader */}
      <DashboardHeader type="recruteur" unreadNotifications={unreadNotifications} /> 

      <div className="container mx-auto px-4 py-8">
        {/* ... (Reste du JSX inchangé) */}
        
        {/* Mise à jour du rendu des offres pour afficher le compte de candidats non lus */}
        {/* ... (Dans le rendu jobs.map) ... */}
         <div className="flex items-center gap-4 min-w-[200px]">
            <Link to={`/job-candidates/${job.id}`} className="flex items-center gap-1 text-sm font-medium text-slate-700 dark:text-slate-300">
                <Users className="h-4 w-4 text-brand-orange" /> 
                {job.candidatesCount} candidatures 
                {/* Affiche le badge de notification si des candidats ne sont pas lus */}
                {job.unreadCount > 0 && (
                    <Badge variant="destructive" className="ml-1 px-2 py-0.5 bg-red-600">
                        {job.unreadCount} nouveaux
                    </Badge>
                )}
            </Link>
            <Link to={`/job-candidates/${job.id}`}>
                <Button size="sm" className="dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700">Gérer</Button>
            </Link>
            {/* ... (Reste des boutons inchangé) ... */}
        </div>
      </div>
    </div>
  );
}