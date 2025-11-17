import React, { useState, useEffect } from 'react'
import { getSuperAdminToken, getAdminToken, clearAuth } from './utils/auth'
import Navbar from './components/Navbar/Navbar'
import Sidebar from './components/Sidebar/Sidebar'
import SuperAdminSidebar from './components/SuperAdminSidebar/SuperAdminSidebar'
import Login from './components/Login/Login'
import SuperAdminLogin from './components/SuperAdminLogin/SuperAdminLogin'
import { Routes, Route, useLocation } from 'react-router-dom';
import axios from 'axios';
import i18n from './i18n';
import Add from './pages/Add/Add';
import List from './pages/List/List';
import Orders from './pages/Orders/Orders';
import Categories from './pages/Categories/Categories';
import Edit from './pages/Edit/Edit';
import Settings from './pages/Settings/Settings';
import Banners from './pages/Banners/Banners';
import Tables from './pages/Tables/Tables';
import Coupons from './pages/Coupons/Coupons';
import BluetoothPrint from './components/BluetoothPrint/BluetoothPrint';
import StoreManagement from './pages/SuperAdmin/StoreManagement/StoreManagement';
import SystemSettings from './pages/SuperAdmin/SystemSettings/SystemSettings';
import Analytics from './pages/SuperAdmin/Analytics/Analytics';
import CustomerAnalytics from './pages/Analytics/Analytics';
import UserManagement from './pages/SuperAdmin/UserManagement/UserManagement';
import SuperAdminDashboard from './pages/SuperAdmin/Dashboard/SuperAdminDashboard';
import StoreLinks from './pages/StoreLinks/StoreLinks';
import AdminProfile from './pages/Profile/AdminProfile';
import WaiterManagement from './pages/WaiterManagement/WaiterManagement';
import Customers from './pages/Customers/Customers';

import AsaasDashboard from './pages/AsaasDashboard/AsaasDashboard';
import ApiManagement from './pages/SuperAdmin/ApiManagement/ApiManagement';
import SystemLogs from './pages/SuperAdmin/SystemLogs/SystemLogs';
import StockManagement from './pages/StockManagement/StockManagement';
import WhatsAppSettings from './pages/WhatsAppSettings/WhatsAppSettings';
import WhatsAppMessages from './pages/WhatsAppMessages/WhatsAppMessages';
import OrderStats from './pages/OrderStats/OrderStats';
import PaymentStats from './pages/PaymentStats/PaymentStats';
import CounterAttendants from './pages/CounterAttendants/CounterAttendants';
import PaymentSettings from './pages/Settings/PaymentSettings';
import LizaChat from './pages/LizaChat/LizaChat';
import LizaDemoChat from './pages/LizaChat/LizaDemoChat';
import Cashback from './pages/Cashback/Cashback';
import ProductSuggestions from './pages/ProductSuggestions/ProductSuggestions';
import AdminDashboard from './pages/Dashboard/AdminDashboard';
import PublicMenu from './pages/PublicMenu/PublicMenu';

import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ThemeProvider } from './contexts/ThemeContext';

