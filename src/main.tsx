// DANS src/main.tsx (Remplace TOUT le contenu)
import React from 'react'
import ReactDOM from 'react-dom/client'
// Importe explicitement le composant App
import { default as App } from './App.tsx' 
import './index.css'
import { BrowserRouter } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)