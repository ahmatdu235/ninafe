import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Bell, Moon, Sun, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { supabase } from "@/lib/supabase";

export function DashboardHeader({ type = "candidat" }: { type?: "candidat" | "recruteur" }) {
  const [isDark, setIsDark] = useState(false);
  
  // États pour les notifs
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Gestion Dark Mode
  useEffect(() => {
    if (isDark) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [isDark]);

  // Charger les notifs au démarrage
  useEffect(() => {
    async function fetchNotifications() {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data } = await supabase
            .from('notifications')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(10); // On prend les 10 dernières

        if (data) {
            setNotifications(data);
            setUnreadCount(data.filter(n => !n.is_read).length);
        }
    }
    fetchNotifications();

    // (Optionnel : on pourrait ajouter un "Realtime subscription" ici pour voir la notif arriver en direct sans rafraîchir)
  }, []);

  const markAsRead = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // On met tout en "lu" dans la base
    await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', user.id);
    
    setUnreadCount(0);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white dark:bg-slate-950 dark:border-slate-800 transition-colors">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-brand-blue text-brand-orange font-bold text-xl">N</div>
          <span className="text-xl font-bold text-brand-blue dark:text-white">
            Ninafe <span className="text-xs font-normal text-slate-500 uppercase ml-1">{type === "recruteur" ? "Entreprise" : "Candidat"}</span>
          </span>
        </Link>

        <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => setIsDark(!isDark)}>
                {isDark ? <Sun className="h-5 w-5 text-yellow-500" /> : <Moon className="h-5 w-5 text-slate-600" />}
            </Button>

            {/* NOTIFICATIONS */}
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative" onClick={markAsRead}>
                        <Bell className="h-5 w-5 text-slate-600 dark:text-slate-300" />
                        {unreadCount > 0 && (
                            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-slate-950 animate-pulse"></span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0 mr-4 border-slate-200 dark:border-slate-800" align="end">
                    <div className="p-4 border-b font-semibold bg-slate-50 dark:bg-slate-900 dark:text-white dark:border-slate-800 flex justify-between items-center">
                        Notifications
                        {unreadCount > 0 && <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">{unreadCount} nouvelles</span>}
                    </div>
                    
                    <div className="max-h-[300px] overflow-y-auto dark:bg-slate-950">
                        {notifications.length === 0 ? (
                            <div className="p-8 text-center text-slate-500 dark:text-slate-400 text-sm">
                                Aucune notification pour le moment.
                            </div>
                        ) : (
                            notifications.map((notif) => (
                                <div key={notif.id} className={`p-3 border-b dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors ${!notif.is_read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}>
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="font-semibold text-sm text-brand-blue dark:text-slate-200">{notif.title}</span>
                                        <span className="text-[10px] text-slate-400">{new Date(notif.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                    </div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">{notif.message}</p>
                                </div>
                            ))
                        )}
                    </div>
                </PopoverContent>
            </Popover>

            <div className="h-6 w-[1px] bg-slate-200 dark:bg-slate-800 mx-1"></div>

            <Link to="/login">
                <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30">
                    <LogOut className="mr-2 h-4 w-4" /> <span className="hidden sm:inline">Déconnexion</span>
                </Button>
            </Link>
        </div>
      </div>
    </header>
  );
}