import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, MapPin, Building2, Banknote, Calendar, CheckCircle, Moon, Sun, Menu, Briefcase, Heart, Star, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ApplyDialog } from "@/components/ApplyDialog"; 
import { supabase } from "@/lib/supabase";

export default function JobDetails() {
  const { id } = useParams();
  const [isSaved, setIsSaved] = useState(false);
  const [isDark, setIsDark] = useState(() => localStorage.getItem("theme") === "dark");
  
  // --- DONNÉES DYNAMIQUES ---
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isDark) { document.documentElement.classList.add("dark"); localStorage.setItem("theme", "dark"); }
    else { document.documentElement.classList.remove("dark"); localStorage.setItem("theme", "light"); }

    async function fetchJob() {
        const { data, error } = await supabase
            .from('jobs')
            .select('*')
            .eq('id', id) // On cherche l'offre avec l'ID de l'URL
            .single();
        
        if (data) setJob(data);
        setLoading(false);
    }
    fetchJob();
  }, [id, isDark]);

  if (loading) return <div className="p-8 text-center">Chargement de l'offre...</div>;
  if (!job) return <div className="p-8 text-center">Offre introuvable.</div>;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 transition-colors">
      {/* HEADER (Simplifié) */}
      <header className="sticky top-0 z-50 w-full border-b bg-white dark:bg-slate-950 dark:border-slate-800 shadow-sm transition-colors">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-brand-blue text-brand-orange font-bold text-xl">N</div>
            <span className="text-xl font-bold tracking-tight text-brand-blue dark:text-white">Ninafe</span>
          </Link>
          <div className="flex items-center gap-3">
             <Button variant="ghost" size="icon" onClick={() => setIsDark(!isDark)}>{isDark ? <Sun className="h-5 w-5 text-yellow-500" /> : <Moon className="h-5 w-5 text-slate-600" />}</Button>
             <Link to="/login"><Button variant="ghost">Connexion</Button></Link>
          </div>
        </div>
      </header>

      <div className="py-8">
        <div className="container mx-auto px-4 mb-6">
            <Link to="/search" className="inline-flex items-center text-slate-500 hover:text-brand-blue dark:text-slate-400 dark:hover:text-brand-orange">
            <ArrowLeft className="mr-2 h-4 w-4" /> Retour aux offres
            </Link>
        </div>

        <div className="container mx-auto px-4 grid gap-6 md:grid-cols-3 max-w-6xl">
            <div className="md:col-span-2 space-y-6">
                <Card className="border-t-4 border-t-brand-orange shadow-sm dark:bg-slate-900 dark:border-slate-800">
                    <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row justify-between items-start mb-4 gap-4">
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold text-brand-blue dark:text-white mb-2">{job.title}</h1>
                                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 font-medium text-lg">
                                    <Building2 className="h-5 w-5 text-brand-orange" /> {job.company_name}
                                </div>
                            </div>
                            <Badge className="text-sm px-3 py-1 bg-brand-blue hover:bg-slate-700 dark:text-white">{job.type}</Badge>
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm text-slate-500 dark:text-slate-400 mb-6">
                            <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {job.location}</span>
                            <span className="flex items-center gap-1"><Banknote className="h-4 w-4" /> {job.salary}</span>
                            <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> {new Date(job.created_at).toLocaleDateString()}</span>
                        </div>
                        <Separator className="mb-6 dark:bg-slate-800" />
                        
                        {/* Description */}
                        <div>
                            <h3 className="font-semibold text-slate-900 dark:text-white mb-3 text-lg">Description</h3>
                            <div className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line text-base">{job.description}</div>
                        </div>
                    </CardContent>
                </Card>

                {/* Carte Entreprise */}
                <Card className="shadow-sm dark:bg-slate-900 dark:border-slate-800">
                    <CardContent className="p-6">
                        <h3 className="font-semibold text-lg text-slate-900 dark:text-white mb-3">À propos de {job.company_name}</h3>
                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{job.company_description || "Aucune description disponible."}</p>
                    </CardContent>
                </Card>
            </div>

            {/* Sidebar */}
            <div className="md:col-span-1">
                <Card className="sticky top-24 shadow-md border-brand-blue/10 dark:bg-slate-900 dark:border-slate-800">
                    <CardContent className="p-6 space-y-6">
                        <div>
                            <h3 className="font-bold text-lg text-center text-slate-800 dark:text-white mb-2">Ce poste vous intéresse ?</h3>
                            <p className="text-center text-sm text-slate-500 dark:text-slate-400">N'attendez plus, envoyez votre candidature dès maintenant.</p>
                        </div>
                        <div className="w-full flex justify-center">
                            <div className="w-full">
                               <ApplyDialog  jobTitle={job.title}  companyName={job.company_name}  jobId={job.id} />     
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
      </div>
    </div>
  );
}