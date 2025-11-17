import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'

const items = [
  { to: '/', label: 'Dashboard', icon: (
    <svg xmlns="http://www.w3.org/2000/svg" className="icon" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 13h8V3H3z"/><path d="M13 21h8v-8h-8z"/><path d="M13 3h8v6h-8z"/><path d="M3 21h8v-6H3z"/></svg>
  ) },
  { to: '/estatisticas', label: 'Estatísticas', icon: (
    <svg xmlns="http://www.w3.org/2000/svg" className="icon" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="M7 14l5-5 4 4 5-5"/></svg>
  ) },
  { to: '/categorias', label: 'Categorias', icon: (
    <svg xmlns="http://www.w3.org/2000/svg" className="icon" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1"/>
      <rect x="14" y="3" width="7" height="7" rx="1"/>
      <rect x="3" y="14" width="7" height="7" rx="1"/>
      <rect x="14" y="14" width="7" height="7" rx="1"/>
    </svg>
  ) },
  { to: '/pedidos', label: 'Pedidos', icon: (
    <svg xmlns="http://www.w3.org/2000/svg" className="icon" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 4h12l1 4H5z"/><path d="M5 8l1 11a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-11"/><path d="M10 12h4"/></svg>
  ) },
  { to: '/produtos', label: 'Produtos', icon: (
    <svg xmlns="http://www.w3.org/2000/svg" className="icon" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 10h18"/></svg>
  ) },
  { to: '/sugestoes', label: 'Sugestão de Produtos', icon: (
    <svg xmlns="http://www.w3.org/2000/svg" className="icon" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18h6"/><path d="M10 22h4"/><path d="M12 2a7 7 0 0 0-7 7c0 3.5 2.33 5.33 3.5 6.5.34.33.5.8.5 1.27V17h6v-.23c0-.47.16-.94.5-1.27C16.67 14.33 19 12.5 19 9a7 7 0 0 0-7-7z"/></svg>
  ) },
  { to: '/clientes', label: 'Clientes', icon: (
    <svg xmlns="http://www.w3.org/2000/svg" className="icon" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="7" r="4"/><path d="M17 11v-2a4 4 0 1 1 8 0v2" transform="translate(-6,0)"/><path d="M3 21a6 6 0 0 1 12 0"/></svg>
  ) },
  { to: '/mesas', label: 'Mesas', icon: (
    <svg xmlns="http://www.w3.org/2000/svg" className="icon" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 6h16l-2 14H6z"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M8 12h8"/></svg>
  ) },
  { to: '/garcom', label: 'Garçom', icon: (
    <svg xmlns="http://www.w3.org/2000/svg" className="icon" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-6"/><path d="M20 18l-2 2l2 2"/><path d="M4 17v-4"/><path d="M7 13l-2 -2"/><path d="M17 11v-2a2 2 0 0 0 -2 -2h-4a2 2 0 0 0 -2 2v2"/><path d="M17 11h-2.5a1.5 1.5 0 0 1 -1.5 -1.5v-1a1.5 1.5 0 0 1 1.5 -1.5h2.5"/><path d="M7 11h2.5a1.5 1.5 0 0 0 1.5 -1.5v-1a1.5 1.5 0 0 0 -1.5 -1.5h-2.5"/></svg>
  ) },
  { to: '/atendentes', label: 'Atendentes', icon: (
    <svg xmlns="http://www.w3.org/2000/svg" className="icon" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="7" r="4"/><path d="M3 21a6 6 0 0 1 12 0"/><path d="M17 21v-6"/><path d="M20 18l-2 2l2 2"/></svg>
  ) },
  { to: '/bluetooth-print', label: 'Impressora BT', icon: (
    <svg xmlns="http://www.w3.org/2000/svg" className="icon" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8h-6a2 2 0 0 0 -2 2v6a2 2 0 0 0 2 2h6"/><path d="M6 8v-2a2 2 0 0 1 2 -2h2"/><path d="M18 16v2a2 2 0 0 1 -2 2h-2"/><path d="M12 8v-2"/><path d="M12 16v-2"/><path d="M15 12h-6"/><path d="M6 12h.01"/><path d="M18 12h.01"/></svg>
  ) },
  { to: '/formas-pagamento', label: 'Formas de Pagamento', icon: (
    <svg xmlns="http://www.w3.org/2000/svg" className="icon" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12h5l3 5l4 -8l3 3h4"/><path d="M3 12v-2a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v2"/><path d="M3 12v8a2 2 0 0 0 2 2h14a2 2 0 0 0 2 -2v-8"/></svg>
  ) },
  { to: '/menu-links', label: 'Links do Cardápio', icon: (
    <svg xmlns="http://www.w3.org/2000/svg" className="icon" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.72"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.72-1.72"/></svg>
  ) },
  { to: '/whatsapp-campanhas', label: 'WhatsApp Business', icon: (
    <svg xmlns="http://www.w3.org/2000/svg" className="icon" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21l1.65 -3.8a9 9 0 1 1 3.4 2.9l-5.2 .12"/><path d="M9 10a0.5 .5 0 0 0 1 0v-1a0.5 .5 0 0 0 -1 0v1a5 5 0 0 0 5 5h1a0.5 .5 0 0 0 0 -1h-1a0.5 .5 0 0 0 0 1"/></svg>
  ) },
  { to: '/cashback', label: 'Cashback', icon: (
    <svg xmlns="http://www.w3.org/2000/svg" className="icon" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/><path d="M8 12h8"/></svg>
  ) },
  { to: '/liza-demo', label: 'Assistente Liza', icon: (
    <svg xmlns="http://www.w3.org/2000/svg" className="icon" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>
  ) },
  { to: '/cupons', label: 'Cupons', icon: (
    <svg xmlns="http://www.w3.org/2000/svg" className="icon" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 6h16v4a2 2 0 1 1 0 4v4H4v-4a2 2 0 1 1 0-4z"/><path d="M8 12h8"/></svg>
  ) },
  { to: '/banners', label: 'Banners', icon: (
    <svg xmlns="http://www.w3.org/2000/svg" className="icon" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16v16H4z"/><path d="M8 8h8"/><path d="M8 12h8"/><path d="M8 16h5"/></svg>
  ) },
  { to: '/config', label: 'Configurações', icon: (
    <svg xmlns="http://www.w3.org/2000/svg" className="icon" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1A1.65 1.65 0 0 0 4.27 7l-.06-.06A2 2 0 1 1 7.04 4.1l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9c0 .63.37 1.2.94 1.45.54.23 1.06.55 1.51.94.24.21.55.36.9.36a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
  ) }
]

