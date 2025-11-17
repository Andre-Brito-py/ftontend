import React, { useEffect, useMemo, useRef, useState } from 'react'
import { IconCurrencyDollar, IconTrendingUp, IconTrendingDown, IconUsers, IconBuilding, IconCalendar, IconDownload, IconFilter, IconChartBar, IconReceipt, IconCreditCard, IconCash, IconRefresh } from '@tabler/icons-react'

const FinancialManagement = () => {
  const [financialData, setFinancialData] = useState({
    revenue: {
      total: 1258400,
      monthly: 104866.67,
      daily: 3448.90,
      growth: 12.5
    },
    subscriptions: {
      total: 245,
      active: 198,
      cancelled: 47,
      growth: 8.3
    },
    plans: [
      { name: 'Basic', price: 29, subscribers: 89, revenue: 2581 },
      { name: 'Professional', price: 79, subscribers: 76, revenue: 6004 },
      { name: 'Enterprise', price: 199, subscribers: 33, revenue: 6567 },
      { name: 'Custom', price: 499, subscribers: 0, revenue: 0 }
    ],
    transactions: [],
    chartData: []
  })
  const [loading, setLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState('month')
  const [selectedPlan, setSelectedPlan] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [transactionsPerPage, setTransactionsPerPage] = useState(10)
  const [isDarkMode, setIsDarkMode] = useState(false)

  // Detectar modo claro/escuro
  useEffect(() => {
    const checkDarkMode = () => {
      const htmlElement = document.documentElement
      setIsDarkMode(htmlElement.classList.contains('dark') || 
                   htmlElement.getAttribute('data-bs-theme') === 'dark')
    }

    checkDarkMode()
    const observer = new MutationObserver(checkDarkMode)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class', 'data-bs-theme']
    })
    return () => observer.disconnect()
  }, [])

  // Gerar dados financeiros simulados
  const generateMockData = () => {
    const transactions = []
    const statuses = ['completed', 'pending', 'failed', 'refunded']
    const paymentMethods = ['credit_card', 'pix', 'bank_transfer', 'boleto']
    const plans = ['Basic', 'Professional', 'Enterprise', 'Custom']
    
    for (let i = 1; i <= 50; i++) {
      const date = new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000)
      const amount = Math.floor(Math.random() * 5000) + 29
      const status = statuses[Math.floor(Math.random() * statuses.length)]
      const paymentMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)]
      const plan = plans[Math.floor(Math.random() * plans.length)]
      const customer = `Cliente ${Math.floor(Math.random() * 100) + 1}`
      
      transactions.push({
        id: `txn-${i.toString().padStart(6, '0')}`,
        date: date.toISOString(),
        customer,
        plan,
        amount,
        status,
        paymentMethod,
        description: `Assinatura ${plan} - ${customer}`,
        invoiceUrl: `https://demo.com/invoice/${i}`,
        refundAmount: status === 'refunded' ? Math.floor(amount * 0.8) : 0
      })
    }
    
    // Ordenar por data (mais recente primeiro)
    transactions.sort((a, b) => new Date(b.date) - new Date(a.date))
    
    // Gerar dados para gráfico
    const chartData = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dayRevenue = Math.floor(Math.random() * 500) + 200
      chartData.push({
        date: date.toISOString().split('T')[0],
        revenue: dayRevenue,
        transactions: Math.floor(Math.random() * 20) + 5
      })
    }
    
    return { transactions, chartData }
  }

  useEffect(() => {
    setLoading(true)
    setTimeout(() => {
      const { transactions, chartData } = generateMockData()
      setFinancialData(prev => ({
        ...prev,
        transactions,
        chartData
      }))
      setLoading(false)
    }, 1000)
  }, [])

  // Filtrar transações por período e plano
  const filteredTransactions = useMemo(() => {
    let filtered = financialData.transactions

    // Filtrar por período
    const now = new Date()
    let startDate
    switch (selectedPeriod) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
        break
      case 'quarter':
        startDate = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate())
        break
      case 'year':
        startDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate())
        break
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) // Default month
    }
    
    filtered = filtered.filter(t => new Date(t.date) >= startDate)

    // Filtrar por plano
    if (selectedPlan !== 'all') {
      filtered = filtered.filter(t => t.plan === selectedPlan)
    }

    return filtered
  }, [financialData.transactions, selectedPeriod, selectedPlan])

  // Paginação
  const totalPages = Math.ceil(filteredTransactions.length / transactionsPerPage)
  const startIndex = (currentPage - 1) * transactionsPerPage
  const paginatedTransactions = filteredTransactions.slice(startIndex, startIndex + transactionsPerPage)

  const getStatusBadge = (status) => {
    const colors = {
      completed: 'bg-success',
      pending: 'bg-warning',
      failed: 'bg-danger',
      refunded: 'bg-secondary'
    }
    const labels = {
      completed: 'Concluído',
      pending: 'Pendente',
      failed: 'Falhou',
      refunded: 'Reembolsado'
    }
    return <span className={`badge ${colors[status]}`}>{labels[status]}</span>
  }

  const getPaymentMethodIcon = (method) => {
    switch (method) {
      case 'credit_card': return <IconCreditCard size={16} />
      case 'pix': return <IconCash size={16} />
      case 'bank_transfer': return <IconChartBar size={16} />
      case 'boleto': return <IconReceipt size={16} />
      default: return <IconCurrencyDollar size={16} />
    }
  }

  const getPaymentMethodLabel = (method) => {
    const labels = {
      credit_card: 'Cartão de Crédito',
      pix: 'PIX',
      bank_transfer: 'Transferência Bancária',
      boleto: 'Boleto Bancário'
    }
    return labels[method] || method
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const exportData = () => {
    const csvContent = [
      ['Data', 'Cliente', 'Plano', 'Valor', 'Status', 'Método de Pagamento', 'Descrição'],
      ...filteredTransactions.map(t => [
        formatDate(t.date),
        t.customer,
        t.plan,
        formatCurrency(t.amount),
        getPaymentMethodLabel(t.status),
        getPaymentMethodLabel(t.paymentMethod),
        t.description
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `transacoes-financeiras-${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const clearFilters = () => {
    setSelectedPeriod('month')
    setSelectedPlan('all')
  }

  return (
    <div className="container-fluid">
      <div className="page-header mb-4">
        <div className="row align-items-center">
          <div className="col">
            <h2 className="page-title">Gestão Financeira</h2>
            <div className="page-pretitle">Controle de receitas, assinaturas e transações</div>
          </div>
          <div className="col-auto ms-auto">
            <div className="btn-list">
              <button
                type="button"
                className="btn btn-outline-primary"
                onClick={exportData}
                disabled={filteredTransactions.length === 0}
              >
                <IconDownload size={16} className="me-1" />
                Exportar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* KPIs Financeiros */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="me-3">
                  <IconCurrencyDollar size={24} className="text-success" />
                </div>
                <div>
                  <div className="h3 m-0">{formatCurrency(financialData.revenue.total)}</div>
                  <div className="text-muted small">Receita Total</div>
                  <div className="text-success small">
                    <IconTrendingUp size={14} className="me-1" />
                    +{financialData.revenue.growth}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="me-3">
                  <IconTrendingUp size={24} className="text-primary" />
                </div>
                <div>
                  <div className="h3 m-0">{formatCurrency(financialData.revenue.monthly)}</div>
                  <div className="text-muted small">Receita Mensal</div>
                  <div className="text-muted small">Média diária: {formatCurrency(financialData.revenue.daily)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="me-3">
                  <IconUsers size={24} className="text-info" />
                </div>
                <div>
                  <div className="h3 m-0">{financialData.subscriptions.total}</div>
                  <div className="text-muted small">Total Assinaturas</div>
                  <div className="text-success small">
                    <IconTrendingUp size={14} className="me-1" />
                    +{financialData.subscriptions.growth}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="me-3">
                  <IconBuilding size={24} className="text-warning" />
                </div>
                <div>
                  <div className="h3 m-0">{financialData.subscriptions.active}</div>
                  <div className="text-muted small">Assinaturas Ativas</div>
                  <div className="text-muted small">{financialData.subscriptions.cancelled} canceladas</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Gráfico de Receita */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Evolução da Receita</h3>
              <div className="card-actions">
                <div className="btn-list">
                  {['week', 'month', 'quarter', 'year'].map(period => (
                    <button
                      key={period}
                      className={`btn btn-sm ${selectedPeriod === period ? 'btn-primary' : 'btn-outline-primary'}`}
                      onClick={() => setSelectedPeriod(period)}
                    >
                      {period === 'week' && 'Semana'}
                      {period === 'month' && 'Mês'}
                      {period === 'quarter' && 'Trimestre'}
                      {period === 'year' && 'Ano'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="card-body">
              <div className="row g-3">
                {financialData.chartData.map((day, index) => (
                  <div key={index} className="col-md-6 col-lg-4 col-xl-3">
                    <div className="card card-sm">
                      <div className="card-body">
                        <div className="d-flex align-items-center">
                          <div className="me-3">
                            <IconCalendar size={20} className="text-muted" />
                          </div>
                          <div className="flex-fill">
                            <div className="strong">{formatDate(day.date)}</div>
                            <div className="text-success">{formatCurrency(day.revenue)}</div>
                            <div className="text-muted small">{day.transactions} transações</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Planos e Preços */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Planos e Assinaturas</h3>
            </div>
            <div className="card-body">
              <div className="row g-3">
                {financialData.plans.map((plan, index) => (
                  <div key={index} className="col-md-6 col-lg-3">
                    <div className="card card-sm">
                      <div className="card-body text-center">
                        <div className="mb-3">
                          <h4 className="mb-1">{plan.name}</h4>
                          <div className="h2 text-success">{formatCurrency(plan.price)}</div>
                          <small className="text-muted">por mês</small>
                        </div>
                        <div className="mb-3">
                          <div className="strong">{plan.subscribers}</div>
                          <small className="text-muted">assinantes</small>
                        </div>
                        <div className="mb-3">
                          <div className="strong text-success">{formatCurrency(plan.revenue)}</div>
                          <small className="text-muted">receita/mês</small>
                        </div>
                        <div className="progress mb-2" style={{ height: '4px' }}>
                          <div 
                            className="progress-bar bg-success" 
                            style={{ 
                              width: `${(plan.subscribers / financialData.subscriptions.total) * 100}%` 
                            }}
                          ></div>
                        </div>
                        <small className="text-muted">
                          {((plan.subscribers / financialData.subscriptions.total) * 100).toFixed(1)}% do total
                        </small>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros e Transações */}
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <div className="row align-items-center">
                <div className="col">
                  <h3 className="card-title">Transações Recentes</h3>
                </div>
                <div className="col-auto">
                  <div className="btn-list">
                    <select
                      className="form-select form-select-sm"
                      value={selectedPlan}
                      onChange={(e) => setSelectedPlan(e.target.value)}
                    >
                      <option value="all">Todos os Planos</option>
                      <option value="Basic">Basic</option>
                      <option value="Professional">Professional</option>
                      <option value="Enterprise">Enterprise</option>
                      <option value="Custom">Custom</option>
                    </select>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-secondary"
                      onClick={clearFilters}
                    >
                      <IconFilter size={14} className="me-1" />
                      Limpar
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="card-body p-0">
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary mb-3" role="status">
                    <span className="visually-hidden">Carregando...</span>
                  </div>
                  <p className="text-muted">Carregando transações...</p>
                </div>
              ) : paginatedTransactions.length === 0 ? (
                <div className="text-center py-5">
                  <IconReceipt size={48} className="text-muted mb-3" />
                  <h4 className="text-muted">Nenhuma transação encontrada</h4>
                  <p className="text-muted">Tente ajustar os filtros ou período de tempo</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover table-nowrap mb-0">
                    <thead>
                      <tr>
                        <th>Data</th>
                        <th>Cliente</th>
                        <th>Plano</th>
                        <th>Valor</th>
                        <th>Status</th>
                        <th>Pagamento</th>
                        <th>Descrição</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedTransactions.map((transaction) => (
                        <tr key={transaction.id} className={transaction.status === 'failed' ? 'table-danger' : transaction.status === 'refunded' ? 'table-secondary' : ''}>
                          <td>
                            <div>
                              <div className="strong">{formatDate(transaction.date)}</div>
                              <small className="text-muted">{formatDateTime(transaction.date).split(' ')[1]}</small>
                            </div>
                          </td>
                          <td>
                            <div className="text-truncate" style={{ maxWidth: '150px' }}>
                              {transaction.customer}
                            </div>
                          </td>
                          <td>
                            <span className="badge bg-outline-primary">{transaction.plan}</span>
                          </td>
                          <td>
                            <div className="strong text-success">{formatCurrency(transaction.amount)}</div>
                            {transaction.refundAmount > 0 && (
                              <small className="text-danger">Reembolso: {formatCurrency(transaction.refundAmount)}</small>
                            )}
                          </td>
                          <td>{getStatusBadge(transaction.status)}</td>
                          <td>
                            <div className="d-flex align-items-center">
                              {getPaymentMethodIcon(transaction.paymentMethod)}
                              <span className="ms-1">{getPaymentMethodLabel(transaction.paymentMethod)}</span>
                            </div>
                          </td>
                          <td>
                            <div className="text-truncate" style={{ maxWidth: '200px' }}>
                              {transaction.description}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            {filteredTransactions.length > 0 && (
              <div className="card-footer d-flex align-items-center">
                <div className="text-muted small">
                  Mostrando {startIndex + 1} a {Math.min(startIndex + transactionsPerPage, filteredTransactions.length)} de {filteredTransactions.length} transações
                </div>
                <div className="ms-auto">
                  <nav aria-label="Page navigation">
                    <ul className="pagination pagination-sm mb-0">
                      <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                        <button 
                          className="page-link" 
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                          disabled={currentPage === 1}
                        >
                          Anterior
                        </button>
                      </li>
                      {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                        const page = i + 1
                        return (
                          <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                            <button 
                              className="page-link" 
                              onClick={() => setCurrentPage(page)}
                            >
                              {page}
                            </button>
                          </li>
                        )
                      })}
                      <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                        <button 
                          className="page-link" 
                          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                          disabled={currentPage === totalPages}
                        >
                          Próximo
                        </button>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default FinancialManagement