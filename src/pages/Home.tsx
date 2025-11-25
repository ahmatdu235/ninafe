import React, { useState, useEffect } from "react";
import { Search, MapPin, Briefcase, Menu, LogIn, ArrowRight, Moon, Sun, UserPlus, Send, Star, Quote } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Autoplay from "embla-carousel-autoplay";
import { ApplyDialog } from "@/components/ApplyDialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Données Carrousel Hero
const heroSlides = [
  {
    id: 1, title: "Trouvez des artisans qualifiés", description: "Maçons, Plombiers, Électriciens prêts à intervenir.",
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=2000&auto=format&fit=crop"
  },
  {
    id: 2, title: "Experts du Digital & Tech", description: "Développeurs, Graphistes et Techniciens réseau.",
    image: "https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=2000&auto=format&fit=crop"
  },
  {
    id: 3, title: "Transport & Logistique", description: "Chauffeurs et livreurs disponibles immédiatement.",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2000&auto=format&fit=crop"
  },
];

// Données Catégories
const categories = [
  { name: "BTP & Construction", count: 120 },
  { name: "Informatique & Tech", count: 45 },
  { name: "Ménage & Services", count: 80 },
  { name: "Transport & Logistique", count: 60 },
];

// Données Offres
const recentJobs = [
  { id: 1, title: "Développeur Web Full-Stack", company: "Tchad Numérique", location: "N'Djamena (Centre)", type: "CDI", budget: "À négocier", posted: "Il y a 2h", tags: ["React", "Node.js"] },
  { id: 2, title: "Plombier pour chantier résidentiel", company: "Particulier", location: "Moundou", type: "Prestation", budget: "50 000 FCFA", posted: "Il y a 5h", tags: ["Urgent", "BTP"] },
  { id: 3, title: "Assistant(e) Administratif", company: "Cabinet Sahel", location: "Abéché", type: "CDD", budget: "200 000 FCFA/mois", posted: "Il y a 1j", tags: ["Bureautique", "Gestion"] },
];

// --- MISE À JOUR : Données Témoignages (7 avis maintenant) ---
const testimonials = [
  { name: "Fatimer Zara", role: "Recruteuse", text: "Ninafe m'a permis de trouver un comptable en moins de 24h. Le système de vérification des CV est top !" },
  { name: "Mahamat Ali", role: "Électricien Freelance", text: "Grâce à la plateforme, j'ai trouvé 3 chantiers ce mois-ci. C'est simple et efficace." },
  { name: "Sophie D.", role: "Directrice RH", text: "L'interface est moderne et on reçoit des candidatures de qualité. Je recommande." },
  // Nouveaux avis ajoutés :
  { name: "Ibrahim K.", role: "Chef de chantier", text: "J'ai trouvé une équipe de maçons très compétente pour un gros projet à Farcha." },
  { name: "Amina B.", role: "Assistante de direction", text: "Plateforme très intuitive, j'ai postulé à plusieurs offres facilement depuis mon téléphone." },
  { name: "Moussa D.", role: "Gérant PME", text: "Le vivier de talents est impressionnant. Un gain de temps énorme pour nos recrutements." },
  { name: "Clarisse S.", role: "Freelance Marketing", text: "Mes meilleures missions viennent de Ninafe ces derniers mois. Les clients sont sérieux." },
];

