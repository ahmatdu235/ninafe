import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, MapPin, Building2, Globe, Users, Briefcase, ExternalLink, Moon, Sun, Menu, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AppHeader } from "@/components/AppHeader"; // NOUVEAU

// Types des props passées par App.tsx
interface CompanyProfileProps {
    isLoggedIn: boolean;
    userRole: string | null;
    isDark: boolean;
    setIsDark: (dark: boolean) => void;
}

// Données simulées de l'entreprise
const company = {
    name: "Tchad Numérique",
    logo: "TN",
    location: "N'Djamena, Avenue Charles de Gaulle",
    website: "https://www.tchad-numerique.com",
    size: "50-100 employés",
    industry: "Technologie & Services",
    description: "Tchad Numérique est une société de services numériques leader au Tchad, spécialisée dans la transformation digitale des entreprises locales et internationales. Notre mission est d'accompagner les entreprises locales et l'administration dans leur modernisation.\n\nNous valorisons l'innovation, la formation continue et l'esprit d'équipe. Nos bureaux sont situés au cœur de N'Djamena et offrent un cadre de travail moderne.",
    activeJobs: [
      { id: 1, title: "Développeur Web Full-Stack", type: "CDI", location: "N'Djamena", posted: "Il y a 2 jours" },
      { id: 2, title: "Designer UI/UX", type: "Freelance", location: "Télétravail", posted: "Il y a 1 semaine" },
      { id: 3, title: "Chef de Projet Digital", type: "CDD", location: "N'Djamena", posted: "Il y a 3 jours" },
    ]
};

export default function CompanyProfile(props: CompanyProfileProps) { // Réception des props
    const { id } = useParams();
    
    // Le dark mode est maintenant géré via les props
    const isDark = props.isDark;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 transition-colors">
            
            {/* --- NOUVEAU HEADER DYNAMIQUE --- */}
            <AppHeader {...props} type="public" />

            <div className="container mx-auto px-4 py-8 max-w-5xl">
                <Link to="/search" className="inline-flex items-center text-slate-500 hover:text-brand-blue dark:text-slate-400 mb-6 dark:hover:text-brand-orange">
                    <ChevronLeft className="mr-2 h-4 w-4" /> Retour aux offres
                </Link>

                {/* EN-TÊTE ENTREPRISE */}
                <Card className="mb-8 border-t-4 border-t-brand-blue dark:bg-slate-900 dark:border-slate-800">
                    <CardContent className="p-6 md:p-8">
                        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                            <Avatar className="h-24 w-24 border-2 border-slate-100 dark:border-slate-700 text-2xl">
                                <AvatarImage src={`https://ui-avatars.com/api/?name=${company.name}&background=0f172a&color=fff`} />
                                <AvatarFallback>{company.logo}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 text-center md:text-left space-y-2">
                                <h1 className="text-3xl font-bold text-brand-blue dark:text-white">{company.name}</h1>
                                <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-slate-500 dark:text-slate-400">
                                    <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {company.location}</span>
                                    <span className="flex items-center gap-1"><Users className="h-4 w-4" /> {company.size}</span>
                                    <span className="flex items-center gap-1"><Building2 className="h-4 w-4" /> {company.industry}</span>
                                </div>
                            </div>
                            <a href={company.website} target="_blank" rel="noopener noreferrer">
                                <Button variant="outline" className="dark:bg-slate-800 dark:text-white dark:border-slate-700">
                                    <Globe className="mr-2 h-4 w-4" /> Visiter le site web
                                </Button>
                            </a>
                        </div>
                    </CardContent>
                </Card>

                {/* CONTENU (ONGLETS) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2">
                        <Tabs defaultValue="about" className="w-full">
                            <TabsList className="grid w-full grid-cols-2 dark:bg-slate-900">
                                <TabsTrigger value="about">À propos</TabsTrigger>
                                <TabsTrigger value="jobs">Offres d'emploi ({company.activeJobs.length})</TabsTrigger>
                            </TabsList>
                            
                            <TabsContent value="about" className="mt-6">
                                <Card className="dark:bg-slate-900 dark:border-slate-800">
                                    <CardHeader>
                                        <CardTitle className="dark:text-white">Qui sommes-nous ?</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                                            {company.description}
                                        </p>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="jobs" className="mt-6">
                                <div className="space-y-4">
                                    {company.activeJobs.map(job => (
                                        <Card key={job.id} className="hover:shadow-md transition-shadow dark:bg-slate-900 dark:border-slate-800">
                                            <CardContent className="p-4 flex items-center justify-between">
                                                <div>
                                                    <h3 className="font-bold text-brand-blue dark:text-slate-200">{job.title}</h3>
                                                    <div className="flex gap-2 text-sm text-slate-500 dark:text-slate-400 mt-1">
                                                        <span>{job.location}</span> • <span>{job.posted}</span>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-end gap-2">
                                                    <Badge variant="outline" className="dark:text-slate-300">{job.type}</Badge>
                                                    <Link to={`/job/${job.id}`}>
                                                        <Button size="sm" variant="link" className="text-brand-orange p-0 h-auto">Voir l'offre</Button>
                                                    </Link>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>

                    {/* BARRE LATÉRALE */}
                    <div className="space-y-6">
                        <Card className="dark:bg-slate-900 dark:border-slate-800">
                            <CardHeader>
                                <CardTitle className="text-lg dark:text-white">Contact</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 text-sm text-slate-600 dark:text-slate-400">
                                <p className="font-semibold block text-slate-900 dark:text-slate-200">Email RH :</p>
                                <p className="font-semibold block text-slate-900 dark:text-slate-200">Téléphone :</p>
                                <Separator className="dark:bg-slate-800" />
                                <div className="pt-2">
                                     <Button className="w-full bg-brand-blue text-white hover:bg-slate-800">Envoyer un message</Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}