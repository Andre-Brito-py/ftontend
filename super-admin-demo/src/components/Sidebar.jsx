import React from 'react'
import { NavLink } from 'react-router-dom'

const items = [
  { to: '/', label: 'Dashboard', icon: (
    <svg xmlns="http://www.w3.org/2000/svg" className="icon" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 13h8V3H3z"/><path d="M13 21h8v-8h-8z"/><path d="M13 3h8v6h-8z"/><path d="M3 21h8v-6H3z"/></svg>
  ) },
  { to: '/lojas', label: 'Lojas', icon: (
    <svg xmlns="http://www.w3.org/2000/svg" className="icon" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 4h16l-2 14H6z"/><path d="M5 8l1 11a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-11"/><path d="M10 12h4"/></svg>
  ) },
  { to: '/usuarios', label: 'Usuários', icon: (
    <svg xmlns="http://www.w3.org/2000/svg" className="icon" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="7" r="4"/><path d="M17 11v-2a4 4 0 1 1 8 0v2" transform="translate(-6,0)"/><path d="M3 21a6 6 0 0 1 12 0"/></svg>
  ) },
  { to: '/apis', label: 'APIs', icon: (
    <svg xmlns="http://www.w3.org/2000/svg" className="icon" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 13h5"/><path d="M12 16v-8h3a2 2 0 0 1 2 2v1a2 2 0 0 1 -2 2h-3"/><path d="M20 8v8"/><path d="M16 12h2"/><path d="M16 16h2"/><path d="M16 8h2"/></svg>
  ) },
  { to: '/analytics', label: 'Analytics', icon: (
    <svg xmlns="http://www.w3.org/2000/svg" className="icon" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="M7 14l5-5 4 4 5-5"/></svg>
  ) },
  { to: '/config', label: 'Configurações', icon: (
    <svg xmlns="http://www.w3.org/2000/svg" className="icon" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1A1.65 1.65 0 0 0 4.27 7l-.06-.06A2 2 0 1 1 7.04 4.1l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9c0 .63.37 1.2.94 1.45.54.23 1.06.55 1.51.94.24.21.55.36.9.36a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
  ) },
  { to: '/logs', label: 'Logs', icon: (
    <svg xmlns="http://www.w3.org/2000/svg" className="icon" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
  ) },
  { to: '/financeiro', label: 'Financeiro', icon: (
    <svg xmlns="http://www.w3.org/2000/svg" className="icon" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
  ) }
]

export default function Sidebar({ collapsed = false }) {
  return (
    <aside className={`navbar navbar-vertical ${collapsed ? 'navbar-vertical-collapsed' : ''}`}>
      <style jsx="true">{`
        aside {
          position: fixed !important;
          top: 0;
          left: 0;
          bottom: 0;
          z-index: 1030;
          width: ${collapsed ? '76px' : '280px'};
          height: 100vh;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          background: inherit;
          padding-bottom: 3rem;
        }
        .sidebar-container {
          display: flex;
          flex-direction: column;
          height: 100%;
          width: 100%;
        }
        .sidebar-scroll {
          flex: 1;
          overflow-y: auto;
          scrollbar-width: thin;
          scrollbar-color: rgba(0,0,0,0.2) transparent;
          padding: 0.5rem 0;
          padding-bottom: 1rem;
        }
        .sidebar-scroll::-webkit-scrollbar {
          width: 4px;
        }
        .sidebar-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .sidebar-scroll::-webkit-scrollbar-thumb {
          background: rgba(0,0,0,0.2);
          border-radius: 2px;
        }
        .nav-link {
          justify-content: flex-start !important;
          text-align: left !important;
          padding-left: 1rem !important;
          padding-right: 1rem !important;
        }
        .nav-link-icon {
          margin-right: 0.75rem !important;
          flex-shrink: 0;
        }
        .nav-link-title {
          word-break: break-word;
        }
      `}</style>
      
      <div className="sidebar-container">
        <div className="sidebar-scroll flex-grow-1">
          <ul className="navbar-nav">
            {items.map((item) => (
              <li className="nav-item" key={item.to}>
                <NavLink to={item.to} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} end>
                  <span className="nav-link-icon">{item.icon}</span>
                  <span className="nav-link-title">{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </aside>
  )
}