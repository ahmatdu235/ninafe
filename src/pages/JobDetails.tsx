import { Progress } from "@/components/ui/progress";
import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, MapPin, Building2, Banknote, Calendar, CheckCircle, Moon, Sun, Menu, Briefcase, LogIn, ExternalLink, Heart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ApplyDialog } from "@/components/ApplyDialog"; 

export default function JobDetails() {
  const { id } = useParams();
  // État pour savoir si l'offre est en favori
  const [isSaved, setIsSaved] = useState(false);

  // Gestion du Dark Mode
  const [isDark, setIsDark] = useState(() => localStorage.getItem("theme") === "dark");
  useEffect(() => {
    if (isDark) { document.documentElement.classList.add("dark"); localStorage.setItem("theme", "dark"); }
    else { document.documentElement.classList.remove("dark"); localStorage.setItem("theme", "light"); }
  }, [isDark]);

  const job = {
    title: "Développeur Web Full-Stack",
    company: "Tchad Numérique",
    companyDescription: "Tchad Numérique est une agence leader dans la transformation digitale à N'Djamena.",
    location: "N'Djamena (Centre)",
    type: "CDI",
    salary: "À négocier (selon profil)",
    posted: "Il y a 2 jours",
    description: "Nous recherchons un développeur passionné...",
    tags: ["React", "TypeScript", "Node.js", "Git", "Travail d'équipe"],
    match: 95 // Score de compatibilité simulé
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 transition-colors">
      
      {/* HEADER */}
      <header className="sticky top-0 z-50 w-full border-b bg-white dark:bg-slate-950 dark:border-slate-800 shadow-sm transition-colors">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-brand-blue text-brand-orange font-bold text-xl">N</div>
            <span className="text-xl font-bold tracking-tight text-brand-blue dark:text-white">Ninafe</span>
          </Link>
          <div className="flex items-center gap-3">
             <Button variant="ghost" size="icon" onClick={() => setIsDark(!isDark)}>
                {isDark ? <Sun className="h-5 w-5 text-yellow-500" /> : <Moon className="h-5 w-5 text-slate-600" />}
            </Button>
            <Link to="/favorites">
                <Button variant="ghost" size="icon" title="Mes Favoris">
                    <Heart className="h-5 w-5 text-slate-600 dark:text-slate-300" />
                </Button>
            </Link>
            <Link to="/login"><Button variant="ghost" className="hidden md:flex text-slate-600 dark:text-slate-300 dark:hover:text-white">Se connecter</Button></Link>
            <Link to="/post-job"><Button className="hidden md:flex bg-brand-orange hover:bg-orange-600 text-white"><Briefcase className="mr-2 h-4 w-4" /> Publier</Button></Link>
             <Sheet>
              <SheetTrigger asChild><Button variant="ghost" size="icon" className="md:hidden dark:text-slate-200"><Menu className="h-6 w-6" /></Button></SheetTrigger>
              <SheetContent side="left" className="w-[300px] dark:bg-slate-950 dark:border-slate-800">
                  <div className="flex flex-col gap-4 mt-8">
                    <Link to="/favorites"><Button variant="ghost" className="w-full justify-start"><Heart className="mr-2 h-4 w-4" /> Mes Favoris</Button></Link>
                    <Link to="/login"><Button variant="outline" className="w-full">Se connecter</Button></Link>
                  </div>
              </SheetContent>
            </Sheet>
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
                                <Link to="/company/1" className="flex items-center gap-2 text-slate-600 dark:text-slate-300 font-medium text-lg hover:text-brand-orange hover:underline transition-colors">
                                    <Building2 className="h-5 w-5 text-brand-orange" /> {job.company}
                                    <ExternalLink className="h-4 w-4 opacity-50" />
                                </Link>
                            </div>
                            <Badge className="text-sm px-3 py-1 bg-brand-blue hover:bg-slate-700 dark:text-white">{job.type}</Badge>
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm text-slate-500 dark:text-slate-400 mb-6">
                            <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {job.location}</span>
                            <span className="flex items-center gap-1"><Banknote className="h-4 w-4" /> {job.salary}</span>
                            <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> {job.posted}</span>
                        </div>
                        
                        <Separator className="mb-6 dark:bg-slate-800" />
                        
                        <div className="mb-8">
                            <h3 className="font-semibold text-slate-900 dark:text-white mb-3 text-lg">Compétences</h3>
                            <div className="flex flex-wrap gap-2">
                                {job.tags.map(tag => (
                                    <Badge key={tag} variant="secondary" className="px-3 py-1 bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200 dark:bg-slate-950 dark:border-slate-700 dark:text-slate-300">{tag}</Badge>
                                ))}
                            </div>
                        </div>

                        {/* --- SCORE DE COMPATIBILITÉ (AJOUTÉ ICI) --- */}
                        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-4 rounded-lg mb-8">
                            <div className="flex justify-between items-end mb-2">
                                <div>
                                    <h3 className="font-bold text-green-800 dark:text-green-400 flex items-center gap-2">
                                        <Star className="h-5 w-5 fill-current" /> Excellent Match !
                                    </h3>
                                    <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                                        Vos compétences correspondent parfaitement à ce poste.
                                    </p>
                                </div>
                                <span className="text-2xl font-bold text-green-700 dark:text-green-400">{job.match}%</span>
                            </div>
                            {/* La barre de progression */}
                            <Progress value={job.match} className="h-3 bg-green-200 dark:bg-green-900" />
                        </div>

                        <div>
                            <h3 className="font-semibold text-slate-900 dark:text-white mb-3 text-lg">Description</h3>
                            <div className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line text-base">{job.description}</div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* COLONNE DROITE */}
            <div className="md:col-span-1">
                <Card className="sticky top-24 shadow-md border-brand-blue/10 dark:bg-slate-900 dark:border-slate-800">
                    <CardContent className="p-6 space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="font-bold text-lg text-slate-800 dark:text-white">Ce poste vous plaît ?</h3>
                            <Button 
                                variant="outline" 
                                size="icon" 
                                className={`rounded-full transition-colors ${isSaved ? 'bg-red-50 border-red-200 text-red-500 dark:bg-red-900/20 dark:border-red-900' : 'dark:bg-slate-950'}`}
                                onClick={() => setIsSaved(!isSaved)}
                            >
                                <Heart className={`h-5 w-5 ${isSaved ? 'fill-current' : ''}`} />
                            </Button>
                        </div>
                        
                        <div className="w-full flex justify-center">
                            <div className="w-full">
                                <ApplyDialog jobTitle={job.title} companyName={job.company} />
                            </div>
                        </div>

                        <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-lg text-xs text-slate-500 dark:text-slate-400 space-y-3 border border-slate-100 dark:border-slate-800">
                            <div className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-600" /> Profil Vérifié recommandé</div>
                            <div className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-600" /> Réponse moyenne sous 48h</div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
      </div>
    </div>
  );
}