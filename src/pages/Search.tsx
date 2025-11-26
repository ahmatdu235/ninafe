import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Search as SearchIcon, MapPin, Filter, Briefcase, Moon, Sun, Banknote, Star, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { AppHeader } from "@/components/AppHeader"; // NOUVEAU HEADER

// Types des props passées par App.tsx
interface SearchProps {
    isLoggedIn: boolean;
    userRole: string | null;
    isDark: boolean;
    setIsDark: (dark: boolean) => void;
}


// --- DONNÉES STATIQUES (à remplacer par la DB dans un futur proche) ---
const allJobs = [ /* Ajout d'une liste plus longue simulée pour le rendu */
  { id: 1, title: "Chauffeur Poids Lourd", company_name: "Logistique Tchad", location: "N'Djamena", type: "CDD", budget: "150 000 FCFA", tags: ["Permis C", "Transport"], date: "Il y a 2h", match: 95 },
  { id: 2, title: "Maçon qualifié", company_name: "Particulier", location: "Moundou", type: "Prestation", budget: "300 000 FCFA", tags: ["BTP", "Urgent"], date: "Il y a 5h", match: 45 },
  { id: 3, title: "Vendeuse en Pharmacie", company_name: "Pharmacie de la Paix", location: "N'Djamena", type: "CDI", budget: "200 000 FCFA", tags: ["Santé", "Vente"], date: "Il y a 1j", match: 80 },
  { id: 4, title: "Technicien Froid", company_name: "Froid Express", location: "Abéché", type: "Prestation", budget: "Par unité", tags: ["Technique"], date: "Il y a 2j", match: 60 },
  { id: 5, title: "Développeur React", company_name: "Tchad Tech", location: "N'Djamena", type: "CDI", budget: "500 000 FCFA", tags: ["React", "Remote"], date: "Il y a 1 semaine", match: 92 },
  { id: 6, title: "Assistant RH", company_name: "Cabinet Sahel", location: "Sarh", type: "CDD", budget: "180 000 FCFA", tags: ["Gestion", "Rigueur"], date: "Il y a 3 jours", match: 70 },
  { id: 7, title: "Plombier/Urgence", company_name: "Services Express", location: "Moundou", type: "Prestation", budget: "70 000 FCFA", tags: ["Plomberie", "Urgence"], date: "Il y a 1h", match: 85 },
];


export default function SearchPage(props: SearchProps) {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const initialLoc = searchParams.get("loc") || "";
  const [salaryRange, setSalaryRange] = useState([50000]); 
  
  // Note : La logique de pagination n'est pas nécessaire ici car on utilise des données statiques. 
  // En production, on ferait le fetch ici.
  const currentJobs = allJobs; 
  const totalResults = allJobs.length; 
  
  // Le dark mode est géré par les props (isDark, setIsDark)

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 transition-colors">
      
      {/* --- NOUVEAU HEADER DYNAMIQUE --- */}
      <AppHeader {...props} type="public" />

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* --- FILTRES AVANCÉS (GAUCHE) --- */}
          <aside className="w-full lg:w-72 shrink-0 space-y-6 bg-white dark:bg-slate-900 p-6 rounded-lg border dark:border-slate-800 h-fit">
            <div className="flex items-center justify-between font-semibold text-lg dark:text-white">
              <span className="flex items-center gap-2"><Filter className="h-5 w-5" /> Filtres</span>
              <Button variant="link" className="text-xs text-slate-500 h-auto p-0">Réinitialiser</Button>
            </div>
            
            {/* Recherche Mot clé (Pré-rempli par URL) */}
            <div className="space-y-2">
              <Label className="dark:text-slate-300">Mot-clé</Label>
              <div className="relative">
                <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                <Input className="pl-9 dark:bg-slate-950" placeholder="Ex: Peintre..." defaultValue={initialQuery} />
              </div>
            </div>

            <Separator className="dark:bg-slate-800" />

            {/* Salaire (Slider) */}
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <Label className="dark:text-slate-300">Salaire Min.</Label>
                    <span className="text-xs font-bold text-brand-orange">{salaryRange[0].toLocaleString()} FCFA</span>
                </div>
                <Slider defaultValue={[50]} max={100} step={1} className="py-2" />
            </div>

            <Separator className="dark:bg-slate-800" />

            {/* Expérience & Contrat (Reste du code statique) */}
            <div className="space-y-3">
              <Label className="dark:text-slate-300">Expérience</Label>
              <div className="space-y-2">
                {["Débutant (0-2 ans)", "Intermédiaire (2-5 ans)", "Expert (5+ ans)"].map((exp) => (
                    <div key={exp} className="flex items-center space-x-2">
                        <Checkbox id={exp} />
                        <Label htmlFor={exp} className="font-normal text-sm dark:text-slate-400">{exp}</Label>
                    </div>
                ))}
              </div>
            </div>
            
            <Button className="w-full bg-brand-blue text-white hover:bg-slate-700">Appliquer</Button>
          </aside>

          {/* --- RÉSULTATS (DROITE) --- */}
          <main className="flex-1">
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                {totalResults} offres trouvées
              </h1>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-500 dark:text-slate-400">Trier par :</span>
                <Select defaultValue="pertinence">
                    <SelectTrigger className="w-[180px] dark:bg-slate-900"><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="pertinence">Pertinence</SelectItem>
                        <SelectItem value="date">Plus récent</SelectItem>
                    </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              {currentJobs.map((job) => (
                <Card key={job.id} className="flex flex-col md:flex-row items-start p-4 gap-4 hover:border-brand-orange/50 transition-colors dark:bg-slate-900 dark:border-slate-800 relative overflow-hidden">
                  
                  {job.match > 80 && (
                      <div className="absolute top-0 right-0 bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg z-10 flex items-center gap-1">
                          <Star className="h-3 w-3 fill-current" /> {job.match}% Match
                      </div>
                  )}

                  <div className="h-14 w-14 shrink-0 rounded bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xl font-bold text-slate-500 dark:text-slate-400">
                    {job.company_name.charAt(0)}
                  </div>
                  
                  <div className="flex-1 space-y-1 w-full">
                    <div className="flex flex-col sm:flex-row sm:justify-between">
                      <h3 className="font-bold text-lg text-brand-blue dark:text-slate-200">{job.title}</h3>
                      <span className="text-xs text-slate-400">{job.date}</span>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{job.company_name} • {job.location}</p>
                    
                    <div className="flex items-center gap-4 text-sm mt-2 mb-3">
                        <Badge variant="outline" className="dark:text-slate-300">{job.type}</Badge>
                        <span className="font-semibold text-brand-orange flex items-center gap-1"><Banknote className="h-3 w-3" /> {job.budget}</span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {job.tags.map(tag => (
                            <Badge key={tag} variant="secondary" className="text-xs font-normal dark:bg-slate-800 dark:text-slate-300">
                                {tag}
                            </Badge>
                        ))}
                    </div>
                  </div>

                  <div className="w-full md:w-auto mt-2 md:mt-0 flex md:flex-col justify-end gap-2">
                    <Link to={`/job/${job.id}`}>
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