import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogOut, User, Menu, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { supabase } from "@/lib/supabase";
import { ModeToggle } from "@/components/mode-toggle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

// Ajout de la prop unreadNotifications
interface DashboardHeaderProps {
  type: "candidat" | "recruteur";
  unreadNotifications?: number; // Nouveau
}

export function DashboardHeader({ type, unreadNotifications = 0 }: DashboardHeaderProps) {
  const navigate = useNavigate();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const navItems = [
    { name: type === "recruteur" ? "Tableau de Bord" : "Dashboard", path: type === "recruteur" ? "/dashboard-recruiter" : "/dashboard", icon: <User className="h-4 w-4" /> },
    { name: "Rechercher des profils", path: "/search", icon: <User className="h-4 w-4" /> },
    { name: "Messages", path: "/messages", icon: <User className="h-4 w-4" /> },
    ...(type === "candidat" ? [{ name: "Mes favoris", path: "/favorites", icon: <User className="h-4 w-4" /> }] : []),
    ...(type === "recruteur" ? [{ name: "Publier une annonce", path: "/post-job", icon: <User className="h-4 w-4" /> }] : []),
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-slate-200 dark:bg-slate-900 dark:border-slate-800 shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-brand-blue text-brand-orange font-bold text-lg">
                N
            </div>
            <span className="font-bold text-xl text-brand-blue dark:text-white hidden sm:inline">Ninafe</span>
        </Link>
        
        {/* Menu Principal (Desktop) */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/search" className="text-sm font-medium text-slate-600 hover:text-brand-blue dark:text-slate-300 dark:hover:text-brand-orange transition-colors">Rechercher</Link>
          <Link to="/messages" className="text-sm font-medium text-slate-600 hover:text-brand-blue dark:text-slate-300 dark:hover:text-brand-orange transition-colors">Messages</Link>
          {type === "recruteur" ? (
            <Link to="/post-job">
              <Button size="sm" className="bg-brand-orange hover:bg-orange-600 text-white">
                Publier
              </Button>
            </Link>
          ) : (
             <Link to="/favorites" className="text-sm font-medium text-slate-600 hover:text-brand-blue dark:text-slate-300 dark:hover:text-brand-orange transition-colors">Favoris</Link>
          )}
        </nav>
        
        {/* Actions (Toggles & Profil) */}
        <div className="flex items-center space-x-3">
          
          {/* Icône de Notification avec Badge */}
          {type === "recruteur" && (
            <Link to="/job-candidates/1" className="relative cursor-pointer text-slate-600 dark:text-slate-300 hover:text-brand-orange" title="Nouvelles Candidatures">
                <Bell className="h-5 w-5" />
                {unreadNotifications > 0 && (
                    // Ce badge affiche le nombre réel de notifications non lues
                    <Badge variant="destructive" className="absolute top-[-5px] right-[-5px] h-4 w-4 p-0 flex items-center justify-center rounded-full text-xs">
                        {unreadNotifications}
                    </Badge>
                )}
            </Link>
          )}

          <ModeToggle />

          <Link to={type === "recruteur" ? "/dashboard-recruiter" : "/dashboard"}>
            <Avatar className="h-8 w-8 border-2 border-brand-blue dark:border-brand-orange cursor-pointer">
              <AvatarFallback className="bg-brand-blue/10 text-brand-blue dark:bg-brand-orange/10 dark:text-brand-orange font-bold">
                {type === "recruteur" ? "R" : "C"}
              </AvatarFallback>
            </Avatar>
          </Link>
          
          <Button variant="ghost" size="icon" onClick={handleLogout} className="text-slate-500 hover:text-red-500 dark:text-slate-400 dark:hover:text-red-400 hidden sm:flex">
            <LogOut className="h-5 w-5" />
          </Button>

          {/* Menu Mobile */}
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden dark:text-white">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] dark:bg-slate-900 dark:border-slate-800">
              <SheetHeader>
                <SheetTitle className="text-2xl font-bold text-brand-blue dark:text-white">Navigation</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-4 mt-8">
                {navItems.map((item) => (
                  <Link 
                    key={item.path} 
                    to={item.path} 
                    onClick={() => setIsSheetOpen(false)}
                    className="flex items-center gap-3 text-lg font-medium text-slate-700 dark:text-slate-300 hover:text-brand-orange dark:hover:text-brand-orange transition-colors border-b dark:border-slate-800 pb-2"
                  >
                    {item.icon} {item.name}
                  </Link>
                ))}
                <Button 
                    variant="ghost" 
                    onClick={handleLogout} 
                    className="flex items-center gap-3 text-lg font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 mt-4 justify-start"
                >
                    <LogOut className="h-4 w-4" /> Déconnexion
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}