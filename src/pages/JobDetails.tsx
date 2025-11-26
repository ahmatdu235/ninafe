import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { MapPin, Briefcase, Clock, DollarSign, ChevronLeft, Heart, Share2, Phone, Mail, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ApplyDialog } from "@/components/ApplyDialog";
import { AppHeader } from "@/components/AppHeader"; // NOUVEAU

// Types des props passées par App.tsx
interface JobDetailsProps {
    isLoggedIn: boolean;
    userRole: string | null;
    isDark: boolean;
    setIsDark: (dark: boolean) => void;
}

// Données statiques pour la simulation
const mockJob = {
    id: 1,
    title: "Développeur Web Full-Stack (Senior)",
    company: "Tchad Numérique",
    companyId: 101,
    location: "N'Djamena (Centre)",
    type: "CDI",
    budget: "700 000 - 900 000 FCFA/mois",
    posted: "Publié il y a 3 jours",
    description: "Nous recherchons un développeur Full-Stack passionné et expérimenté pour rejoindre notre équipe agile. Vous travaillerez sur des projets innovants allant de la refonte de sites à la création d'applications mobiles. Une excellente maîtrise de React, Node.js et de Supabase est essentielle. Le candidat idéal est autonome et capable de mener un projet de A à Z.",
    requirements: [
        "5+ années d'expérience en développement Full-Stack.",
        "Maîtrise de JavaScript/TypeScript, React, et Node.js.",
        "Expérience avec les bases de données SQL (PostgreSQL/Supabase).",
        "Capacité à travailler en équipe et à gérer les délais.",
        "Bac +5 en Informatique ou équivalent."
    ],
    benefits: [
        "Assurance santé premium.",
        "Jours de télétravail flexibles.",
        "Budget formation annuel.",
        "Un environnement de travail stimulant."
    ],
    tags: ["React", "Node.js", "TypeScript", "Supabase", "API REST", "Agile"],
    contactInfo: {
        phone: "+235 66 12 34 56",
        email: "rh@tchadnumerique.com",
        website: "https://tchadnumerique.com"
    }
};

const mockCompany = {
    name: "Tchad Numérique",
    description: "Tchad Numérique est une société de services numériques leader au Tchad, spécialisée dans la transformation digitale des entreprises locales et internationales. Notre mission est d'apporter des solutions technologiques adaptées au contexte africain.",
    jobsCount: 5,
    sector: "IT & Services",
    location: "N'Djamena",
    logoFallback: "TN"
}

export default function JobDetails(props: JobDetailsProps) { // Réception des props
    const { id } = useParams();
    const [isFavorite, setIsFavorite] = useState(false);

    // En réalité, on ferait un fetch ici avec 'id'
    const job = mockJob;
    const company = mockCompany;

    if (!job) {
        return <div className="p-8 text-center dark:text-white">Offre non trouvée.</div>;
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100">
            
            {/* --- NOUVEAU HEADER DYNAMIQUE --- */}
            <AppHeader {...props} type="public" />

            <div className="container mx-auto px-4 py-8 md:py-12">
                <Link to="/search" className="inline-flex items-center text-brand-blue hover:text-brand-orange mb-6 text-sm dark:text-slate-300 dark:hover:text-brand-orange">
                    <ChevronLeft className="h-4 w-4 mr-1" /> Retour aux résultats
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Colonne Principale: Détails de l'Offre */}
                    <div className="lg:col-span-2 space-y-8">
                        <Card className="dark:bg-slate-900 dark:border-slate-800">
                            <CardHeader className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h1 className="text-3xl font-extrabold text-brand-blue dark:text-white">{job.title}</h1>
                                    <Button variant="ghost" size="icon" onClick={() => setIsFavorite(!isFavorite)} className={`hover:bg-red-50 dark:hover:bg-red-900/20 ${isFavorite ? 'text-red-500' : 'text-slate-400'}`}>
                                        <Heart className={`h-6 w-6 ${isFavorite ? 'fill-red-500' : ''}`} />
                                    </Button>
                                </div>
                                <div className="flex flex-wrap items-center gap-4 text-slate-600 dark:text-slate-400 text-sm">
                                    <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {job.location}</span>
                                    <span className="flex items-center gap-1"><Briefcase className="h-4 w-4" /> {job.type}</span>
                                    <span className="flex items-center gap-1 font-semibold text-brand-orange"><DollarSign className="h-4 w-4" /> {job.budget}</span>
                                    <span className="text-xs ml-auto">{job.posted}</span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {job.tags.map(tag => <Badge key={tag} variant="secondary" className="dark:bg-slate-800 dark:text-slate-300">{tag}</Badge>)}
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <Separator className="dark:bg-slate-800" />
                                
                                <h2 className="text-xl font-bold dark:text-white">Description du poste</h2>
                                <p className="text-slate-700 dark:text-slate-300 whitespace-pre-line">{job.description}</p>

                                <h2 className="text-xl font-bold dark:text-white">Compétences requises</h2>
                                <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
                                    {job.requirements.map((req, index) => <li key={index}>{req}</li>)}
                                </ul>

                                <h2 className="text-xl font-bold dark:text-white">Avantages</h2>
                                <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
                                    {job.benefits.map((ben, index) => <li key={index}>{ben}</li>)}
                                </ul>

                                <div className="pt-4 flex flex-col sm:flex-row gap-4">
                                    <ApplyDialog jobTitle={job.title} companyName={job.company} />
                                    <Button variant="outline" className="flex items-center gap-2 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">
                                        <Share2 className="h-4 w-4" /> Partager
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Colonne Latérale: Infos Entreprise */}
                    <div className="lg:col-span-1 space-y-8">
                        <Card className="dark:bg-slate-900 dark:border-slate-800">
                            <CardHeader>
                                <div className="flex items-center gap-4 mb-3">
                                    <div className="h-12 w-12 rounded-lg bg-brand-blue/10 dark:bg-brand-blue/20 text-brand-blue dark:text-brand-orange flex items-center justify-center text-xl font-bold">{company.logoFallback}</div>
                                    <CardTitle className="text-xl font-bold text-brand-blue dark:text-white">{company.name}</CardTitle>
                                </div>
                                <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3">{company.description}</p>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Link to={`/company/${company.companyId}`} className="text-brand-orange font-medium hover:underline text-sm">
                                    Voir le profil complet ({company.jobsCount} offres) &rarr;
                                </Link>
                                <Separator className="dark:bg-slate-800" />
                                <div className="space-y-2">
                                    <p className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300"><Briefcase className="h-4 w-4 text-slate-500" /> {company.sector}</p>
                                    <p className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300"><MapPin className="h-4 w-4 text-slate-500" /> {company.location}</p>
                                </div>
                                
                                <Separator className="dark:bg-slate-800" />

                                <div className="space-y-3">
                                    <h3 className="font-semibold dark:text-white">Contacter l'entreprise</h3>
                                    <p className="text-sm text-slate-700 dark:text-slate-300 flex items-center gap-2"><Phone className="h-4 w-4 text-slate-500" /> {job.contactInfo.phone}</p>
                                    <p className="text-sm text-slate-700 dark:text-slate-300 flex items-center gap-2"><Mail className="h-4 w-4 text-slate-500" /> {job.contactInfo.email}</p>
                                    <p className="text-sm text-slate-700 dark:text-slate-300 flex items-center gap-2"><Globe className="h-4 w-4 text-slate-500" /> <a href={job.contactInfo.website} target="_blank" rel="noopener noreferrer" className="hover:underline">{job.contactInfo.website.replace('https://', '')}</a></p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}