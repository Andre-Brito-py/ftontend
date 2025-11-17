import React from 'react'
import ReactApexChart from 'react-apexcharts'

// Utilitários: ler tema atual e variáveis CSS
const useThemeSettings = () => {
  const isDark = typeof document !== 'undefined' && document.documentElement.getAttribute('data-theme') === 'dark'
  const css = typeof window !== 'undefined' ? getComputedStyle(document.documentElement) : null
  const brand = css ? (css.getPropertyValue('--brand-primary') || '#206bc4').trim() : '#206bc4'
  const text = css ? (css.getPropertyValue('--tblr-body-color') || (isDark ? '#e8eaed' : '#232323')).trim() : (isDark ? '#e8eaed' : '#232323')
  const muted = css ? (css.getPropertyValue('--tblr-muted') || (isDark ? '#a1a7b0' : '#667085')).trim() : (isDark ? '#a1a7b0' : '#667085')
  const grid = css ? (css.getPropertyValue('--tblr-border-color') || (isDark ? '#2a313a' : '#e5e7eb')).trim() : (isDark ? '#2a313a' : '#e5e7eb')
  return { isDark, brand, text, muted, grid }
}

// Gráfico de linha: Receita por dia
export const RevenueLineChart = ({ series, categories }) => {
  const { isDark, brand, text, muted, grid } = useThemeSettings()
  const options = {
    chart: { type: 'line', toolbar: { show: false }, animations: { enabled: true }, background: 'transparent', foreColor: text },
    theme: { mode: isDark ? 'dark' : 'light' },
    stroke: { curve: 'smooth', width: 3 },
    dataLabels: { enabled: false },
    grid: { strokeDashArray: 4, borderColor: grid },
    xaxis: { categories, labels: { style: { colors: muted } } },
    yaxis: { labels: { formatter: (v) => `R$ ${v.toFixed(0)}`, style: { colors: muted } } },
    colors: [brand],
    tooltip: { theme: isDark ? 'dark' : 'light', y: { formatter: (v) => `R$ ${v.toFixed(2)}` } }
  }
  return <ReactApexChart options={options} series={series} type="line" height={300} />
}

// Gráfico de barras: Top produtos
export const TopProductsBarChart = ({ series, categories }) => {
  const { isDark, brand, text, muted, grid } = useThemeSettings()
  const options = {
    chart: { type: 'bar', toolbar: { show: false }, background: 'transparent', foreColor: text },
    theme: { mode: isDark ? 'dark' : 'light' },
    plotOptions: { bar: { borderRadius: 4, columnWidth: '55%' } },
    dataLabels: { enabled: false },
    xaxis: { categories, labels: { style: { colors: muted } } },
    colors: [brand],
    grid: { strokeDashArray: 4, borderColor: grid }
  }
  return <ReactApexChart options={options} series={series} type="bar" height={300} />
}

// Gráfico de donut: Métodos de pagamento
export const PaymentsDonutChart = ({ series, labels }) => {
  const { isDark, brand, text, muted } = useThemeSettings()
  const options = {
    chart: { type: 'donut', background: 'transparent', foreColor: text },
    theme: { mode: isDark ? 'dark' : 'light' },
    labels,
    legend: { position: 'bottom', labels: { colors: muted } },
    colors: [brand, '#2fb344', '#f59f00', '#ae3ec9']
  }
  return <ReactApexChart options={options} series={series} type="donut" height={300} />
}

export default function ChartsDemo() {
  // Dados mock para a demonstração
  const revenueCategories = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom']
  const revenueSeries = [{ name: 'Receita', data: [2100, 2500, 1800, 3000, 4200, 3800, 4400] }]

  const topProductsCategories = ['Hambúrguer', 'Pizza', 'Sushi', 'Tacos', 'Salada']
  const topProductsSeries = [{ name: 'Pedidos', data: [55, 73, 41, 36, 29] }]

  const paymentsLabels = ['PIX', 'Crédito', 'Débito', 'Dinheiro']
  const paymentsSeries = [45, 30, 15, 10]

  return (
    <div className="row row-cards">
      <div className="col-md-6">
        <div className="card">
          <div className="card-header"><h3 className="card-title">Receita por Dia</h3></div>
          <div className="card-body">
            <RevenueLineChart series={revenueSeries} categories={revenueCategories} />
          </div>
        </div>
      </div>
      <div className="col-md-6">
        <div className="card">
          <div className="card-header"><h3 className="card-title">Top Produtos</h3></div>
          <div className="card-body">
            <TopProductsBarChart series={topProductsSeries} categories={topProductsCategories} />
          </div>
        </div>
      </div>
      <div className="col-md-6">
        <div className="card">
          <div className="card-header"><h3 className="card-title">Pagamentos</h3></div>
          <div className="card-body">
            <PaymentsDonutChart series={paymentsSeries} labels={paymentsLabels} />
          </div>
        </div>
      </div>
    </div>
  )
}