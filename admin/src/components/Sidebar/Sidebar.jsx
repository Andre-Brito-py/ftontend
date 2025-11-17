import React from 'react'
import './Sidebar.css'
import { assets } from '../../assets/assets'
import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const Sidebar = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  return (
    <>
      {/* Backdrop para fechar o menu em mobile */}
      {isOpen && <div className='sidebar-backdrop' onClick={onClose}></div>}
      
      <div className={`sidebar ${isOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-options">
        <NavLink to='/dashboard' className="sidebar-option" onClick={onClose}>
          <img src={assets.dashboardIcon} alt="" />
          <p>{t('dashboard')}</p>
        </NavLink>
        <NavLink to='/add' className="sidebar-option" onClick={onClose}>
          <img src={assets.addIcon} alt="" />
          <p>{t('addItems')}</p>
        </NavLink>
        <NavLink to='/list' className="sidebar-option" onClick={onClose}>
          <img src={assets.listIcon} alt="" />
          <p>{t('listItems')}</p>
        </NavLink>
        <NavLink to='/categories' className="sidebar-option" onClick={onClose}>
          <img src={assets.categoryIcon} alt="" />
          <p>{t('categories')}</p>
        </NavLink>
        <NavLink to='/product-suggestions' className="sidebar-option" onClick={onClose}>
          <img src={assets.listIcon} alt="" />
          <p>{t('productSuggestions')}</p>
        </NavLink>

        <NavLink to='/banners' className="sidebar-option" onClick={onClose}>
          <img src={assets.bannersIcon} alt="" />
          <p>{t('banners')}</p>
        </NavLink>
        <NavLink to='/orders' className="sidebar-option" onClick={onClose}>
          <img src={assets.ordersIcon} alt="" />
          <p>{t('orders')}</p>
        </NavLink>
        <NavLink to='/order-stats' className="sidebar-option" onClick={onClose}>
          <img src={assets.analyticsIcon} alt="" />
          <p>{t('statistics')}</p>
        </NavLink>
        <NavLink to='/payment-stats' className="sidebar-option" onClick={onClose}>
          <img src={assets.paymentIcon} alt="" />
          <p>{t('payments')}</p>
        </NavLink>
        <NavLink to='/tables' className="sidebar-option" onClick={onClose}>
          <img src={assets.tablesIcon} alt="" />
          <p>{t('tables')}</p>
        </NavLink>
        <NavLink to='/coupons' className="sidebar-option" onClick={onClose}>
          <img src={assets.couponsIcon} alt="" />
          <p>{t('coupons')}</p>
        </NavLink>
        <NavLink to='/cashback' className="sidebar-option" onClick={onClose}>
          <img src={assets.paymentIcon} alt="" />
          <p>{t('cashback')}</p>
        </NavLink>
        <NavLink to='/customers' className="sidebar-option" onClick={onClose}>
          <img src={assets.usersIcon} alt="" />
          <p>{t('customers')}</p>
        </NavLink>
        <NavLink to='/customer-analytics' className="sidebar-option" onClick={onClose}>
          <img src={assets.analyticsIcon} alt="" />
          <p>{t('analyticsLiza')}</p>
        </NavLink>
        <NavLink to='/waiter-management' className="sidebar-option" onClick={onClose}>
          <img src={assets.usersIcon} alt="" />
          <p>{t('waiter')}</p>
        </NavLink>
        <NavLink to='/counter-attendants' className="sidebar-option" onClick={onClose}>
          <img src={assets.usersIcon} alt="" />
          <p>{t('counterAttendants')}</p>
        </NavLink>

        <NavLink to='/settings' className="sidebar-option" onClick={onClose}>
          <img src={assets.settingsIcon} alt="" />
          <p>{t('settings')}</p>
        </NavLink>
        <NavLink to='/payment-settings' className="sidebar-option" onClick={onClose}>
          <img src={assets.paymentIcon} alt="" />
          <p>{t('paymentSettings')}</p>
        </NavLink>
        <NavLink to='/profile' className="sidebar-option" onClick={onClose}>
          <img src={assets.usersIcon} alt="" />
          <p>{t('profile')}</p>
        </NavLink>
        <NavLink to='/store-links' className="sidebar-option" onClick={onClose}>
           <img src={assets.parcel_icon} alt="" />
           <p>{t('storeLinks')}</p>
         </NavLink>
        <NavLink to='/bluetooth-print' className="sidebar-option" onClick={onClose}>
          <img src={assets.settingsIcon} alt="" />
          <p>{t('bluetoothPrinter')}</p>
        </NavLink>
        <NavLink to='/whatsapp-settings' className="sidebar-option" onClick={onClose}>
          <img src={assets.whatsappIcon} alt="" />
          <p>{t('whatsappSettings')}</p>
        </NavLink>
        <NavLink to='/whatsapp-messages' className="sidebar-option" onClick={onClose}>
          <img src={assets.whatsappIcon} alt="" />
          <p>{t('whatsappMessages')}</p>
        </NavLink>
        <NavLink to='/liza-chat' className="sidebar-option" onClick={onClose}>
          <img src={assets.liza_chat_icon} alt="" />
          <p>{t('lizaChat')}</p>
        </NavLink>
        <NavLink to='/liza-demo' className="sidebar-option demo-option" onClick={onClose}>
          <img src={assets.liza_chat_icon} alt="" />
          <p>Liza Demo</p>
        </NavLink>
      </div>
    </div>
    </>
  )
}

export default Sidebar