const App = () => {
  const location = useLocation();
  // Em desenvolvimento, usar proxy Vite com paths relativos ("/api") para evitar CORS
  const url = import.meta.env?.DEV ? '' : (import.meta.env.VITE_BACKEND_URL || 'http://localhost:4001');
  const [token, setToken] = useState('');
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [showSuperAdminLogin, setShowSuperAdminLogin] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // Token específico do Super Admin (sempre usar nas rotas de sistema)
  const superAdminToken = getSuperAdminToken();

  useEffect(() => {
    const superToken = getSuperAdminToken();
    const adminToken = getAdminToken();
    const userRole = localStorage.getItem('userRole');

    if (superToken) {
      setToken(superToken);
      setIsSuperAdmin(true);
      setShowSuperAdminLogin(false);
      return;
    }

    if (adminToken) {
      setToken(adminToken);
      setIsSuperAdmin(false);
      setShowSuperAdminLogin(false);
      return;
    }

    // Se havia valores inválidos (ex.: stub), limpar e decidir login adequado
    const rawSuper = localStorage.getItem('superAdminToken');
    const rawAdmin = localStorage.getItem('token');
    if (rawSuper || rawAdmin) {
      clearAuth();
    }
    setShowSuperAdminLogin(userRole === 'super_admin');
  }, []);

  // Atualizar título da aba conforme papel/rota
  useEffect(() => {
    const path = (location?.pathname || '').toLowerCase();
    const isSuperAdminRoute = isSuperAdmin || path.startsWith('/super-admin');
    const isMenuRoute = /\/(store|menu|card[áa]pio)/.test(path);

    const nextTitle = isMenuRoute
      ? 'Zappy!'
      : (isSuperAdminRoute ? 'Zappy super admin' : 'Zappy admin');
    if (document.title !== nextTitle) {
      document.title = nextTitle;
    }
  }, [isSuperAdmin, location]);

  // Aplicar idioma do admin com base nas configurações da loja
  useEffect(() => {
    const applyStoreLanguage = async () => {
      try {
        if (!token || isSuperAdmin) return;
        const response = await axios.get(`${url}/api/store/current`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data?.success && response.data.store?.settings?.language) {
          const lang = response.data.store.settings.language;
          i18n.changeLanguage(lang);
        }
      } catch (error) {
        // Silencioso: mantém idioma padrão se falhar
        console.warn('Falha ao aplicar idioma da loja:', error?.response?.data?.message || error.message);
      }
    };
    applyStoreLanguage();
  }, [token, isSuperAdmin, url]);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('superAdminToken');
    localStorage.removeItem('userRole');
    setToken('');
    setIsSuperAdmin(false);
    setShowSuperAdminLogin(false);
  };

  // Permitir acesso público ao cardápio sem exigir login
  const isPublicMenuRoute = (location?.pathname || '').toLowerCase().startsWith('/loja/');

  if (!token && !isPublicMenuRoute) {
    return (
      <ThemeProvider>
        <div>
          <ToastContainer/>
          {showSuperAdminLogin ? (
            <div>
              <SuperAdminLogin url={url} setToken={setToken} setSuperAdmin={setIsSuperAdmin} />
              <div style={{textAlign: 'center', marginTop: '20px'}}>
                <button 
                  onClick={() => setShowSuperAdminLogin(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#667eea',
                    cursor: 'pointer',
                    textDecoration: 'underline'
                  }}
                >
                  Voltar para Login Normal
                </button>
              </div>
            </div>
          ) : (
            <div>
              <Login url={url} setToken={setToken} />
              <div style={{textAlign: 'center', marginTop: '20px'}}>
                <button 
                  onClick={() => setShowSuperAdminLogin(true)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#667eea',
                    cursor: 'pointer',
                    textDecoration: 'underline'
                  }}
                >
                  Acesso Super Admin
                </button>
              </div>
            </div>
          )}
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <div className="page">
        <ToastContainer/>
        {/* Quando for rota pública do cardápio sem login, não renderizar layout do admin */}
        {(!token && isPublicMenuRoute) ? (
          <Routes>
            <Route path='/loja/:slug' element={<PublicMenu url={url} />} />
          </Routes>
        ) : (
          <>
          <Navbar 
            logout={logout} 
            isSuperAdmin={isSuperAdmin}
            onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          />
          <div className="page-body">
            <div className="container-xl app-content">
            {isSuperAdmin ? (
              <SuperAdminSidebar 
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
              />
            ) : (
              <Sidebar 
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
              />
            )}
            <Routes>
          {/* Rotas do Super Admin */}
          <Route path='/super-admin/dashboard' element={<SuperAdminDashboard url={url} token={superAdminToken || token}/>} />
          <Route path='/super-admin/stores' element={<StoreManagement url={url} token={superAdminToken || token}/>} />
          <Route path='/super-admin/system-settings' element={<SystemSettings url={url} token={superAdminToken || token}/>} />
          <Route path='/super-admin/api-management' element={<ApiManagement url={url} token={superAdminToken || token}/>} />
          <Route path='/super-admin/analytics' element={<Analytics url={url} token={superAdminToken || token}/>} />
          <Route path='/super-admin/users' element={<UserManagement url={url} token={superAdminToken || token}/>} />
          <Route path='/super-admin/logs' element={<SystemLogs url={url} token={superAdminToken || token}/>} />
          <Route path='/super-admin/asaas' element={<AsaasDashboard url={url} token={superAdminToken || token}/>} />
          <Route path='/store-links' element={<StoreLinks url={url} token={token}/>} />
          {/* Visualização pública do cardápio por slug */}
          <Route path='/loja/:slug' element={<PublicMenu url={url} />} />
          
          {/* Rotas normais do admin */}
          <Route path='/dashboard' element={<AdminDashboard url={url} token={token}/>} />
          <Route path='/add' element={<Add url={url} />} />
          <Route path='/list' element={<List url={url}/>} />
          <Route path='/categories' element={<Categories url={url}/>} />
          <Route path='/product-suggestions' element={<ProductSuggestions url={url} token={token}/>} />

          <Route path='/orders' element={<Orders url={url} token={token}/>} />
          <Route path='/order-stats' element={<OrderStats url={url} token={token}/>} />
          <Route path='/payment-stats' element={<PaymentStats url={url} token={token}/>} />
          <Route path='/edit/:id' element={<Edit url={url}/>} />
          <Route path='/settings' element={<Settings url={url}/>} />
          <Route path='/payment-settings' element={<PaymentSettings url={url}/>} />
          <Route path='/profile' element={<AdminProfile />} />
          <Route path='/banners' element={<Banners url={url}/>} />
          <Route path='/tables' element={<Tables url={url}/>} />
          <Route path='/coupons' element={<Coupons url={url}/>} />
          <Route path='/cashback' element={<Cashback url={url} token={token}/>} />
          <Route path='/customers' element={<Customers url={url} token={token}/>} />
          <Route path='/customer-analytics' element={<CustomerAnalytics url={url} token={token}/>} />
          <Route path='/waiter-management' element={<WaiterManagement url={url}/>} />

          <Route path='/bluetooth-print' element={<BluetoothPrint url={url} token={token}/>} />
          <Route path='/stock-management/:id' element={<StockManagement url={url}/>} />
          <Route path='/whatsapp-settings' element={<WhatsAppSettings url={url}/>} />
          <Route path='/whatsapp-messages' element={<WhatsAppMessages url={url}/>} />
          <Route path='/counter-attendants' element={<CounterAttendants url={url}/>} />
          <Route path='/liza-chat' element={<LizaChat url={url} token={token}/>} />
          <Route path='/liza-demo' element={<LizaDemoChat url={url} token={token}/>} />
          
          {/* Rota padrão */}
          <Route path='/' element={isSuperAdmin ? <StoreManagement url={url} token={superAdminToken || token}/> : <Add url={url} />} />
        </Routes>
            </div>
          </div>
          </>
        )}
    </div>
  </ThemeProvider>
  )
}

export default App
