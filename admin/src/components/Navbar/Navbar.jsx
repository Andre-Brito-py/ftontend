import React, { useState, useRef, useEffect } from 'react'
import './Navbar.css'
import { assets } from './../../assets/assets';
import { useTheme } from '../../contexts/ThemeContext';
import { useTranslation } from 'react-i18next';

const Navbar = ({ logout, isSuperAdmin, onToggleSidebar }) => {
  const { theme, toggleTheme, isDark } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const { t } = useTranslation();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className='navbar navbar-expand-md'>
        {/* Marca com imagem (logo PNG do diretório público) - responsivo */}
        <picture className='navbar-brand-picture'>
          {/* Preview: usar SVG da versão enviada como primeira fonte */}
          <source
            type='image/svg+xml'
            srcSet='/logos/zappy-preview.svg'
          />
          {/* Mobile: PNG somente */}
          <source
            media='(max-width: 600px)'
            srcSet='/logos/logo-small.png 1x, /logos/logo-small@2x.png 2x'
          />
          {/* Desktop: PNG com @2x para retina */}
          <source
            media='(min-width: 601px)'
            srcSet='/logos/logo.png 1x, /logos/logo@2x.png 2x'
          />
          <img
            src='/logos/logo.png'
            alt='Zappy'
            className='navbar-brand-image'
            loading='eager'
            decoding='async'
          />
        </picture>
        <button className='mobile-menu-toggle' onClick={onToggleSidebar}>
          <span></span>
          <span></span>
          <span></span>
        </button>
        <div className='navbar-center'>
          {isSuperAdmin && (
            <div className='admin-badge'>
              <span>🔧 {t('superAdmin')}</span>
            </div>
          )}
        </div>
        <div className='navbar-right'>
          <div className='theme-toggle-container' title={`Alternar para modo ${isDark ? 'claro' : 'escuro'}`}>
            <label className='theme-toggle-switch'>
              <input
                type="checkbox"
                checked={isDark}
                onChange={toggleTheme}
              />
              <span className='theme-slider'></span>
            </label>
          </div>
          <div className='nav-item dropdown user-menu' ref={menuRef}>
            <button
              className='nav-link d-flex lh-1 text-reset user-menu-toggle'
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label='Abrir menu do usuário'
            >
              <span
                className='avatar avatar-sm'
                style={{ backgroundImage: `url(${assets.profile_image})` }}
              ></span>
              <div className='d-none d-xl-block ps-2'>
                <div>{t('admin')}</div>
                <div className='mt-1 small text-secondary'>{t('profile')}</div>
              </div>
            </button>
            <div className={`dropdown-menu dropdown-menu-end dropdown-menu-arrow ${menuOpen ? 'show' : ''}`}>
              <a href='/profile' className='dropdown-item'>{t('profile')}</a>
              <a href='/settings' className='dropdown-item'>{t('settings')}</a>
              <div className='dropdown-divider'></div>
              <button onClick={logout} className='dropdown-item'>{t('logout')}</button>
            </div>
          </div>
          <button onClick={logout} className='btn'>{t('logout')}</button>
        </div>
    </div>
  )
}

export default Navbar