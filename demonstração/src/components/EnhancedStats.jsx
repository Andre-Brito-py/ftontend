import React, { useState, useMemo, useEffect } from 'react'
import ReactApexChart from 'react-apexcharts'
import { useGoalsConfig, GoalsConfigButton, GoalsConfigModal } from './GoalsConfig.jsx'

// Hook para tema e cores
const useThemeSettings = () => {
  const [isDark, setIsDark] = useState(false)
  
  useEffect(() => {
    const checkTheme = () => {
      const dark = typeof document !== 'undefined' && document.documentElement.getAttribute('data-theme') === 'dark'
      setIsDark(dark)
    }
    checkTheme()
    window.addEventListener('theme-change', checkTheme)
    return () => window.removeEventListener('theme-change', checkTheme)
  }, [])
  
  const css = typeof window !== 'undefined' ? getComputedStyle(document.documentElement) : null
  const brand = css ? (css.getPropertyValue('--brand-primary') || '#206bc4').trim() : '#206bc4'
  const text = css ? (css.getPropertyValue('--tblr-body-color') || (isDark ? '#e8eaed' : '#232323')).trim() : (isDark ? '#e8eaed' : '#232323')
  const muted = css ? (css.getPropertyValue('--tblr-muted') || (isDark ? '#a1a7b0' : '#667085')).trim() : (isDark ? '#a1a7b0' : '#667085')
  const grid = css ? (css.getPropertyValue('--tblr-border-color') || (isDark ? '#2a313a' : '#e5e7eb')).trim() : (isDark ? '#2a313a' : '#e5e7eb')
  const success = css ? (css.getPropertyValue('--tblr-green') || '#2fb344').trim() : '#2fb344'
  const warning = css ? (css.getPropertyValue('--tblr-yellow') || '#f59f00').trim() : '#f59f00'
  const danger = css ? (css.getPropertyValue('--tblr-red') || '#d63939').trim() : '#d63939'
  
  return { isDark, brand, text, muted, grid, success, warning, danger }
}

// Filtro de período
export const PeriodFilter = ({ value, onChange }) => (
  <div className="btn-group" role="group">
    {[{value: 'today', label: 'Hoje'}, {value: 'week', label: 'Esta Semana'}, {value: 'month', label: 'Este Mês'}, {value: 'year', label: 'Este Ano'}].map((p) => (
      <button key={p.value} type="button" className={`btn btn-outline-primary ${value === p.value ? 'active' : ''}`} onClick={() => onChange(p.value)}>
        {p.label}
      </button>
    ))}
  </div>
)

