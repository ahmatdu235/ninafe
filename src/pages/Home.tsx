import React, { useState, useEffect } from "react";
import { Search, MapPin, Briefcase, Menu, LogIn, ArrowRight, Moon, Sun, UserPlus, Send, Star, Quote } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Autoplay from "embla-carousel-autoplay";
import { ApplyDialog } from "@/components/ApplyDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/lib/supabase"; // <--- Connexion Supabase

// Données statiques (Carrousel & Catégories)
const heroSlides = [
  { id: 1, title: "Trouvez des artisans qualifiés", description: "Maçons, Plombiers, Électriciens prêts à intervenir.", image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=2000&auto=format&fit=crop" },
  { id: 2, title: "Experts du Digital & Tech", description: "Développeurs, Graphistes et Techniciens réseau.", image: "https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=2000&auto=format&fit=crop" },
  { id: 3, title: "Transport & Logistique", description: "Chauffeurs et livreurs disponibles immédiatement.", image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2000&auto=format&fit=crop" },
];

const categories = [
  { name: "BTP & Construction", count: 120 },
  { name: "Informatique & Tech", count: 45 },
  { name: "Ménage & Services", count: 80 },
  { name: "Transport & Logistique", count: 60 },
];

const testimonials = [
  { name: "Fatimer Zara", role: "Recruteuse", text: "Ninafe m'a permis de trouver un comptable en moins de 24h." },
  { name: "Mahamat Ali", role: "Électricien", text: "Grâce à la plateforme, j'ai trouvé 3 chantiers ce mois-ci." },
  { name: "Sophie D.", role: "Directrice RH", text: "L'interface est moderne et on reçoit des candidatures de qualité." },
  { name: "Ibrahim K.", role: "Chef de chantier", text: "J'ai trouvé une équipe de maçons très compétente." },
];

export default function Home() {
  const heroPlugin = React.useRef(Autoplay({ delay: 4000, stopOnInteraction: true }));
  const testimonialPlugin = React.useRef(Autoplay({ delay: 5000, stopOnInteraction: true }));
  const navigate = useNavigate();
  
  const [query, setQuery] = useState(""); 
  const [location, setLocation] = useState(""); 
  const [isDark, setIsDark] = useState(() => localStorage.getItem("theme") === "dark");
  
  // --- NOUVEAU : ÉTAT POUR LES VRAIES OFFRES ---
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Mode Sombre
    if (isDark) { document.documentElement.classList.add("dark"); localStorage.setItem("theme", "dark"); }
    else { document.documentElement.classList.remove("dark"); localStorage.setItem("theme", "light"); }

    // 2. Récupérer les offres depuis Supabase
    async function fetchJobs() {
        const { data, error } = await supabase
            .from('jobs')
            .select('*')
            .order('created_at', { ascending: false }) // Les plus récentes en premier
            .limit(3); // On en prend juste 3 pour l'accueil

        if (!error && data) {
            setJobs(data);
        }
        setLoading(false);
    }
    fetchJobs();
  }, [isDark]);

  const handleSearch = () => { navigate(`/search?q=${query}&loc=${location}`); };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 transition-colors">
      {/* HEADER (Simplifié pour la lecture, identique avant) */}
      <header className="sticky top-0 z-50 w-full border-b bg-white dark:bg-slate-950 dark:border-slate-800 shadow-sm transition-colors">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-brand-blue text-brand-orange font-bold text-xl">N</div>
            <span className="text-xl font-bold tracking-tight text-brand-blue dark:text-white">Ninafe</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/search" className="text-sm font-medium hover:text-brand-blue dark:hover:text-white">Trouver un service</Link>
            <Link to="/search" className="text-sm font-medium hover:text-brand-blue dark:hover:text-white">Offres d'emploi</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => setIsDark(!isDark)}>{isDark ? <Sun className="h-5 w-5 text-yellow-500" /> : <Moon className="h-5 w-5 text-slate-600" />}</Button>
            <Link to="/login"><Button variant="ghost">Se connecter</Button></Link>
            <Link to="/post-job"><Button className="bg-brand-orange hover:bg-orange-600 text-white"><Briefcase className="mr-2 h-4 w-4" /> Publier</Button></Link>
          </div>
        </div>
      </header>

      <main>
        {/* HERO SECTION (Identique) */}
        <section className="bg-brand-blue dark:bg-slate-900 pt-12 pb-24 relative overflow-hidden transition-colors">
          <div className="container px-4 mx-auto relative z-10">
            <div className="text-center mb-10">
              <h1 className="text-3xl font-extrabold text-white sm:text-5xl mb-4">Le réseau des compétences <span className="text-brand-orange">au Tchad.</span></h1>
            </div>
            <div className="mx-auto mb-16 flex max-w-3xl flex-col gap-2 rounded-lg bg-white dark:bg-slate-800 p-2 shadow-lg sm:flex-row items-center transition-colors">
              <div className="relative flex-1 w-full"><Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" /><Input placeholder="Que recherchez-vous ?" className="pl-10 border-0 shadow-none h-12 dark:bg-slate-800 dark:text-white" onChange={(e) => setQuery(e.target.value)} /></div>
              <div className="relative flex-1 w-full"><MapPin className="absolute left-3 top-3 h-5 w-5 text-slate-400" /><Input placeholder="Ville (ex: N'Djamena)" className="pl-10 border-0 shadow-none h-12 dark:bg-slate-800 dark:text-white" onChange={(e) => setLocation(e.target.value)} /></div>
              <Button onClick={handleSearch} className="w-full sm:w-auto h-12 px-8 bg-brand-orange hover:bg-orange-600 text-white font-semibold text-lg">Rechercher</Button>
            </div>
            <div className="mx-auto max-w-5xl">
                <Carousel plugins={[heroPlugin.current]} className="w-full" onMouseEnter={heroPlugin.current.stop} onMouseLeave={heroPlugin.current.reset}>
                    <CarouselContent>
                        {heroSlides.map((slide) => (
                            <CarouselItem key={slide.id} className="md:basis-1/2 lg:basis-1/3 p-2">
                                <Card className="h-40 border-none shadow-xl overflow-hidden bg-slate-900/50 text-white relative"><img src={slide.image} className="absolute inset-0 object-cover w-full h-full opacity-60" /><CardHeader className="relative z-10"><CardTitle className="text-lg">{slide.title}</CardTitle></CardHeader></Card>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>
            </div>
          </div>
        </section>

        {/* CATÉGORIES (Identique) */}
        <section className="py-12 bg-white dark:bg-slate-950 transition-colors">
          <div className="container px-4 mx-auto">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Catégories populaires</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categories.map((cat) => (
                <Link key={cat.name} to="/search" className="group flex flex-col items-center justify-center rounded-lg border border-slate-200 bg-slate-50 p-6 hover:border-brand-orange dark:bg-slate-900 dark:border-slate-800">
                  <span className="font-semibold text-slate-700 dark:text-slate-200">{cat.name}</span>
                  <span className="text-sm text-slate-500 mt-1">{cat.count} offres</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* --- VRAIES OFFRES (Modifié) --- */}
        <section className="py-12 bg-slate-50 dark:bg-slate-900 transition-colors">
          <div className="container px-4 mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Dernières offres au Tchad</h2>
              <Link to="/search" className="text-brand-orange font-medium hover:underline">Voir tout &rarr;</Link>
            </div>
            
            {loading ? (
                <p className="text-center text-slate-500">Chargement des offres...</p>
            ) : jobs.length === 0 ? (
                <p className="text-center text-slate-500">Aucune offre publiée pour le moment.</p>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {jobs.map((job) => (
                    <Card key={job.id} className="hover:shadow-md transition-shadow border-slate-200 dark:bg-slate-950 dark:border-slate-800">
                    <CardHeader>
                        <div className="flex justify-between items-start">
                        <Badge variant="outline" className="mb-2 bg-slate-100 border-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-700">{job.type}</Badge>
                        <span className="text-xs text-slate-400">Nouveau</span>
                        </div>
                        <CardTitle className="text-lg text-brand-blue dark:text-slate-200 line-clamp-1">{job.title}</CardTitle>
                        <CardDescription className="flex items-center gap-1 mt-1 dark:text-slate-400"><MapPin className="h-3 w-3" /> {job.location}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{job.company_name}</p>
                        <p className="text-sm text-slate-600 font-semibold text-brand-orange">{job.salary || "À discuter"}</p>
                    </CardContent>
                    <CardFooter className="flex gap-2 flex-wrap border-t pt-4 dark:border-slate-800">
                        {/* On affiche les 2 premiers tags seulement pour pas casser l'affichage */}
                        {job.tags && job.tags.slice(0, 2).map((tag: string) => (<Badge key={tag} variant="secondary" className="text-xs font-normal dark:bg-slate-800 dark:text-slate-300">{tag}</Badge>))}
                        <Link to={`/job/${job.id}`} className="ml-auto">
                            <Button size="sm" className="bg-brand-blue text-white hover:bg-slate-800">Voir l'offre</Button>
                        </Link>
                    </CardFooter>
                    </Card>
                ))}
                </div>
            )}
          </div>
        </section>

        {/* TÉMOIGNAGES (Identique) */}
        <section className="py-16 bg-slate-50 dark:bg-slate-900 transition-colors overflow-hidden">
            <div className="container px-4 mx-auto">
                <h2 className="text-2xl font-bold text-center text-slate-900 dark:text-white mb-10">Ce que disent nos utilisateurs</h2>
                <div className="mx-auto max-w-6xl px-4">
                  <Carousel plugins={[testimonialPlugin.current]} className="w-full" onMouseEnter={testimonialPlugin.current.stop} onMouseLeave={testimonialPlugin.current.reset} opts={{ align: "start", loop: true }}>
                      <CarouselContent className="-ml-4">
                          {testimonials.map((t, i) => (
                              <CarouselItem key={i} className="pl-4 md:basis-1/2 lg:basis-1/3">
                                  <Card className="h-full dark:bg-slate-950 dark:border-slate-800 flex flex-col justify-between">
                                      <CardContent className="p-6 flex-1">
                                          <Quote className="h-8 w-8 text-brand-orange/30 mb-4" />
                                          <p className="text-slate-600 dark:text-slate-300 italic mb-6">"{t.text}"</p>
                                      </CardContent>
                                      <CardFooter className="p-6 pt-0 flex items-center gap-4">
                                        <Avatar><AvatarFallback>{t.name.charAt(0)}</AvatarFallback></Avatar>
                                        <div><p className="font-bold text-sm dark:text-white">{t.name}</p><p className="text-xs text-slate-500">{t.role}</p></div>
                                        <div className="ml-auto flex text-yellow-400">{[...Array(5)].map((_, i) => <Star key={i} className="h-3 w-3 fill-current" />)}</div>
                                      </CardFooter>
                                  </Card>
                              </CarouselItem>
                          ))}
                      </CarouselContent>
                  </Carousel>
                </div>
            </div>
        </section>
      </main>
    </div>
  );
}