import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Bell, Moon, Sun, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function DashboardHeader({ type = "candidat" }: { type?: "candidat" | "recruteur" }) {
  // Gestion du Mode Sombre
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Ajoute ou enlève la classe 'dark' sur le corps du site
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white dark:bg-slate-950 dark:border-slate-800 transition-colors">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-brand-blue text-brand-orange font-bold text-xl">
            N
          </div>
          <span className="text-xl font-bold text-brand-blue dark:text-white">
            Ninafe 
            <span className="text-xs font-normal text-slate-500 uppercase ml-1">
                {type === "recruteur" ? "Entreprise" : "Candidat"}
            </span>
          </span>
        </Link>

        {/* ACTIONS DROITE */}
        <div className="flex items-center gap-2">
            
            {/* BOUTON MODE SOMBRE */}
            <Button variant="ghost" size="icon" onClick={() => setIsDark(!isDark)} title="Changer le thème">
                {isDark ? (
                    <Sun className="h-5 w-5 text-yellow-500" />
                ) : (
                    <Moon className="h-5 w-5 text-slate-600" />
                )}
            </Button>

            {/* NOTIFICATIONS (Popover) */}
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative">
                        <Bell className="h-5 w-5 text-slate-600 dark:text-slate-300" />
                        {/* Point rouge de notif */}
                        <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-slate-950"></span>
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0 mr-4" align="end">
                    <div className="p-4 border-b font-semibold bg-slate-50 dark:bg-slate-900 dark:border-slate-800">
                        Notifications
                    </div>
                    <div className="p-2 space-y-1 dark:bg-slate-950">
                        <div className="p-3 hover:bg-slate-100 dark:hover:bg-slate-900 rounded cursor-pointer transition-colors">
                            <div className="flex justify-between items-start mb-1">
                                <span className="font-semibold text-sm text-brand-blue dark:text-slate-200">Profil Validé</span>
                                <span className="text-[10px] text-slate-400">Il y a 10 min</span>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Vos documents ont été vérifiés par l'équipe Ninafe.
                            </p>
                        </div>
                        <div className="p-3 hover:bg-slate-100 dark:hover:bg-slate-900 rounded cursor-pointer transition-colors">
                            <div className="flex justify-between items-start mb-1">
                                <span className="font-semibold text-sm text-brand-blue dark:text-slate-200">Nouvelle offre</span>
                                <span className="text-[10px] text-slate-400">Il y a 2h</span>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Une offre "Plombier" correspond à votre profil.
                            </p>
                        </div>
                    </div>
                    <div className="p-2 border-t text-center text-xs text-brand-orange cursor-pointer hover:underline dark:border-slate-800">
                        Tout marquer comme lu
                    </div>
                </PopoverContent>
            </Popover>

            {/* SÉPARATEUR */}
            <div className="h-6 w-[1px] bg-slate-200 dark:bg-slate-800 mx-1"></div>

            {/* BOUTON DÉCONNEXION */}
            <Link to="/login">
                <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30">
                    <LogOut className="mr-2 h-4 w-4" /> 
                    <span className="hidden sm:inline">Déconnexion</span>
                </Button>
            </Link>
        </div>
      </div>
    </header>
  );
}