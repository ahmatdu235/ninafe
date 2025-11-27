import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

export default function Onboarding() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("");
  const [isLoading, setIsLoading] = useState(false);

const handleCompleteProfile = async () => {
    if (!fullName || !role) {
      alert("Veuillez entrer votre nom complet et choisir un rôle.");
      return;
    }

    setIsLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { error } = await supabase
          .from('profiles')
          .update({
            full_name: fullName,
            role: role,
          })
          .eq('id', user.id);

        if (error) throw error;
        
        // ASTUCE : On force le rechargement complet vers la bonne page
        // Cela garantit que App.tsx relit le profil depuis zéro
        if (role === 'recruiter') {
          window.location.href = "/dashboard-recruiter";
        } else {
          window.location.href = "/dashboard";
        }
      }
    } catch (error) {
      alert("Erreur lors de la sauvegarde du profil.");
      setIsLoading(false); // On arrête le chargement seulement en cas d'erreur
    } 
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 py-8 transition-colors">
      <Card className="w-full max-w-lg border-t-4 border-t-brand-orange shadow-lg dark:bg-slate-900">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-brand-blue dark:text-white">
            Bienvenue sur Ninafe !
          </CardTitle>
          <p className="text-slate-500 dark:text-slate-400">
            Veuillez compléter votre profil pour continuer.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="fullName" className="dark:text-slate-300">Votre Nom Complet</Label>
            <Input 
              id="fullName" 
              placeholder="Ex: Moussa Diallo" 
              className="dark:bg-slate-950 dark:border-slate-700" 
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role" className="dark:text-slate-300">Quel est votre objectif principal ?</Label>
            <Select onValueChange={setRole}>
              <SelectTrigger id="role" className="dark:bg-slate-950 dark:border-slate-700 dark:text-slate-300">
                <SelectValue placeholder="Sélectionnez votre profil" />
              </SelectTrigger>
              <SelectContent className="dark:bg-slate-950 dark:border-slate-700">
                <SelectItem value="candidate">Je cherche un emploi / des missions</SelectItem>
                <SelectItem value="recruiter">Je recrute / J'ai des annonces à publier</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button 
            className="w-full bg-brand-orange hover:bg-orange-600 text-white font-semibold h-10"
            onClick={handleCompleteProfile}
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Accéder à mon tableau de bord
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}