import React, { useState } from "react";
import { LogOut, FileText, Upload, Trash2, ShieldCheck, GraduationCap, CreditCard, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { DashboardHeader } from "@/components/DashboardHeader"; // On utilise le Header intelligent

// Simulation des candidatures existantes
const myApplications = [
  { id: 1, job: "Développeur Web", company: "Tchad Numérique", date: "24 Nov", status: "Entretien", color: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-100" },
  { id: 2, job: "Plombier", company: "Particulier", date: "22 Nov", status: "Refusé", color: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-100" },
  { id: 3, job: "Assistant RH", company: "Cabinet Sahel", date: "20 Nov", status: "En attente", color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-100" },
];

export default function Dashboard() {
  const [docs, setDocs] = useState({
    cv: "mon_cv_2024.pdf",
    idCard: null,
    diploma: null
  });

  const handleUpload = (type: keyof typeof docs, fileName: string) => {
    setTimeout(() => {
      setDocs(prev => ({ ...prev, [type]: fileName }));
    }, 500);
  };

  const handleDelete = (type: keyof typeof docs) => {
    if (confirm("Voulez-vous vraiment supprimer ce document ?")) {
      setDocs(prev => ({ ...prev, [type]: null }));
    }
  };

  return (
    // AJOUT : dark:bg-slate-950 et dark:text-slate-100 sur le conteneur principal
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 dark:text-slate-100 font-sans text-slate-900 transition-colors">
      
      {/* Header Intelligent */}
      <DashboardHeader type="candidat" />

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8">
             <Avatar className="h-24 w-24 border-4 border-white dark:border-slate-800 shadow-lg">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>MD</AvatarFallback>
             </Avatar>
             <div className="flex-1">
                <h1 className="text-3xl font-bold text-brand-blue dark:text-white">Moussa Diallo</h1>
                <p className="text-slate-600 dark:text-slate-400 flex items-center gap-2">
                    Technicien Réseau • N'Djamena
                    {docs.cv && docs.idCard && (
                        <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800">
                            <ShieldCheck className="w-3 h-3 mr-1" /> Profil Vérifié
                        </Badge>
                    )}
                </p>
             </div>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full max-w-[400px] grid-cols-2 dark:bg-slate-900">
            <TabsTrigger value="profile">Mon Profil & Docs</TabsTrigger>
            <TabsTrigger value="applications">Mes Candidatures</TabsTrigger>
          </TabsList>

          {/* ONGLET PROFIL & DOCUMENTS */}
          <TabsContent value="profile" className="mt-6 space-y-6">
            
            {/* 1. Section Documents */}
            {/* AJOUT : dark:bg-slate-900 dark:border-slate-800 */}
            <Card className="border-brand-blue/20 shadow-sm dark:bg-slate-900 dark:border-slate-800">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 dark:text-white">
                        <FileText className="h-5 w-5 text-brand-orange" />
                        Mes Documents Justificatifs
                    </CardTitle>
                    <CardDescription className="dark:text-slate-400">
                        Ces documents sont stockés de manière sécurisée et permettent aux recruteurs de valider votre profil.
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6 md:grid-cols-3">
                    
                    <DocumentBox 
                        title="CV / Curriculum Vitae" 
                        icon={<FileText className="h-6 w-6" />}
                        isMandatory={true}
                        fileName={docs.cv}
                        onUpload={() => handleUpload("cv", "mon_cv_final.pdf")}
                        onDelete={() => handleDelete("cv")}
                    />

                    <DocumentBox 
                        title="Pièce d'identité (CNI/Passeport)" 
                        icon={<CreditCard className="h-6 w-6" />}
                        isMandatory={true}
                        fileName={docs.idCard}
                        onUpload={() => handleUpload("idCard", "cni_scan_recto_verso.jpg")}
                        onDelete={() => handleDelete("idCard")}
                    />

                    <DocumentBox 
                        title="Dernier Diplôme" 
                        icon={<GraduationCap className="h-6 w-6" />}
                        isMandatory={false}
                        fileName={docs.diploma}
                        onUpload={() => handleUpload("diploma", "master_informatique.pdf")}
                        onDelete={() => handleDelete("diploma")}
                    />

                </CardContent>
            </Card>

            {/* 2. Section Infos Personnelles */}
            <Card className="dark:bg-slate-900 dark:border-slate-800">
                <CardHeader>
                  <CardTitle className="dark:text-white">Informations personnelles</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="dark:text-slate-300">Nom complet</Label>
                      <Input defaultValue="Moussa Diallo" className="dark:bg-slate-950 dark:border-slate-700" />
                    </div>
                    <div className="space-y-2">
                      <Label className="dark:text-slate-300">Poste recherché</Label>
                      <Input defaultValue="Technicien Réseau" className="dark:bg-slate-950 dark:border-slate-700" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="dark:text-slate-300">Bio / Compétences</Label>
                    <Textarea className="min-h-[100px] dark:bg-slate-950 dark:border-slate-700" defaultValue="Expert en câblage et configuration Cisco. Disponible pour des missions à N'Djamena et alentours." />
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-6 dark:border-slate-800">
                    <Button className="ml-auto bg-brand-blue text-white hover:bg-slate-700">Mettre à jour mes infos</Button>
                </CardFooter>
            </Card>
          </TabsContent>

          {/* ONGLET CANDIDATURES */}
          <TabsContent value="applications" className="mt-6">
            <Card className="dark:bg-slate-900 dark:border-slate-800">
              <CardHeader>
                <CardTitle className="dark:text-white">Suivi des candidatures</CardTitle>
                <CardDescription className="dark:text-slate-400">Retrouvez l'historique de vos demandes.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                    {myApplications.map(app => (
                        <div key={app.id} className="flex items-center justify-between p-4 border rounded-lg bg-white dark:bg-slate-950 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                            <div>
                                <h3 className="font-bold text-slate-800 dark:text-slate-200">{app.job}</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400">{app.company} • Envoyé le {app.date}</p>
                            </div>
                            <Badge className={`${app.color} border-0 px-3 py-1`}>{app.status}</Badge>
                        </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// --- COMPOSANT DOCUMENT BOX (Adapté Mode Sombre) ---
function DocumentBox({ title, icon, isMandatory, fileName, onUpload, onDelete }: any) {
    return (
        <div className={`border rounded-lg p-4 flex flex-col justify-between transition-all 
            ${fileName 
                ? 'bg-blue-50 border-blue-200 dark:bg-blue-950/30 dark:border-blue-900' 
                : 'bg-white border-slate-200 border-dashed dark:bg-slate-950/50 dark:border-slate-700'
            }`}>
            <div>
                <div className="flex justify-between items-start mb-3">
                    <div className={`p-2 rounded-full ${fileName ? 'bg-brand-blue text-white' : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'}`}>
                        {icon}
                    </div>
                    {isMandatory && !fileName && <Badge variant="destructive" className="text-xs">Requis</Badge>}
                    {isMandatory && fileName && <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400">Reçu</Badge>}
                    {!isMandatory && <Badge variant="outline" className="text-xs text-slate-400 dark:border-slate-700">Optionnel</Badge>}
                </div>
                <h4 className="font-semibold text-sm mb-1 dark:text-slate-200">{title}</h4>
                {fileName ? (
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 truncate underline cursor-pointer">{fileName}</p>
                ) : (
                    <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Aucun fichier sélectionné</p>
                )}
            </div>

            {fileName ? (
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="w-full text-xs h-8 bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200" title="Voir">
                        <Eye className="h-3 w-3 mr-1" /> Voir
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30" onClick={onDelete}>
                        <Trash2 className="h-3 w-3" />
                    </Button>
                </div>
            ) : (
                <div className="relative">
                    <Input type="file" className="absolute inset-0 opacity-0 cursor-pointer z-10" onChange={onUpload} />
                    <Button variant="secondary" size="sm" className="w-full text-xs h-8 dark:bg-slate-800 dark:text-slate-200">
                        <Upload className="h-3 w-3 mr-2" /> Importer
                    </Button>
                </div>
            )}
        </div>
    )
}