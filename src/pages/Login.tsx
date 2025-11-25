import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const handleLogin = () => {
    // Simulation existante : Recruteur ou Candidat selon l'email
    if (email === "recruteur@ninafe.com") {
      navigate("/dashboard-recruiter");
    } else {
      navigate("/dashboard");
    }
  };

  const handleGoogleLogin = () => {
    // Simulation de la connexion Google
    // Plus tard : supabase.auth.signInWithOAuth(...)
    navigate("/dashboard");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 transition-colors">
      <Card className="w-full max-w-md border-slate-200 dark:border-slate-800 shadow-lg dark:bg-slate-900">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-brand-blue text-brand-orange font-bold text-2xl">
              N
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-brand-blue dark:text-white">
            Connexion
          </CardTitle>
          <CardDescription className="dark:text-slate-400">
            Entrez vos identifiants pour accéder à votre espace Ninafe.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          
          {/* --- BOUTON GOOGLE --- */}
          <Button variant="outline" className="w-full dark:bg-slate-950 dark:text-white dark:border-slate-700" onClick={handleGoogleLogin}>
            <Icons.google className="mr-2 h-4 w-4" />
            Continuer avec Google
          </Button>

          {/* --- SÉPARATEUR --- */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-200 dark:border-slate-700" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white dark:bg-slate-900 px-2 text-slate-500 dark:text-slate-400">
                Ou continuer avec email
              </span>
            </div>
          </div>

          {/* --- FORMULAIRE --- */}
          <div className="space-y-2">
            <Label htmlFor="email" className="dark:text-slate-300">Email</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="exemple@gmail.com" 
              className="dark:bg-slate-950 dark:border-slate-700"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="dark:text-slate-300">Mot de passe</Label>
              <Link
                to="#"
                className="text-sm font-medium text-brand-orange hover:underline"
              >
                Oublié ?
              </Link>
            </div>
            <Input id="password" type="password" className="dark:bg-slate-950 dark:border-slate-700" />
          </div>
          
          <Button 
            className="w-full bg-brand-blue hover:bg-slate-800 text-white font-semibold"
            onClick={handleLogin}
          >
            Se connecter
          </Button>
        </CardContent>
        <CardFooter className="flex justify-center border-t dark:border-slate-800 p-4 pt-6">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Pas encore de compte ?{" "}
            <Link to="/register" className="font-semibold text-brand-orange hover:underline">
              S'inscrire
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

const Icons = {
  google: (props: React.SVGProps<SVGSVGElement>) => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fill="currentColor"
        d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
      />
    </svg>
  ),
}