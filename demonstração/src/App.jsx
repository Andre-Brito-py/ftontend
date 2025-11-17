import React, { useMemo } from 'react'
import { Routes, Route } from 'react-router-dom'
import ChartsDemo from './components/ChartsDemo.jsx'
import AdminLayout from './layout/AdminLayout.jsx'
import OrdersPage from './pages/Orders.jsx'
import CategoriesPage from './pages/Categories.jsx'
import CreateCategoryPage from './pages/CreateCategory.jsx'
import ProductsPage from './pages/Products.jsx'
import CreateProductPage from './pages/CreateProduct.jsx'
import CouponsPage from './pages/Coupons.jsx'
import CreateCouponPage from './pages/CreateCoupon.jsx'
import SettingsPage from './pages/Settings.jsx'
import ProductSuggestionsPage from './pages/ProductSuggestions.jsx'
import BannersPage from './pages/Banners.jsx'
import StatisticsPage from './pages/Statistics.jsx'
import CustomersPage from './pages/Customers.jsx'
import TablesPage from './pages/Tables.jsx'
import CashbackPage from './pages/Cashback.jsx'
import LizaDemoChat from './components/LizaDemoChat.jsx'
import CounterAttendants from './pages/CounterAttendants.jsx'
import WaiterManagement from './pages/WaiterManagement.jsx'
import BluetoothPrint from './pages/BluetoothPrint.jsx'
import PaymentMethods from './pages/PaymentMethods.jsx'
import MenuLinks from './pages/MenuLinks.jsx'
import WhatsAppCampaigns from './pages/WhatsAppCampaigns.jsx'

// Utilitário para formato BRL
const brl = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0)

const DemoAdminDashboard = () => {
  // Dados simulados (sem conexão ao backend)
  const orders = 128
  const revenue = 18457.90
  const avgTicket = revenue / orders
  const revenueToday = 1240.50
  const topPayment = 'PIX'

  const kpis = useMemo(() => ([
    { label: 'Pedidos', value: orders },
    { label: 'Receita Total', value: brl(revenue) },
    { label: 'Ticket Médio', value: brl(avgTicket) },
    { label: 'Receita Hoje', value: brl(revenueToday) },
    { label: 'Pagamento Principal', value: topPayment }
  ]), [orders, revenue, avgTicket, revenueToday, topPayment])

  const DashboardPage = (
    <div className="page">
      <div className="page-header">
        <div className="container-xl">
          <div className="row g-2 align-items-center">
            <div className="col">
              <h2 className="page-title">Dashboard do Admin (Demonstração)</h2>
              <div className="page-pretitle">Visão geral rápida do desempenho da loja</div>
            </div>
            <div className="col-auto ms-auto d-print-none">
              <div className="btn-list">
                <button className="btn btn-outline-primary" onClick={() => alert('Somente visual.')}>Atualizar</button>
                <a href="/estatisticas" className="btn btn-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                    <path d="M3 3v18h18"/><path d="M7 14l5-5 4 4 5-5"/>
                  </svg>
                  Ver Estatísticas Detalhadas
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="page-body">
        <div className="container-xl">
          {/* KPIs */}
          <div className="row row-cards mb-3">
            {kpis.map((k) => (
              <div key={k.label} className="col-sm-6 col-md-3">
                <div className="card card-sm">
                  <div className="card-body">
                    <div className="d-flex align-items-center">
                      <div>
                        <div className="font-weight-medium">{k.label}</div>
                        <div className="text-secondary">{k.value}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Gráficos reais (ApexCharts) */}
          <ChartsDemo />
          
          {/* Link para estatísticas detalhadas */}
          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-body text-center">
                  <h3>Quer ver mais detalhes?</h3>
                  <p className="text-muted">Acesse nossa página de estatísticas avançadas com gráficos interativos, filtros personalizados e análises detalhadas.</p>
                  <a href="/estatisticas" className="btn btn-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                      <path d="M3 3v18h18"/><path d="M7 14l5-5 4 4 5-5"/>
                    </svg>
                    Explorar Estatísticas Avançadas
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={DashboardPage} />
        <Route path="/estatisticas" element={<StatisticsPage />} />
        <Route path="/pedidos" element={<OrdersPage />} />
        <Route path="/categorias" element={<CategoriesPage />} />
        <Route path="/categorias/nova" element={<CreateCategoryPage />} />
        <Route path="/produtos" element={<ProductsPage />} />
        <Route path="/produtos/novo" element={<CreateProductPage />} />
        <Route path="/cupons" element={<CouponsPage />} />
        <Route path="/cupons/novo" element={<CreateCouponPage />} />
        <Route path="/banners" element={<BannersPage />} />
        <Route path="/clientes" element={<CustomersPage />} />
        <Route path="/mesas" element={<TablesPage />} />
        <Route path="/cashback" element={<CashbackPage />} />
        <Route path="/config" element={<SettingsPage />} />
        <Route path="/sugestoes" element={<ProductSuggestionsPage />} />
        <Route path="/liza-demo" element={<LizaDemoChat />} />
        <Route path="/atendentes" element={<CounterAttendants />} />
        <Route path="/garcom" element={<WaiterManagement />} />
        <Route path="/bluetooth-print" element={<BluetoothPrint />} />
        <Route path="/formas-pagamento" element={<PaymentMethods />} />
        <Route path="/menu-links" element={<MenuLinks />} />
        <Route path="/whatsapp-campanhas" element={<WhatsAppCampaigns />} />
      </Routes>
    </AdminLayout>
  )
}

export default DemoAdminDashboard