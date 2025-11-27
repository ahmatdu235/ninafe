import React, { useState, useEffect } from "react";
import { Plus, Users, Briefcase, Trash2, Edit, Loader2, AlertTriangle, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { AppHeader } from "@/components/AppHeader"; // Header général
import { supabase } from "@/lib/supabase";
import { Separator } from "@/components/ui/separator";

// Types des props passées par App.tsx
interface DashboardProps {
    isLoggedIn: boolean;
    userRole: string | null;
    isDark: boolean;
    setIsDark: (dark: boolean) => void;
    // Ajout des fonctions pour le Logout
    setIsLoggedIn: (status: boolean) => void; 
    setUserRole: (role: string | null) => void;
    unreadNotifications: number;
}

export default function RecruiterDashboard(props: DashboardProps) {
    const [jobs, setJobs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [recruiterProfile, setRecruiterProfile] = useState<any>({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [companyName, setCompanyName] = useState("");
    const [companyDesc, setCompanyDesc] = useState("");
    
    // Vérification de l'exigence : Le profil est-il complet ?
    const isProfileComplete = recruiterProfile.full_name && recruiterProfile.bio;

    async function fetchRecruiterData() {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { setLoading(false); return; }

        const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
        if (profile) {
            setRecruiterProfile(profile);
            setCompanyName(profile.full_name || ""); 
            setCompanyDesc(profile.bio || "");
        }

        const { data: jobsData, error } = await supabase
            .from('jobs')
            .select('*, applications(count)')
            .eq('recruiter_id', user.id)
            .order('created_at', { ascending: false });
        
        if (!error && jobsData) {
            const formattedJobs = jobsData.map(job => ({
                ...job,
                candidatesCount: job.applications ? job.applications[0]?.count || 0 : 0
            }));
            setJobs(formattedJobs);
        }
        setLoading(false);
    }

    useEffect(() => {
        fetchRecruiterData();
    }, []);

    const handleUpdateProfile = async () => {
        setUpdating(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { error } = await supabase.from('profiles')
            .update({ full_name: companyName, bio: companyDesc })
            .eq('id', user.id);

        if (error) alert("Erreur lors de la mise à jour du profil.");
        else {
            alert("Profil mis à jour !");
            setRecruiterProfile(prev => ({ ...prev, full_name: companyName, bio: companyDesc }));
            setIsModalOpen(false);
        }
        setUpdating(false);
    };

    const deleteJob = async (jobId: number) => {
        if (!confirm("Êtes-vous sûr de vouloir supprimer cette annonce ?")) return;

        setLoading(true);
        const { error } = await supabase.from('jobs').delete().eq('id', jobId);

        if (error) alert("Erreur lors de la suppression de l'offre.");
        else {
            alert("Annonce supprimée avec succès.");
            fetchRecruiterData();
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 dark:text-slate-100 font-sans text-slate-900 transition-colors">
            
            {/* Utilisation de l'AppHeader pour la cohérence globale */}
            <AppHeader {...props} type="dashboard" /> 

            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-6 dark:text-white">Espace Recrutement</h1>

                {/* --- BLOC ALERTE/EXIGENCE (SI PROFIL INCOMPLET) --- */}
                {!isProfileComplete && (
                    <Card className="mb-8 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div className="flex items-center gap-3">
                                <AlertTriangle className="h-5 w-5 shrink-0" />
                                <CardTitle className="text-lg text-red-700 dark:text-red-400">Action Requis : Profil Incomplet</CardTitle>
                            </div>
                            <Button variant="link" onClick={() => setIsModalOpen(true)} className="text-red-700 dark:text-red-400 hover:text-red-900">
                                <ArrowRight className="h-4 w-4 mr-2" /> Compléter mon profil
                            </Button>
                        </CardHeader>
                    </Card>
                )}


                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div className="flex items-center gap-4">
                        <Avatar className="h-16 w-16 border-2 border-brand-orange">
                            <AvatarImage src={`https://ui-avatars.com/api/?name=${recruiterProfile.full_name || 'ENT'}&background=f97316&color=fff`} />
                            <AvatarFallback>ENT</AvatarFallback>
                        </Avatar>
                        <div>
                            <h1 className="text-2xl font-bold text-brand-blue dark:text-white">{recruiterProfile.full_name || "Nom Entreprise"}</h1>
                            <p className="text-slate-500 dark:text-slate-400">Gérez vos offres et vos recrutements</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        {/* Modale d'édition de profil */}
                        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline" className="dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800">
                                    <Edit className="mr-2 h-4 w-4" /> Modifier Profil
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px] dark:bg-slate-900 dark:border-slate-800">
                                <DialogHeader>
                                    <DialogTitle className="dark:text-white">Éditer le profil entreprise</DialogTitle>
                                    <DialogDescription className="dark:text-slate-400">
                                        Mettez à jour les informations de votre entreprise.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="space-y-2">
                                        <Label className="dark:text-slate-300">Nom de l'entreprise *</Label>
                                        <Input value={companyName} onChange={e => setCompanyName(e.target.value)} className="dark:bg-slate-950 dark:border-slate-700" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="dark:text-slate-300">Description (Bio) *</Label>
                                        <Textarea value={companyDesc} onChange={e => setCompanyDesc(e.target.value)} className="min-h-[100px] dark:bg-slate-950 dark:border-slate-700" />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button onClick={handleUpdateProfile} disabled={updating || !companyName || !companyDesc} className="bg-brand-blue text-white hover:bg-slate-700">
                                        {updating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Enregistrer
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                        <Link to="/post-job">
                            <Button className="bg-brand-orange hover:bg-orange-600 text-white" disabled={!isProfileComplete}>
                                <Plus className="mr-2 h-4 w-4" /> Créer une annonce
                            </Button>
                        </Link>
                    </div>
                </div>
                
                {/* Liste des offres (Visuellement désactivée si profil incomplet) */}
                <Card className={`dark:bg-slate-900 dark:border-slate-800 ${!isProfileComplete ? 'opacity-50 pointer-events-none' : ''}`}>
                    <CardHeader>
                        <CardTitle className="dark:text-white">Mes annonces actives</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="text-center py-8"><Loader2 className="h-8 w-8 animate-spin mx-auto text-brand-orange" /></div>
                        ) : jobs.length === 0 ? (
                            <div className="text-center py-8 text-slate-500">Vous n'avez publié aucune annonce.</div>
                        ) : (
                            <div className="space-y-4">
                                {/* Affichage des offres... */}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}