// Gráfico de área - Vendas por hora
export const SalesAreaChart = ({ period }) => {
  const { isDark, brand, text, muted, grid } = useThemeSettings()
  
  const data = useMemo(() => {
    const baseData = {
      today: { categories: Array.from({length: 24}, (_,i) => `${i}h`), data: [12,19,25,32,28,35,42,38,45,52,48,55,62,58,65,72,68,75,82,78,65,52,38,25] },
      week: { categories: ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'], data: [420,550,680,720,890,1100,950] },
      month: { categories: Array.from({length: 30}, (_,i) => `${i+1}`), data: Array.from({length: 30}, () => Math.floor(Math.random() * 500) + 200) },
      year: { categories: ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'], data: [8500,9200,10800,11500,13200,14800,16200,15500,14200,12800,10500,9800] }
    }
    return baseData[period] || baseData.today
  }, [period])
  
  const options = {
    chart: { 
      type: 'area', 
      toolbar: { show: false }, 
      background: 'transparent',
      foreColor: text,
      animations: { enabled: true, easing: 'easeinout' }
    },
    theme: { mode: isDark ? 'dark' : 'light' },
    stroke: { curve: 'smooth', width: 2 },
    fill: { 
      type: 'gradient', 
      gradient: { 
        shadeIntensity: 1, 
        opacityFrom: 0.7, 
        opacityTo: 0.3,
        stops: [0, 90, 100]
      } 
    },
    dataLabels: { enabled: false },
    grid: { strokeDashArray: 4, borderColor: grid },
    xaxis: { 
      categories: data.categories, 
      labels: { style: { colors: muted } },
      axisBorder: { show: false },
      axisTicks: { show: false }
    },
    yaxis: { 
      labels: { 
        formatter: (v) => `R$ ${(v/1000).toFixed(1)}k`, 
        style: { colors: muted } 
      },
      axisBorder: { show: false }
    },
    colors: [brand],
    tooltip: { 
      theme: isDark ? 'dark' : 'light', 
      y: { formatter: (v) => `R$ ${v.toLocaleString('pt-BR', {minimumFractionDigits: 2})}` } 
    },
    legend: { show: false }
  }
  
  const series = [{ name: 'Vendas', data: data.data }]
  
  return <ReactApexChart options={options} series={series} type="area" height={350} />
}

// Gráfico de barras horizontal - Categorias mais vendidas
export const CategoriesHorizontalChart = ({ period }) => {
  const { isDark, brand, text, muted, grid, success, warning, danger } = useThemeSettings()
  
  const data = useMemo(() => {
    const baseData = {
      today: { categories: ['Hambúrguer','Pizza','Sushi','Tacos','Salada','Bebidas'], data: [45,38,32,28,22,18] },
      week: { categories: ['Hambúrguer','Pizza','Sushi','Tacos','Salada','Bebidas'], data: [320,285,240,195,150,125] },
      month: { categories: ['Hambúrguer','Pizza','Sushi','Tacos','Salada','Bebidas'], data: [1420,1285,1080,875,650,525] },
      year: { categories: ['Hambúrguer','Pizza','Sushi','Tacos','Salada','Bebidas'], data: [16800,15200,12800,10200,7600,6200] }
    }
    return baseData[period] || baseData.today
  }, [period])
  
  const options = {
    chart: { 
      type: 'bar', 
      toolbar: { show: false }, 
      background: 'transparent',
      foreColor: text
    },
    theme: { mode: isDark ? 'dark' : 'light' },
    plotOptions: { 
      bar: { 
        borderRadius: 4, 
        horizontal: true,
        barHeight: '60%'
      } 
    },
    dataLabels: { enabled: false },
    grid: { 
      strokeDashArray: 4, 
      borderColor: grid,
      xaxis: { lines: { show: true } },
      yaxis: { lines: { show: false } }
    },
    xaxis: { 
      categories: data.categories, 
      labels: { style: { colors: muted } },
      axisBorder: { show: false }
    },
    yaxis: { 
      labels: { style: { colors: muted } },
      axisBorder: { show: false }
    },
    colors: [brand, success, warning, danger, '#ae3ec9', '#667085'],
    tooltip: { 
      theme: isDark ? 'dark' : 'light',
      y: { formatter: (v) => `${v} pedidos` }
    },
    legend: { show: false }
  }
  
  const series = [{ name: 'Pedidos', data: data.data }]
  
  return <ReactApexChart options={options} series={series} type="bar" height={300} />
}

// Gráfico de linha múltipla - Comparação de períodos
export const PeriodComparisonChart = ({ currentPeriod, comparePeriod, comparisonPeriods }) => {
  const { isDark, brand, text, muted, grid, success } = useThemeSettings()
  
  const data = useMemo(() => {
    const generateData = (base) => Array.from({length: 7}, () => Math.floor(Math.random() * base) + base/2)
    
    // Ajustar labels baseado nos períodos selecionados
    let categories = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb']
    let currentLabel = 'Período Atual'
    let previousLabel = 'Período Anterior'
    
    if (comparisonPeriods) {
      switch (comparisonPeriods.current) {
        case 'today':
          categories = ['Manhã','Tarde','Noite']
          currentLabel = 'Hoje'
          break
        case 'week':
          categories = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb']
          currentLabel = 'Esta Semana'
          break
        case 'month':
          categories = Array.from({length: 30}, (_,i) => `${i+1}`)
          currentLabel = 'Este Mês'
          break
        case 'year':
          categories = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez']
          currentLabel = 'Este Ano'
          break
      }
      
      switch (comparisonPeriods.previous) {
        case 'previous_week':
          previousLabel = 'Semana Anterior'
          break
        case 'previous_month':
          previousLabel = 'Mês Anterior'
          break
        case 'previous_year':
          previousLabel = 'Ano Anterior'
          break
        case 'same_period_last_month':
          previousLabel = 'Mesmo Período Mês Anterior'
          break
        case 'same_period_last_year':
          previousLabel = 'Mesmo Período Ano Anterior'
          break
      }
    }
    
    return {
      categories,
      current: generateData(1000),
      previous: generateData(800),
      currentLabel,
      previousLabel
    }
  }, [currentPeriod, comparePeriod, comparisonPeriods])
  
  const options = {
    chart: { 
      type: 'line', 
      toolbar: { show: false }, 
      background: 'transparent',
      foreColor: text,
      animations: { enabled: true }
    },
    theme: { mode: isDark ? 'dark' : 'light' },
    stroke: { curve: 'smooth', width: 3 },
    dataLabels: { enabled: false },
    grid: { strokeDashArray: 4, borderColor: grid },
    xaxis: { 
      categories: data.categories, 
      labels: { style: { colors: muted } },
      axisBorder: { show: false }
    },
    yaxis: { 
      labels: { 
        formatter: (v) => `R$ ${(v/1000).toFixed(0)}k`, 
        style: { colors: muted } 
      },
      axisBorder: { show: false }
    },
    colors: [brand, success],
    tooltip: { 
      theme: isDark ? 'dark' : 'light',
      y: { formatter: (v) => `R$ ${v.toLocaleString('pt-BR', {minimumFractionDigits: 2})}` }
    },
    legend: { 
      position: 'top', 
      labels: { colors: text },
      markers: { width: 12, height: 12, radius: 6 }
    }
  }
  
  const series = [
    { name: data.currentLabel, data: data.current },
    { name: data.previousLabel, data: data.previous }
  ]
  
  return <ReactApexChart options={options} series={series} type="line" height={350} />
}

// Gráfico de pizza - Distribuição de vendas por período do dia
export const SalesByPeriodChart = () => {
  const { isDark, brand, text, muted, success, warning, danger } = useThemeSettings()
  
  const data = useMemo(() => {
    return {
      labels: ['Manhã (6-12h)', 'Tarde (12-18h)', 'Noite (18-24h)', 'Madrugada (0-6h)'],
      series: [25, 45, 25, 5],
      colors: [success, brand, warning, danger]
    }
  }, [])
  
  const options = {
    chart: { 
      type: 'donut', 
      background: 'transparent',
      foreColor: text
    },
    theme: { mode: isDark ? 'dark' : 'light' },
    labels: data.labels,
    legend: { 
      position: 'bottom', 
      labels: { colors: text },
      markers: { width: 12, height: 12 }
    },
    colors: data.colors,
    tooltip: { 
      theme: isDark ? 'dark' : 'light',
      y: { formatter: (v) => `${v}%` }
    },
    plotOptions: {
      pie: {
        donut: {
          size: '65%',
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Total',
              formatter: () => '100%'
            }
          }
        }
      }
    }
  }
  
  return <ReactApexChart options={options} series={data.series} type="donut" height={350} />
}

