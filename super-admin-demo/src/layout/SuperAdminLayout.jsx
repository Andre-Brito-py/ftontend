import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Sidebar from '../components/Sidebar.jsx'

export default function SuperAdminLayout({ children }) {
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
      document.documentElement.setAttribute('data-bs-theme', theme === 'dark' ? 'dark' : 'light')
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', theme)
    }
  }, [theme])

  const sidebarWidth = collapsed ? '76px' : '280px'

  return (
    <div className="page">
      {/* Logo Zappy no canto superior esquerdo acima da sidebar */}
      <div className="super-admin-logo" style={{
        position: 'fixed',
        top: '1rem',
        left: '1rem',
        zIndex: 1040,
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
      }}>
        <img 
          src="/logos/zappy.svg" 
          alt="Zappy" 
          style={{ 
            height: '40px', 
            width: 'auto',
            filter: theme === 'dark' ? 'brightness(0.8)' : 'none'
          }} 
        />
        <span style={{ 
          fontWeight: 600, 
          fontSize: '1.1rem',
          color: theme === 'dark' ? '#ffffff' : '#2c3e50'
        }}>
          Super Admin
        </span>
      </div>

      <header className="navbar navbar-expand-md d-print-none">
        <div className="container-xl">
          <div className="d-none d-md-flex align-items-center me-3">
            <div className="btn-list">
              <button className="btn" onClick={() => setCollapsed((c) => !c)} title="Recuar sidebar">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6h16M4 12h10M4 18h16"/></svg>
              </button>
            </div>
          </div>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbar-menu">
            <span className="navbar-toggler-icon"></span>
          </button>
          <h1 className="navbar-brand navbar-brand-autodark">
            <Link to="/" className="d-flex align-items-center gap-2">
              <span>Dashboard</span>
            </Link>
          </h1>
          
          {/* Botão Modo Noturno no header */}
          <div className="navbar-nav flex-row order-md-last">
            <div className="nav-item d-none d-md-flex me-3">
              <button 
                className="btn btn-icon" 
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} 
                title={theme === 'dark' ? 'Ativar modo claro' : 'Ativar modo escuro'}
                style={{
                  backgroundColor: theme === 'dark' ? '#34495e' : '#f8f9fa',
                  border: '1px solid',
                  borderColor: theme === 'dark' ? '#495057' : '#dee2e6',
                  borderRadius: '0.375rem',
                  padding: '0.5rem',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = theme === 'dark' ? '#495057' : '#e9ecef'
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = theme === 'dark' ? '#34495e' : '#f8f9fa'
                }}
              >
                {theme === 'dark' ? (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: '#f1c40f' }}>
                    <circle cx="12" cy="12" r="4"/>
                    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: '#2c3e50' }}>
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="collapse navbar-collapse" id="navbar-menu">
            <div className="d-flex flex-column flex-md-row flex-fill align-items-stretch align-items-md-center">
              <ul className="navbar-nav">
                <li className="nav-item"><Link className="nav-link" to="/">Dashboard</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/lojas">Lojas</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/usuarios">Usuários</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/apis">APIs</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </header>
      <Sidebar collapsed={collapsed} />
      <div className="page-wrapper" style={{ marginLeft: sidebarWidth }}>
        {children}
      </div>
    </div>
  )
}