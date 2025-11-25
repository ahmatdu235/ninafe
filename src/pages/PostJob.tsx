import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, Briefcase, Building2, Tags } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

export default function PostJob() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  // État pour gérer les tags (exigences)
  const [tagsInput, setTagsInput] = useState("");

  const handleSubmit = () => {
    setIsLoading(true);
    // Simulation d'envoi
    setTimeout(() => {
      setIsLoading(false);
      navigate("/dashboard-recruiter");
    }, 1500);
  };

  // Petite fonction magique pour transformer "Excel, Word, Java" en tableau de badges
  const tagsPreview = tagsInput.split(",").map(tag => tag.trim()).filter(tag => tag !== "");

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 font-sans text-slate-900">
      <div className="container mx-auto max-w-3xl">
        <Link to="/dashboard-recruiter" className="flex items-center text-slate-500 hover:text-brand-blue mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" /> Retour au tableau de bord
        </Link>

        <Card>
          <CardHeader>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand-orange/10 text-brand-orange mb-4">
              <Briefcase />
            </div>
            <CardTitle className="text-2xl font-bold text-brand-blue">Publier une annonce détaillée</CardTitle>
            <CardDescription>Donnez le maximum d'informations pour attirer les meilleurs talents.</CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            
            {/* --- SECTION 1 : L'ENTREPRISE (Nouvelle demande) --- */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2 text-slate-800">
                    <Building2 className="h-4 w-4 text-brand-orange" /> L'Entreprise
                </h3>
                <div className="space-y-2">
                    <Label>Nom de l'entreprise (ou Particulier)</Label>
                    <Input placeholder="Ex: Tchad Numérique" />
                </div>
                <div className="space-y-2">
                    <Label>Présentation de l'entreprise</Label>
                    <Textarea 
                        placeholder="Qui êtes-vous ? (Ex: Leader de la tech à N'Djamena, nous cherchons à agrandir notre équipe...)" 
                        className="min-h-[80px]" 
                    />
                </div>
            </div>

            <Separator />

            {/* --- SECTION 2 : LE POSTE --- */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2 text-slate-800">
                    <Briefcase className="h-4 w-4 text-brand-orange" /> Le Poste
                </h3>
                <div className="space-y-2">
                    <Label>Titre de l'annonce</Label>
                    <Input placeholder="Ex: Cherche Plombier expérimenté" />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                        <Label>Catégorie</Label>
                        <Select>
                            <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="btp">BTP & Construction</SelectItem>
                                <SelectItem value="tech">Informatique & Tech</SelectItem>
                                <SelectItem value="services">Ménage & Services</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Ville / Quartier</Label>
                        <Input placeholder="Ex: N'Djamena, Moursal" />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label>Description détaillée des missions</Label>
                    <Textarea className="min-h-[150px]" placeholder="Détaillez ce que la personne devra faire..." />
                </div>
            </div>

            <Separator />

            {/* --- SECTION 3 : EXIGENCES / TAGS (Nouvelle demande) --- */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2 text-slate-800">
                    <Tags className="h-4 w-4 text-brand-orange" /> Compétences requises
                </h3>
                <div className="space-y-2">
                    <Label>Tags (séparez les compétences par une virgule)</Label>
                    <Input 
                        placeholder="Ex: Permis B, Java, Anglais, Maçonnerie" 
                        value={tagsInput}
                        onChange={(e) => setTagsInput(e.target.value)}
                    />
                    {/* Le Nuage de Tags s'affiche ici automatiquement */}
                    <div className="flex flex-wrap gap-2 mt-2">
                        {tagsPreview.length > 0 ? (
                            tagsPreview.map((tag, idx) => (
                                <Badge key={idx} variant="secondary" className="bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200">
                                    {tag}
                                </Badge>
                            ))
                        ) : (
                            <span className="text-sm text-slate-400 italic">Tapez des mots-clés ci-dessus...</span>
                        )}
                    </div>
                </div>
            </div>

            <Separator />

            <div className="space-y-2">
                <Label>Budget / Salaire</Label>
                <Input placeholder="Ex: 150 000 FCFA" />
            </div>

            <Button className="w-full bg-brand-orange text-white text-lg h-12 mt-4 hover:bg-orange-600" onClick={handleSubmit} disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Publier l'annonce"}
            </Button>

          </CardContent>
        </Card>
      </div>
    </div>
  );
}