// Gráfico de radar - Performance geral
export const PerformanceRadarChart = ({ goals }) => {
  const { isDark, brand, text, muted, success, warning, danger } = useThemeSettings()
  
  const data = useMemo(() => {
    return {
      categories: ['Vendas', 'Clientes', 'Produtos', 'Pedidos', 'Ticket Médio', 'Satisfação'],
      current: [85, 78, 92, 88, 75, 82],
      target: [goals.sales, goals.customers, goals.products, goals.orders, goals.avgTicket, goals.satisfaction]
    }
  }, [goals])
  
  const options = {
    chart: { 
      type: 'radar', 
      toolbar: { show: false }, 
      background: 'transparent',
      foreColor: text
    },
    theme: { mode: isDark ? 'dark' : 'light' },
    stroke: { width: 2 },
    fill: { opacity: 0.2 },
    markers: { size: 4 },
    grid: { 
      strokeDashArray: 4, 
      borderColor: muted 
    },
    xaxis: { 
      categories: data.categories, 
      labels: { style: { colors: muted } }
    },
    yaxis: { 
      show: false,
      min: 0,
      max: 100
    },
    colors: [brand, success],
    tooltip: { 
      theme: isDark ? 'dark' : 'light',
      y: { formatter: (v) => `${v}%` }
    },
    legend: { 
      position: 'top', 
      labels: { colors: text },
      markers: { width: 12, height: 12 }
    }
  }
  
  const series = [
    { name: 'Atual', data: data.current },
    { name: 'Meta', data: data.target }
  ]
  
  return <ReactApexChart options={options} series={series} type="radar" height={350} />
}

