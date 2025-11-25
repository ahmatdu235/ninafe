import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, MapPin, Trash2, Heart, Briefcase, Moon, Sun, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function Favorites() {
  // Gestion du Dark Mode
  const [isDark, setIsDark] = useState(() => localStorage.getItem("theme") === "dark");
  useEffect(() => {
    if (isDark) { document.documentElement.classList.add("dark"); localStorage.setItem("theme", "dark"); }
    else { document.documentElement.classList.remove("dark"); localStorage.setItem("theme", "light"); }
  }, [isDark]);

  // Liste simulée des favoris
  const [favJobs, setFavJobs] = useState([
    {
      id: 1, title: "Développeur Web Full-Stack", company: "Tchad Numérique", location: "N'Djamena", type: "CDI", budget: "À négocier", tags: ["React", "Node.js"]
    },
    {
      id: 2, title: "Plombier pour chantier", company: "Particulier", location: "Moundou", type: "Prestation", budget: "50 000 FCFA", tags: ["BTP", "Urgent"]
    }
  ]);

  const removeFav = (id: number) => {
    setFavJobs(favJobs.filter(job => job.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 transition-colors">
      
      {/* HEADER SIMPLE */}
      <header className="sticky top-0 z-50 w-full border-b bg-white dark:bg-slate-950 dark:border-slate-800 shadow-sm transition-colors">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-brand-blue text-brand-orange font-bold text-xl">N</div>
            <span className="text-xl font-bold text-brand-blue dark:text-white">Ninafe</span>
          </Link>
          <div className="flex items-center gap-3">
             <Button variant="ghost" size="icon" onClick={() => setIsDark(!isDark)}>
                {isDark ? <Sun className="h-5 w-5 text-yellow-500" /> : <Moon className="h-5 w-5 text-slate-600" />}
            </Button>
            <Link to="/post-job"><Button className="hidden md:flex bg-brand-orange hover:bg-orange-600 text-white"><Briefcase className="mr-2 h-4 w-4" /> Publier</Button></Link>
            <Sheet>
              <SheetTrigger asChild><Button variant="ghost" size="icon" className="md:hidden dark:text-slate-200"><Menu className="h-6 w-6" /></Button></SheetTrigger>
              <SheetContent side="left" className="w-[300px] dark:bg-slate-950 dark:border-slate-800">
                  <div className="flex flex-col gap-4 mt-8"><Link to="/login"><Button variant="outline" className="w-full">Se connecter</Button></Link></div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Link to="/search" className="inline-flex items-center text-slate-500 hover:text-brand-blue dark:text-slate-400 mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" /> Retour à la recherche
        </Link>

        <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-full text-red-500">
                <Heart className="h-6 w-6 fill-current" />
            </div>
            <h1 className="text-3xl font-bold text-brand-blue dark:text-white">Mes Favoris</h1>
        </div>

        {favJobs.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-lg border dark:border-slate-800">
                <p className="text-slate-500 dark:text-slate-400">Vous n'avez aucune offre sauvegardée pour le moment.</p>
                <Link to="/search" className="text-brand-orange hover:underline mt-2 block">Parcourir les offres</Link>
            </div>
        ) : (
            <div className="space-y-4">
              {favJobs.map((job) => (
                <Card key={job.id} className="flex flex-col sm:flex-row items-center p-4 gap-4 hover:shadow-md transition-shadow dark:bg-slate-900 dark:border-slate-800">
                  <div className="h-12 w-12 shrink-0 rounded bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-lg font-bold text-slate-500 dark:text-slate-400">
                    {job.company.charAt(0)}
                  </div>
                  
                  <div className="flex-1 space-y-1 text-center sm:text-left">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between">
                      <h3 className="font-bold text-lg text-brand-blue dark:text-slate-200">{job.title}</h3>
                      <Badge variant="outline" className="dark:text-slate-300 dark:border-slate-700">{job.type}</Badge>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{job.company} • {job.location}</p>
                    <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-2">
                        {job.tags.map(tag => (<Badge key={tag} variant="secondary" className="text-xs font-normal dark:bg-slate-800 dark:text-slate-300">{tag}</Badge>))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Link to={`/job/${job.id}`}>
                        <Button className="dark:bg-slate-950 dark:text-white dark:border dark:border-slate-700">Voir</Button>
                    </Link>
                    <Button variant="ghost" size="icon" className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20" onClick={() => removeFav(job.id)} title="Retirer des favoris">
                        <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
        )}
      </div>
    </div>
  );
}