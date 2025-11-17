import React, { useEffect, useMemo, useRef, useState } from 'react'
import { IconSearch, IconFilter, IconDownload, IconTrash, IconRefresh, IconEye, IconX, IconCheck, IconAlertCircle, IconInfoCircle, IconClock, IconUser, IconDeviceDesktop, IconWorld, IconShield, IconKey, IconDatabase, IconSettings } from '@tabler/icons-react'

const Logs = () => {
  const [logs, setLogs] = useState([])
  const [filteredLogs, setFilteredLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLevel, setSelectedLevel] = useState('all')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [dateRange, setDateRange] = useState('today')
  const [currentPage, setCurrentPage] = useState(1)
  const [logsPerPage, setLogsPerPage] = useState(25)
  const [selectedLog, setSelectedLog] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [autoRefresh, setAutoRefresh] = useState(false)
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

  // Gerar logs simulados
  const generateMockLogs = () => {
    const levels = ['info', 'warning', 'error', 'success']
    const categories = ['auth', 'api', 'database', 'system', 'security', 'user']
    const actions = [
      'Login realizado com sucesso',
      'Tentativa de login falhou',
      'API key gerada',
      'Dados atualizados',
      'Backup realizado',
      'Erro de conexão',
      'Permissão negada',
      'Configuração alterada',
      'Usuário criado',
      'Sessão expirada',
      'Arquivo exportado',
      'Manutenção iniciada',
      'Webhook disparado',
      'Cache limpo',
      'Notificação enviada'
    ]
    const users = ['admin@demo.com', 'user@demo.com', 'system', 'api-service', 'backup-bot']
    
    const mockLogs = []
    const now = new Date()
    
    for (let i = 0; i < 200; i++) {
      const date = new Date(now.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000)
      const level = levels[Math.floor(Math.random() * levels.length)]
      const category = categories[Math.floor(Math.random() * categories.length)]
      const action = actions[Math.floor(Math.random() * actions.length)]
      const user = users[Math.floor(Math.random() * users.length)]
      
      mockLogs.push({
        id: `log-${i + 1}`,
        timestamp: date.toISOString(),
        level,
        category,
        message: action,
        user,
        ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        details: {
          requestId: `req-${Math.random().toString(36).substr(2, 9)}`,
          duration: Math.floor(Math.random() * 1000) + 50,
          memory: Math.floor(Math.random() * 100) + 20,
          statusCode: level === 'error' ? [400, 401, 403, 404, 500][Math.floor(Math.random() * 5)] : [200, 201][Math.floor(Math.random() * 2)]
        }
      })
    }
    
    return mockLogs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  }

  useEffect(() => {
    setLoading(true)
    // Simular carregamento
    setTimeout(() => {
      const mockLogs = generateMockLogs()
      setLogs(mockLogs)
      setFilteredLogs(mockLogs)
      setLoading(false)
    }, 1000)
  }, [])

  // Auto refresh
  useEffect(() => {
    if (!autoRefresh) return
    
    const interval = setInterval(() => {
      const newLog = {
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString(),
        level: ['info', 'warning', 'success'][Math.floor(Math.random() * 3)],
        category: ['api', 'system', 'database'][Math.floor(Math.random() * 3)],
        message: ['Novo registro criado', 'Dados sincronizados', 'Cache atualizado'][Math.floor(Math.random() * 3)],
        user: 'system',
        ip: '127.0.0.1',
        userAgent: 'System Monitor',
        details: { requestId: `req-${Date.now()}`, duration: Math.floor(Math.random() * 100), memory: Math.floor(Math.random() * 50) + 10 }
      }
      
      setLogs(prev => [newLog, ...prev].slice(0, 500))
    }, 5000)

    return () => clearInterval(interval)
  }, [autoRefresh])

  // Filtrar logs
  useEffect(() => {
    let filtered = logs

    // Filtrar por nível
    if (selectedLevel !== 'all') {
      filtered = filtered.filter(log => log.level === selectedLevel)
    }

    // Filtrar por categoria
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(log => log.category === selectedCategory)
    }

    // Filtrar por data
    const now = new Date()
    let startDate
    switch (dateRange) {
      case 'today':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        break
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
        break
      case 'all':
      default:
        startDate = null
    }
    
    if (startDate) {
      filtered = filtered.filter(log => new Date(log.timestamp) >= startDate)
    }

    // Filtrar por termo de busca
    if (searchTerm) {
      filtered = filtered.filter(log => 
        log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.ip.includes(searchTerm)
      )
    }

    setFilteredLogs(filtered)
    setCurrentPage(1)
  }, [logs, selectedLevel, selectedCategory, dateRange, searchTerm])

  // Paginação
  const totalPages = Math.ceil(filteredLogs.length / logsPerPage)
  const startIndex = (currentPage - 1) * logsPerPage
  const paginatedLogs = filteredLogs.slice(startIndex, startIndex + logsPerPage)

  const getLevelIcon = (level) => {
    switch (level) {
      case 'success': return <IconCheck size={16} className="text-success" />
      case 'warning': return <IconAlertCircle size={16} className="text-warning" />
      case 'error': return <IconX size={16} className="text-danger" />
      default: return <IconInfoCircle size={16} className="text-info" />
    }
  }

  const getLevelBadge = (level) => {
    const colors = {
      info: 'bg-info',
      success: 'bg-success',
      warning: 'bg-warning',
      error: 'bg-danger'
    }
    return <span className={`badge ${colors[level]}`}>{level.toUpperCase()}</span>
  }

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'auth': return <IconShield size={16} />
      case 'api': return <IconKey size={16} />
      case 'database': return <IconDatabase size={16} />
      case 'system': return <IconSettings size={16} />
      case 'security': return <IconShield size={16} />
      case 'user': return <IconUser size={16} />
      default: return <IconInfoCircle size={16} />
    }
  }

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  const exportLogs = () => {
    const csvContent = [
      ['Data/Hora', 'Nível', 'Categoria', 'Mensagem', 'Usuário', 'IP'],
      ...filteredLogs.map(log => [
        formatTimestamp(log.timestamp),
        log.level,
        log.category,
        log.message,
        log.user,
        log.ip
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `logs-${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedLevel('all')
    setSelectedCategory('all')
    setDateRange('today')
  }

  return (
    <div className="container-fluid">
      <div className="page-header mb-4">
        <div className="row align-items-center">
          <div className="col">
            <h2 className="page-title">Logs do Sistema</h2>
            <div className="page-pretitle">Visualizar e gerenciar registros de atividade</div>
          </div>
          <div className="col-auto ms-auto">
            <div className="btn-list">
              <button
                type="button"
                className={`btn ${autoRefresh ? 'btn-success' : 'btn-outline-secondary'}`}
                onClick={() => setAutoRefresh(!autoRefresh)}
              >
                <IconRefresh size={16} className={`me-1 ${autoRefresh ? 'animate-spin' : ''}`} />
                {autoRefresh ? 'Auto Atualização ON' : 'Auto Atualização OFF'}
              </button>
              <button
                type="button"
                className="btn btn-outline-primary"
                onClick={exportLogs}
                disabled={filteredLogs.length === 0}
              >
                <IconDownload size={16} className="me-1" />
                Exportar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label">Pesquisar</label>
              <div className="input-group">
                <span className="input-group-text">
                  <IconSearch size={16} />
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Pesquisar mensagens, usuários, IPs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-2">
              <label className="form-label">Nível</label>
              <select
                className="form-select"
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
              >
                <option value="all">Todos</option>
                <option value="info">Info</option>
                <option value="success">Sucesso</option>
                <option value="warning">Aviso</option>
                <option value="error">Erro</option>
              </select>
            </div>
            <div className="col-md-2">
              <label className="form-label">Categoria</label>
              <select
                className="form-select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="all">Todas</option>
                <option value="auth">Autenticação</option>
                <option value="api">API</option>
                <option value="database">Banco de Dados</option>
                <option value="system">Sistema</option>
                <option value="security">Segurança</option>
                <option value="user">Usuário</option>
              </select>
            </div>
            <div className="col-md-2">
              <label className="form-label">Período</label>
              <select
                className="form-select"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
              >
                <option value="today">Hoje</option>
                <option value="week">Última Semana</option>
                <option value="month">Último Mês</option>
                <option value="all">Todos</option>
              </select>
            </div>
            <div className="col-md-2">
              <label className="form-label">Ações</label>
              <div className="d-grid">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={clearFilters}
                >
                  <IconFilter size={16} className="me-1" />
                  Limpar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="row mb-4">
        <div className="col-md-3">
        <div className="card">
          <div className="card-body">
            <div className="d-flex align-items-center">
              <div className="me-3">
                <IconInfoCircle size={24} className="text-info" />
              </div>
              <div>
                <div className="h3 m-0">{logs.filter(log => log.level === 'info').length}</div>
                <div className="text-muted small">Info</div>
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
                  <IconCheck size={24} className="text-success" />
                </div>
                <div>
                  <div className="h3 m-0">{logs.filter(log => log.level === 'success').length}</div>
                  <div className="text-muted small">Sucesso</div>
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
                  <IconAlertCircle size={24} className="text-warning" />
                </div>
                <div>
                  <div className="h3 m-0">{logs.filter(log => log.level === 'warning').length}</div>
                  <div className="text-muted small">Avisos</div>
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
                  <IconX size={24} className="text-danger" />
                </div>
                <div>
                  <div className="h3 m-0">{logs.filter(log => log.level === 'error').length}</div>
                  <div className="text-muted small">Erros</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabela de Logs */}
      <div className="card">
        <div className="card-header">
          <div className="row align-items-center">
            <div className="col">
              <h3 className="card-title">
                Registros ({filteredLogs.length} de {logs.length})
              </h3>
            </div>
            <div className="col-auto">
              <div className="btn-list">
                <select
                  className="form-select form-select-sm"
                  value={logsPerPage}
                  onChange={(e) => setLogsPerPage(Number(e.target.value))}
                >
                  <option value={10}>10 por página</option>
                  <option value={25}>25 por página</option>
                  <option value={50}>50 por página</option>
                  <option value={100}>100 por página</option>
                </select>
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
              <p className="text-muted">Carregando logs...</p>
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="text-center py-5">
              <IconSearch size={48} className="text-muted mb-3" />
              <h4 className="text-muted">Nenhum log encontrado</h4>
              <p className="text-muted">Tente ajustar os filtros ou período de tempo</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover table-nowrap mb-0">
                <thead>
                  <tr>
                    <th width="180">Data/Hora</th>
                    <th width="100">Nível</th>
                    <th width="120">Categoria</th>
                    <th>Mensagem</th>
                    <th width="150">Usuário</th>
                    <th width="120">IP</th>
                    <th width="80">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedLogs.map((log) => (
                    <tr key={log.id} className={log.level === 'error' ? 'table-danger' : ''}>
                      <td>
                        <div className="d-flex align-items-center">
                          <IconClock size={14} className="text-muted me-2" />
                          <small className="text-muted">{formatTimestamp(log.timestamp)}</small>
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          {getLevelIcon(log.level)}
                          <span className="ms-1">{getLevelBadge(log.level)}</span>
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          {getCategoryIcon(log.category)}
                          <span className="ms-1 text-capitalize">{log.category}</span>
                        </div>
                      </td>
                      <td>
                        <div className="text-truncate" style={{ maxWidth: '300px' }}>
                          {log.message}
                        </div>
                      </td>
                      <td>
                        <div className="text-truncate" style={{ maxWidth: '150px' }}>
                          <small className="text-muted">{log.user}</small>
                        </div>
                      </td>
                      <td>
                        <small className="text-muted">{log.ip}</small>
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => {
                            setSelectedLog(log)
                            setShowModal(true)
                          }}
                        >
                          <IconEye size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        {filteredLogs.length > 0 && (
          <div className="card-footer d-flex align-items-center">
            <div className="text-muted small">
              Mostrando {startIndex + 1} a {Math.min(startIndex + logsPerPage, filteredLogs.length)} de {filteredLogs.length} registros
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

      {/* Modal de Detalhes */}
      {showModal && selectedLog && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Detalhes do Log</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">ID do Registro</label>
                    <input type="text" className="form-control" value={selectedLog.id} readOnly />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Data/Hora</label>
                    <input type="text" className="form-control" value={formatTimestamp(selectedLog.timestamp)} readOnly />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Nível</label>
                    <div className="input-group">
                      <span className="input-group-text">{getLevelIcon(selectedLog.level)}</span>
                      <input type="text" className="form-control" value={selectedLog.level.toUpperCase()} readOnly />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Categoria</label>
                    <div className="input-group">
                      <span className="input-group-text">{getCategoryIcon(selectedLog.category)}</span>
                      <input type="text" className="form-control" value={selectedLog.category} readOnly />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Usuário</label>
                    <input type="text" className="form-control" value={selectedLog.user} readOnly />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Endereço IP</label>
                    <input type="text" className="form-control" value={selectedLog.ip} readOnly />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Mensagem</label>
                    <textarea className="form-control" rows="2" value={selectedLog.message} readOnly />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">ID da Requisição</label>
                    <input type="text" className="form-control" value={selectedLog.details.requestId} readOnly />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Duração (ms)</label>
                    <input type="text" className="form-control" value={selectedLog.details.duration} readOnly />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Uso de Memória (%)</label>
                    <input type="text" className="form-control" value={selectedLog.details.memory} readOnly />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Código de Status</label>
                    <input type="text" className="form-control" value={selectedLog.details.statusCode || 'N/A'} readOnly />
                  </div>
                  <div className="col-12">
                    <label className="form-label">User Agent</label>
                    <textarea className="form-control" rows="2" value={selectedLog.userAgent} readOnly />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Logs