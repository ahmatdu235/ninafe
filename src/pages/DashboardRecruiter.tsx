import React, { useState, useEffect } from "react";
import { Plus, Users, Briefcase, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DashboardHeader } from "@/components/DashboardHeader";
import { supabase } from "@/lib/supabase";

export default function DashboardRecruiter() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [recruiterName, setRecruiterName] = useState("Entreprise");

  useEffect(() => {
    async function fetchData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // 1. Récupérer le nom du recruteur
      const { data: profile } = await supabase.from('profiles').select('full_name').eq('id', user.id).single();
      if (profile) setRecruiterName(profile.full_name);

      // 2. Récupérer les offres du recruteur AVEC le nombre de candidatures
      // On utilise .select('*, applications(count)') pour compter les lignes liées
      const { data: jobsData, error } = await supabase
        .from('jobs')
        .select('*, applications(count)')
        .eq('recruiter_id', user.id)
        .order('created_at', { ascending: false });

      if (!error && jobsData) {
        // On formate un peu les données pour faciliter l'affichage
        const formattedJobs = jobsData.map(job => ({
            ...job,
            // @ts-ignore (Supabase renvoie count dans un tableau parfois)
            candidatesCount: job.applications ? job.applications[0]?.count || 0 : 0
        }));
        setJobs(formattedJobs);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 dark:text-slate-100 font-sans text-slate-900 transition-colors">
      <DashboardHeader type="recruteur" />

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-brand-orange">
              <AvatarImage src={`https://ui-avatars.com/api/?name=${recruiterName}&background=f97316&color=fff`} />
              <AvatarFallback>ENT</AvatarFallback>
            </Avatar>
            <div>
                <h1 className="text-2xl font-bold text-brand-blue dark:text-white">{recruiterName}</h1>
                <p className="text-slate-500 dark:text-slate-400">Espace Recrutement</p>
            </div>
          </div>
          <Link to="/post-job">
            <Button className="bg-brand-orange hover:bg-orange-600 text-white">
                <Plus className="mr-2 h-4 w-4" /> Créer une annonce
            </Button>
          </Link>
        </div>

        {/* Liste des offres */}
        <Card className="dark:bg-slate-900 dark:border-slate-800">
            <CardHeader>
                <CardTitle className="dark:text-white">Mes annonces</CardTitle>
                <CardDescription className="dark:text-slate-400">Gérez vos recrutements en cours.</CardDescription>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="text-center py-8"><Loader2 className="h-8 w-8 animate-spin mx-auto text-brand-orange" /></div>
                ) : jobs.length === 0 ? (
                    <div className="text-center py-8 text-slate-500">Vous n'avez publié aucune annonce.</div>
                ) : (
                    <div className="space-y-4">
                        {jobs.map(job => (
                            <div key={job.id} className="flex flex-col sm:flex-row sm:items-center justify-between border p-4 rounded-lg bg-white dark:bg-slate-950 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors gap-4">
                                <div className="flex flex-col gap-1">
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-brand-blue dark:text-slate-200">{job.title}</span>
                                        <Badge variant="outline" className="dark:text-slate-300 dark:border-slate-700">{job.type}</Badge>
                                    </div>
                                    <span className="text-sm text-slate-500 dark:text-slate-500 flex items-center gap-1">
                                        <Briefcase className="h-3 w-3" /> {new Date(job.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-1 text-sm font-medium text-slate-700 dark:text-slate-300">
                                        <Users className="h-4 w-4 text-brand-orange" /> 
                                        {/* Astuce : Supabase renvoie parfois le count différemment, on gère le cas simple ici */}
                                        {job.applications[0]?.count ?? 0} candidats
                                    </div>
                                    <Link to={`/job-candidates/${job.id}`}>
                                        <Button variant="outline" size="sm" className="dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800">Gérer</Button>
                                    </Link>
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