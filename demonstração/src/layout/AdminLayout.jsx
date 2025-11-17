import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Sidebar from '../components/Sidebar.jsx'

export default function AdminLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false)
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || 'light'
    }
    return 'light'
  })

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', theme)
      // Tabler/Bootstrap 5 usa data-bs-theme para alternar tokens
      document.documentElement.setAttribute('data-bs-theme', theme === 'dark' ? 'dark' : 'light')
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', theme)
    }
  }, [theme])
  const sidebarWidth = collapsed ? '76px' : '280px'
  return (
    <div className="page">
      {/* Navbar topo */}
      <header className="navbar navbar-expand-md d-print-none">
        <div className="container-xl">
          {/* Grupo de ferramentas na esquerda (desktop) */}
          <div className="d-none d-md-flex align-items-center me-3">
            <div className="btn-list">
              {/* Botão para recuar/expandir a sidebar (canto superior esquerdo) */}
              <button className="btn" onClick={() => setCollapsed((c) => !c)} title="Recuar sidebar">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6h16M4 12h10M4 18h16"/></svg>
              </button>
              {/* Botão de modo claro/escuro */}
              <button className="btn" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} title="Alternar tema">
                {theme === 'dark' ? (
                  // Ícone sol
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>
                ) : (
                  // Ícone lua
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
                )}
              </button>
            </div>
          </div>

          {/* Toggler mobile para menu topo */}
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbar-menu">
            <span className="navbar-toggler-icon"></span>
          </button>
          <h1 className="navbar-brand navbar-brand-autodark brand-zappy">
            <Link to="/" className="d-flex align-items-center gap-2">
              <img src="/logos/zappy.svg" alt="Zappy" className="brand-logo" />
            </Link>
          </h1>
          <div className="collapse navbar-collapse" id="navbar-menu">
            <div className="d-flex flex-column flex-md-row flex-fill align-items-stretch align-items-md-center">
              <ul className="navbar-nav">
                <li className="nav-item"><Link className="nav-link" to="/">Dashboard</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/pedidos">Pedidos</Link></li>
                <li className="nav-item"><Link className="nav-link" to="#">Produtos</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar vertical */}
      <Sidebar collapsed={collapsed} />

      <div className="page-wrapper" style={{ marginLeft: sidebarWidth }}>
        {children}
      </div>
    </div>
  )
}