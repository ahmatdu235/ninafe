import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Moon, Sun, Menu, Briefcase, LogOut, User, Heart, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { supabase } from "@/lib/supabase";

interface AppHeaderProps {
    isLoggedIn: boolean;
    userRole: string | null;
    isDark: boolean;
    setIsDark: (dark: boolean) => void;
}

export function AppHeader({ isLoggedIn, userRole, isDark, setIsDark }: AppHeaderProps) {
    const navigate = useNavigate();
    const [isSheetOpen, setIsSheetOpen] = useState(false);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate("/");
    };

    const dashboardPath = userRole === 'recruiter' ? "/dashboard-recruiter" : "/dashboard";

    const renderActionButtons = () => {
        if (isLoggedIn) {
            return (
                <div className="flex items-center gap-3">
                    <Link to={dashboardPath}>
                        <Button variant="outline" size="sm" className="hidden md:flex dark:bg-slate-800 dark:text-white dark:border-slate-700">
                            <User className="mr-2 h-4 w-4" /> Mon Espace
                        </Button>
                    </Link>
                    <Button variant="ghost" size="icon" onClick={handleLogout} className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 hidden sm:flex">
                        <LogOut className="h-5 w-5" />
                    </Button>
                </div>
            );
        }
        return (
            <div className="flex items-center gap-2">
                <Link to="/login"><Button variant="ghost" className="text-slate-600 dark:text-slate-300 dark:hover:text-white">Se connecter</Button></Link>
                <Link to="/register"><Button className="bg-brand-orange hover:bg-orange-600 text-white">S'inscrire</Button></Link>
            </div>
        );
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-white dark:bg-slate-950 dark:border-slate-800 shadow-sm transition-colors">
            <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
                
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-brand-blue text-brand-orange font-bold text-xl">N</div>
                    <span className="text-xl font-bold tracking-tight text-brand-blue dark:text-white">Ninafe</span>
                </Link>

                {/* Navigation Desktop */}
                <nav className="hidden md:flex items-center gap-6">
                    <Link to="/search" className="text-sm font-medium dark:text-slate-300 hover:text-brand-orange">Trouver un service</Link>
                    <Link to="/post-job" className="text-sm font-medium dark:text-slate-300 hover:text-brand-orange">Publier une offre</Link>
                    {isLoggedIn && (
                        <Link to="/messages" className="text-sm font-medium dark:text-slate-300 hover:text-brand-orange">Messages</Link>
                    )}
                </nav>

                {/* Actions Droite */}
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" onClick={() => setIsDark(!isDark)}>
                        {isDark ? <Sun className="h-5 w-5 text-yellow-500" /> : <Moon className="h-5 w-5 text-slate-600" />}
                    </Button>
                    
                    {/* Boutons (Desktop) */}
                    <div className="hidden sm:flex">
                        {renderActionButtons()}
                    </div>

                    {/* Menu Mobile */}
                    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="sm:hidden dark:text-white"><Menu className="h-6 w-6" /></Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-[300px] dark:bg-slate-950 dark:border-slate-800">
                           <nav className="flex flex-col gap-4 mt-8">
                                <Link to={dashboardPath} onClick={() => setIsSheetOpen(false)} className="text-lg font-medium text-brand-blue dark:text-white border-b dark:border-slate-800 pb-2">
                                    <span className="flex items-center gap-2"><User className="h-5 w-5" /> Mon Espace</span>
                                </Link>
                                <Link to="/search" onClick={() => setIsSheetOpen(false)} className="text-lg font-medium text-slate-700 dark:text-slate-300 hover:text-brand-orange">Rechercher</Link>
                                <Link to="/messages" onClick={() => setIsSheetOpen(false)} className="text-lg font-medium text-slate-700 dark:text-slate-300 hover:text-brand-orange">Messages</Link>
                                <Link to="/favorites" onClick={() => setIsSheetOpen(false)} className="text-lg font-medium text-slate-700 dark:text-slate-300 hover:text-brand-orange">Favoris</Link>

                                <div className="mt-6 space-y-3 pt-6 border-t dark:border-slate-800">
                                    {isLoggedIn ? (
                                        <Button className="w-full bg-red-600 hover:bg-red-700 text-white" onClick={handleLogout}>
                                            <LogOut className="mr-2 h-4 w-4" /> Déconnexion
                                        </Button>
                                    ) : (
                                        <>
                                            <Link to="/register"><Button className="w-full bg-brand-orange hover:bg-orange-600 text-white">S'inscrire</Button></Link>
                                            <Link to="/login"><Button variant="outline" className="w-full border-brand-blue text-brand-blue dark:text-slate-300">Se connecter</Button></Link>
                                        </>
                                    )}
                                </div>
                           </nav>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    );
}