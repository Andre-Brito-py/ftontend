import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import '@tabler/core/dist/css/tabler.min.css'
import '@tabler/core/dist/js/tabler.js'
import './styles/theme.scss'
import './i18n';
import { BrowserRouter } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
)
