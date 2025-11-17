import React, { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

// Usa o mesmo backend original
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4001'

// Dados mock de clientes para demonstração
const mockCustomers = [
  {
    _id: '1',
    name: 'João Silva',
    email: 'joao.silva@email.com',
    phone: '(11) 98765-4321',
    cpf: '123.456.789-00',
    address: {
      street: 'Rua das Flores, 123',
      neighborhood: 'Centro',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01234-567'
    },
    ordersCount: 15,
    totalSpent: 1250.50,
    lastOrder: '2024-01-15',
    firstOrder: '2023-06-10',
    status: 'active',
    loyaltyPoints: 1250,
    tier: 'gold',
    preferences: ['Hambúrguer', 'Pizza'],
    notes: 'Cliente VIP, sempre pede combo familiar'
  },
  {
    _id: '2',
    name: 'Maria Santos',
    email: 'maria.santos@email.com',
    phone: '(21) 99876-5432',
    cpf: '987.654.321-00',
    address: {
      street: 'Av. Atlântica, 456',
      neighborhood: 'Copacabana',
      city: 'Rio de Janeiro',
      state: 'RJ',
      zipCode: '22011-001'
    },
    ordersCount: 8,
    totalSpent: 680.75,
    lastOrder: '2024-01-12',
    firstOrder: '2023-09-22',
    status: 'active',
    loyaltyPoints: 680,
    tier: 'silver',
    preferences: ['Sushi', 'Salada'],
    notes: 'Prefere pedidos saudáveis'
  },
  {
    _id: '3',
    name: 'Pedro Oliveira',
    email: 'pedro.oliveira@email.com',
    phone: '(31) 91234-5678',
    cpf: '456.789.123-00',
    address: {
      street: 'Rua da Bahia, 789',
      neighborhood: 'Savassi',
      city: 'Belo Horizonte',
      state: 'MG',
      zipCode: '30130-110'
    },
    ordersCount: 23,
    totalSpent: 2100.00,
    lastOrder: '2024-01-18',
    firstOrder: '2023-03-15',
    status: 'active',
    loyaltyPoints: 2100,
    tier: 'platinum',
    preferences: ['Hambúrguer', 'Pizza', 'Tacos'],
    notes: 'Cliente muito frequente, gosta de variedade'
  },
  {
    _id: '4',
    name: 'Ana Costa',
    email: 'ana.costa@email.com',
    phone: '(41) 92345-6789',
    cpf: '789.123.456-00',
    address: {
      street: 'Rua XV de Novembro, 321',
      neighborhood: 'Centro',
      city: 'Curitiba',
      state: 'PR',
      zipCode: '80020-310'
    },
    ordersCount: 5,
    totalSpent: 320.00,
    lastOrder: '2024-01-08',
    firstOrder: '2023-11-30',
    status: 'inactive',
    loyaltyPoints: 320,
    tier: 'bronze',
    preferences: ['Pizza'],
    notes: 'Cliente novo, potencial para crescer'
  },
  {
    _id: '5',
    name: 'Carlos Mendes',
    email: 'carlos.mendes@email.com',
    phone: '(51) 93456-7890',
    cpf: '321.654.987-00',
    address: {
      street: 'Av. Borges de Medeiros, 987',
      neighborhood: 'Moinhos de Vento',
      city: 'Porto Alegre',
      state: 'RS',
      zipCode: '90540-001'
    },
    ordersCount: 12,
    totalSpent: 950.25,
    lastOrder: '2024-01-14',
    firstOrder: '2023-07-20',
    status: 'active',
    loyaltyPoints: 950,
    tier: 'silver',
    preferences: ['Hambúrguer', 'Tacos'],
    notes: 'Sempre pede comida picante'
  },
  {
    _id: '6',
    name: 'Julia Ferreira',
    email: 'julia.ferreira@email.com',
    phone: '(61) 94567-8901',
    cpf: '654.987.321-00',
    address: {
      street: 'SCS Quadra 1, Bloco A',
      neighborhood: 'Asa Sul',
      city: 'Brasília',
      state: 'DF',
      zipCode: '70300-100'
    },
    ordersCount: 18,
    totalSpent: 1580.75,
    lastOrder: '2024-01-16',
    firstOrder: '2023-05-12',
    status: 'active',
    loyaltyPoints: 1580,
    tier: 'gold',
    preferences: ['Sushi', 'Salada', 'Bebidas'],
    notes: 'Prefere opções saudáveis e bebidas especiais'
  }
]

export default function CustomersPage() {
  const navigate = useNavigate()
  
  // Estado dos clientes
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  // Estado de filtragem e busca
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [tierFilter, setTierFilter] = useState('all')
  const [sortBy, setSortBy] = useState('name')
  const [sortOrder, setSortOrder] = useState('asc')
  
  // Estado de modal e ações
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState(null)
  
  // Estado de paginação
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  
  const storeId = useMemo(() => {
    const ls = typeof window !== 'undefined' ? localStorage.getItem('storeId') : null
    return ls || '507f1f77bcf86cd799439012'
  }, [])
  
  // Simula carregamento de clientes
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true)
        // Simula delay de API
        await new Promise(resolve => setTimeout(resolve, 1000))
        setCustomers(mockCustomers)
      } catch (err) {
        setError('Erro ao carregar clientes')
        setCustomers([])
      } finally {
        setLoading(false)
      }
    }
    
    fetchCustomers()
  }, [])
  
  // Filtragem e ordenação de clientes
  const filteredCustomers = useMemo(() => {
    let filtered = customers.filter(customer => {
      const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           customer.phone.includes(searchTerm)
      
      const matchesStatus = statusFilter === 'all' || customer.status === statusFilter
      const matchesTier = tierFilter === 'all' || customer.tier === tierFilter
      
      return matchesSearch && matchesStatus && matchesTier
    })
    
    // Ordenação
    filtered.sort((a, b) => {
      let aValue, bValue
      
      switch (sortBy) {
        case 'name':
          aValue = a.name
          bValue = b.name
          break
        case 'orders':
          aValue = a.ordersCount
          bValue = b.ordersCount
          break
        case 'spent':
          aValue = a.totalSpent
          bValue = b.totalSpent
          break
        case 'lastOrder':
          aValue = new Date(a.lastOrder)
          bValue = new Date(b.lastOrder)
          break
        default:
          aValue = a.name
          bValue = b.name
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })
    
    return filtered
  }, [customers, searchTerm, statusFilter, tierFilter, sortBy, sortOrder])
  
  // Paginação
  const paginatedCustomers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredCustomers.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredCustomers, currentPage, itemsPerPage])
  
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage)
  
  // Handlers de ações
  const handleViewCustomer = (customer) => {
    setSelectedCustomer(customer)
    setShowModal(true)
  }
  
  const handleEditCustomer = (customer) => {
    setEditingCustomer({ ...customer })
    setShowModal(true)
  }
  
  const handleSaveCustomer = () => {
    if (editingCustomer) {
      setCustomers(prev => prev.map(c => c._id === editingCustomer._id ? editingCustomer : c))
      setEditingCustomer(null)
      setShowModal(false)
    }
  }
  
  const handleToggleStatus = (customerId) => {
    setCustomers(prev => prev.map(c => 
      c._id === customerId 
        ? { ...c, status: c.status === 'active' ? 'inactive' : 'active' }
        : c
    ))
  }
  
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setEditingCustomer(prev => ({ ...prev, [name]: value }))
  }
  
  const getStatusBadge = (status) => {
    const badges = {
      active: 'bg-success',
      inactive: 'bg-secondary',
      blocked: 'bg-danger'
    }
    return badges[status] || 'bg-secondary'
  }
  
  const getTierBadge = (tier) => {
    const badges = {
      bronze: 'bg-warning text-dark',
      silver: 'bg-secondary',
      gold: 'bg-warning',
      platinum: 'bg-primary'
    }
    return badges[tier] || 'bg-secondary'
  }
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }
  
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    }).format(value)
  }
  
  if (loading) {
    return (
      <div className="container-xl">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Carregando...</span>
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="container-xl">
      <div className="page-header">
        <div className="row g-2 align-items-center">
          <div className="col">
            <h2 className="page-title">Clientes</h2>
            <div className="page-pretitle">Gerencie seus clientes e veja detalhes</div>
          </div>
          <div className="col-auto ms-auto">
            <div className="btn-list">
              <button className="btn btn-primary" onClick={() => navigate('/clientes/novo')}>
                <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                  <path d="M12 5l0 14" />
                  <path d="M5 12l14 0" />
                </svg>
                Novo Cliente
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Filtros e Busca */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-4">
                  <label className="form-label">Buscar</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                        <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
                        <path d="M21 21l-6 -6" />
                      </svg>
                    </span>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="Nome, email ou telefone..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <label className="form-label">Status</label>
                  <select 
                    className="form-select" 
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="all">Todos</option>
                    <option value="active">Ativo</option>
                    <option value="inactive">Inativo</option>
                    <option value="blocked">Bloqueado</option>
                  </select>
                </div>
                <div className="col-md-3">
                  <label className="form-label">Tier</label>
                  <select 
                    className="form-select" 
                    value={tierFilter}
                    onChange={(e) => setTierFilter(e.target.value)}
                  >
                    <option value="all">Todos</option>
                    <option value="bronze">Bronze</option>
                    <option value="silver">Prata</option>
                    <option value="gold">Ouro</option>
                    <option value="platinum">Platina</option>
                  </select>
                </div>
                <div className="col-md-2">
                  <label className="form-label">Ordenar</label>
                  <div className="btn-group w-100" role="group">
                    <select 
                      className="form-select" 
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                    >
                      <option value="name">Nome</option>
                      <option value="orders">Pedidos</option>
                      <option value="spent">Gasto</option>
                      <option value="lastOrder">Último Pedido</option>
                    </select>
                    <button 
                      type="button" 
                      className="btn btn-outline-secondary"
                      onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                    >
                      {sortOrder === 'asc' ? '↑' : '↓'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Estatísticas Rápidas */}
      <div className="row mb-4">
        <div className="col-sm-6 col-lg-3">
          <div className="card">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="subheader">Total de Clientes</div>
                <div className="ms-auto lh-1">
                  <span className="text-success">👥</span>
                </div>
              </div>
              <div className="d-flex align-items-baseline">
                <div className="h2 mb-0 me-2">{customers.length}</div>
                <div className="text-success d-flex align-items-center">
                  <span>↗</span>
                  <span className="ms-1">+12%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-sm-6 col-lg-3">
          <div className="card">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="subheader">Clientes Ativos</div>
                <div className="ms-auto lh-1">
                  <span className="text-success">✅</span>
                </div>
              </div>
              <div className="d-flex align-items-baseline">
                <div className="h2 mb-0 me-2">{customers.filter(c => c.status === 'active').length}</div>
                <div className="text-success d-flex align-items-center">
                  <span>↗</span>
                  <span className="ms-1">+8%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-sm-6 col-lg-3">
          <div className="card">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="subheader">Ticket Médio</div>
                <div className="ms-auto lh-1">
                  <span className="text-primary">💰</span>
                </div>
              </div>
              <div className="d-flex align-items-baseline">
                <div className="h2 mb-0 me-2">{formatCurrency(customers.reduce((acc, c) => acc + c.totalSpent, 0) / customers.length || 0)}</div>
                <div className="text-primary d-flex align-items-center">
                  <span>→</span>
                  <span className="ms-1">0%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-sm-6 col-lg-3">
          <div className="card">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="subheader">Pontos de Fidelidade</div>
                <div className="ms-auto lh-1">
                  <span className="text-warning">⭐</span>
                </div>
              </div>
              <div className="d-flex align-items-baseline">
                <div className="h2 mb-0 me-2">{customers.reduce((acc, c) => acc + c.loyaltyPoints, 0).toLocaleString('pt-BR')}</div>
                <div className="text-warning d-flex align-items-center">
                  <span>↗</span>
                  <span className="ms-1">+15%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tabela de Clientes */}
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <div className="d-flex justify-content-between align-items-center">
                <h3 className="card-title">
                  Lista de Clientes ({filteredCustomers.length})
                </h3>
                <div className="text-muted">
                  Página {currentPage} de {totalPages}
                </div>
              </div>
            </div>
            
            {error && (
              <div className="card-body">
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              </div>
            )}
            
            <div className="table-responsive">
              <table className="table table-vcenter card-table">
                <thead>
                  <tr>
                    <th>Cliente</th>
                    <th>Contato</th>
                    <th>Localização</th>
                    <th>Atividade</th>
                    <th>Valor</th>
                    <th>Status/Tier</th>
                    <th className="w-1">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedCustomers.map((customer) => (
                    <tr key={customer._id}>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="avatar avatar-sm me-2">
                            {customer.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-weight-medium">{customer.name}</div>
                            <div className="text-muted">{customer.email}</div>
                            {customer.notes && (
                              <div className="small text-warning">📝 {customer.notes}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td>
                        <div>{customer.phone}</div>
                        <div className="text-muted small">{customer.cpf}</div>
                      </td>
                      <td>
                        <div>{customer.address.city}</div>
                        <div className="text-muted small">{customer.address.state}</div>
                      </td>
                      <td>
                        <div>{customer.ordersCount} pedidos</div>
                        <div className="text-muted small">Último: {formatDate(customer.lastOrder)}</div>
                      </td>
                      <td>
                        <div className="font-weight-medium">{formatCurrency(customer.totalSpent)}</div>
                        <div className="text-muted small">{customer.loyaltyPoints} pts</div>
                      </td>
                      <td>
                        <div className="mb-1">
                          <span className={`badge ${getStatusBadge(customer.status)}`}>
                            {customer.status === 'active' ? 'Ativo' : customer.status === 'inactive' ? 'Inativo' : 'Bloqueado'}
                          </span>
                        </div>
                        <div>
                          <span className={`badge ${getTierBadge(customer.tier)}`}>
                            {customer.tier === 'bronze' ? 'Bronze' : customer.tier === 'silver' ? 'Prata' : customer.tier === 'gold' ? 'Ouro' : 'Platina'}
                          </span>
                        </div>
                      </td>
                      <td>
                        <div className="btn-group btn-group-sm" role="group">
                          <button 
                            className="btn btn-outline-primary"
                            onClick={() => handleViewCustomer(customer)}
                            title="Ver detalhes"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="16" height="16" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                              <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                              <path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
                              <path d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6" />
                            </svg>
                          </button>
                          <button 
                            className="btn btn-outline-secondary"
                            onClick={() => handleEditCustomer(customer)}
                            title="Editar"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="16" height="16" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                              <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                              <path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1" />
                              <path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z" />
                              <path d="M16 5l3 3" />
                            </svg>
                          </button>
                          <button 
                            className={`btn btn-outline-${customer.status === 'active' ? 'warning' : 'success'}`}
                            onClick={() => handleToggleStatus(customer._id)}
                            title={customer.status === 'active' ? 'Desativar' : 'Ativar'}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="16" height="16" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                              <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                              <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
                              <path d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Paginação */}
            {totalPages > 1 && (
              <div className="card-footer d-flex align-items-center">
                <div className="text-muted">
                  Mostrando {((currentPage - 1) * itemsPerPage) + 1} até {Math.min(currentPage * itemsPerPage, filteredCustomers.length)} de {filteredCustomers.length} resultados
                </div>
                <div className="ms-auto">
                  <div className="btn-group" role="group">
                    <button 
                      className="btn btn-outline-secondary" 
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                    >
                      Anterior
                    </button>
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                      const page = i + 1
                      return (
                        <button 
                          key={page}
                          className={`btn btn-outline-secondary ${currentPage === page ? 'active' : ''}`}
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </button>
                      )
                    })}
                    <button 
                      className="btn btn-outline-secondary" 
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                    >
                      Próximo
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Modal de Detalhes/Edição */}
      {showModal && (selectedCustomer || editingCustomer) && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingCustomer ? 'Editar Cliente' : 'Detalhes do Cliente'}
                </h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => {
                    setShowModal(false)
                    setSelectedCustomer(null)
                    setEditingCustomer(null)
                  }}
                ></button>
              </div>
              <div className="modal-body">
                {editingCustomer ? (
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Nome</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        name="name"
                        value={editingCustomer.name}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Email</label>
                      <input 
                        type="email" 
                        className="form-control" 
                        name="email"
                        value={editingCustomer.email}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Telefone</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        name="phone"
                        value={editingCustomer.phone}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">CPF</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        name="cpf"
                        value={editingCustomer.cpf}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Observações</label>
                      <textarea 
                        className="form-control" 
                        rows="3"
                        name="notes"
                        value={editingCustomer.notes || ''}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="row">
                    <div className="col-md-6">
                      <h6>Informações Pessoais</h6>
                      <div className="mb-2">
                        <strong>Nome:</strong> {selectedCustomer.name}
                      </div>
                      <div className="mb-2">
                        <strong>Email:</strong> {selectedCustomer.email}
                      </div>
                      <div className="mb-2">
                        <strong>Telefone:</strong> {selectedCustomer.phone}
                      </div>
                      <div className="mb-2">
                        <strong>CPF:</strong> {selectedCustomer.cpf}
                      </div>
                      <div className="mb-2">
                        <strong>Status:</strong>
                        <span className={`badge ms-1 ${getStatusBadge(selectedCustomer.status)}`}>
                          {selectedCustomer.status === 'active' ? 'Ativo' : selectedCustomer.status === 'inactive' ? 'Inativo' : 'Bloqueado'}
                        </span>
                      </div>
                      <div className="mb-2">
                        <strong>Tier:</strong>
                        <span className={`badge ms-1 ${getTierBadge(selectedCustomer.tier)}`}>
                          {selectedCustomer.tier === 'bronze' ? 'Bronze' : selectedCustomer.tier === 'silver' ? 'Prata' : selectedCustomer.tier === 'gold' ? 'Ouro' : 'Platina'}
                        </span>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <h6>Estatísticas</h6>
                      <div className="mb-2">
                        <strong>Total de Pedidos:</strong> {selectedCustomer.ordersCount}
                      </div>
                      <div className="mb-2">
                        <strong>Total Gasto:</strong> {formatCurrency(selectedCustomer.totalSpent)}
                      </div>
                      <div className="mb-2">
                        <strong>Pontos de Fidelidade:</strong> {selectedCustomer.loyaltyPoints}
                      </div>
                      <div className="mb-2">
                        <strong>Primeiro Pedido:</strong> {formatDate(selectedCustomer.firstOrder)}
                      </div>
                      <div className="mb-2">
                        <strong>Último Pedido:</strong> {formatDate(selectedCustomer.lastOrder)}
                      </div>
                    </div>
                    <div className="col-12">
                      <h6>Endereço</h6>
                      <div className="mb-2">
                        <strong>Endereço:</strong> {selectedCustomer.address.street}
                      </div>
                      <div className="mb-2">
                        <strong>Bairro:</strong> {selectedCustomer.address.neighborhood}
                      </div>
                      <div className="mb-2">
                        <strong>Cidade:</strong> {selectedCustomer.address.city} - {selectedCustomer.address.state}
                      </div>
                      <div className="mb-2">
                        <strong>CEP:</strong> {selectedCustomer.address.zipCode}
                      </div>
                    </div>
                    {selectedCustomer.notes && (
                      <div className="col-12">
                        <h6>Observações</h6>
                        <div className="alert alert-info">
                          {selectedCustomer.notes}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="modal-footer">
                {editingCustomer ? (
                  <>
                    <button 
                      type="button" 
                      className="btn btn-secondary"
                      onClick={() => setEditingCustomer(null)}
                    >
                      Cancelar
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-primary"
                      onClick={handleSaveCustomer}
                    >
                      Salvar
                    </button>
                  </>
                ) : (
                  <>
                    <button 
                      type="button" 
                      className="btn btn-secondary"
                      onClick={() => setShowModal(false)}
                    >
                      Fechar
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-primary"
                      onClick={() => setEditingCustomer(selectedCustomer)}
                    >
                      Editar
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}