export default function Sidebar({ collapsed = false }) {
  const [storeInfo, setStoreInfo] = useState(() => {
    if (typeof window === 'undefined') return { name: 'Zappy Demo', user: 'admin@demo', logoDataUrl: '', isOpen: true }
    try {
      const raw = localStorage.getItem('demoStoreInfo')
      const settings = localStorage.getItem('demoSettings')
      const storeData = raw ? JSON.parse(raw) : { name: 'Zappy Demo', user: 'admin@demo', logoDataUrl: '' }
      const storeSettings = settings ? JSON.parse(settings) : { isOpen: true }
      return { ...storeData, isOpen: storeSettings.isOpen !== false }
    } catch {
      return { name: 'Zappy Demo', user: 'admin@demo', logoDataUrl: '', isOpen: true }
    }
  })

  useEffect(() => {
    const onUpdate = () => {
      try {
        const raw = localStorage.getItem('demoStoreInfo')
        const settings = localStorage.getItem('demoSettings')
        const storeData = raw ? JSON.parse(raw) : { name: 'Zappy Demo', user: 'admin@demo', logoDataUrl: '' }
        const storeSettings = settings ? JSON.parse(settings) : { isOpen: true }
        setStoreInfo({ ...storeData, isOpen: storeSettings.isOpen !== false })
      } catch {
        // noop
      }
    }
    window.addEventListener('demo-store-info-updated', onUpdate)
    window.addEventListener('demo-settings-updated', onUpdate)
    return () => {
      window.removeEventListener('demo-store-info-updated', onUpdate)
      window.removeEventListener('demo-settings-updated', onUpdate)
    }
  }, [])

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
        .sidebar-footer {
          padding: 0.75rem 1rem;
          border-top: 1px solid rgba(0,0,0,0.1);
          background: inherit;
          flex-shrink: 0;
          width: 100%;
          margin-bottom: 3rem;
        }
        .sidebar-footer-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 0.25rem;
        }
        .sidebar-footer-logo {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          object-fit: cover;
          flex-shrink: 0;
        }
        .sidebar-footer-logo.placeholder {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(45deg, #f0f0f0, #e0e0e0);
          border: 2px dashed #ccc;
          flex-shrink: 0;
        }
        .sidebar-footer-text {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.25rem;
          min-width: 0;
        }
        .sidebar-footer-name {
          font-weight: 600;
          font-size: 0.875rem;
          line-height: 1.2;
          word-break: break-word;
          overflow-wrap: break-word;
        }
        .sidebar-footer-user {
          font-size: 0.75rem;
          color: #666;
          line-height: 1.2;
          word-break: break-word;
          overflow-wrap: break-word;
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
        .store-status {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          margin-top: 0.25rem;
          justify-content: center;
          flex-wrap: nowrap;
        }
        .status-indicator {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          animation: pulse 2s infinite;
          flex-shrink: 0;
        }
        .status-open {
          background-color: #2fb344;
          box-shadow: 0 0 0 2px rgba(47, 179, 68, 0.3);
        }
        .status-closed {
          background-color: #d63939;
          box-shadow: 0 0 0 2px rgba(214, 57, 57, 0.3);
        }
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
      `}</style>
      
      <div className="sidebar-container">
        {/* Área rolável com os menus */}
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

        {/* Rodapé com identidade da loja e status */}
        <div className="sidebar-footer">
          <div className="d-flex align-items-center gap-2">
            {storeInfo.logoDataUrl ? (
              <img src={storeInfo.logoDataUrl} alt="Logo" className="sidebar-footer-logo" />
            ) : (
              <div className="sidebar-footer-logo placeholder"></div>
            )}
            <div className="sidebar-footer-text flex-grow-1">
              <div className="sidebar-footer-name">{storeInfo.name || 'Zappy Demo'}</div>
              <div className="sidebar-footer-user">{storeInfo.user || 'admin@demo'}</div>
              <div className="store-status">
                <div className={`status-indicator ${storeInfo.isOpen ? 'status-open' : 'status-closed'}`}></div>
                <small className={`text-${storeInfo.isOpen ? 'success' : 'danger'}`}>
                  {storeInfo.isOpen ? 'Loja Aberta' : 'Loja Fechada'}
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}