export default function Home() {
  // Plugin pour le carrousel du haut (Hero)
  const heroPlugin = React.useRef(Autoplay({ delay: 4000, stopOnInteraction: true }));
  
  // --- MISE À JOUR : Nouveau plugin indépendant pour les témoignages ---
  // On met un délai un peu différent (5s) pour que ça ne bouge pas exactement en même temps
  const testimonialPlugin = React.useRef(Autoplay({ delay: 5000, stopOnInteraction: true }));

  const navigate = useNavigate();
  const [query, setQuery] = useState(""); 
  const [location, setLocation] = useState(""); 
  const [isDark, setIsDark] = useState(() => localStorage.getItem("theme") === "dark");

  useEffect(() => {
    if (isDark) { document.documentElement.classList.add("dark"); localStorage.setItem("theme", "dark"); }
    else { document.documentElement.classList.remove("dark"); localStorage.setItem("theme", "light"); }
  }, [isDark]);

  const handleSearch = () => { navigate(`/search?q=${query}&loc=${location}`); };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 transition-colors">
      
      {/* HEADER */}
      <header className="sticky top-0 z-50 w-full border-b bg-white dark:bg-slate-950 dark:border-slate-800 shadow-sm transition-colors">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <Link to="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="Logo Ninafe" className="h-10 w-auto object-contain hidden" onError={(e) => e.currentTarget.style.display = 'none'} onLoad={(e) => e.currentTarget.classList.remove('hidden')} />
            <div className="flex items-center gap-2 logo-fallback">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-brand-blue text-brand-orange font-bold text-xl">N</div>
                <span className="text-xl font-bold tracking-tight text-brand-blue dark:text-white">Ninafe</span>
            </div>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/search" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-brand-blue dark:hover:text-white">Trouver un service</Link>
            <Link to="/search" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-brand-blue dark:hover:text-white">Offres d'emploi</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => setIsDark(!isDark)}>{isDark ? <Sun className="h-5 w-5 text-yellow-500" /> : <Moon className="h-5 w-5 text-slate-600" />}</Button>
            <Link to="/login"><Button variant="ghost" className="hidden md:flex text-slate-600 dark:text-slate-300 dark:hover:text-white">Se connecter</Button></Link>
            <Link to="/post-job"><Button className="hidden md:flex bg-brand-orange hover:bg-orange-600 text-white"><Briefcase className="mr-2 h-4 w-4" /> Publier une annonce</Button></Link>
            <Sheet>
              <SheetTrigger asChild><Button variant="ghost" size="icon" className="md:hidden dark:text-slate-200"><Menu className="h-6 w-6" /></Button></SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px] dark:bg-slate-950 dark:border-slate-800">
                <div className="flex flex-col gap-6 mt-6">
                  <div className="flex items-center gap-2 mb-4"><div className="flex h-8 w-8 items-center justify-center rounded-md bg-brand-blue text-brand-orange font-bold text-xl">N</div><span className="text-xl font-bold text-brand-blue dark:text-white">Ninafe</span></div>
                  <nav className="flex flex-col gap-4">
                    <Link to="/search" className="text-lg font-medium text-slate-700 dark:text-slate-300">Trouver un service</Link>
                    <Link to="/search" className="text-lg font-medium text-slate-700 dark:text-slate-300">Offres d'emploi</Link>
                    <Link to="/dashboard" className="text-lg font-medium text-slate-700 dark:text-slate-300">Mon Tableau de bord</Link>
                  </nav>
                  <div className="h-[1px] bg-slate-200 dark:bg-slate-800 w-full my-2"></div>
                  <div className="flex flex-col gap-3">
                    <Link to="/post-job"><Button className="w-full bg-brand-orange hover:bg-orange-600 text-white"><Briefcase className="mr-2 h-4 w-4" /> Publier une annonce</Button></Link>
                    <Link to="/login"><Button variant="outline" className="w-full border-brand-blue text-brand-blue dark:border-slate-700 dark:text-slate-300"><LogIn className="mr-2 h-4 w-4" /> Se connecter</Button></Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main>
        {/* HERO CAROUSEL */}
        <section className="bg-brand-blue dark:bg-slate-900 pt-12 pb-24 md:pt-20 md:pb-32 relative overflow-hidden transition-colors">
          <div className="container px-4 md:px-6 mx-auto relative z-10">
            <div className="text-center mb-10">
              <h1 className="text-3xl font-extrabold tracking-tighter text-white sm:text-4xl md:text-5xl lg:text-6xl mb-4">
                Le réseau des compétences <br className="hidden sm:inline" /> <span className="text-brand-orange">au Tchad.</span>
              </h1>
              <p className="mx-auto max-w-[700px] text-slate-300 md:text-xl">De N'Djamena à Sarh, trouvez le bon expert ou le job idéal.</p>
            </div>
            <div className="mx-auto mb-16 flex max-w-3xl flex-col gap-2 rounded-lg bg-white dark:bg-slate-800 p-2 shadow-lg sm:flex-row items-center transition-colors">
              <div className="relative flex-1 w-full"><Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" /><Input placeholder="Que recherchez-vous ?" className="pl-10 border-0 focus-visible:ring-0 shadow-none text-base h-12 dark:bg-slate-800 dark:text-white" onChange={(e) => setQuery(e.target.value)} /></div>
              <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-700 hidden sm:block"></div>
              <div className="relative flex-1 w-full"><MapPin className="absolute left-3 top-3 h-5 w-5 text-slate-400" /><Input placeholder="Ville (ex: N'Djamena)" className="pl-10 border-0 focus-visible:ring-0 shadow-none text-base h-12 dark:bg-slate-800 dark:text-white" onChange={(e) => setLocation(e.target.value)} /></div>
              <Button onClick={handleSearch} className="w-full sm:w-auto h-12 px-8 bg-brand-orange hover:bg-orange-600 text-white font-semibold text-lg">Rechercher</Button>
            </div>
            <div className="mx-auto max-w-5xl">
                {/* Utilisation de heroPlugin ici */}
                <Carousel plugins={[heroPlugin.current]} className="w-full" onMouseEnter={heroPlugin.current.stop} onMouseLeave={heroPlugin.current.reset}>
                    <CarouselContent>
                        {heroSlides.map((slide) => (
                            <CarouselItem key={slide.id} className="md:basis-1/2 lg:basis-1/3 p-2">
                                <div className="p-1 h-full">
                                    <Card className="h-full border-none shadow-xl overflow-hidden bg-slate-900/50 backdrop-blur-sm text-white">
                                        <div className="relative h-40 w-full overflow-hidden"><img src={slide.image} alt={slide.title} className="object-cover w-full h-full transition-transform hover:scale-105 duration-500" /><div className="absolute inset-0 bg-black/20"></div></div>
                                        <CardHeader><CardTitle className="text-lg font-bold text-white">{slide.title}</CardTitle><CardDescription className="text-slate-300">{slide.description}</CardDescription></CardHeader>
                                        <CardFooter><Link to="/search" className="text-sm font-medium text-brand-orange hover:text-white flex items-center">Découvrir <ArrowRight className="ml-1 h-4 w-4" /></Link></CardFooter>
                                    </Card>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>
            </div>
          </div>
        </section>

        {/* CATÉGORIES */}
        <section className="py-12 bg-white dark:bg-slate-950 transition-colors">
          <div className="container px-4 mx-auto">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Catégories populaires</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categories.map((cat) => (
                <Link key={cat.name} to="/search" className="group flex flex-col items-center justify-center rounded-lg border border-slate-200 bg-slate-50 p-6 transition-colors hover:border-brand-orange hover:bg-orange-50 dark:bg-slate-900 dark:border-slate-800 dark:hover:border-brand-orange/50 dark:hover:bg-slate-900">
                  <span className="font-semibold text-slate-700 dark:text-slate-200 group-hover:text-brand-orange text-center">{cat.name}</span>
                  <span className="text-sm text-slate-500 mt-1">{cat.count} offres</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* COMMENT ÇA MARCHE */}
        <section className="py-16 bg-slate-50 dark:bg-slate-900 transition-colors">
            <div className="container px-4 mx-auto text-center">
                <h2 className="text-3xl font-bold text-brand-blue dark:text-white mb-12">Comment ça marche ?</h2>
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="flex flex-col items-center">
                        <div className="h-16 w-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-brand-blue dark:text-blue-200 mb-4">
                            <UserPlus className="h-8 w-8" />
                        </div>
                        <h3 className="text-xl font-bold mb-2 dark:text-white">1. Créez votre profil</h3>
                        <p className="text-slate-600 dark:text-slate-400">Ajoutez votre CV et validez votre identité pour devenir un profil "Vérifié".</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="h-16 w-16 bg-orange-100 dark:bg-orange-900/50 rounded-full flex items-center justify-center text-brand-orange mb-4">
                            <Search className="h-8 w-8" />
                        </div>
                        <h3 className="text-xl font-bold mb-2 dark:text-white">2. Trouvez une offre</h3>
                        <p className="text-slate-600 dark:text-slate-400">Parcourez des centaines d'offres d'emploi ou de missions freelance.</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="h-16 w-16 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center text-green-600 dark:text-green-400 mb-4">
                            <Send className="h-8 w-8" />
                        </div>
                        <h3 className="text-xl font-bold mb-2 dark:text-white">3. Postulez en 1 clic</h3>
                        <p className="text-slate-600 dark:text-slate-400">Envoyez votre candidature directement aux recruteurs via la plateforme.</p>
                    </div>
                </div>
            </div>
        </section>

        {/* OFFRES */}
        <section className="py-12 bg-white dark:bg-slate-950 transition-colors">
          <div className="container px-4 mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Dernières offres au Tchad</h2>
              <Link to="/search" className="text-brand-orange font-medium hover:underline">Voir tout &rarr;</Link>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {recentJobs.map((job) => (
                <Card key={job.id} className="hover:shadow-md transition-shadow border-slate-200 dark:bg-slate-950 dark:border-slate-800">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <Badge variant="outline" className="mb-2 bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-950 dark:text-slate-300 dark:border-slate-700">{job.type}</Badge>
                      <span className="text-xs text-slate-400">{job.posted}</span>
                    </div>
                    <CardTitle className="text-lg text-brand-blue dark:text-slate-200 line-clamp-1">{job.title}</CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-1 dark:text-slate-400"><MapPin className="h-3 w-3" /> {job.location}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{job.company}</p>
                    <p className="text-sm text-slate-600 font-semibold text-brand-orange">{job.budget}</p>
                  </CardContent>
                  <CardFooter className="flex gap-2 flex-wrap border-t pt-4 dark:border-slate-800">
                    {job.tags.map((tag) => (<Badge key={tag} variant="secondary" className="text-xs font-normal dark:bg-slate-800 dark:text-slate-300">{tag}</Badge>))}
                    <ApplyDialog jobTitle={job.title} companyName={job.company} />
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* --- MISE À JOUR : TÉMOIGNAGES EN CARROUSEL --- */}
        <section className="py-16 bg-slate-50 dark:bg-slate-900 transition-colors overflow-hidden">
            <div className="container px-4 mx-auto">
                <h2 className="text-2xl font-bold text-center text-slate-900 dark:text-white mb-10">Ce que disent nos utilisateurs</h2>
                
                {/* Conteneur pour limiter la largeur du carrousel */}
                <div className="mx-auto max-w-6xl px-4">
                  <Carousel 
                      // Utilisation du nouveau plugin dédié aux témoignages
                      plugins={[testimonialPlugin.current]} 
                      className="w-full" 
                      onMouseEnter={testimonialPlugin.current.stop} 
                      onMouseLeave={testimonialPlugin.current.reset}
                      opts={{
                        align: "start",
                        loop: true,
                      }}
                  >
                      {/* Ajout d'une marge négative pour gérer l'espacement entre les slides */}
                      <CarouselContent className="-ml-4">
                          {testimonials.map((t, i) => (
                              // Ajustement des bases : 1 carte sur mobile, 2 sur tablette, 3 sur grand écran
                              <CarouselItem key={i} className="pl-4 md:basis-1/2 lg:basis-1/3">
                                  <Card className="h-full dark:bg-slate-950 dark:border-slate-800 flex flex-col justify-between">
                                      <CardContent className="p-6 flex-1">
                                          <Quote className="h-8 w-8 text-brand-orange/30 mb-4" />
                                          <p className="text-slate-600 dark:text-slate-300 italic mb-6">"{t.text}"</p>
                                      </CardContent>
                                      <CardFooter className="p-6 pt-0 flex items-center gap-4">
                                        <Avatar>
                                            <AvatarImage src={`https://i.pravatar.cc/150?u=${i + 10}`} />
                                            <AvatarFallback>{t.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-bold text-sm dark:text-white">{t.name}</p>
                                            <p className="text-xs text-slate-500">{t.role}</p>
                                        </div>
                                        <div className="ml-auto flex text-yellow-400">
                                            {[...Array(5)].map((_, i) => <Star key={i} className="h-3 w-3 fill-current" />)}
                                        </div>
                                      </CardFooter>
                                  </Card>
                              </CarouselItem>
                          ))}
                      </CarouselContent>
                      {/* Tu peux décommenter ces lignes si tu veux ajouter des flèches de navigation */}
                      {/* <CarouselPrevious className="hidden md:flex" /> */}
                      {/* <CarouselNext className="hidden md:flex" /> */}
                  </Carousel>
                </div>
            </div>
        </section>

        {/* FOOTER */}
        <footer className="bg-slate-900 text-slate-300 py-12">
            <div className="container mx-auto px-4 grid md:grid-cols-4 gap-8 text-sm">
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-white text-brand-blue font-bold text-xl">N</div>
                        <span className="text-xl font-bold text-white">Ninafe</span>
                    </div>
                    <p className="text-slate-400">Le premier réseau professionnel dédié au Tchad. Connecter les talents, bâtir l'avenir.</p>
                </div>
                <div>
                    <h4 className="font-bold text-white mb-4">Candidats</h4>
                    <ul className="space-y-2">
                        <li><Link to="/search" className="hover:text-brand-orange">Trouver un emploi</Link></li>
                        <li><Link to="/register" className="hover:text-brand-orange">Créer un compte</Link></li>
                        <li><Link to="/search" className="hover:text-brand-orange">Liste des entreprises</Link></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold text-white mb-4">Entreprises</h4>
                    <ul className="space-y-2">
                        <li><Link to="/post-job" className="hover:text-brand-orange">Publier une annonce</Link></li>
                        <li><Link to="/search" className="hover:text-brand-orange">CVthèque</Link></li>
                        <li><Link to="/login" className="hover:text-brand-orange">Connexion Recruteur</Link></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold text-white mb-4">Contact</h4>
                    <ul className="space-y-2">
                        <li>N'Djamena, Tchad</li>
                        <li>support@ninafe.td</li>
                        <li>+235 66 00 00 00</li>
                    </ul>
                </div>
            </div>
            <div className="container mx-auto px-4 mt-8 pt-8 border-t border-slate-800 text-center text-slate-500 text-xs">
                &copy; 2024 Ninafe Tchad. Tous droits réservés.
            </div>
        </footer>
      </main>
    </div>
  );
}