import { createClient } from '@supabase/supabase-js'

// On récupère les clés qu'on a mises dans le fichier .env.local
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY


console.log("URL Supabase :", supabaseUrl);
// Petite sécurité : si les clés manquent, on prévient
if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Il manque les clés Supabase dans le fichier .env.local')
}

// On crée la connexion et on l'exporte pour l'utiliser partout
export const supabase = createClient(supabaseUrl, supabaseAnonKey)