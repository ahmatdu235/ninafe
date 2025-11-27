
// DANS src/pages/JobCandidates.tsx (Remplace le bloc d'imports actuel)

import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, FileText, Mail, User, Loader2, Download, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"; // <-- CORRIGÉ
import { DashboardHeader } from "@/components/DashboardHeader";
import { supabase } from "@/lib/supabase";
import { Badge } from "@/components/ui/badge"; // <-- AJOUTÉ

// ... (Le reste du code reste inchangé) ...

export default function JobCandidates() {
  const { jobId } = useParams<{ jobId: string }>();
  const [job, setJob] = useState<any>(null);
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null);

  // --- NOUVEAU : FONCTION MARQUER COMME LU ---
  const markApplicationsAsRead = async (jobId: string) => {
    // On met à jour toutes les candidatures pour cette offre comme 'lues'
    await supabase
        .from('applications')
        .update({ read_by_recruiter: true })
        .eq('job_id', jobId);
  };

  async function fetchCandidates() {
    setLoading(true);
    
    // 1. MARQUER COMME LU (Dès que le recruteur ouvre la page)
    if (jobId) {
        await markApplicationsAsRead(jobId);
    }

    // 2. Récupérer les détails de l'offre
    const { data: jobData } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', jobId)
        .single();
    
    if (jobData) setJob(jobData);

    // 3. Récupérer les candidatures (avec jointure sur les profils pour le nom)
    const { data: applicationsData, error: applicationsError } = await supabase
        .from('applications')
        .select(`
            *,
            candidate:profiles!applications_candidate_id_fkey(full_name, job_title, bio)
        `)
        .eq('job_id', jobId);

    if (!applicationsError && applicationsData) {
        setCandidates(applicationsData);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchCandidates();
  }, [jobId]);

  const updateStatus = async (id: number, newStatus: string) => {
      // Mettre à jour le statut dans la base (Accepté/Refusé)
      const { error } = await supabase.from('applications').update({ status: newStatus }).eq('id', id);
      if (!error) {
          // Mise à jour locale pour que l'interface change tout de suite
          setCandidates(candidates.map(c => c.id === id ? { ...c, status: newStatus } : c));
      }
  };


  if (loading) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
            <Loader2 className="h-10 w-10 animate-spin mx-auto text-brand-orange" />
        </div>
    );
  }

  if (!job) {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-8">
            <h1 className="text-2xl font-bold dark:text-white">Offre introuvable.</h1>
            <p className="text-slate-500">Veuillez vérifier l'ID de l'offre dans l'URL.</p>
        </div>
    );
  }


  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 dark:text-slate-100 font-sans text-slate-900 transition-colors">
      <DashboardHeader type="recruteur" />

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="flex items-center justify-between mb-6">
            <div>
                <Link to="/dashboard-recruiter" className="flex items-center text-slate-500 hover:text-brand-blue mb-2 text-sm">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Retour au tableau de bord
                </Link>
                <h1 className="text-2xl font-bold text-brand-blue dark:text-white">{job.title || "Titre de l'offre"}</h1>
                <p className="text-lg text-slate-500 dark:text-slate-400">Gestion des candidatures reçues ({candidates.length})</p>
            </div>
        </div>

        {candidates.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-lg border dark:border-slate-800">
                <p className="text-slate-500 dark:text-slate-400">Aucun candidat pour l'instant.</p>
            </div>
        ) : (
            <div className="space-y-4">
                {candidates.map((app) => (
                    <Card key={app.id} className="overflow-hidden border-l-4 border-l-brand-blue hover:shadow-md transition-shadow dark:bg-slate-900 dark:border-slate-700">
                        <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row gap-6 items-start">

                                {/* Info Candidat */}
                                <div className="flex items-start gap-4 min-w-[250px]">
                                    <Avatar className="h-16 w-16 border-2 border-slate-100 cursor-pointer">
                                        <AvatarImage src={`https://ui-avatars.com/api/?name=${app.full_name}&background=random`} />
                                        <AvatarFallback>{app.full_name?.charAt(0) || 'C'}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h3 className="font-bold text-lg text-brand-blue dark:text-white">{app.full_name}</h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">{app.email}</p>
                                        <span className={`text-xs font-bold px-2 py-1 rounded mt-2 inline-block ${
                                            app.status === 'Accepté' ? 'bg-green-100 text-green-700' :
                                            app.status === 'Refusé' ? 'bg-red-100 text-red-700' :
                                            'bg-slate-100 text-slate-600'
                                        }`}>
                                            {app.status}
                                        </span>
                                    </div>
                                </div>

                                <Separator orientation="vertical" className="hidden md:block h-auto bg-slate-100 dark:bg-slate-800" />

                                {/* Message et Documents */}
                                <div className="flex-1 flex flex-col justify-center gap-3">
                                    <p className="text-sm italic text-slate-600 dark:text-slate-300 line-clamp-2">
                                        <Mail className="h-4 w-4 mr-2 inline-block" /> {app.message}
                                    </p>
                                    <div className="flex gap-2">
                                        <a href={app.cv_url} target="_blank" rel="noreferrer">
                                            <Button variant="outline" size="sm" className="text-blue-600 border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-900 dark:text-blue-300">
                                                <Download className="mr-2 h-4 w-4" /> CV
                                            </Button>
                                        </a>
                                        <Button onClick={() => setSelectedCandidate(app)} variant="outline" size="sm" className="dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700 flex items-center gap-2">
                                            <User className="mr-2 h-4 w-4" /> Profil
                                        </Button>
                                    </div>
                                </div>

                                {/* Décision */}
                                <div className="flex flex-col gap-2 min-w-[120px]">
                                    <Button onClick={() => updateStatus(app.id, 'Accepté')} className="bg-green-600 hover:bg-green-700 text-white w-full text-xs">Accepter</Button>
                                    <Button onClick={() => updateStatus(app.id, 'Refusé')} variant="outline" className="text-red-500 border-red-200 hover:bg-red-50 w-full text-xs dark:bg-transparent dark:hover:bg-red-900/20">Refuser</Button>
                                </div>

                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        )}

        {/* MODALE DÉTAILS */}
        <Dialog open={!!selectedCandidate} onOpenChange={() => setSelectedCandidate(null)}>
            <DialogContent className="max-w-2xl dark:bg-slate-900 dark:border-slate-700 dark:text-white">
                {selectedCandidate && (
                    <>
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-bold text-brand-blue dark:text-white">{selectedCandidate.full_name}</DialogTitle>
                            <DialogDescription>Statut : {selectedCandidate.status}</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 mt-4">
                            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                                <h4 className="font-semibold mb-2 flex items-center gap-2"><Mail className="h-4 w-4" /> Message de motivation</h4>
                                <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">{selectedCandidate.message}</p>
                            </div>
                            <div>
                                <h4 className="font-semibold mb-3 flex items-center gap-2"><FileText className="h-4 w-4" /> Documents</h4>
                                <a href={selectedCandidate.cv_url} target="_blank" rel="noreferrer" className="inline-block">
                                    <div className="border dark:border-slate-700 p-3 rounded flex items-center gap-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800">
                                        <div className="bg-red-100 p-2 rounded text-red-600"><FileText /></div>
                                        <div>
                                            <p className="font-bold text-sm">Curriculum Vitae</p>
                                            <p className="text-xs text-slate-500">Cliquez pour télécharger</p>
                                        </div>
                                    </div>
                                </a>
                            </div>
                        </div>
                    </>
                )}
            </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}