import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Search as SearchIcon, Filter, MapPin, Banknote, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import { DashboardHeader } from "@/components/DashboardHeader";
import { supabase } from "@/lib/supabase"; // Connexion

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Au chargement, on récupère TOUTES les offres
  useEffect(() => {
    async function fetchAllJobs() {
        setLoading(true);
        
        // On prépare la requête
        let query = supabase
            .from('jobs')
            .select('*')
            .order('created_at', { ascending: false });

        // Si on a un mot clé dans l'URL, on filtre (recherche simple)
        if (initialQuery) {
            query = query.ilike('title', `%${initialQuery}%`);
        }

        const { data, error } = await query;

        if (!error && data) {
            setJobs(data);
        }
        setLoading(false);
    }
    fetchAllJobs();
  }, [initialQuery]); // Se relance si la recherche change

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 transition-colors">
      <DashboardHeader type="candidat" />

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* --- FILTRES (GAUCHE) - Statique pour l'instant --- */}
          <aside className="w-full lg:w-72 shrink-0 space-y-6 bg-white dark:bg-slate-900 p-6 rounded-lg border dark:border-slate-800 h-fit">
            <div className="flex items-center justify-between font-semibold text-lg dark:text-white">
              <span className="flex items-center gap-2"><Filter className="h-5 w-5" /> Filtres</span>
            </div>
            <div className="space-y-2">
              <Label>Mot-clé</Label>
              <div className="relative">
                <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                <Input className="pl-9 dark:bg-slate-950" placeholder="Ex: Peintre..." defaultValue={initialQuery} />
              </div>
            </div>
            <Separator />
            <Button className="w-full bg-brand-blue text-white hover:bg-slate-700">Appliquer</Button>
          </aside>

          {/* --- RÉSULTATS (DROITE) --- */}
          <main className="flex-1">
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                {loading ? "Chargement..." : `${jobs.length} offres trouvées`}
              </h1>
            </div>

            <div className="space-y-4">
              {jobs.map((job) => (
                <Card key={job.id} className="flex flex-col md:flex-row items-start p-4 gap-4 hover:border-brand-orange/50 transition-colors dark:bg-slate-900 dark:border-slate-800 relative overflow-hidden">
                  {/* Petit badge aléatoire pour simuler le match */}
                  <div className="absolute top-0 right-0 bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg z-10 flex items-center gap-1">
                      <Star className="h-3 w-3 fill-current" /> 95% Match
                  </div>

                  <div className="h-14 w-14 shrink-0 rounded bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xl font-bold text-slate-500 dark:text-slate-400 uppercase">
                    {job.company_name?.charAt(0) || "N"}
                  </div>
                  <div className="flex-1 space-y-1 w-full">
                    <div className="flex flex-col sm:flex-row sm:justify-between">
                      <h3 className="font-bold text-lg text-brand-blue dark:text-slate-200">{job.title}</h3>
                      <span className="text-xs text-slate-400">Nouveau</span>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{job.company_name} • {job.location}</p>
                    <div className="flex items-center gap-4 text-sm mt-2 mb-3">
                        <Badge variant="outline" className="dark:text-slate-300">{job.type}</Badge>
                        <span className="font-semibold text-brand-orange flex items-center gap-1"><Banknote className="h-3 w-3" /> {job.salary}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {job.tags && job.tags.map((tag: string) => (<Badge key={tag} variant="secondary" className="text-xs font-normal dark:bg-slate-800 dark:text-slate-300">{tag}</Badge>))}
                    </div>
                  </div>
                  <div className="w-full md:w-auto mt-2 md:mt-0">
                    <Link to={`/job/${job.id}`} className="w-full">
                        <Button className="w-full dark:bg-slate-950 dark:text-white dark:border dark:border-slate-700">Voir</Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}