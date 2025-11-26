import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    LayoutDashboard, Briefcase, Users, MessageSquare, Settings, LogOut,
    Eye, Trash2, Edit2, ChevronDown, CheckCircle, XCircle, Clock, Send, Plus
} from "lucide-react";
import { AppHeader } from "@/components/AppHeader";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

// Types des props passées par App.tsx
interface DashboardProps {
    isLoggedIn: boolean;
    userRole: string | null;
    isDark: boolean;
    setIsDark: (dark: boolean) => void;
    // Ajout d'une fonction de déconnexion simulée
    setIsLoggedIn: (status: boolean) => void; 
    setUserRole: (role: string | null) => void;
}

// Données simulées pour le tableau de bord
const mockStats = [
    { title: "Offres Actives", value: 3, icon: Briefcase, color: "text-brand-blue" },
    { title: "Candidatures Totales", value: 45, icon: Users, color: "text-brand-orange" },
    { title: "Nouveaux Appliquants (7j)", value: 12, icon: CheckCircle, color: "text-green-500" },
    { title: "Messages Non Lus", value: 2, icon: MessageSquare, color: "text-red-500" },
];

const mockJobs = [
    {
        id: 1,
        title: "Développeur Web Full-Stack",
        applicants: 25,
        newApplicants: 5,
        status: "Actif",
        date: "25/11/2025"
    },
    {
        id: 2,
        title: "Plombier Qualifié N'Djamena",
        applicants: 15,
        newApplicants: 2,
        status: "Actif",
        date: "20/11/2025"
    },
    {
        id: 3,
        title: "Assistant Administratif (CDD)",
        applicants: 5,
        newApplicants: 0,
        status: "Fermé",
        date: "10/11/2025"
    },
];

const mockApplicants = [
    { id: 101, name: "Fatima Zara", job: "Développeur Web Full-Stack", status: "Nouveau", date: "26/11/2025 à 09:30" },
    { id: 102, name: "Mahamat Ali", job: "Plombier Qualifié N'Djamena", status: "Nouveau", date: "26/11/2025 à 08:15" },
    { id: 103, name: "Sophie Daba", job: "Développeur Web Full-Stack", status: "Examiné", date: "25/11/2025" },
];

