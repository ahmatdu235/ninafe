import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { Loader2, Paperclip } from "lucide-react"

// Ce composant accepte le titre du job et le nom de l'entreprise comme "props"
export function ApplyDialog({ jobTitle, companyName }: { jobTitle: string, companyName: string }) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault() // Empêche la page de se recharger
    setIsLoading(true)

    // On simule l'envoi pendant 1.5 secondes
    setTimeout(() => {
        setIsLoading(false)
        setOpen(false) // On ferme la fenêtre
        alert(`Candidature envoyée avec succès pour : ${jobTitle} !`)
    }, 1500)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* Le bouton qui ouvre la fenêtre */}
      <DialogTrigger asChild>
        <Button size="sm" className="ml-auto bg-brand-blue text-white hover:bg-slate-800">
            Postuler
        </Button>
      </DialogTrigger>
      
      {/* Le contenu de la fenêtre */}
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Postuler : {jobTitle}</DialogTitle>
          <DialogDescription>
            Envoyez votre candidature à <span className="font-semibold">{companyName}</span>.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          
          {/* Ligne Nom + Email */}
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
                <Label htmlFor="name">Nom complet</Label>
                <Input id="name" placeholder="Moussa Diallo" required />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="moussa@exemple.com" required />
            </div>
          </div>

          {/* --- NOUVEAU : UPLOAD DU CV --- */}
          <div className="grid gap-2">
            <Label htmlFor="cv" className="flex items-center gap-2">
                Votre CV (PDF ou Word) <span className="text-red-500">*</span>
            </Label>
            <Input 
                id="cv" 
                type="file" 
                accept=".pdf,.doc,.docx" 
                className="cursor-pointer file:text-brand-blue file:font-semibold hover:bg-slate-50"
                required 
            />
            <p className="text-xs text-slate-500">Formats acceptés : .pdf, .doc, .docx (Max 5Mo)</p>
          </div>

          {/* --- NOUVEAU : PORTFOLIO FACULTATIF --- */}
          <div className="grid gap-2">
            <Label htmlFor="portfolio">Lien Portfolio / Site Web <span className="text-slate-400 font-normal">(Facultatif)</span></Label>
            <div className="relative">
                <Paperclip className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input id="portfolio" className="pl-9" placeholder="https://mon-portfolio.com" />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="message">Message de motivation</Label>
            <Textarea id="message" placeholder="Bonjour, je suis très intéressé par ce poste car..." className="min-h-[100px]" required />
          </div>
          
          <DialogFooter>
            <Button type="submit" disabled={isLoading} className="bg-brand-orange text-white hover:bg-orange-600 w-full text-lg h-12">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Envoyer ma candidature
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}