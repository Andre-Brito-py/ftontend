import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

// Importa SCSS do Tabler diretamente do diretório external
import './styles/tabler.scss'
// Pequenas customizações locais (cores, espaçamentos)
import './styles/overrides.scss'

import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
)