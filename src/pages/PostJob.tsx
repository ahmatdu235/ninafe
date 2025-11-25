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
import { supabase } from "@/lib/supabase"; // On importe le client Supabase

export default function PostJob() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  // --- ÉTATS POUR CHAQUE CHAMP DU FORMULAIRE ---
  const [companyName, setCompanyName] = useState("");
  const [companyDesc, setCompanyDesc] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [salary, setSalary] = useState("");
  const [contractType, setContractType] = useState("CDI"); // Valeur par défaut
  
  // Gestion des tags
  const [tagsInput, setTagsInput] = useState("");
  // Transforme "React, Node" en ["React", "Node"]
  const tagsArray = tagsInput.split(",").map(tag => tag.trim()).filter(tag => tag !== "");

  const handleSubmit = async () => {
    // 1. Vérification basique
    if (!title || !companyName || !location || !category) {
        alert("Veuillez remplir au moins le titre, l'entreprise, la catégorie et la ville.");
        return;
    }

    setIsLoading(true);

    try {
        // 2. Envoi des données à Supabase (Table 'jobs')
        const { error } = await supabase
            .from('jobs')
            .insert({
                title: title,
                company_name: companyName,
                company_description: companyDesc,
                category: category,
                location: location,
                description: jobDesc,
                tags: tagsArray, // On envoie le tableau de tags
                salary: salary,
                type: contractType
                // recruiter_id est ajouté automatiquement par Supabase grâce au "default auth.uid()"
            });

        if (error) throw error;

        // 3. Succès
        alert("Annonce publiée avec succès !");
        navigate("/dashboard-recruiter");

    } catch (error: any) {
        console.error("Erreur:", error);
        alert("Erreur lors de la publication : " + error.message);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8 px-4 font-sans text-slate-900 dark:text-slate-100 transition-colors">
      <div className="container mx-auto max-w-3xl">
        <Link to="/dashboard-recruiter" className="flex items-center text-slate-500 hover:text-brand-blue mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" /> Retour au tableau de bord
        </Link>

        <Card className="dark:bg-slate-900 dark:border-slate-800">
          <CardHeader>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand-orange/10 text-brand-orange mb-4">
              <Briefcase />
            </div>
            <CardTitle className="text-2xl font-bold text-brand-blue dark:text-white">Publier une annonce réelle</CardTitle>
            <CardDescription className="dark:text-slate-400">Votre annonce sera visible immédiatement par tous les candidats.</CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            
            {/* L'ENTREPRISE */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2 text-slate-800 dark:text-white">
                    <Building2 className="h-4 w-4 text-brand-orange" /> L'Entreprise
                </h3>
                <div className="space-y-2">
                    <Label className="dark:text-slate-300">Nom de l'entreprise</Label>
                    <Input 
                        className="dark:bg-slate-950 dark:border-slate-700" 
                        placeholder="Ex: Tchad Numérique" 
                        value={companyName}
                        onChange={e => setCompanyName(e.target.value)}
                    />
                </div>
                <div className="space-y-2">
                    <Label className="dark:text-slate-300">Présentation</Label>
                    <Textarea 
                        className="min-h-[80px] dark:bg-slate-950 dark:border-slate-700" 
                        placeholder="Décrivez votre activité..." 
                        value={companyDesc}
                        onChange={e => setCompanyDesc(e.target.value)}
                    />
                </div>
            </div>

            <Separator className="dark:bg-slate-800" />

            {/* LE POSTE */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2 text-slate-800 dark:text-white">
                    <Briefcase className="h-4 w-4 text-brand-orange" /> Le Poste
                </h3>
                <div className="space-y-2">
                    <Label className="dark:text-slate-300">Titre de l'annonce *</Label>
                    <Input 
                        className="dark:bg-slate-950 dark:border-slate-700"
                        placeholder="Ex: Cherche Plombier expérimenté" 
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                    />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                        <Label className="dark:text-slate-300">Catégorie *</Label>
                        <Select onValueChange={setCategory}>
                            <SelectTrigger className="dark:bg-slate-950 dark:border-slate-700"><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                            <SelectContent className="dark:bg-slate-950 dark:border-slate-700">
                                <SelectItem value="BTP & Construction">BTP & Construction</SelectItem>
                                <SelectItem value="Informatique & Tech">Informatique & Tech</SelectItem>
                                <SelectItem value="Ménage & Services">Ménage & Services</SelectItem>
                                <SelectItem value="Transport & Logistique">Transport & Logistique</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label className="dark:text-slate-300">Ville / Quartier *</Label>
                        <Input 
                            className="dark:bg-slate-950 dark:border-slate-700"
                            placeholder="Ex: N'Djamena" 
                            value={location}
                            onChange={e => setLocation(e.target.value)}
                        />
                    </div>
                </div>
                
                {/* Type de contrat */}
                <div className="space-y-2">
                    <Label className="dark:text-slate-300">Type de contrat</Label>
                    <Select onValueChange={setContractType} defaultValue="CDI">
                        <SelectTrigger className="dark:bg-slate-950 dark:border-slate-700"><SelectValue placeholder="Type de contrat" /></SelectTrigger>
                        <SelectContent className="dark:bg-slate-950 dark:border-slate-700">
                            <SelectItem value="CDI">CDI</SelectItem>
                            <SelectItem value="CDD">CDD</SelectItem>
                            <SelectItem value="Prestation">Prestation / Freelance</SelectItem>
                            <SelectItem value="Stage">Stage</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label className="dark:text-slate-300">Description détaillée</Label>
                    <Textarea 
                        className="min-h-[150px] dark:bg-slate-950 dark:border-slate-700" 
                        placeholder="Détails..." 
                        value={jobDesc}
                        onChange={e => setJobDesc(e.target.value)}
                    />
                </div>
            </div>

            <Separator className="dark:bg-slate-800" />

            {/* TAGS */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2 text-slate-800 dark:text-white">
                    <Tags className="h-4 w-4 text-brand-orange" /> Compétences requises
                </h3>
                <div className="space-y-2">
                    <Label className="dark:text-slate-300">Tags (séparés par une virgule)</Label>
                    <Input 
                        className="dark:bg-slate-950 dark:border-slate-700"
                        placeholder="Ex: Permis B, Java, Maçonnerie" 
                        value={tagsInput}
                        onChange={e => setTagsInput(e.target.value)}
                    />
                    <div className="flex flex-wrap gap-2 mt-2">
                        {tagsArray.map((tag, idx) => (
                            <Badge key={idx} variant="secondary" className="bg-slate-100 dark:bg-slate-800 dark:text-slate-300">
                                {tag}
                            </Badge>
                        ))}
                    </div>
                </div>
            </div>

            <Separator className="dark:bg-slate-800" />

            <div className="space-y-2">
                <Label className="dark:text-slate-300">Budget / Salaire</Label>
                <Input 
                    className="dark:bg-slate-950 dark:border-slate-700"
                    placeholder="Ex: 150 000 FCFA" 
                    value={salary}
                    onChange={e => setSalary(e.target.value)}
                />
            </div>

            <Button className="w-full bg-brand-orange text-white text-lg h-12 mt-4 hover:bg-orange-600" onClick={handleSubmit} disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Publier l'annonce pour de vrai"}
            </Button>

          </CardContent>
        </Card>
      </div>
    </div>
  );
}