// --- Composant principal du Tableau de Bord Recruteur ---
export default function RecruiterDashboard(props: DashboardProps) {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Simuler la déconnexion
        props.setIsLoggedIn(false);
        props.setUserRole(null);
        navigate("/"); // Rediriger vers la page d'accueil
    };

    // Style pour les liens de navigation latérale
    const navItemClass = (isActive: boolean) => 
        `flex items-center gap-3 rounded-lg px-3 py-2 text-slate-900 transition-all hover:bg-slate-100 dark:text-slate-100 dark:hover:bg-slate-800 ${
            isActive ? 'bg-slate-100 dark:bg-slate-800 font-semibold' : ''
        }`;

    // Le tableau de bord recruteur est toujours en `isLoggedIn` = true
    if (!props.isLoggedIn || props.userRole !== 'recruteur') {
        // Redirection simple si l'état est incorrect
        navigate("/login");
        return null;
    }
    
    // Le tableau de bord utilise toujours la vue "dashboard" du header
    const headerProps = { ...props, type: "dashboard" as const };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100">
            
            <AppHeader {...headerProps} />

            <div className="flex">
                {/* --- BARRE LATÉRALE DE NAVIGATION (SIDEBAR) --- */}
                <aside className="hidden md:block w-64 border-r dark:border-slate-800 bg-white dark:bg-slate-900 h-[calc(100vh-64px)] sticky top-16 pt-4">
                    <nav className="flex flex-col gap-1 px-4">
                        <Link to="#" className={navItemClass(true)}>
                            <LayoutDashboard className="h-5 w-5" /> Aperçu
                        </Link>
                        <Link to="#" className={navItemClass(false)}>
                            <Briefcase className="h-5 w-5" /> Mes Offres
                        </Link>
                        <Link to="#" className={navItemClass(false)}>
                            <Users className="h-5 w-5" /> Candidatures
                        </Link>
                        <Link to="#" className={navItemClass(false)}>
                            <MessageSquare className="h-5 w-5" /> Messages
                        </Link>
                    </nav>

                    <Separator className="my-4 dark:bg-slate-800" />
                    
                    <nav className="flex flex-col gap-1 px-4">
                        <Link to="#" className={navItemClass(false)}>
                            <Settings className="h-5 w-5" /> Paramètres
                        </Link>
                        <button onClick={handleLogout} className={`${navItemClass(false)} w-full text-left text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20`}>
                            <LogOut className="h-5 w-5" /> Déconnexion
                        </button>
                    </nav>
                </aside>

                {/* --- CONTENU PRINCIPAL DU DASHBOARD --- */}
                <main className="flex-1 p-4 md:p-8">
                    <div className="max-w-7xl mx-auto">
                        <h1 className="text-3xl font-bold mb-6 dark:text-white">Tableau de Bord Recruteur</h1>

                        <Tabs defaultValue="overview" className="w-full">
                            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                                <TabsList className="dark:bg-slate-900 mb-4 md:mb-0">
                                    <TabsTrigger value="overview">Aperçu</TabsTrigger>
                                    <TabsTrigger value="jobs">Mes Offres</TabsTrigger>
                                    <TabsTrigger value="applicants">Candidatures Récentes</TabsTrigger>
                                </TabsList>
                                <Button className="bg-brand-orange hover:bg-orange-600 text-white flex items-center gap-2">
                                    <Plus className="h-4 w-4" /> Publier une Offre
                                </Button>
                            </div>

                            {/* --- ONGLET APERÇU --- */}
                            <TabsContent value="overview">
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                                    {mockStats.map((stat) => (
                                        <Card key={stat.title} className="dark:bg-slate-900 dark:border-slate-800">
                                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                                <CardTitle className="text-sm font-medium dark:text-slate-300">{stat.title}</CardTitle>
                                                <stat.icon className={`h-4 w-4 ${stat.color}`} />
                                            </CardHeader>
                                            <CardContent>
                                                <div className="text-2xl font-bold dark:text-white">{stat.value}</div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                                
                                <Card className="dark:bg-slate-900 dark:border-slate-800">
                                    <CardHeader><CardTitle className="text-xl dark:text-white">Activité Récente des Candidatures</CardTitle></CardHeader>
                                    <CardContent>
                                        {/* Liste des candidats récents ici */}
                                        <div className="space-y-3">
                                            {mockApplicants.map(app => (
                                                <div key={app.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                                    <div className="flex items-center gap-3">
                                                        <Avatar className="h-8 w-8"><AvatarFallback>{app.name.charAt(0)}</AvatarFallback></Avatar>
                                                        <div>
                                                            <p className="font-semibold text-sm dark:text-white">{app.name}</p>
                                                            <p className="text-xs text-slate-500 dark:text-slate-400">Pour : {app.job}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        <Badge variant="default" className="bg-green-500 hover:bg-green-600">Nouveau</Badge>
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild><Button variant="ghost" size="sm">Actions <ChevronDown className="ml-1 h-4 w-4" /></Button></DropdownMenuTrigger>
                                                            <DropdownMenuContent className="dark:bg-slate-900 dark:border-slate-800">
                                                                <DropdownMenuItem className="dark:hover:bg-slate-800">Voir Profil</DropdownMenuItem>
                                                                <DropdownMenuItem className="dark:hover:bg-slate-800 text-green-600">Accepter</DropdownMenuItem>
                                                                <DropdownMenuItem className="dark:hover:bg-slate-800 text-red-600">Rejeter</DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* --- ONGLET MES OFFRES --- */}
                            <TabsContent value="jobs">
                                <Card className="dark:bg-slate-900 dark:border-slate-800">
                                    <CardHeader><CardTitle className="text-xl dark:text-white">Gestion des Offres d'Emploi</CardTitle></CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            {mockJobs.map(job => (
                                                <Card key={job.id} className="dark:bg-slate-950 dark:border-slate-800 p-4">
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <h3 className="font-bold text-brand-blue dark:text-slate-200">{job.title}</h3>
                                                            <p className="text-sm text-slate-500 dark:text-slate-400">Publié le {job.date}</p>
                                                            <p className="text-xs mt-1">
                                                                <Badge variant="secondary" className="mr-2 dark:bg-slate-800 dark:text-slate-300">{job.applicants} Candidatures</Badge>
                                                                {job.newApplicants > 0 && <Badge className="bg-brand-orange hover:bg-brand-orange">{job.newApplicants} Nouveaux</Badge>}
                                                            </p>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Button variant="outline" size="icon"><Eye className="h-4 w-4" /></Button>
                                                            <Button variant="outline" size="icon"><Edit2 className="h-4 w-4" /></Button>
                                                            <Button variant="destructive" size="icon"><Trash2 className="h-4 w-4" /></Button>
                                                        </div>
                                                    </div>
                                                </Card>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                            
                            {/* --- ONGLET CANDIDATURES RÉCENTES (Pour le détail) --- */}
                            <TabsContent value="applicants">
                                <Card className="dark:bg-slate-900 dark:border-slate-800">
                                    <CardHeader><CardTitle className="text-xl dark:text-white">Toutes les Candidatures</CardTitle></CardHeader>
                                    <CardContent>
                                        {/* Affichage détaillé des candidats (similaire à la liste overview, mais plus complet) */}
                                        <div className="space-y-3">
                                            {mockApplicants.map(app => (
                                                <div key={app.id} className="flex flex-wrap items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                                    <div className="flex items-center gap-3">
                                                        <Avatar className="h-10 w-10"><AvatarFallback className="bg-brand-blue/20 text-brand-blue">{app.name.charAt(0)}</AvatarFallback></Avatar>
                                                        <div>
                                                            <p className="font-bold dark:text-white">{app.name}</p>
                                                            <p className="text-sm text-slate-500 dark:text-slate-400">{app.job}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-4 text-sm">
                                                        <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1"><Clock className="h-3 w-3" /> {app.date}</span>
                                                        <Badge 
                                                            variant={app.status === 'Nouveau' ? 'default' : 'outline'} 
                                                            className={app.status === 'Nouveau' ? 'bg-green-500 hover:bg-green-600' : 'dark:text-slate-300 dark:border-slate-700'}
                                                        >
                                                            {app.status}
                                                        </Badge>
                                                        <Button variant="outline" size="sm" className="dark:bg-slate-950 dark:border-slate-700 dark:hover:bg-slate-800">Voir Profil</Button>
                                                        <Button size="sm" className="bg-brand-blue hover:bg-slate-700">Contacter</Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                        </Tabs>
                    </div>
                </main>
            </div>
        </div>
    );
}