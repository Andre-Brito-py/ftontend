import React, { useEffect, useMemo, useRef, useState } from 'react'
import { IconSearch, IconFilter, IconPlus, IconEdit, IconTrash, IconUser, IconShield, IconKey, IconMail, IconPhone, IconCalendar, IconCheck, IconX, IconRefresh, IconDots, IconBan, IconLockOpen } from '@tabler/icons-react'

const Users = () => {
  const [users, setUsers] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRole, setSelectedRole] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [usersPerPage, setUsersPerPage] = useState(10)
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState('create')
  const [selectedUser, setSelectedUser] = useState(null)
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

  // Gerar usuários simulados
  const generateMockUsers = () => {
    const roles = ['admin', 'manager', 'operator', 'viewer']
    const statuses = ['active', 'inactive', 'suspended']
    const permissions = {
      admin: ['dashboard', 'users', 'stores', 'analytics', 'settings', 'logs'],
      manager: ['dashboard', 'stores', 'analytics'],
      operator: ['dashboard', 'stores'],
      viewer: ['dashboard', 'analytics']
    }
    
    const firstNames = ['João', 'Maria', 'Pedro', 'Ana', 'Carlos', 'Beatriz', 'Lucas', 'Julia', 'Rafael', 'Camila', 'Felipe', 'Amanda', 'Gustavo', 'Larissa', 'Henrique', 'Leticia']
    const lastNames = ['Silva', 'Santos', 'Oliveira', 'Souza', 'Costa', 'Pereira', 'Almeida', 'Ferreira', 'Rodrigues', 'Lima', 'Gomes', 'Martins', 'Rocha', 'Melo', 'Barbosa', 'Moura']
    
    const mockUsers = []
    
    for (let i = 1; i <= 25; i++) {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
      const role = roles[Math.floor(Math.random() * roles.length)]
      const status = statuses[Math.floor(Math.random() * statuses.length)]
      
      const createdAt = new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000)
      const lastLogin = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
      
      mockUsers.push({
        id: `user-${i}`,
        name: `${firstName} ${lastName}`,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@demo.com`,
        phone: `+55 (${Math.floor(Math.random() * 90) + 10}) 9${Math.floor(Math.random() * 9000) + 1000}-${Math.floor(Math.random() * 9000) + 1000}`,
        role,
        status,
        permissions: permissions[role],
        createdAt: createdAt.toISOString(),
        lastLogin: lastLogin.toISOString(),
        loginCount: Math.floor(Math.random() * 100) + 1,
        twoFactorEnabled: Math.random() > 0.5,
        avatar: `https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=random&size=128`
      })
    }
    
    return mockUsers
  }

  useEffect(() => {
    setLoading(true)
    setTimeout(() => {
      const mockUsers = generateMockUsers()
      setUsers(mockUsers)
      setLoading(false)
    }, 1000)
  }, [])

  // Filtrar usuários
  useEffect(() => {
    let filtered = users

    // Filtrar por termo de busca
    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone.includes(searchTerm)
      )
    }

    // Filtrar por função
    if (selectedRole !== 'all') {
      filtered = filtered.filter(user => user.role === selectedRole)
    }

    // Filtrar por status
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(user => user.status === selectedStatus)
    }

    setFilteredUsers(filtered)
    setCurrentPage(1)
  }, [users, searchTerm, selectedRole, selectedStatus])

  // Paginação
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage)
  const startIndex = (currentPage - 1) * usersPerPage
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + usersPerPage)

  const getRoleBadge = (role) => {
    const colors = {
      admin: 'bg-danger',
      manager: 'bg-warning',
      operator: 'bg-info',
      viewer: 'bg-secondary'
    }
    return <span className={`badge ${colors[role]}`}>{role.toUpperCase()}</span>
  }

  const getStatusBadge = (status) => {
    const colors = {
      active: 'bg-success',
      inactive: 'bg-secondary',
      suspended: 'bg-danger'
    }
    return <span className={`badge ${colors[status]}`}>{status.toUpperCase()}</span>
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

  const handleCreateUser = () => {
    setModalType('create')
    setSelectedUser(null)
    setShowModal(true)
  }

  const handleEditUser = (user) => {
    setModalType('edit')
    setSelectedUser(user)
    setShowModal(true)
  }

  const handleToggleStatus = (user) => {
    setUsers(prev => prev.map(u => 
      u.id === user.id 
        ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' }
        : u
    ))
  }

  const handleDeleteUser = (userId) => {
    if (confirm('Tem certeza que deseja excluir este usuário?')) {
      setUsers(prev => prev.filter(u => u.id !== userId))
    }
  }

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedRole('all')
    setSelectedStatus('all')
  }

  return (
    <div className="container-fluid">
      <div className="page-header mb-4">
        <div className="row align-items-center">
          <div className="col">
            <h2 className="page-title">Usuários</h2>
            <div className="page-pretitle">Gerenciar usuários do sistema</div>
          </div>
          <div className="col-auto ms-auto">
            <div className="btn-list">
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleCreateUser}
              >
                <IconPlus size={16} className="me-1" />
                Novo Usuário
              </button>
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
                  <IconUser size={24} className="text-primary" />
                </div>
                <div>
                  <div className="h3 m-0">{users.length}</div>
                  <div className="text-muted small">Total Usuários</div>
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
                  <div className="h3 m-0">{users.filter(u => u.status === 'active').length}</div>
                  <div className="text-muted small">Ativos</div>
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
                  <IconShield size={24} className="text-warning" />
                </div>
                <div>
                  <div className="h3 m-0">{users.filter(u => u.role === 'admin').length}</div>
                  <div className="text-muted small">Administradores</div>
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
                  <IconKey size={24} className="text-info" />
                </div>
                <div>
                  <div className="h3 m-0">{users.filter(u => u.twoFactorEnabled).length}</div>
                  <div className="text-muted small">2FA Ativado</div>
                </div>
              </div>
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
                  placeholder="Pesquisar nome, email ou telefone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-3">
              <label className="form-label">Função</label>
              <select
                className="form-select"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
              >
                <option value="all">Todas</option>
                <option value="admin">Administrador</option>
                <option value="manager">Gerente</option>
                <option value="operator">Operador</option>
                <option value="viewer">Visualizador</option>
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label">Status</label>
              <select
                className="form-select"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="all">Todos</option>
                <option value="active">Ativo</option>
                <option value="inactive">Inativo</option>
                <option value="suspended">Suspenso</option>
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

      {/* Tabela de Usuários */}
      <div className="card">
        <div className="card-header">
          <div className="row align-items-center">
            <div className="col">
              <h3 className="card-title">
                Lista de Usuários ({filteredUsers.length} de {users.length})
              </h3>
            </div>
            <div className="col-auto">
              <select
                className="form-select form-select-sm"
                value={usersPerPage}
                onChange={(e) => setUsersPerPage(Number(e.target.value))}
              >
                <option value={5}>5 por página</option>
                <option value={10}>10 por página</option>
                <option value={25}>25 por página</option>
                <option value={50}>50 por página</option>
              </select>
            </div>
          </div>
        </div>
        <div className="card-body p-0">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary mb-3" role="status">
                <span className="visually-hidden">Carregando...</span>
              </div>
              <p className="text-muted">Carregando usuários...</p>
            </div>
          ) : paginatedUsers.length === 0 ? (
            <div className="text-center py-5">
              <IconUser size={48} className="text-muted mb-3" />
              <h4 className="text-muted">Nenhum usuário encontrado</h4>
              <p className="text-muted">Tente ajustar os filtros ou adicione um novo usuário</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover table-nowrap mb-0">
                <thead>
                  <tr>
                    <th>Usuário</th>
                    <th>Função</th>
                    <th>Status</th>
                    <th>Último Acesso</th>
                    <th>Acessos</th>
                    <th>2FA</th>
                    <th>Criado em</th>
                    <th width="150">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedUsers.map((user) => (
                    <tr key={user.id} className={user.status === 'suspended' ? 'table-danger' : ''}>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="me-3">
                            <img 
                              src={user.avatar} 
                              alt={user.name}
                              className="avatar avatar-sm rounded-circle"
                              style={{ width: '40px', height: '40px' }}
                            />
                          </div>
                          <div>
                            <div className="strong">{user.name}</div>
                            <div className="text-muted small">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td>{getRoleBadge(user.role)}</td>
                      <td>{getStatusBadge(user.status)}</td>
                      <td>
                        <div className="text-muted small">
                          {formatDateTime(user.lastLogin)}
                        </div>
                      </td>
                      <td>
                        <span className="badge bg-outline-secondary">
                          {user.loginCount}
                        </span>
                      </td>
                      <td>
                        {user.twoFactorEnabled ? (
                          <span className="badge bg-success">Ativo</span>
                        ) : (
                          <span className="badge bg-secondary">Inativo</span>
                        )}
                      </td>
                      <td>
                        <div className="text-muted small">
                          {formatDate(user.createdAt)}
                        </div>
                      </td>
                      <td>
                        <div className="btn-list">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => handleEditUser(user)}
                            title="Editar"
                          >
                            <IconEdit size={14} />
                          </button>
                          <button
                            className={`btn btn-sm ${user.status === 'active' ? 'btn-outline-warning' : 'btn-outline-success'}`}
                            onClick={() => handleToggleStatus(user)}
                            title={user.status === 'active' ? 'Desativar' : 'Ativar'}
                          >
                            {user.status === 'active' ? <IconBan size={14} /> : <IconLockOpen size={14} />}
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDeleteUser(user.id)}
                            title="Excluir"
                          >
                            <IconTrash size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        {filteredUsers.length > 0 && (
          <div className="card-footer d-flex align-items-center">
            <div className="text-muted small">
              Mostrando {startIndex + 1} a {Math.min(startIndex + usersPerPage, filteredUsers.length)} de {filteredUsers.length} usuários
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

      {/* Modal de Usuário */}
      {showModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {modalType === 'create' ? 'Criar Novo Usuário' : 'Editar Usuário'}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Nome Completo</label>
                    <input
                      type="text"
                      className="form-control"
                      defaultValue={selectedUser?.name || ''}
                      placeholder="Digite o nome completo"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      defaultValue={selectedUser?.email || ''}
                      placeholder="usuario@empresa.com"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Telefone</label>
                    <input
                      type="tel"
                      className="form-control"
                      defaultValue={selectedUser?.phone || ''}
                      placeholder="+55 (11) 99999-9999"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Função</label>
                    <select className="form-select" defaultValue={selectedUser?.role || 'operator'}>
                      <option value="admin">Administrador</option>
                      <option value="manager">Gerente</option>
                      <option value="operator">Operador</option>
                      <option value="viewer">Visualizador</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Status</label>
                    <select className="form-select" defaultValue={selectedUser?.status || 'active'}>
                      <option value="active">Ativo</option>
                      <option value="inactive">Inativo</option>
                      <option value="suspended">Suspenso</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Senha</label>
                    <input
                      type="password"
                      className="form-control"
                      placeholder={modalType === 'create' ? 'Digite a senha' : 'Deixe em branco para manter a senha atual'}
                    />
                  </div>
                  <div className="col-12">
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        defaultChecked={selectedUser?.twoFactorEnabled || false}
                      />
                      <label className="form-check-label">
                        Ativar autenticação de dois fatores (2FA)
                      </label>
                    </div>
                  </div>
                  {selectedUser && (
                    <div className="col-12">
                      <div className="alert alert-info">
                        <strong>Informações do Usuário:</strong>
                        <ul className="mb-0 mt-2">
                          <li>Criado em: {formatDateTime(selectedUser.createdAt)}</li>
                          <li>Último acesso: {formatDateTime(selectedUser.lastLogin)}</li>
                          <li>Número de acessos: {selectedUser.loginCount}</li>
                          <li>Permissões atuais: {selectedUser.permissions.join(', ')}</li>
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    // Simular salvamento
                    setShowModal(false)
                  }}
                >
                  {modalType === 'create' ? 'Criar Usuário' : 'Salvar Alterações'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Users