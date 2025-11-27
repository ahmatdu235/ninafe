import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Search as SearchIcon, Filter, MapPin, Banknote, Star, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { AppHeader } from "@/components/AppHeader"; 
import { supabase } from "@/lib/supabase";

// --- INTERFACE DE PROPS COMPLETE ---
interface SearchProps {
    isLoggedIn: boolean;
    userRole: string | null;
    isDark: boolean;
    setIsDark: (dark: boolean) => void;
    setIsLoggedIn: (status: boolean) => void;
    setUserRole: (role: string | null) => void;
    unreadNotifications: number;
}

export default function SearchPage(props: SearchProps) { // <--- ACCEPTE LES PROPS
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [salaryRange, setSalaryRange] = useState([50000]);

  useEffect(() => {
    async function fetchAllJobs() {
        setLoading(true);
        
        let query = supabase
            .from('jobs')
            .select('*')
            .order('created_at', { ascending: false });

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
  }, [initialQuery]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 transition-colors">
      
      {/* FIX : Passe toutes les props au Header */}
      <AppHeader {...props} type="public" />

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* FILTRES (Statique pour l'instant) */}
          <aside className="w-full lg:w-72 shrink-0 space-y-6 bg-white dark:bg-slate-900 p-6 rounded-lg border dark:border-slate-800 h-fit">
            <div className="flex items-center justify-between font-semibold text-lg dark:text-white">
              <span className="flex items-center gap-2"><Filter className="h-5 w-5" /> Filtres</span>
              <Button variant="link" className="text-xs text-slate-500 h-auto p-0">Réinitialiser</Button>
            </div>
            
            <div className="space-y-2">
              <Label className="dark:text-slate-300">Mot-clé</Label>
              <div className="relative">
                <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                <Input className="pl-9 dark:bg-slate-950 dark:border-slate-700" placeholder="Ex: Peintre..." defaultValue={initialQuery} />
              </div>
            </div>

            <Separator className="dark:bg-slate-800" />

            {/* Salaire (Slider) */}
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <Label className="dark:text-slate-300">Salaire Min.</Label>
                    <span className="text-xs font-bold text-brand-orange">{salaryRange[0].toLocaleString()} FCFA</span>
                </div>
                <Slider defaultValue={[50000]} max={1000000} step={10000} onValueChange={setSalaryRange} className="py-2" />
            </div>

            <Separator className="dark:bg-slate-800" />
            
            <Button className="w-full bg-brand-blue text-white hover:bg-slate-700">Appliquer</Button>
          </aside>

          {/* RÉSULTATS */}
          <main className="flex-1">
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                {loading ? "Chargement..." : `${jobs.length} offres trouvées`}
              </h1>
            </div>

            <div className="space-y-4">
              {jobs.map((job) => (
                <Card key={job.id} className="flex flex-col md:flex-row items-start p-4 gap-4 hover:border-brand-orange/50 transition-colors dark:bg-slate-900 dark:border-slate-800 relative overflow-hidden">
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