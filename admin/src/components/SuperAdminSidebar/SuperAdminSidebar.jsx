import React from 'react';
import './SuperAdminSidebar.css';
import { NavLink } from 'react-router-dom';
import { assets } from '../../assets/assets';
import { useTranslation } from 'react-i18next';

const SuperAdminSidebar = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  return (
    <>
      {/* Backdrop para fechar o menu em mobile */}
      {isOpen && <div className='sidebar-backdrop' onClick={onClose}></div>}
      
      <div className={`super-admin-sidebar ${isOpen ? 'open' : ''}`}>
        <div className='super-admin-sidebar-options'>
          <NavLink to='/super-admin/dashboard' className='super-admin-sidebar-option' onClick={onClose}>
            <img src={assets.dashboardIcon} alt='Dashboard' />
            <p>{t('dashboard')}</p>
          </NavLink>
          
          <NavLink to='/super-admin/stores' className='super-admin-sidebar-option' onClick={onClose}>
            <img src={assets.settingsIcon} alt='Lojas' />
            <p>{t('manageStores')}</p>
          </NavLink>
          
          <NavLink to='/super-admin/system-settings' className='super-admin-sidebar-option' onClick={onClose}>
            <img src={assets.settingsIcon} alt='Configurações' />
            <p>{t('systemSettings')}</p>
          </NavLink>
          
          <NavLink to='/super-admin/api-management' className='super-admin-sidebar-option' onClick={onClose}>
            <img src={assets.settingsIcon} alt='API Management' />
            <p>{t('apiManagement')}</p>
          </NavLink>
          
          
          <NavLink to='/super-admin/analytics' className='super-admin-sidebar-option' onClick={onClose}>
            <img src={assets.analyticsIcon} alt='Analytics' />
            <p>{t('globalAnalytics')}</p>
          </NavLink>
          
          <NavLink to='/super-admin/users' className='super-admin-sidebar-option' onClick={onClose}>
            <img src={assets.usersIcon} alt='Usuários' />
            <p>{t('manageUsers')}</p>
          </NavLink>
          
          <NavLink to='/super-admin/asaas' className='super-admin-sidebar-option' onClick={onClose}>
            <img src={assets.paymentIcon} alt='Asaas Dashboard' />
            <p>{t('asaasDashboard')}</p>
          </NavLink>
          
          <NavLink to='/super-admin/logs' className='super-admin-sidebar-option' onClick={onClose}>
            <img src={assets.listIcon} alt='Logs' />
            <p>{t('systemLogs')}</p>
          </NavLink>
        </div>
      </div>
    </>
  );
};

export default SuperAdminSidebar;