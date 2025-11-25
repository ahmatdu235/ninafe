import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom"; // Ajout de Link
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
import { DashboardHeader } from "@/components/DashboardHeader";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

// --- GÉNÉRATION DE DONNÉES SIMULÉES (24 annonces) ---
const generateJobs = () => {
  const jobs = [];
  const titles = ["Chauffeur", "Maçon", "Développeur", "Comptable", "Électricien", "Commercial", "Cuisinier", "Assistant"];
  const locations = ["N'Djamena", "Moundou", "Abéché", "Sarh", "Kélo"];
  
  for (let i = 1; i <= 24; i++) {
    jobs.push({
      id: i,
      title: `${titles[Math.floor(Math.random() * titles.length)]} ${i}`,
      company: `Entreprise ${String.fromCharCode(65 + i)}`, // Entreprise A, B, C...
      location: locations[Math.floor(Math.random() * locations.length)],
      type: i % 3 === 0 ? "Freelance" : i % 2 === 0 ? "CDD" : "CDI",
      budget: `${(Math.floor(Math.random() * 50) + 5) * 10000} FCFA`,
      tags: ["Urgent", "Qualifié"],
      date: `Il y a ${Math.floor(Math.random() * 10) + 1}h`,
      match: Math.floor(Math.random() * 40) + 60 // Score entre 60 et 100
    });
  }
  return jobs;
};

const allJobs = generateJobs();

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  
  // --- LOGIQUE DE PAGINATION ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // On affiche 6 annonces par page

  // Calcul des index
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentJobs = allJobs.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(allJobs.length / itemsPerPage);

  // Fonction pour changer de page
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Remonte en haut de la page
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 transition-colors">
      <DashboardHeader type="candidat" />

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* --- FILTRES (GAUCHE) --- */}
          <aside className="w-full lg:w-72 shrink-0 space-y-6 bg-white dark:bg-slate-900 p-6 rounded-lg border dark:border-slate-800 h-fit">
            <div className="flex items-center justify-between font-semibold text-lg dark:text-white">
              <span className="flex items-center gap-2"><Filter className="h-5 w-5" /> Filtres</span>
              <Button variant="link" className="text-xs text-slate-500 h-auto p-0">Réinitialiser</Button>
            </div>
            
            <div className="space-y-2">
              <Label>Mot-clé</Label>
              <div className="relative">
                <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                <Input className="pl-9 dark:bg-slate-950" placeholder="Ex: Peintre..." defaultValue={initialQuery} />
              </div>
            </div>
            <Separator />
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <Label>Salaire Min.</Label>
                    <span className="text-xs font-bold text-brand-orange">50 000 FCFA</span>
                </div>
                <Slider defaultValue={[50]} max={100} step={1} className="py-2" />
            </div>
            <Separator />
            <div className="space-y-3">
              <Label>Type de contrat</Label>
              <div className="space-y-2">
                {["CDI", "CDD", "Prestation"].map(t => (
                    <div key={t} className="flex items-center space-x-2">
                        <Checkbox id={t} /> <Label htmlFor={t} className="font-normal text-sm">{t}</Label>
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
                {allJobs.length} offres trouvées (Page {currentPage}/{totalPages})
              </h1>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-500">Trier par :</span>
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
                    {job.company.charAt(0)}
                  </div>
                  <div className="flex-1 space-y-1 w-full">
                    <div className="flex flex-col sm:flex-row sm:justify-between">
                      <h3 className="font-bold text-lg text-brand-blue dark:text-slate-200">{job.title}</h3>
                      <span className="text-xs text-slate-400">{job.date}</span>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{job.company} • {job.location}</p>
                    <div className="flex items-center gap-4 text-sm mt-2 mb-3">
                        <Badge variant="outline" className="dark:text-slate-300">{job.type}</Badge>
                        <span className="font-semibold text-brand-orange flex items-center gap-1"><Banknote className="h-3 w-3" /> {job.budget}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {job.tags.map(tag => (<Badge key={tag} variant="secondary" className="text-xs font-normal dark:bg-slate-800 dark:text-slate-300">{tag}</Badge>))}
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

            {/* --- PAGINATION --- */}
            <div className="mt-8">
                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious 
                                href="#" 
                                onClick={(e) => { e.preventDefault(); if(currentPage > 1) handlePageChange(currentPage - 1); }} 
                                className={currentPage === 1 ? "opacity-50 pointer-events-none" : "cursor-pointer"}
                            />
                        </PaginationItem>
                        
                        {/* Génération des numéros de page */}
                        {[...Array(totalPages)].map((_, i) => (
                            <PaginationItem key={i}>
                                <PaginationLink 
                                    href="#" 
                                    isActive={currentPage === i + 1}
                                    onClick={(e) => { e.preventDefault(); handlePageChange(i + 1); }}
                                    className="cursor-pointer"
                                >
                                    {i + 1}
                                </PaginationLink>
                            </PaginationItem>
                        ))}

                        <PaginationItem>
                            <PaginationNext 
                                href="#" 
                                onClick={(e) => { e.preventDefault(); if(currentPage < totalPages) handlePageChange(currentPage + 1); }}
                                className={currentPage === totalPages ? "opacity-50 pointer-events-none" : "cursor-pointer"}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>

          </main>
        </div>
      </div>
    </div>
  );
}