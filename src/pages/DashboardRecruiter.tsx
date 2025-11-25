import React from "react";
import { Plus, Users, Briefcase } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DashboardHeader } from "@/components/DashboardHeader"; // <--- Import du nouveau header

// Simulation des offres publiées par cette entreprise
const myJobs = [
  { id: 1, title: "Chauffeur Poids Lourd", type: "CDD", candidates: 12, status: "Actif" },
  { id: 2, title: "Secrétaire comptable", type: "CDI", candidates: 5, status: "Actif" },
  { id: 3, title: "Manœuvre chantier", type: "Prestation", candidates: 0, status: "Brouillon" },
];

export default function DashboardRecruiter() {
  return (
    // Ajout des classes dark:... pour gérer le fond noir
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 dark:text-slate-100 font-sans text-slate-900 transition-colors">
      
      {/* On utilise le nouveau Header intelligent */}
      <DashboardHeader type="recruteur" />

      <div className="container mx-auto px-4 py-8">
        {/* En-tête Dashboard */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-brand-orange">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>ENT</AvatarFallback>
            </Avatar>
            <div>
                <h1 className="text-2xl font-bold text-brand-blue dark:text-white">Logistique Tchad</h1>
                <p className="text-slate-500 dark:text-slate-400">Gérez vos offres et vos recrutements</p>
            </div>
          </div>
          <Link to="/post-job">
            <Button className="bg-brand-orange hover:bg-orange-600 text-white">
                <Plus className="mr-2 h-4 w-4" /> Créer une annonce
            </Button>
          </Link>
        </div>

        {/* Statistiques rapides */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card className="dark:bg-slate-900 dark:border-slate-800">
                <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">Offres actives</CardTitle></CardHeader>
                <CardContent><div className="text-2xl font-bold dark:text-white">2</div></CardContent>
            </Card>
            <Card className="dark:bg-slate-900 dark:border-slate-800">
                <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">Candidatures reçues</CardTitle></CardHeader>
                <CardContent><div className="text-2xl font-bold text-brand-orange">17</div></CardContent>
            </Card>
            <Card className="dark:bg-slate-900 dark:border-slate-800">
                <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">Vue du profil</CardTitle></CardHeader>
                <CardContent><div className="text-2xl font-bold dark:text-white">140</div></CardContent>
            </Card>
        </div>

        {/* Liste des offres */}
        <Card className="dark:bg-slate-900 dark:border-slate-800">
            <CardHeader>
                <CardTitle className="dark:text-white">Mes dernières annonces</CardTitle>
                <CardDescription className="dark:text-slate-400">Suivez l'état de vos recrutements.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {myJobs.map(job => (
                        <div key={job.id} className="flex items-center justify-between border p-4 rounded-lg bg-white dark:bg-slate-950 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                            <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-brand-blue dark:text-slate-200">{job.title}</span>
                                    <Badge variant="outline" className="dark:text-slate-300 dark:border-slate-700">{job.type}</Badge>
                                </div>
                                <span className="text-sm text-slate-500 dark:text-slate-500 flex items-center gap-1">
                                    <Briefcase className="h-3 w-3" /> {job.status}
                                </span>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1 text-sm font-medium text-slate-700 dark:text-slate-300">
                                    <Users className="h-4 w-4 text-brand-orange" /> {job.candidates} candidats
                                </div>
                                {/* Lien vers la gestion des candidats */}
                                <Link to={`/job-candidates/${job.id}`}>
                                    <Button variant="outline" size="sm" className="dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800">Gérer</Button>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}