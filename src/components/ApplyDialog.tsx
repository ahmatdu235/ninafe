import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Loader2, Paperclip } from "lucide-react";
import { supabase } from "@/lib/supabase"; // Connexion

// On ajoute l'ID du job dans les props pour savoir à quoi on postule
export function ApplyDialog({ jobTitle, companyName, jobId }: { jobTitle: string, companyName: string, jobId: number }) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Champs du formulaire
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [portfolio, setPortfolio] = useState("");
  const [cvFile, setCvFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cvFile || !fullName || !email || !message) {
        alert("Veuillez remplir tous les champs obligatoires.");
        return;
    }

    setIsLoading(true);

    try {
        // 1. Récupérer l'ID de l'utilisateur connecté
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Vous devez être connecté pour postuler.");

        // 2. Uploader le CV
        const fileExt = cvFile.name.split('.').pop();
        const filePath = `${user.id}/cv_application_${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
            .from('documents')
            .upload(filePath, cvFile);

        if (uploadError) throw uploadError;

        // Récupérer l'URL publique du CV
        const { data: { publicUrl } } = supabase.storage
            .from('documents')
            .getPublicUrl(filePath);

        // 3. Créer la candidature dans la base de données
        const { error: dbError } = await supabase
            .from('applications')
            .insert({
                job_id: jobId,
                candidate_id: user.id,
                full_name: fullName,
                email: email,
                message: message,
                portfolio_url: portfolio,
                cv_url: publicUrl // On stocke le lien du fichier qu'on vient d'uploader
            });

        if (dbError) throw dbError;

        alert(`Candidature envoyée avec succès pour : ${jobTitle} !`);
        setOpen(false);

    } catch (error: any) {
        console.error(error);
        alert("Erreur : " + error.message);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="ml-auto bg-brand-blue text-white hover:bg-slate-800">
            Postuler
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Postuler : {jobTitle}</DialogTitle>
          <DialogDescription>
            Envoyez votre candidature à <span className="font-semibold">{companyName}</span>.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
                <Label htmlFor="name">Nom complet *</Label>
                <Input id="name" required value={fullName} onChange={e => setFullName(e.target.value)} />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="email">Email *</Label>
                <Input id="email" type="email" required value={email} onChange={e => setEmail(e.target.value)} />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="cv" className="flex items-center gap-2">
                Votre CV (PDF/Word) <span className="text-red-500">*</span>
            </Label>
            <Input 
                id="cv" 
                type="file" 
                accept=".pdf,.doc,.docx" 
                className="cursor-pointer"
                required 
                onChange={(e) => e.target.files && setCvFile(e.target.files[0])}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="portfolio">Lien Portfolio (Facultatif)</Label>
            <div className="relative">
                <Paperclip className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input className="pl-9" placeholder="https://..." value={portfolio} onChange={e => setPortfolio(e.target.value)} />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="message">Message de motivation *</Label>
            <Textarea 
                id="message" 
                placeholder="Bonjour, je suis très intéressé..." 
                className="min-h-[100px]" 
                required 
                value={message}
                onChange={e => setMessage(e.target.value)}
            />
          </div>
          
          <DialogFooter>
            <Button type="submit" disabled={isLoading} className="bg-brand-orange text-white hover:bg-orange-600 w-full">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Envoyer ma candidature
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}