import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Loader2, Mail, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DashboardHeader } from "@/components/DashboardHeader";
import { supabase } from "@/lib/supabase";

export default function JobCandidates() {
  const { jobId } = useParams<{ jobId: string }>();
  const [job, setJob] = useState<any>(null);
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fonction pour marquer toutes les candidatures pour cette offre comme lues
  const markApplicationsAsRead = async (jobId: string) => {
    // On met à jour toutes les lignes de la table `applications`
    // où `job_id` correspond à l'offre et où `read_by_recruiter` est false.
    const { error } = await supabase
        .from('applications')
        .update({ read_by_recruiter: true })
        .eq('job_id', jobId)
        .eq('read_by_recruiter', false); // On ne met à jour que les non lus

    if (error) {
        console.error("Erreur lors du marquage des candidatures comme lues:", error);
    }
  };

  async function fetchCandidates() {
    setLoading(true);
    
    // Marque les candidatures comme lues au moment de l'ouverture de la page
    if (jobId) {
        await markApplicationsAsRead(jobId);
    }

    // Récupérer les détails de l'offre
    const { data: jobData, error: jobError } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', jobId)
        .single();
    
    if (jobError || !jobData) {
        console.error("Erreur de récupération de l'offre:", jobError);
        setLoading(false);
        return;
    }
    setJob(jobData);

    // Récupérer les candidatures pour cette offre
    const { data: applicationsData, error: applicationsError } = await supabase
        .from('applications')
        .select(`
            *,
            candidate:profiles (full_name, job_title, bio)
        `)
        .eq('job_id', jobId);

    if (!applicationsError && applicationsData) {
        setCandidates(applicationsData);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchCandidates();
    
    // Le cleanup pour se synchroniser :
    // Après avoir marqué comme lu, on redirige vers le dashboard pour rafraîchir le compte total de notifications
    return () => {
        // Optionnel : tu peux forcer un rafraîchissement ici pour mettre à jour le header
        // Mais en général, le Dashboard se rafraîchit tout seul lors du retour.
    };
  }, [jobId]);

  if (loading) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
            <Loader2 className="h-10 w-10 text-brand-orange animate-spin" />
        </div>
    );
  }

  if (!job) {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-8">
            <h1 className="text-2xl font-bold dark:text-white">Offre introuvable.</h1>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 dark:text-slate-100 font-sans text-slate-900 transition-colors">
      <DashboardHeader type="recruteur" />
      
      <div className="container mx-auto px-4 py-8">
        <Link to="/dashboard-recruiter" className="flex items-center text-slate-500 hover:text-brand-blue mb-6 dark:text-slate-400">
          <ArrowLeft className="mr-2 h-4 w-4" /> Retour au tableau de bord
        </Link>
        
        <h1 className="text-3xl font-bold text-brand-blue dark:text-white mb-2">{job.title}</h1>
        <p className="text-lg text-slate-500 dark:text-slate-400 mb-6">Gestion des candidatures | Ville : {job.location}</p>

        <Card className="dark:bg-slate-900 dark:border-slate-800">
            <CardHeader>
                <CardTitle className="dark:text-white">Liste des {candidates.length} candidats</CardTitle>
                <CardDescription className="dark:text-slate-400">Derniers candidats postulants pour cette offre.</CardDescription>
            </CardHeader>
            <CardContent>
                {candidates.length === 0 ? (
                    <div className="text-center py-8 text-slate-500 dark:text-slate-400">Aucun candidat pour l'instant.</div>
                ) : (
                    <div className="space-y-4">
                        {candidates.map(app => (
                            <div key={app.id} className="flex flex-col sm:flex-row sm:items-center justify-between border p-4 rounded-lg bg-white dark:bg-slate-950 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors gap-4">
                                <div className="flex flex-col gap-1 flex-1">
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-brand-blue dark:text-slate-200">
                                            {app.candidate?.full_name || "Candidat Anonyme"}
                                        </span>
                                        {/* Affiche le statut "Nouveau" si non lu */}
                                        {!app.read_by_recruiter && (
                                            <Badge className="bg-green-500 hover:bg-green-600">Nouveau</Badge>
                                        )}
                                    </div>
                                    <span className="text-sm text-slate-500 dark:text-slate-500">
                                        {app.candidate?.job_title || app.candidate?.bio || "Pas de titre de poste"}
                                    </span>
                                </div>
                                
                                <div className="flex items-center gap-4 min-w-[200px] justify-end">
                                    <Button variant="outline" size="sm" className="dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700 flex items-center gap-2">
                                        <Download className="h-4 w-4" /> {app.cv_path ? "Télécharger CV" : "CV manquant"}
                                    </Button>
                                    <Button size="sm" className="bg-brand-orange hover:bg-orange-600 text-white flex items-center gap-2">
                                        <Mail className="h-4 w-4" /> Contacter
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
      </div>
    </div>
  );
}