import React from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, FileText, CreditCard, CheckCircle, XCircle, ShieldCheck, Download, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// Simulation des candidats pour ce poste
const candidates = [
  { 
    id: 1, 
    name: "Moussa Diallo", 
    role: "Technicien Réseau", 
    location: "N'Djamena, Moursal",
    status: "En attente",
    isVerified: true, // Il a mis sa CNI
    match: "95%",
    documents: { cv: true, cni: true }
  },
  { 
    id: 2, 
    name: "Amina Youssouf", 
    role: "Informaticienne", 
    location: "N'Djamena, Sabangali",
    status: "En attente",
    isVerified: false, // Pas de CNI
    match: "70%",
    documents: { cv: true, cni: false }
  },
];

export default function JobCandidates() {
  const { jobId } = useParams(); // On pourrait utiliser ça pour charger les bonnes données

  const handleDownload = (docName: string, candidateName: string) => {
    alert(`Téléchargement du document : ${docName} de ${candidateName}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Header simple */}
      <header className="bg-white border-b shadow-sm">
        <div className="container mx-auto h-16 flex items-center px-4">
           <Link to="/dashboard-recruiter" className="flex items-center text-slate-500 hover:text-brand-blue">
            <ArrowLeft className="mr-2 h-4 w-4" /> Retour au tableau de bord
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="flex items-center justify-between mb-6">
            <div>
                <h1 className="text-2xl font-bold text-brand-blue">Chauffeur Poids Lourd (CDD)</h1>
                <p className="text-slate-500">Gestion des candidatures reçues</p>
            </div>
            <Badge className="bg-brand-orange text-white text-base px-4 py-1">2 Candidats</Badge>
        </div>

        <div className="space-y-4">
            {candidates.map((candidate) => (
                <Card key={candidate.id} className="overflow-hidden border-l-4 border-l-brand-blue hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row gap-6">
                            
                            {/* 1. Info Candidat */}
                            <div className="flex items-start gap-4 min-w-[250px]">
                                <Avatar className="h-16 w-16 border-2 border-slate-100">
                                    <AvatarImage src={`https://i.pravatar.cc/150?u=${candidate.id}`} />
                                    <AvatarFallback>{candidate.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-bold text-lg text-brand-blue">{candidate.name}</h3>
                                        {candidate.isVerified && (
                                            <Badge variant="secondary" className="bg-green-100 text-green-700 h-5 px-1.5" title="Identité vérifiée">
                                                <ShieldCheck className="h-3 w-3 mr-1" /> Vérifié
                                            </Badge>
                                        )}
                                    </div>
                                    <p className="text-sm font-medium text-slate-700">{candidate.role}</p>
                                    <p className="text-sm text-slate-500">{candidate.location}</p>
                                </div>
                            </div>

                            <Separator orientation="vertical" className="hidden md:block h-auto bg-slate-100" />

                            {/* 2. Documents Officiels (C'est ce que tu voulais !) */}
                            <div className="flex-1 space-y-3">
                                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Documents justificatifs</h4>
                                <div className="flex flex-wrap gap-3">
                                    {/* Bouton CV */}
                                    <Button variant="outline" size="sm" className="bg-slate-50 border-slate-200" onClick={() => handleDownload("CV", candidate.name)}>
                                        <FileText className="mr-2 h-4 w-4 text-blue-500" /> 
                                        CV
                                    </Button>

                                    {/* Bouton CNI (Grisé si pas là) */}
                                    {candidate.documents.cni ? (
                                        <Button variant="outline" size="sm" className="bg-slate-50 border-slate-200" onClick={() => handleDownload("Pièce d'identité", candidate.name)}>
                                            <CreditCard className="mr-2 h-4 w-4 text-green-600" /> 
                                            Pièce d'Identité
                                        </Button>
                                    ) : (
                                        <Badge variant="outline" className="h-9 px-3 text-slate-400 border-dashed border-slate-300 font-normal">
                                            <XCircle className="mr-2 h-4 w-4" /> Pas de CNI
                                        </Badge>
                                    )}
                                </div>
                            </div>

                            {/* 3. Actions Recruteur */}
                            <div className="flex flex-col gap-2 min-w-[140px] justify-center">
                                <Button className="bg-green-600 hover:bg-green-700 text-white w-full">
                                    <CheckCircle className="mr-2 h-4 w-4" /> Accepter
                                </Button>
                                <Button variant="outline" className="text-red-500 border-red-200 hover:bg-red-50 w-full">
                                    <XCircle className="mr-2 h-4 w-4" /> Refuser
                                </Button>
                            </div>

                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
      </div>
    </div>
  );
}