// Card de KPI com variação
export const KPICard = ({ title, value, variation, icon, color = 'primary' }) => {
  const variationColor = variation > 0 ? 'success' : variation < 0 ? 'danger' : 'muted'
  const variationIcon = variation > 0 ? '↗' : variation < 0 ? '↘' : '→'
  
  return (
    <div className="card">
      <div className="card-body">
        <div className="d-flex align-items-center">
          <div className="subheader">{title}</div>
          <div className="ms-auto lh-1">
            <div className={`dropdown`}>
              <div className="text-muted">{icon}</div>
            </div>
          </div>
        </div>
        <div className="d-flex align-items-baseline">
          <div className="h2 mb-0 me-2">{value}</div>
          <div className={`text-${variationColor} d-flex align-items-center`}>
            <span>{variationIcon}</span>
            <span className="ms-1">{Math.abs(variation)}%</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// Componente principal - Estatísticas Avançadas
export default function EnhancedStats({ period = 'today', onPeriodChange }) {
  const { goals, targets } = useGoalsConfig();
  const [showGoalsModal, setShowGoalsModal] = useState(false);
  
  const kpiData = useMemo(() => {
    const base = {
      today: { revenue: 1240.50, orders: 128, customers: 89, avgTicket: 9.69 },
      week: { revenue: 8683.50, orders: 896, customers: 623, avgTicket: 9.69 },
      month: { revenue: 34734.00, orders: 3584, customers: 2492, avgTicket: 9.69 },
      year: { revenue: 416808.00, orders: 43008, customers: 29904, avgTicket: 9.69 }
    }
    return base[period] || base.today
  }, [period])
  
  // Calcular desempenho em relação às metas
  const performanceData = useMemo(() => {
    const currentTargets = targets[period === 'today' ? 'daily' : period === 'week' ? 'weekly' : period === 'month' ? 'monthly' : 'yearly'];
    
    return {
      revenue: Math.min(100, (kpiData.revenue / currentTargets.revenue) * 100),
      orders: Math.min(100, (kpiData.orders / currentTargets.orders) * 100),
      customers: Math.min(100, (kpiData.customers / currentTargets.customers) * 100),
      avgTicket: Math.min(100, (kpiData.avgTicket / 15) * 100) // Considerando meta de R$15 para ticket médio
    };
  }, [kpiData, targets, period]);
  
  return (
    <div className="container-fluid">
      {/* Header com filtros */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <div className="d-flex justify-content-between align-items-center">
                <h3 className="card-title mb-0">Estatísticas Avançadas</h3>
                <div className="d-flex gap-2">
                  <GoalsConfigButton onClick={() => setShowGoalsModal(true)} />
                  <PeriodFilter value={period} onChange={onPeriodChange} />
                </div>
              </div>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-3">
                  <div className="text-muted small">Meta Receita</div>
                  <div className="h5 mb-0">{performanceData.revenue.toFixed(1)}%</div>
                  <div className="progress progress-sm">
                    <div className="progress-bar bg-primary" style={{width: `${performanceData.revenue}%`}}></div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="text-muted small">Meta Pedidos</div>
                  <div className="h5 mb-0">{performanceData.orders.toFixed(1)}%</div>
                  <div className="progress progress-sm">
                    <div className="progress-bar bg-success" style={{width: `${performanceData.orders}%`}}></div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="text-muted small">Meta Clientes</div>
                  <div className="h5 mb-0">{performanceData.customers.toFixed(1)}%</div>
                  <div className="progress progress-sm">
                    <div className="progress-bar bg-info" style={{width: `${performanceData.customers}%`}}></div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="text-muted small">Meta Ticket Médio</div>
                  <div className="h5 mb-0">{performanceData.avgTicket.toFixed(1)}%</div>
                  <div className="progress progress-sm">
                    <div className="progress-bar bg-warning" style={{width: `${performanceData.avgTicket}%`}}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="row row-cards mb-4">
        <div className="col-sm-6 col-lg-3">
          <KPICard 
            title="Receita Total" 
            value={`R$ ${kpiData.revenue.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`}
            variation={12.5}
            icon="💰"
            color="success"
          />
          <div className="mt-2">
            <div className="text-muted small">Meta: R$ {targets[period === 'today' ? 'daily' : period === 'week' ? 'weekly' : period === 'month' ? 'monthly' : 'yearly'].revenue.toLocaleString('pt-BR')}</div>
            <div className="progress progress-xs">
              <div className="progress-bar bg-success" style={{width: `${Math.min(100, performanceData.revenue)}%`}}></div>
            </div>
          </div>
        </div>
        <div className="col-sm-6 col-lg-3">
          <KPICard 
            title="Total de Pedidos" 
            value={kpiData.orders.toLocaleString('pt-BR')}
            variation={8.3}
            icon="📦"
            color="primary"
          />
          <div className="mt-2">
            <div className="text-muted small">Meta: {targets[period === 'today' ? 'daily' : period === 'week' ? 'weekly' : period === 'month' ? 'monthly' : 'yearly'].orders.toLocaleString('pt-BR')}</div>
            <div className="progress progress-xs">
              <div className="progress-bar bg-primary" style={{width: `${Math.min(100, performanceData.orders)}%`}}></div>
            </div>
          </div>
        </div>
        <div className="col-sm-6 col-lg-3">
          <KPICard 
            title="Clientes Atendidos" 
            value={kpiData.customers.toLocaleString('pt-BR')}
            variation={15.7}
            icon="👥"
            color="info"
          />
          <div className="mt-2">
            <div className="text-muted small">Meta: {targets[period === 'today' ? 'daily' : period === 'week' ? 'weekly' : period === 'month' ? 'monthly' : 'yearly'].customers.toLocaleString('pt-BR')}</div>
            <div className="progress progress-xs">
              <div className="progress-bar bg-info" style={{width: `${Math.min(100, performanceData.customers)}%`}}></div>
            </div>
          </div>
        </div>
        <div className="col-sm-6 col-lg-3">
          <KPICard 
            title="Ticket Médio" 
            value={`R$ ${kpiData.avgTicket.toFixed(2)}`}
            variation={-2.1}
            icon="🎯"
            color="warning"
          />
          <div className="mt-2">
            <div className="text-muted small">Meta: R$ 15,00</div>
            <div className="progress progress-xs">
              <div className="progress-bar bg-warning" style={{width: `${Math.min(100, performanceData.avgTicket)}%`}}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Primeira linha de gráficos */}
      <div className="row row-cards mb-4">
        <div className="col-lg-8">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Vendas por Hora</h3>
            </div>
            <div className="card-body">
              <SalesAreaChart period={period} />
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Vendas por Período</h3>
            </div>
            <div className="card-body">
              <SalesByPeriodChart />
            </div>
          </div>
        </div>
      </div>

      {/* Segunda linha de gráficos */}
      <div className="row row-cards mb-4">
        <div className="col-lg-6">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Categorias Mais Vendidas</h3>
            </div>
            <div className="card-body">
              <CategoriesHorizontalChart period={period} />
            </div>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Performance vs Meta</h3>
            </div>
            <div className="card-body">
              <PerformanceRadarChart goals={goals} />
            </div>
          </div>
        </div>
      </div>

      {/* Terceira linha - Comparação de períodos */}
      <div className="row row-cards mb-4">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Comparação de Períodos</h3>
            </div>
            <div className="card-body">
              <PeriodComparisonChart 
                currentPeriod={period} 
                comparePeriod="previous" 
                comparisonPeriods={{ current: period, previous: 'previous_week' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tabela de produtos mais vendidos */}
      <div className="row row-cards">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <div className="d-flex justify-content-between align-items-center">
                <h3 className="card-title">Produtos Mais Vendidos</h3>
                <div className="text-muted">Período: {period === 'today' ? 'Hoje' : period === 'week' ? 'Esta Semana' : period === 'month' ? 'Este Mês' : 'Este Ano'}</div>
              </div>
            </div>
            <div className="table-responsive">
              <table className="table table-vcenter card-table">
                <thead>
                  <tr>
                    <th>Produto</th>
                    <th>Categoria</th>
                    <th className="text-end">Quantidade</th>
                    <th className="text-end">Receita</th>
                    <th className="text-end">% do Total</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { product: 'Hambúrguer Clássico', category: 'Hambúrguer', qty: 145, revenue: 2465.00, percent: 28.5 },
                    { product: 'Pizza Margherita', category: 'Pizza', qty: 98, revenue: 1960.00, percent: 22.7 },
                    { product: 'Sushi Combo 16pc', category: 'Sushi', qty: 67, revenue: 1340.00, percent: 15.5 },
                    { product: 'Tacos de Carnitas', category: 'Tacos', qty: 54, revenue: 810.00, percent: 9.4 },
                    { product: 'Salada Caesar', category: 'Salada', qty: 43, revenue: 645.00, percent: 7.5 }
                  ].map((item, idx) => (
                    <tr key={idx}>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="avatar avatar-sm me-2">{idx + 1}</div>
                          <div>{item.product}</div>
                        </div>
                      </td>
                      <td>
                        <span className="badge bg-primary">{item.category}</span>
                      </td>
                      <td className="text-end">
                        <strong>{item.qty}</strong>
                      </td>
                      <td className="text-end text-success">
                        <strong>R$ {item.revenue.toFixed(2)}</strong>
                      </td>
                      <td className="text-end">
                        <div className="d-flex align-items-center justify-content-end">
                          <div className="progress progress-sm me-2" style={{width: '80px'}}>
                            <div className="progress-bar" style={{width: `${item.percent}%`}}></div>
                          </div>
                          <span className="text-muted">{item.percent}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Configuração */}
      <GoalsConfigModal 
        show={showGoalsModal} 
        onClose={() => setShowGoalsModal(false)} 
      />
    </div>
  )
}