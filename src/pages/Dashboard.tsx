import React, { useState, useEffect } from "react";
import { LogOut, FileText, Upload, Trash2, ShieldCheck, GraduationCap, CreditCard, Eye, Loader2, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DashboardHeader } from "@/components/DashboardHeader";
import { supabase } from "@/lib/supabase";

const myApplications = [
  { id: 1, job: "Développeur Web", company: "Tchad Numérique", date: "24 Nov", status: "Entretien", color: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-100" },
];

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  
  // Données du profil
  const [userId, setUserId] = useState("");
  const [fullName, setFullName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [location, setLocation] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  
  // URLs des documents
  const [docs, setDocs] = useState({
    cv: "",
    idCard: "",
    diploma: ""
  });

  // Chargement des données au démarrage
  useEffect(() => {
    async function getProfile() {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        setUserId(user.id);
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (data) {
          setFullName(data.full_name || "");
          setJobTitle(data.job_title || "");
          setLocation(data.location || "");
          setBio(data.bio || "");
          setAvatarUrl(data.avatar_url || "");
          // On charge les documents existants
          setDocs({
            cv: data.cv_url || "",
            idCard: data.id_card_url || "",
            diploma: data.diploma_url || ""
          });
        }
      }
      setLoading(false);
    }
    getProfile();
  }, []);

  // --- FONCTION UNIVERSELLE D'UPLOAD ---
  // Elle gère l'avatar ET les documents
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'cv' | 'idCard' | 'diploma') => {
    try {
      if (!event.target.files || event.target.files.length === 0) return;
      
      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${userId}/${type}_${Date.now()}.${fileExt}`;
      
      // Choix du dossier (bucket) selon le type
      const bucketName = type === 'avatar' ? 'avatars' : 'documents';

      // 1. Upload du fichier
      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 2. Récupération du lien public
      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);

      // 3. Mise à jour de la base de données
      // On détermine quelle colonne mettre à jour
      const columnMap = {
        avatar: 'avatar_url',
        cv: 'cv_url',
        idCard: 'id_card_url',
        diploma: 'diploma_url'
      };

      const { error: dbError } = await supabase
        .from('profiles')
        .update({ [columnMap[type]]: publicUrl })
        .eq('id', userId);

      if (dbError) throw dbError;

      // 4. Mise à jour de l'affichage
      if (type === 'avatar') {
        setAvatarUrl(publicUrl);
      } else {
        setDocs(prev => ({ ...prev, [type]: publicUrl }));
      }
      
      alert("Fichier envoyé avec succès !");

    } catch (error: any) {
      console.error(error);
      alert("Erreur lors de l'envoi : " + error.message);
    }
  };

  // Sauvegarder les infos textes
  async function updateProfile() {
    setUpdating(true);
    const { error } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          job_title: jobTitle,
          location: location,
          bio: bio,
        })
        .eq('id', userId);

    if (error) alert("Erreur lors de la mise à jour.");
    else alert("Profil mis à jour avec succès !");
    setUpdating(false);
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 dark:text-slate-100 font-sans text-slate-900 transition-colors">
      <DashboardHeader type="candidat" />

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8">
             
             {/* AVATAR UPLOAD */}
             <div className="relative group">
                <Avatar className="h-24 w-24 border-4 border-white dark:border-slate-800 shadow-lg cursor-pointer">
                    <AvatarImage src={avatarUrl || `https://ui-avatars.com/api/?name=${fullName}&background=random`} className="object-cover" />
                    <AvatarFallback>MD</AvatarFallback>
                </Avatar>
                <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="h-6 w-6 text-white" />
                    <Input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer h-full w-full" 
                        onChange={(e) => handleFileUpload(e, 'avatar')} 
                    />
                </div>
             </div>

             <div className="flex-1">
                {loading ? (
                    <div className="h-8 w-48 bg-slate-200 dark:bg-slate-800 animate-pulse rounded"></div>
                ) : (
                    <>
                        <h1 className="text-3xl font-bold text-brand-blue dark:text-white">{fullName || "Utilisateur"}</h1>
                        <p className="text-slate-600 dark:text-slate-400 flex items-center gap-2">
                            {jobTitle || "Titre non défini"} • {location || "Ville non définie"}
                            {docs.cv && docs.idCard && (
                                <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800">
                                    <ShieldCheck className="w-3 h-3 mr-1" /> Profil Vérifié
                                </Badge>
                            )}
                        </p>
                    </>
                )}
             </div>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full max-w-[400px] grid-cols-2 dark:bg-slate-900">
            <TabsTrigger value="profile">Mon Profil & Docs</TabsTrigger>
            <TabsTrigger value="applications">Mes Candidatures</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="mt-6 space-y-6">
            
            {/* DOCUMENTS */}
            <Card className="border-brand-blue/20 shadow-sm dark:bg-slate-900 dark:border-slate-800">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 dark:text-white">
                        <FileText className="h-5 w-5 text-brand-orange" />
                        Mes Documents Justificatifs
                    </CardTitle>
                </CardHeader>
                <CardContent className="grid gap-6 md:grid-cols-3">
                    <DocumentBox 
                        title="CV" icon={<FileText />} isMandatory={true} 
                        fileUrl={docs.cv} 
                        onUpload={(e: any) => handleFileUpload(e, 'cv')} 
                    />
                    <DocumentBox 
                        title="CNI / Passeport" icon={<CreditCard />} isMandatory={true} 
                        fileUrl={docs.idCard} 
                        onUpload={(e: any) => handleFileUpload(e, 'idCard')} 
                    />
                    <DocumentBox 
                        title="Diplôme" icon={<GraduationCap />} isMandatory={false} 
                        fileUrl={docs.diploma} 
                        onUpload={(e: any) => handleFileUpload(e, 'diploma')} 
                    />
                </CardContent>
            </Card>

            {/* INFOS PERSO */}
            <Card className="dark:bg-slate-900 dark:border-slate-800">
                <CardHeader><CardTitle className="dark:text-white">Informations personnelles</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2"><Label className="dark:text-slate-300">Nom complet</Label><Input value={fullName} onChange={(e) => setFullName(e.target.value)} className="dark:bg-slate-950 dark:border-slate-700" /></div>
                    <div className="space-y-2"><Label className="dark:text-slate-300">Poste</Label><Input value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} className="dark:bg-slate-950 dark:border-slate-700" /></div>
                  </div>
                  <div className="space-y-2"><Label className="dark:text-slate-300">Ville</Label><Input value={location} onChange={(e) => setLocation(e.target.value)} className="dark:bg-slate-950 dark:border-slate-700" /></div>
                  <div className="space-y-2"><Label className="dark:text-slate-300">Bio</Label><Textarea value={bio} onChange={(e) => setBio(e.target.value)} className="min-h-[100px] dark:bg-slate-950 dark:border-slate-700" /></div>
                </CardContent>
                <CardFooter className="border-t pt-6 dark:border-slate-800">
                    <Button onClick={updateProfile} disabled={updating} className="ml-auto bg-brand-blue text-white hover:bg-slate-700">
                        {updating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Enregistrer
                    </Button>
                </CardFooter>
            </Card>

          </TabsContent>

          <TabsContent value="applications" className="mt-6">
             {/* ... (Reste du code applications identique) ... */}
             <Card className="dark:bg-slate-900 dark:border-slate-800">
                <CardHeader><CardTitle className="dark:text-white">Suivi des candidatures</CardTitle></CardHeader>
                <CardContent>
                    <p className="text-slate-500">Aucune candidature pour le moment.</p>
                </CardContent>
             </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// Composant Document Box mis à jour pour gérer le vrai lien
function DocumentBox({ title, icon, isMandatory, fileUrl, onUpload }: any) {
    return (
        <div className={`border rounded-lg p-4 flex flex-col justify-between transition-all ${fileUrl ? 'bg-blue-50 border-blue-200 dark:bg-blue-950/30 dark:border-blue-900' : 'bg-white border-slate-200 border-dashed dark:bg-slate-950/50 dark:border-slate-700'}`}>
            <div>
                <div className="flex justify-between items-start mb-3">
                    <div className={`p-2 rounded-full ${fileUrl ? 'bg-brand-blue text-white' : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'}`}>{icon}</div>
                    {isMandatory && !fileUrl && <Badge variant="destructive" className="text-xs">Requis</Badge>}
                    {fileUrl && <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">Reçu</Badge>}
                </div>
                <h4 className="font-semibold text-sm mb-1 dark:text-slate-200">{title}</h4>
                {fileUrl ? (
                    <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline cursor-pointer truncate block max-w-[150px]">Voir le document</a>
                ) : (
                    <p className="text-xs text-slate-400 mb-4">Aucun fichier</p>
                )}
            </div>
            {!fileUrl && (
                <div className="relative">
                    <Input type="file" className="absolute inset-0 opacity-0 cursor-pointer z-10" onChange={onUpload} />
                    <Button variant="secondary" size="sm" className="w-full text-xs h-8 dark:bg-slate-800 dark:text-slate-200"><Upload className="h-3 w-3 mr-2" /> Importer</Button>
                </div>
            )}
            {fileUrl && (
                 <div className="relative mt-2">
                    <Input type="file" className="absolute inset-0 opacity-0 cursor-pointer z-10" onChange={onUpload} />
                    <Button variant="outline" size="sm" className="w-full text-xs h-8 bg-white dark:bg-slate-800 dark:text-slate-300">Remplacer</Button>
                </div>
            )}
        </div>
    )
}