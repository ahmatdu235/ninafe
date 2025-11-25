import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, FileText, Mail, User, Loader2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DashboardHeader } from "@/components/DashboardHeader";
import { supabase } from "@/lib/supabase";

export default function JobCandidates() {
  const { jobId } = useParams();
  const [candidates, setCandidates] = useState<any[]>([]);
  const [jobTitle, setJobTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null);

  useEffect(() => {
    async function fetchData() {
        // 1. Récupérer le titre du job
        const { data: job } = await supabase.from('jobs').select('title').eq('id', jobId).single();
        if (job) setJobTitle(job.title);

        // 2. Récupérer les candidatures
        const { data, error } = await supabase
            .from('applications')
            .select('*')
            .eq('job_id', jobId)
            .order('created_at', { ascending: false });

        if (!error && data) {
            setCandidates(data);
        }
        setLoading(false);
    }
    fetchData();
  }, [jobId]);

  const updateStatus = async (id: number, newStatus: string) => {
      // Mettre à jour le statut dans la base (Accepté/Refusé)
      const { error } = await supabase.from('applications').update({ status: newStatus }).eq('id', id);
      if (!error) {
          // Mise à jour locale pour que l'interface change tout de suite
          setCandidates(candidates.map(c => c.id === id ? { ...c, status: newStatus } : c));
      }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 dark:text-slate-100 font-sans text-slate-900 transition-colors">
      <DashboardHeader type="recruteur" />

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="flex items-center justify-between mb-6">
            <div>
                <Link to="/dashboard-recruiter" className="flex items-center text-slate-500 hover:text-brand-blue mb-2 text-sm">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Retour
                </Link>
                <h1 className="text-2xl font-bold text-brand-blue dark:text-white">{jobTitle || "Chargement..."}</h1>
                <p className="text-slate-500 dark:text-slate-400">Gestion des candidatures reçues</p>
            </div>
        </div>

        {loading ? (
            <div className="text-center py-12"><Loader2 className="h-10 w-10 animate-spin mx-auto text-brand-orange" /></div>
        ) : candidates.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-lg border dark:border-slate-800">
                <p className="text-slate-500">Aucune candidature pour le moment.</p>
            </div>
        ) : (
            <div className="space-y-4">
                {candidates.map((candidate) => (
                    <Card key={candidate.id} className="overflow-hidden border-l-4 border-l-brand-blue hover:shadow-md transition-shadow dark:bg-slate-900 dark:border-slate-700">
                        <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row gap-6 items-start">
                                
                                {/* Info Candidat */}
                                <div className="flex items-start gap-4 min-w-[250px]">
                                    <Avatar className="h-16 w-16 border-2 border-slate-100 cursor-pointer">
                                        <AvatarImage src={`https://ui-avatars.com/api/?name=${candidate.full_name}&background=random`} />
                                        <AvatarFallback>{candidate.full_name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h3 className="font-bold text-lg text-brand-blue dark:text-white">{candidate.full_name}</h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">{candidate.email}</p>
                                        <span className={`text-xs font-bold px-2 py-1 rounded mt-2 inline-block ${
                                            candidate.status === 'Accepté' ? 'bg-green-100 text-green-700' :
                                            candidate.status === 'Refusé' ? 'bg-red-100 text-red-700' :
                                            'bg-slate-100 text-slate-600'
                                        }`}>
                                            {candidate.status}
                                        </span>
                                    </div>
                                </div>

                                <Separator orientation="vertical" className="hidden md:block h-auto bg-slate-100 dark:bg-slate-800" />

                                {/* Actions & Documents */}
                                <div className="flex-1 flex flex-col justify-center gap-3">
                                    <p className="text-sm italic text-slate-600 dark:text-slate-300 line-clamp-2">"{candidate.message}"</p>
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm" onClick={() => setSelectedCandidate(candidate)} className="dark:bg-slate-800 dark:text-white">
                                            <User className="mr-2 h-4 w-4" /> Voir Profil & Lettre
                                        </Button>
                                        <a href={candidate.cv_url} target="_blank" rel="noreferrer">
                                            <Button variant="outline" size="sm" className="text-blue-600 border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-900 dark:text-blue-300">
                                                <Download className="mr-2 h-4 w-4" /> CV
                                            </Button>
                                        </a>
                                    </div>
                                </div>

                                {/* Décision */}
                                <div className="flex flex-col gap-2 min-w-[120px]">
                                    <Button onClick={() => updateStatus(candidate.id, 'Accepté')} className="bg-green-600 hover:bg-green-700 text-white w-full text-xs">Accepter</Button>
                                    <Button onClick={() => updateStatus(candidate.id, 'Refusé')} variant="outline" className="text-red-500 border-red-200 hover:bg-red-50 w-full text-xs dark:bg-transparent dark:hover:bg-red-900/20">Refuser</Button>
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
                        </DialogHeader>
                        <div className="space-y-6 mt-4">
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