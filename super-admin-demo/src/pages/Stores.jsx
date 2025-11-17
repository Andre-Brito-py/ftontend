import React, { useState, useMemo, useEffect } from 'react'
import StoreCreationModal from '../components/StoreCreationModal.jsx'

const brl = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0)

export default function Stores() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('name')
  const [sortOrder, setSortOrder] = useState('asc')
  const [storesData, setStoresData] = useState([])
  const [showCreateModal, setShowCreateModal] = useState(false)

  // Adicionar estilos de animação e modo escuro
  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      @keyframes slideInRight {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      
      @keyframes slideOutRight {
        from {
          transform: translateX(0);
          opacity: 1;
        }
        to {
          transform: translateX(100%);
          opacity: 0;
        }
      }
      
      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: scale(0.95);
        }
        to {
          opacity: 1;
          transform: scale(1);
        }
      }
      
      .badge-success { background-color: #28a745 !important; }
      .badge-warning { background-color: #ffc107 !important; color: #000 !important; }
      .badge-danger { background-color: #dc3545 !important; }
      .badge-secondary { background-color: #6c757d !important; }
      
      /* Melhorias de contraste para modo escuro */
      [data-bs-theme="dark"] .text-secondary {
        color: #adb5bd !important;
      }
      
      [data-bs-theme="dark"] .form-control::placeholder {
        color: #6c757d !important;
        opacity: 1;
      }
      
      [data-bs-theme="dark"] .form-select {
        color: #e9ecef !important;
        background-color: #212529 !important;
        border-color: #495057 !important;
      }
      
      [data-bs-theme="dark"] .form-control {
        color: #e9ecef !important;
        background-color: #212529 !important;
        border-color: #495057 !important;
      }
      
      [data-bs-theme="dark"] .card-header {
        background-color: rgba(33, 37, 41, 0.8) !important;
        border-bottom-color: #495057 !important;
      }
      
      [data-bs-theme="dark"] .table thead th {
        color: #e9ecef !important;
        border-bottom-color: #495057 !important;
      }
      
      [data-bs-theme="dark"] .btn-white {
        background-color: #343a40 !important;
        border-color: #495057 !important;
        color: #e9ecef !important;
      }
      
      [data-bs-theme="dark"] .btn-white:hover {
        background-color: #495057 !important;
        border-color: #6c757d !important;
      }
      
      /* Melhorar contraste dos links no modo escuro */
      [data-bs-theme="dark"] a.text-reset {
        color: #e9ecef !important;
      }
      
      [data-bs-theme="dark"] a.text-reset:hover {
        color: #ffffff !important;
      }
      
      /* Placeholder com melhor contraste */
      .form-control::placeholder {
        color: #6c757d;
        opacity: 1;
      }
      
      [data-bs-theme="dark"] .form-control::placeholder {
        color: #adb5bd !important;
      }
      
      /* Labels dos cards de estatísticas */
      .card-body .font-weight-medium {
        color: #495057;
      }
      
      [data-bs-theme="dark"] .card-body .font-weight-medium {
        color: #ced4da !important;
      }
      
      /* Cabeçalhos de seções */
      .page-pretitle {
        color: #6c757d;
      }
      
      [data-bs-theme="dark"] .page-pretitle {
        color: #adb5bd !important;
      }
      
      /* Melhorar contraste do texto nos dropdowns */
      .dropdown-item {
        color: #212529;
      }
      
      [data-bs-theme="dark"] .dropdown-item {
        color: #e9ecef !important;
      }
      
      [data-bs-theme="dark"] .dropdown-item:hover {
        background-color: #495057 !important;
      }
      
      [data-bs-theme="dark"] .dropdown-item.active {
        background-color: #0d6efd !important;
        color: #ffffff !important;
      }
      
      /* Melhorias adicionais para modo escuro */
      [data-bs-theme="dark"] .text-muted {
        color: #adb5bd !important;
      }
      
      /* Garantir que o nome da loja fique laranja no modo escuro também */
      [data-bs-theme="dark"] .h4 {
        color: #F47C2C !important;
      }
      
      [data-bs-theme="dark"] .navbar-brand {
        color: #ffffff !important;
      }
      
      [data-bs-theme="dark"] .nav-link {
        color: #e9ecef !important;
      }
      
      [data-bs-theme="dark"] .nav-link:hover {
        color: #ffffff !important;
      }
      
      /* Melhorar contraste dos títulos das estatísticas */
      [data-bs-theme="dark"] .card-sm .text-secondary {
        color: #ced4da !important;
      }
      
      /* Melhorar visibilidade dos headers da tabela */
      [data-bs-theme="dark"] .table-dark th {
        background-color: #212529 !important;
        border-color: #495057 !important;
      }
      
      /* Melhorar contraste dos botões de ação */
      [data-bs-theme="dark"] .btn-white {
        background-color: #343a40 !important;
        border-color: #495057 !important;
        color: #e9ecef !important;
      }
      
      [data-bs-theme="dark"] .btn-white:hover {
        background-color: #495057 !important;
        border-color: #6c757d !important;
      }
      
      /* Melhorar contraste do texto do sidebar */
      [data-bs-theme="dark"] .navbar-nav .nav-link {
        color: #e9ecef !important;
      }
      
      [data-bs-theme="dark"] .navbar-nav .nav-link.active {
        color: #ffffff !important;
        background-color: rgba(255, 255, 255, 0.1) !important;
      }
      
      /* Melhorar contraste do logo e título */
      [data-bs-theme="dark"] .super-admin-logo span {
        color: #ffffff !important;
      }
      
      /* Melhorar contraste dos dropdowns do status */
      [data-bs-theme="dark"] .badge-success {
        background-color: #28a745 !important;
        color: #ffffff !important;
      }
      
      [data-bs-theme="dark"] .badge-warning {
        background-color: #ffc107 !important;
        color: #000000 !important;
      }
      
      [data-bs-theme="dark"] .badge-danger {
        background-color: #dc3545 !important;
        color: #ffffff !important;
      }
      
      [data-bs-theme="dark"] .badge-secondary {
        background-color: #6c757d !important;
        color: #ffffff !important;
      }
    `
    document.head.appendChild(style)
    
    return () => {
      document.head.removeChild(style)
    }
  }, [])

  // Dados simulados de lojas
  const initialStores = useMemo(() => [
    {
      id: 1,
      name: 'Loja Centro',
      owner: 'João Silva',
      email: 'joao@lojacentro.com',
      phone: '(11) 98765-4321',
      status: 'Ativa',
      revenue: 5420,
      createdAt: '2024-11-15',
      lastActivity: '2024-11-16',
      plan: 'Premium',
      location: 'São Paulo, SP'
    },
    {
      id: 2,
      name: 'Tech Store',
      owner: 'Maria Santos',
      email: 'maria@techstore.com',
      phone: '(21) 99876-5432',
      status: 'Ativa',
      revenue: 8900,
      createdAt: '2024-11-14',
      lastActivity: '2024-11-16',
      plan: 'Enterprise',
      location: 'Rio de Janeiro, RJ'
    },
    {
      id: 3,
      name: 'Fashion Boutique',
      owner: 'Pedro Oliveira',
      email: 'pedro@fashionboutique.com',
      phone: '(31) 91234-5678',
      status: 'Pendente',
      revenue: 3200,
      createdAt: '2024-11-13',
      lastActivity: '2024-11-13',
      plan: 'Basic',
      location: 'Belo Horizonte, MG'
    },
    {
      id: 4,
      name: 'Food Market',
      owner: 'Ana Costa',
      email: 'ana@foodmarket.com',
      phone: '(41) 92345-6789',
      status: 'Ativa',
      revenue: 12300,
      createdAt: '2024-11-12',
      lastActivity: '2024-11-16',
      plan: 'Premium',
      location: 'Curitiba, PR'
    },
    {
      id: 5,
      name: 'Book Store',
      owner: 'Carlos Mendes',
      email: 'carlos@bookstore.com',
      phone: '(51) 93456-7890',
      status: 'Inativa',
      revenue: 2100,
      createdAt: '2024-11-10',
      lastActivity: '2024-11-10',
      plan: 'Basic',
      location: 'Porto Alegre, RS'
    },
    {
      id: 6,
      name: 'Sports Center',
      owner: 'Julia Fernandes',
      email: 'julia@sportscenter.com',
      phone: '(61) 94567-8901',
      status: 'Ativa',
      revenue: 6700,
      createdAt: '2024-11-11',
      lastActivity: '2024-11-16',
      plan: 'Enterprise',
      location: 'Brasília, DF'
    }
  ], [])
  
  // Inicializar dados das lojas
  useEffect(() => {
    setStoresData(initialStores)
  }, [])

  // Filtrar e ordenar lojas
  const filteredStores = useMemo(() => {
    let filtered = storesData.filter(store => {
      const matchesSearch = store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           store.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           store.email.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === 'all' || store.status === statusFilter
      return matchesSearch && matchesStatus
    })

    // Ordenar
    filtered.sort((a, b) => {
      let aValue = a[sortBy]
      let bValue = b[sortBy]
      
      if (sortBy === 'revenue') {
        aValue = parseFloat(aValue)
        bValue = parseFloat(bValue)
      }
      
      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1
      return 0
    })

    return filtered
  }, [storesData, searchTerm, statusFilter, sortBy, sortOrder])

  // Estatísticas
  const stats = useMemo(() => {
    const total = storesData.length
    const ativas = storesData.filter(s => s.status === 'Ativa').length
    const pendentes = storesData.filter(s => s.status === 'Pendente').length
    const inativas = storesData.filter(s => s.status === 'Inativa').length
    const totalRevenue = storesData.reduce((sum, s) => sum + s.revenue, 0)
    
    return { total, ativas, pendentes, inativas, totalRevenue }
  }, [storesData])

  const handleEdit = (id) => {
    alert(`Editar loja ID: ${id}`)
  }

  const handleStatusChange = (id, newStatus) => {
    setStoresData(prevStores => 
      prevStores.map(store => 
        store.id === id ? { ...store, status: newStatus } : store
      )
    )
  }

  const handleDelete = (id) => {
    if (confirm('Tem certeza que deseja excluir esta loja?')) {
      alert(`Loja ID: ${id} excluída com sucesso!`)
    }
  }

  const handleView = (id) => {
    alert(`Visualizar detalhes da loja ID: ${id}`)
  }

  const handleNewStore = () => {
    setShowCreateModal(true)
  }

  const handleStoreCreated = (newStore) => {
    // Add the new store to the list
    setStoresData(prev => [newStore, ...prev])
    
    // Show success notification
    const notification = document.createElement('div')
    notification.className = 'alert alert-success alert-dismissible position-fixed top-0 end-0 m-3'
    notification.style.zIndex = '1050'
    notification.style.animation = 'slideInRight 0.3s ease-out'
    notification.innerHTML = `
      <div class="d-flex align-items-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-check" width="20" height="20" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
          <path d="M5 12l5 5l10 -10" />
        </svg>
        <span class="ms-2">Loja "${newStore.name}" criada com sucesso!</span>
      </div>
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `
    document.body.appendChild(notification)
    
    // Remove notification after 5 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.style.animation = 'slideOutRight 0.3s ease-in'
        setTimeout(() => {
          notification.parentNode.removeChild(notification)
        }, 300)
      }
    }, 5000)
  }

  const StatusDropdown = ({ storeId, currentStatus }) => {
    const [isOpen, setIsOpen] = useState(false)
    
    const statusOptions = [
      { value: 'Ativa', label: 'Ativa', color: 'success' },
      { value: 'Pendente', label: 'Pendente', color: 'warning' },
      { value: 'Inativa', label: 'Inativa', color: 'danger' },
      { value: 'Suspensa', label: 'Suspensa', color: 'secondary' }
    ]
    
    const currentOption = statusOptions.find(option => option.value === currentStatus) || statusOptions[0]
    
    const handleStatusSelect = (newStatus) => {
      handleStatusChange(storeId, newStatus)
      setIsOpen(false)
      
      // Mostrar notificação de sucesso
      const notification = document.createElement('div')
      notification.className = 'alert alert-success alert-dismissible position-fixed top-0 end-0 m-3'
      notification.style.zIndex = '1050'
      notification.style.animation = 'slideInRight 0.3s ease-out'
      notification.innerHTML = `
        <div class="d-flex align-items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-check" width="20" height="20" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
            <path d="M5 12l5 5l10 -10" />
          </svg>
          <span class="ms-2">Status alterado para "${newStatus}" com sucesso!</span>
        </div>
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
      `
      document.body.appendChild(notification)
      
      // Remover notificação após 3 segundos
      setTimeout(() => {
        if (notification.parentNode) {
          notification.style.animation = 'slideOutRight 0.3s ease-in'
          setTimeout(() => {
            notification.parentNode.removeChild(notification)
          }, 300)
        }
      }, 3000)
    }
    
    return (
      <div className="dropdown" style={{ position: 'relative' }}>
        <button 
          className={`btn btn-sm dropdown-toggle badge-${currentOption.color} text-white`}
          onClick={() => setIsOpen(!isOpen)}
          style={{ 
            border: 'none', 
            backgroundColor: currentOption.color === 'success' ? '#28a745' : 
                           currentOption.color === 'warning' ? '#ffc107' :
                           currentOption.color === 'danger' ? '#dc3545' : '#6c757d',
            color: 'white',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'scale(1.05)'
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'scale(1)'
          }}
        >
          {currentStatus}
          <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-chevron-down ms-1" width="12" height="12" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
            <path d="M6 9l6 6l6 -6" />
          </svg>
        </button>
        
        {isOpen && (
          <>
            <div 
              className="position-fixed top-0 start-0 w-100 h-100" 
              style={{ zIndex: 999 }}
              onClick={() => setIsOpen(false)}
            />
            <div className="dropdown-menu show" style={{ 
              position: 'absolute', 
              top: '100%', 
              left: 0, 
              zIndex: 1000,
              minWidth: '120px',
              marginTop: '0.25rem',
              animation: 'fadeIn 0.2s ease-out'
            }}>
              {statusOptions.map((option) => (
                <button
                  key={option.value}
                  className={`dropdown-item ${currentStatus === option.value ? 'active' : ''}`}
                  onClick={() => handleStatusSelect(option.value)}
                  style={{
                    backgroundColor: currentStatus === option.value ? '#f8f9fa' : 'transparent',
                    border: 'none',
                    width: '100%',
                    textAlign: 'left',
                    padding: '0.5rem 1rem',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (currentStatus !== option.value) {
                      e.target.style.backgroundColor = '#e9ecef'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (currentStatus !== option.value) {
                      e.target.style.backgroundColor = 'transparent'
                    }
                  }}
                >
                  <span className={`badge bg-${option.color} me-2`} style={{ fontSize: '0.7rem' }}></span>
                  {option.label}
                  {currentStatus === option.value && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-check float-end" width="16" height="16" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                      <path d="M5 12l5 5l10 -10" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    )
  }

  const getStatusBadge = (status) => {
    const badges = {
      'Ativa': 'bg-success',
      'Pendente': 'bg-warning',
      'Inativa': 'bg-danger'
    }
    return badges[status] || 'bg-secondary'
  }

  const getPlanBadge = (plan) => {
    const badges = {
      'Enterprise': 'bg-purple',
      'Premium': 'bg-info',
      'Basic': 'bg-secondary'
    }
    return badges[plan] || 'bg-secondary'
  }

  return (
    <div className="page">
      <div className="page-header">
        <div className="container-xl">
          <div className="row g-2 align-items-center">
            <div className="col">
              <h2 className="page-title">Gerenciar Lojas</h2>
              <div className="page-pretitle">ADMINISTRAÇÃO DE LOJAS</div>
            </div>
            <div className="col-auto ms-auto d-print-none">
              <div className="btn-list">
                <button className="btn btn-primary" onClick={handleNewStore}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                    <path d="M12 5l0 14"/><path d="M5 12l14 0"/>
                  </svg>
                  Nova Loja
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="page-body">
        <div className="container-xl">
          {/* Cards de Estatísticas */}
          <div className="row row-cards mb-4">
            <div className="col-sm-6 col-md-3">
              <div className="card card-sm">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div>
                      <div className="font-weight-medium">Total de Lojas</div>
                      <div className="text-secondary">{stats.total}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-sm-6 col-md-3">
              <div className="card card-sm">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div>
                      <div className="font-weight-medium">Lojas Ativas</div>
                      <div className="text-secondary">{stats.ativas}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-sm-6 col-md-3">
              <div className="card card-sm">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div>
                      <div className="font-weight-medium">Pendentes</div>
                      <div className="text-secondary">{stats.pendentes}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-sm-6 col-md-3">
              <div className="card card-sm">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div>
                      <div className="font-weight-medium">Receita Total</div>
                      <div className="text-secondary">{brl(stats.totalRevenue)}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Filtros e Pesquisa */}
          <div className="card mb-4">
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <div className="input-icon">
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="Pesquisar lojas..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <span className="input-icon-addon">
                      <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                        <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0"/>
                        <path d="M21 21l-6 -6"/>
                      </svg>
                    </span>
                  </div>
                </div>
                <div className="col-md-3">
                  <select 
                    className="form-select" 
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="all">Todos os Status</option>
                    <option value="Ativa">Ativa</option>
                    <option value="Pendente">Pendente</option>
                    <option value="Inativa">Inativa</option>
                  </select>
                </div>
                <div className="col-md-3">
                  <div className="d-flex gap-2">
                    <select 
                      className="form-select" 
                      value={`${sortBy}-${sortOrder}`}
                      onChange={(e) => {
                        const [field, order] = e.target.value.split('-')
                        setSortBy(field)
                        setSortOrder(order)
                      }}
                    >
                      <option value="name-asc">Nome (A-Z)</option>
                      <option value="name-desc">Nome (Z-A)</option>
                      <option value="revenue-desc">Receita (Maior)</option>
                      <option value="revenue-asc">Receita (Menor)</option>
                      <option value="createdAt-desc">Data (Mais Recente)</option>
                      <option value="createdAt-asc">Data (Mais Antiga)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabela de Lojas */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Lista de Lojas ({filteredStores.length})</h3>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-vcenter">
                  <thead>
                    <tr>
                      <th>Loja</th>
                      <th>Proprietário</th>
                      <th>Plano</th>
                      <th>Status</th>
                      <th>Receita</th>
                      <th>Localização</th>
                      <th>Última Atividade</th>
                      <th className="w-1">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStores.map((store) => (
                      <tr key={store.id}>
                        <td>
                          <div className="d-flex py-1 align-items-center">
                            <div className="flex-fill">
                              <div className="d-flex align-items-center mb-2">
                                <div className="avatar avatar-sm me-2" style={{ 
                                  backgroundColor: '#e3f2fd', 
                                  borderRadius: '8px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  width: '32px',
                                  height: '32px'
                                }}>
                                  <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-building-store" width="18" height="18" viewBox="0 0 24 24" strokeWidth="2" stroke="#1976d2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                    <path d="M4 21v-15a1 1 0 0 1 1 -1h5v15h-5" />
                                    <path d="M16 10v-5a1 1 0 0 1 1 -1h5v15h-5" />
                                    <path d="M8 8v-1a1 1 0 0 1 1 -1h6" />
                                    <path d="M8 14v-1a1 1 0 0 1 1 -1h6" />
                                  </svg>
                                </div>
                                <div className="h4 mb-0" style={{ 
                                  fontSize: '1.1rem', 
                                  fontWeight: '600',
                                  color: '#F47C2C', /* Cor laranja do logo Zappy */
                                  letterSpacing: '-0.01em',
                                  textShadow: '0 1px 2px rgba(0,0,0,0.1)',
                                  transition: 'all 0.2s ease',
                                  cursor: 'pointer'
                                }}
                                onMouseEnter={(e) => {
                                  e.target.style.color = '#FF8C42' /* Laranja mais claro no hover */
                                  e.target.style.transform = 'translateX(2px)'
                                }}
                                onMouseLeave={(e) => {
                                  e.target.style.color = '#F47C2C' /* Voltar ao laranja original */
                                  e.target.style.transform = 'translateX(0)'
                                }}
                                onClick={() => handleView(store.id)}
                                title="Clique para ver detalhes da loja"
                                >
                                  {store.name}
                                </div>
                              </div>
                              <div className="text-secondary mb-1 ms-1">
                                <a href={`mailto:${store.email}`} className="text-reset text-decoration-none d-flex align-items-center">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-mail me-1" width="14" height="14" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                    <path d="M3 7a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-10z" />
                                    <path d="M3 7l9 6l9 -6" />
                                  </svg>
                                  {store.email}
                                </a>
                              </div>
                              <div className="text-secondary d-flex align-items-center ms-1">
                                <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-phone me-1" width="14" height="14" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                  <path d="M5 4h4l2 5l-2.5 1.5a11 11 0 0 0 5 5l1.5 -2.5l5 2v4a2 2 0 0 1 -2 2a16 16 0 0 1 -15 -15a2 2 0 0 1 2 -2" />
                                </svg>
                                {store.phone}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div>{store.owner}</div>
                          <div className="text-secondary">Criada em {new Date(store.createdAt).toLocaleDateString('pt-BR')}</div>
                        </td>
                        <td>
                          <span className={`badge ${getPlanBadge(store.plan)}`}>{store.plan}</span>
                        </td>
                        <td>
                          <StatusDropdown storeId={store.id} currentStatus={store.status} />
                        </td>
                        <td>
                          <div className="font-weight-medium">{brl(store.revenue)}</div>
                        </td>
                        <td>
                          <div className="text-secondary">{store.location}</div>
                        </td>
                        <td>
                          <div className="text-secondary">{new Date(store.lastActivity).toLocaleDateString('pt-BR')}</div>
                        </td>
                        <td>
                          <div className="btn-list flex-nowrap">
                            <button 
                              className="btn btn-white btn-sm" 
                              onClick={() => handleView(store.id)}
                              title="Visualizar"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-eye" width="20" height="20" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                <path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
                                <path d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6" />
                              </svg>
                            </button>
                            <button 
                              className="btn btn-white btn-sm" 
                              onClick={() => handleEdit(store.id)}
                              title="Editar"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-edit" width="20" height="20" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                <path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1" />
                                <path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z" />
                                <path d="M16 5l3 3" />
                              </svg>
                            </button>
                            <button 
                              className="btn btn-white btn-sm" 
                              onClick={() => handleDelete(store.id)}
                              title="Excluir"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-trash" width="20" height="20" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                <path d="M4 7l16 0" />
                                <path d="M10 11l0 6" />
                                <path d="M14 11l0 6" />
                                <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
                                <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {filteredStores.length === 0 && (
                <div className="text-center py-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-search-off" width="48" height="48" viewBox="0 0 24 24" strokeWidth="1" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.5 }}>
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                    <path d="M5.039 5.062a7 7 0 0 0 9.91 9.89m1.584 -2.434a7 7 0 0 0 -9.038 -9.057" />
                    <path d="M17.5 17.5l2.5 2.5" />
                    <path d="M3 3l18 18" />
                  </svg>
                  <p className="text-secondary mt-2">Nenhuma loja encontrada</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <StoreCreationModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onStoreCreated={handleStoreCreated}
      />
    </div>
  )
}