import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar/Navbar';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home/Home';
import Cart from './pages/Cart/Cart';
import PlaceOrder from './pages/PlaceOrder/PlaceOrder';
import Footer from './components/Footer/Footer';
import LoginPopup from './components/LoginPopup/LoginPopup';
import Verify from './pages/Verify/Verify';
import MyOrders from './pages/MyOrders/MyOrders';
import ProductDetail from './pages/ProductDetail/ProductDetail';
import StoreHome from './pages/StoreHome/StoreHome';
import MenuById from './pages/MenuById/MenuById';
import CartDebug from './components/CartDebug/CartDebug';
import WaiterOrderPage from './pages/WaiterOrderPage/WaiterOrderPage';
import CustomerInfo from './pages/CustomerInfo/CustomerInfo';

const App = () => {

  const [showLogin, setShowLogin] = useState(false);
  // Título padrão do cliente como Zappy
  useEffect(() => {
    if (!/waiter/i.test(document.title)) {
      document.title = 'Zappy!';
    }
  }, []);
  const location = useLocation();
  const isWaiterRoute = /^\/waiter-order\//.test(location.pathname);

  return (
    <HelmetProvider>
      {showLogin ? <LoginPopup setShowLogin={setShowLogin} /> : <></>}
      <div className='app'>
        {!isWaiterRoute && <Navbar setShowLogin={setShowLogin} />}
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/loja/:storeSlug' element={<StoreHome />} />
          <Route path='/menu/:storeId' element={<MenuById />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/order' element={<PlaceOrder setShowLogin={setShowLogin} />} />
          <Route path='/verify' element={<Verify />} />
          <Route path='/myorders' element={<MyOrders />} />
          <Route path='/product/:id' element={<ProductDetail />} />
          <Route path='/debug-cart' element={<CartDebug />} />
          <Route path='/waiter-order/:storeId' element={<WaiterOrderPage />} />
          <Route path='/customer-info' element={<CustomerInfo />} />
        </Routes>
      </div>
      {!isWaiterRoute && <Footer />}
      <ToastContainer />
    </HelmetProvider>
  );
};

export default App;