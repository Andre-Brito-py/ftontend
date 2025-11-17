import React, { useState, useMemo } from 'react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { IconTrendingUp, IconTrendingDown, IconUsers, IconShoppingCart, IconCurrencyDollar, IconBuildingStore, IconChartBar, IconCalendar, IconFilter, IconMapPin } from '@tabler/icons-react';
import WorldMap from '../components/WorldMap';

const Analytics = () => {
  const [dateRange, setDateRange] = useState('7d');
  const [metricFilter, setMetricFilter] = useState('all');
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [showCountryModal, setShowCountryModal] = useState(false);

  // Mock data for charts
  const revenueData = [
    { name: 'Jan', revenue: 45000, orders: 120, users: 850 },
    { name: 'Feb', revenue: 52000, orders: 145, users: 920 },
    { name: 'Mar', revenue: 48000, orders: 132, users: 890 },
    { name: 'Apr', revenue: 61000, orders: 178, users: 1150 },
    { name: 'May', revenue: 55000, orders: 156, users: 1020 },
    { name: 'Jun', revenue: 67000, orders: 189, users: 1280 },
    { name: 'Jul', revenue: 72000, orders: 210, users: 1420 },
    { name: 'Aug', revenue: 69000, orders: 198, users: 1350 },
    { name: 'Sep', revenue: 75000, orders: 225, users: 1480 },
    { name: 'Oct', revenue: 82000, orders: 245, users: 1620 },
    { name: 'Nov', revenue: 78000, orders: 232, users: 1550 },
    { name: 'Dec', revenue: 89000, orders: 267, users: 1780 }
  ];

  const storePerformanceData = [
    { name: 'Loja Centro', revenue: 125000, orders: 342, conversion: 3.2, rating: 4.8 },
    { name: 'Loja Norte', revenue: 98000, orders: 278, conversion: 2.8, rating: 4.6 },
    { name: 'Loja Sul', revenue: 87000, orders: 245, conversion: 2.5, rating: 4.4 },
    { name: 'Loja Leste', revenue: 156000, orders: 423, conversion: 3.8, rating: 4.9 },
    { name: 'Loja Oeste', revenue: 112000, orders: 312, conversion: 3.1, rating: 4.7 }
  ];

  const categoryData = [
    { name: 'Eletrônicos', value: 35, color: '#0088FE' },
    { name: 'Roupas', value: 25, color: '#00C49F' },
    { name: 'Alimentos', value: 20, color: '#FFBB28' },
    { name: 'Casa', value: 12, color: '#FF8042' },
    { name: 'Outros', value: 8, color: '#8884D8' }
  ];

  const userGrowthData = [
    { month: 'Jan', newUsers: 450, activeUsers: 2800, churnRate: 2.1 },
    { month: 'Feb', newUsers: 520, activeUsers: 3120, churnRate: 1.8 },
    { month: 'Mar', newUsers: 480, activeUsers: 3350, churnRate: 2.3 },
    { month: 'Apr', newUsers: 610, activeUsers: 3780, churnRate: 1.9 },
    { month: 'May', newUsers: 550, activeUsers: 4020, churnRate: 2.0 },
    { month: 'Jun', newUsers: 670, activeUsers: 4450, churnRate: 1.7 },
    { month: 'Jul', newUsers: 720, activeUsers: 4980, churnRate: 1.5 }
  ];

  // Mock data for stores by country with SVG properties
  const storesByCountry = [
    {
      id: 'brazil',
      name: 'Brasil',
      countryCode: 'br',
      stores: 45,
      revenue: 2850000,
      users: 12500,
      regions: [
        { name: 'Sudeste', stores: 20, cities: ['São Paulo', 'Rio de Janeiro', 'Belo Horizonte'] },
        { name: 'Sul', stores: 12, cities: ['Porto Alegre', 'Curitiba', 'Florianópolis'] },
        { name: 'Nordeste', stores: 8, cities: ['Salvador', 'Recife', 'Fortaleza'] },
        { name: 'Centro-Oeste', stores: 3, cities: ['Brasília', 'Campo Grande'] },
        { name: 'Norte', stores: 2, cities: ['Manaus', 'Belém'] }
      ],
      color: '#28a745',
      path: 'M 320 200 L 420 180 L 440 220 L 420 260 L 380 250 L 340 240 L 320 220 L 320 200 Z',
      centerX: 380,
      centerY: 220
    },
    {
      id: 'usa',
      name: 'Estados Unidos',
      countryCode: 'usa',
      stores: 32,
      revenue: 4200000,
      users: 18500,
      regions: [
        { name: 'Califórnia', stores: 15, cities: ['Los Angeles', 'San Francisco', 'San Diego'] },
        { name: 'Texas', stores: 8, cities: ['Houston', 'Dallas', 'Austin'] },
        { name: 'Nova York', stores: 6, cities: ['Nova York', 'Buffalo', 'Rochester'] },
        { name: 'Flórida', stores: 3, cities: ['Miami', 'Orlando', 'Tampa'] }
      ],
      color: '#007bff',
      path: 'M 140 120 L 300 100 L 320 140 L 280 180 L 220 160 L 180 150 L 140 140 L 140 120 Z',
      centerX: 240,
      centerY: 150
    },
    {
      id: 'canada',
      name: 'Canadá',
      countryCode: 'ca',
      stores: 18,
      revenue: 1580000,
      users: 8200,
      regions: [
        { name: 'Ontário', stores: 8, cities: ['Toronto', 'Ottawa', 'Hamilton'] },
        { name: 'Quebec', stores: 5, cities: ['Montreal', 'Quebec City'] },
        { name: 'Colúmbia Britânica', stores: 3, cities: ['Vancouver', 'Victoria'] },
        { name: 'Alberta', stores: 2, cities: ['Calgary', 'Edmonton'] }
      ],
      color: '#17a2b8',
      path: 'M 160 60 L 320 40 L 340 80 L 300 120 L 240 100 L 200 90 L 160 80 L 160 60 Z',
      centerX: 250,
      centerY: 80
    },
    {
      id: 'mexico',
      name: 'México',
      countryCode: 'mx',
      stores: 12,
      revenue: 890000,
      users: 6800,
      regions: [
        { name: 'Valle do México', stores: 6, cities: ['Cidade do México', 'Toluca'] },
        { name: 'Jalisco', stores: 3, cities: ['Guadalajara', 'Puerto Vallarta'] },
        { name: 'Nuevo León', stores: 2, cities: ['Monterrey'] },
        { name: 'Yucatán', stores: 1, cities: ['Mérida'] }
      ],
      color: '#ffc107',
      path: 'M 200 220 L 320 200 L 340 240 L 300 260 L 240 250 L 220 240 L 200 230 L 200 220 Z',
      centerX: 270,
      centerY: 230
    },
    {
      id: 'argentina',
      name: 'Argentina',
      countryCode: 'ar',
      stores: 8,
      revenue: 650000,
      users: 4200,
      regions: [
        { name: 'Buenos Aires', stores: 5, cities: ['Buenos Aires', 'La Plata', 'Mar del Plata'] },
        { name: 'Córdoba', stores: 2, cities: ['Córdoba', 'Villa Carlos Paz'] },
        { name: 'Santa Fé', stores: 1, cities: ['Rosário'] }
      ],
      color: '#dc3545',
      path: 'M 280 300 L 400 280 L 420 320 L 380 340 L 320 330 L 300 320 L 280 310 L 280 300 Z',
      centerX: 350,
      centerY: 310
    }
  ];

  const topProducts = [
    { name: 'Smartphone X1', sales: 1234, revenue: 98720, growth: 12.5 },
    { name: 'Notebook Pro', sales: 856, revenue: 128400, growth: 8.3 },
    { name: 'Fone Bluetooth', sales: 2341, revenue: 70230, growth: 15.7 },
    { name: 'Smartwatch', sales: 678, revenue: 54240, growth: -2.1 },
    { name: 'Tablet 10"', sales: 445, revenue: 35600, growth: 5.8 }
  ];

  const currentMonthData = revenueData[revenueData.length - 1];
  const previousMonthData = revenueData[revenueData.length - 2];

  const metrics = {
    totalRevenue: {
      value: currentMonthData.revenue,
      change: ((currentMonthData.revenue - previousMonthData.revenue) / previousMonthData.revenue * 100).toFixed(1),
      trend: 'up'
    },
    totalOrders: {
      value: currentMonthData.orders,
      change: ((currentMonthData.orders - previousMonthData.orders) / previousMonthData.orders * 100).toFixed(1),
      trend: 'up'
    },
    totalUsers: {
      value: currentMonthData.users,
      change: ((currentMonthData.users - previousMonthData.users) / previousMonthData.users * 100).toFixed(1),
      trend: 'up'
    },
    avgOrderValue: {
      value: (currentMonthData.revenue / currentMonthData.orders).toFixed(0),
      change: '2.3',
      trend: 'up'
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatNumber = (value) => {
    return new Intl.NumberFormat('pt-BR').format(value);
  };

  const handleCountryClick = (country) => {
    setSelectedCountry(country);
    setShowCountryModal(true);
  };

  const closeCountryModal = () => {
    setShowCountryModal(false);
    setSelectedCountry(null);
  };

  return (
    <div className="container-xl">
      {/* Page Header */}
      <div className="page-header d-print-none">
        <div className="row g-2 align-items-center">
          <div className="col">
            <h2 className="page-title">Analytics</h2>
            <div className="text-muted mt-1">Visualize métricas e desempenho do sistema</div>
          </div>
          <div className="col-auto ms-auto d-print-none">
            <div className="btn-list">
              <div className="dropdown">
                <button className="btn dropdown-toggle" data-bs-toggle="dropdown">
                  <IconCalendar className="icon" />
                  {dateRange === '7d' ? 'Últimos 7 dias' : dateRange === '30d' ? 'Últimos 30 dias' : 'Últimos 90 dias'}
                </button>
                <div className="dropdown-menu">
                  <a className="dropdown-item" onClick={() => setDateRange('7d')}>Últimos 7 dias</a>
                  <a className="dropdown-item" onClick={() => setDateRange('30d')}>Últimos 30 dias</a>
                  <a className="dropdown-item" onClick={() => setDateRange('90d')}>Últimos 90 dias</a>
                </div>
              </div>
              <button className="btn btn-primary d-none d-sm-inline-block">
                <IconChartBar className="icon" />
                Exportar Relatório
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="row row-cards">
        <div className="col-sm-6 col-lg-3">
          <div className="card">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="subheader">Receita Total</div>
                <div className="ms-auto lh-1">
                  <div className="text-success">
                    <IconTrendingUp className="icon" />
                  </div>
                </div>
              </div>
              <div className="d-flex align-items-baseline">
                <div className="h1 mb-0 me-2">{formatCurrency(metrics.totalRevenue.value)}</div>
                <div className="me-auto">
                  <span className={`d-inline-flex align-items-center lh-1 ${
                    metrics.totalRevenue.trend === 'up' ? 'text-green' : 'text-red'
                  }`}>
                    {metrics.totalRevenue.trend === 'up' ? '+' : ''}{metrics.totalRevenue.change}%
                  </span>
                </div>
              </div>
              <div className="text-muted small mt-1">vs mês anterior</div>
            </div>
          </div>
        </div>

        <div className="col-sm-6 col-lg-3">
          <div className="card">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="subheader">Total de Pedidos</div>
                <div className="ms-auto lh-1">
                  <div className="text-success">
                    <IconShoppingCart className="icon" />
                  </div>
                </div>
              </div>
              <div className="d-flex align-items-baseline">
                <div className="h1 mb-0 me-2">{formatNumber(metrics.totalOrders.value)}</div>
                <div className="me-auto">
                  <span className={`d-inline-flex align-items-center lh-1 ${
                    metrics.totalOrders.trend === 'up' ? 'text-green' : 'text-red'
                  }`}>
                    {metrics.totalOrders.trend === 'up' ? '+' : ''}{metrics.totalOrders.change}%
                  </span>
                </div>
              </div>
              <div className="text-muted small mt-1">vs mês anterior</div>
            </div>
          </div>
        </div>

        <div className="col-sm-6 col-lg-3">
          <div className="card">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="subheader">Usuários Ativos</div>
                <div className="ms-auto lh-1">
                  <div className="text-success">
                    <IconUsers className="icon" />
                  </div>
                </div>
              </div>
              <div className="d-flex align-items-baseline">
                <div className="h1 mb-0 me-2">{formatNumber(metrics.totalUsers.value)}</div>
                <div className="me-auto">
                  <span className={`d-inline-flex align-items-center lh-1 ${
                    metrics.totalUsers.trend === 'up' ? 'text-green' : 'text-red'
                  }`}>
                    {metrics.totalUsers.trend === 'up' ? '+' : ''}{metrics.totalUsers.change}%
                  </span>
                </div>
              </div>
              <div className="text-muted small mt-1">vs mês anterior</div>
            </div>
          </div>
        </div>

        <div className="col-sm-6 col-lg-3">
          <div className="card">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="subheader">Ticket Médio</div>
                <div className="ms-auto lh-1">
                  <div className="text-success">
                    <IconCurrencyDollar className="icon" />
                  </div>
                </div>
              </div>
              <div className="d-flex align-items-baseline">
                <div className="h1 mb-0 me-2">{formatCurrency(metrics.avgOrderValue.value)}</div>
                <div className="me-auto">
                  <span className={`d-inline-flex align-items-center lh-1 ${
                    metrics.avgOrderValue.trend === 'up' ? 'text-green' : 'text-red'
                  }`}>
                    {metrics.avgOrderValue.trend === 'up' ? '+' : ''}{metrics.avgOrderValue.change}%
                  </span>
                </div>
              </div>
              <div className="text-muted small mt-1">vs mês anterior</div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="row row-cards mt-4">
        <div className="col-lg-8">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Receita e Pedidos - Últimos 12 Meses</h3>
              <div className="card-actions">
                <button className="btn btn-outline-primary btn-sm">
                  <IconFilter className="icon" />
                  Filtrar
                </button>
              </div>
            </div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip formatter={(value, name) => {
                    if (name === 'revenue') return [formatCurrency(value), 'Receita'];
                    if (name === 'orders') return [value, 'Pedidos'];
                    return [value, name];
                  }} />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="#206bc4" strokeWidth={2} name="Receita" />
                  <Line yAxisId="right" type="monotone" dataKey="orders" stroke="#2fb344" strokeWidth={2} name="Pedidos" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Vendas por Categoria</h3>
            </div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="row row-cards mt-4">
        <div className="col-lg-6">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Crescimento de Usuários</h3>
            </div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={userGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="activeUsers" stackId="1" stroke="#206bc4" fill="#206bc4" fillOpacity={0.6} name="Usuários Ativos" />
                  <Area type="monotone" dataKey="newUsers" stackId="2" stroke="#2fb344" fill="#2fb344" fillOpacity={0.6} name="Novos Usuários" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Desempenho por Loja</h3>
            </div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={storePerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip formatter={(value, name) => {
                    if (name === 'revenue') return [formatCurrency(value), 'Receita'];
                    if (name === 'conversion') return [`${value}%`, 'Conversão'];
                    return [value, name];
                  }} />
                  <Legend />
                  <Bar yAxisId="left" dataKey="revenue" fill="#206bc4" name="Receita" />
                  <Bar yAxisId="right" dataKey="conversion" fill="#2fb344" name="Taxa de Conversão (%)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive World Map */}
      <div className="row row-cards mt-4">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Visualização Global de Lojas</h3>
              <div className="card-actions">
                <button className="btn btn-outline-primary btn-sm" onClick={() => setShowCountryModal(false)}>
                  <IconMapPin className="icon" />
                  Ver Todos os Países
                </button>
              </div>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-lg-8">
                  <WorldMap 
                    stores={storesByCountry}
                    onCountryClick={handleCountryClick}
                    selectedCountry={selectedCountry}
                  />
                </div>
                <div className="col-lg-4">
                  <div className="mb-4">
                    <h4 className="mb-3">Resumo por País</h4>
                    <div className="list-group list-group-flush">
                      {storesByCountry.map((country) => (
                        <div 
                          key={country.id}
                          className={`list-group-item list-group-item-action ${
                            selectedCountry?.id === country.id ? 'active' : ''
                          }`}
                          onClick={() => handleCountryClick(country)}
                          style={{ cursor: 'pointer' }}
                        >
                          <div className="d-flex justify-content-between align-items-center">
                            <div>
                              <div className="fw-bold">{country.name}</div>
                              <div className="small text-muted">
                                {country.stores} lojas • {formatNumber(country.users)} usuários
                              </div>
                            </div>
                            <div className="text-end">
                              <div className="fw-bold text-success">
                                {formatCurrency(country.revenue)}
                              </div>
                              <div className="small text-muted">receita</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {selectedCountry && (
                    <div className="card">
                      <div className="card-header">
                        <h5 className="card-title mb-0">{selectedCountry.name}</h5>
                      </div>
                      <div className="card-body">
                        <div className="row g-3">
                          <div className="col-6">
                            <div className="text-muted small">Lojas</div>
                            <div className="h4 mb-0">{selectedCountry.stores}</div>
                          </div>
                          <div className="col-6">
                            <div className="text-muted small">Usuários</div>
                            <div className="h4 mb-0">{formatNumber(selectedCountry.users)}</div>
                          </div>
                          <div className="col-12">
                            <div className="text-muted small">Receita Total</div>
                            <div className="h4 mb-0 text-success">
                              {formatCurrency(selectedCountry.revenue)}
                            </div>
                          </div>
                        </div>
                        
                        <hr className="my-3" />
                        
                        <h6 className="mb-2">Regiões Principais</h6>
                        <div className="list-group list-group-flush">
                          {selectedCountry.regions.slice(0, 3).map((region, index) => (
                            <div key={index} className="list-group-item px-0 py-2">
                              <div className="d-flex justify-content-between">
                                <div>
                                  <div className="fw-bold">{region.name}</div>
                                  <div className="small text-muted">
                                    {region.cities.slice(0, 2).join(', ')}
                                  </div>
                                </div>
                                <div className="text-end">
                                  <div className="fw-bold">{region.stores}</div>
                                  <div className="small text-muted">lojas</div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        <button 
                          className="btn btn-primary btn-sm w-100 mt-3"
                          onClick={() => setShowCountryModal(true)}
                        >
                          Ver Detalhes Completos
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Products Table */}
      <div className="row row-cards mt-4">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Produtos Mais Vendidos</h3>
              <div className="card-actions">
                <button className="btn btn-outline-primary btn-sm">Ver Todos</button>
              </div>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-vcenter">
                  <thead>
                    <tr>
                      <th>Produto</th>
                      <th>Vendas</th>
                      <th>Receita</th>
                      <th>Crescimento</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topProducts.map((product, index) => (
                      <tr key={index}>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="avatar avatar-sm me-3">{index + 1}</div>
                            <div>
                              <div className="fw-bold">{product.name}</div>
                              <div className="text-muted small">Categoria: Eletrônicos</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="fw-bold">{formatNumber(product.sales)}</div>
                          <div className="text-muted small">unidades vendidas</div>
                        </td>
                        <td>
                          <div className="fw-bold">{formatCurrency(product.revenue)}</div>
                          <div className="text-muted small">receita total</div>
                        </td>
                        <td>
                          <div className={`d-flex align-items-center ${
                            product.growth >= 0 ? 'text-green' : 'text-red'
                          }`}>
                            <IconTrendingUp className="icon icon-inline me-1" />
                            {product.growth >= 0 ? '+' : ''}{product.growth}%
                          </div>
                        </td>
                        <td>
                          <span className="badge bg-success">Em Alta</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Store Performance Table */}
      <div className="row row-cards mt-4">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Desempenho Detalhado por Loja</h3>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-vcenter">
                  <thead>
                    <tr>
                      <th>Loja</th>
                      <th>Receita</th>
                      <th>Pedidos</th>
                      <th>Ticket Médio</th>
                      <th>Taxa Conversão</th>
                      <th>Avaliação</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {storePerformanceData.map((store, index) => (
                      <tr key={index}>
                        <td>
                          <div className="d-flex align-items-center">
                            <IconBuildingStore className="icon me-2" />
                            <div>
                              <div className="fw-bold">{store.name}</div>
                              <div className="text-muted small">Filial {index + 1}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="fw-bold">{formatCurrency(store.revenue)}</div>
                        </td>
                        <td>
                          <div className="fw-bold">{formatNumber(store.orders)}</div>
                        </td>
                        <td>
                          <div className="fw-bold">{formatCurrency(store.revenue / store.orders)}</div>
                        </td>
                        <td>
                          <div className="fw-bold">{store.conversion}%</div>
                        </td>
                        <td>
                          <div className="d-flex align-items-center">
                            <span className="text-yellow me-1">★</span>
                            <span className="fw-bold">{store.rating}</span>
                          </div>
                        </td>
                        <td>
                          <span className={`badge ${
                            store.conversion >= 3.5 ? 'bg-success' : 
                            store.conversion >= 2.5 ? 'bg-warning' : 'bg-danger'
                          }`}>
                            {store.conversion >= 3.5 ? 'Excelente' : 
                             store.conversion >= 2.5 ? 'Bom' : 'Precisa Melhorar'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Country Details Modal */}
      {showCountryModal && selectedCountry && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{selectedCountry.name} - Detalhes Completos</h5>
                <button type="button" className="btn-close" onClick={closeCountryModal}></button>
              </div>
              <div className="modal-body">
                <div className="row g-4">
                  <div className="col-md-4">
                    <div className="card card-sm">
                      <div className="card-body text-center">
                        <div className="h1 text-primary mb-2">{selectedCountry.stores}</div>
                        <div className="text-muted">Total de Lojas</div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="card card-sm">
                      <div className="card-body text-center">
                        <div className="h1 text-success mb-2">{formatNumber(selectedCountry.users)}</div>
                        <div className="text-muted">Usuários Ativos</div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="card card-sm">
                      <div className="card-body text-center">
                        <div className="h1 text-warning mb-2">{formatCurrency(selectedCountry.revenue)}</div>
                        <div className="text-muted">Receita Total</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <h6 className="mb-3">Distribuição por Regiões</h6>
                  <div className="table-responsive">
                    <table className="table table-vcenter">
                      <thead>
                        <tr>
                          <th>Região</th>
                          <th>Lojas</th>
                          <th>Cidades Principais</th>
                          <th>% do Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedCountry.regions.map((region, index) => (
                          <tr key={index}>
                            <td>
                              <div className="fw-bold">{region.name}</div>
                            </td>
                            <td>
                              <div className="fw-bold">{region.stores}</div>
                            </td>
                            <td>
                              <div className="text-muted">{region.cities.join(', ')}</div>
                            </td>
                            <td>
                              <div className="fw-bold">
                                {((region.stores / selectedCountry.stores) * 100).toFixed(1)}%
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="mt-4">
                  <h6 className="mb-3">Principais Cidades</h6>
                  <div className="row g-3">
                    {selectedCountry.regions.flatMap(region => 
                      region.cities.slice(0, 2).map((city, index) => (
                        <div key={`${region.name}-${index}`} className="col-md-6">
                          <div className="card card-sm">
                            <div className="card-body d-flex justify-content-between align-items-center">
                              <div>
                                <div className="fw-bold">{city}</div>
                                <div className="small text-muted">{region.name}</div>
                              </div>
                              <div className="text-end">
                                <IconMapPin className="icon text-primary" />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ).slice(0, 6)}
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeCountryModal}>
                  Fechar
                </button>
                <button type="button" className="btn btn-primary">
                  Exportar Dados
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;