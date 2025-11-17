import React, { useState, useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';

// Dados mockados para demonstração
const mockAttendants = [
  {
    _id: '1',
    name: 'João Silva',
    email: 'joao.silva@zappy.com',
    shift: 'morning',
    permissions: ['create_orders', 'view_reports'],
    isActive: true,
    orderCount: 45,
    createdAt: '2024-01-15T10:30:00Z'
  },
  {
    _id: '2',
    name: 'Maria Santos',
    email: 'maria.santos@zappy.com',
    shift: 'afternoon',
    permissions: ['create_orders', 'view_reports', 'manage_products'],
    isActive: true,
    orderCount: 32,
    createdAt: '2024-02-20T14:15:00Z'
  },
  {
    _id: '3',
    name: 'Pedro Oliveira',
    email: 'pedro.oliveira@zappy.com',
    shift: 'night',
    permissions: ['create_orders'],
    isActive: false,
    orderCount: 18,
    createdAt: '2024-03-10T18:45:00Z'
  }
];

// Configurações de turno
const shiftOptions = [
  { value: 'morning', label: 'Manhã (06:00 - 12:00)' },
  { value: 'afternoon', label: 'Tarde (12:00 - 18:00)' },
  { value: 'night', label: 'Noite (18:00 - 23:00)' },
  { value: 'full', label: 'Integral (06:00 - 23:00)' }
];

// Configurações de permissões
const permissionOptions = [
  { value: 'create_orders', label: 'Criar Pedidos' },
  { value: 'view_reports', label: 'Visualizar Relatórios' },
  { value: 'manage_products', label: 'Gerenciar Produtos' }
];

// URL do sistema de balcão (demo)
const COUNTER_URL = 'http://localhost:5174';

export default function CounterAttendants() {
  const [attendants, setAttendants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAttendant, setEditingAttendant] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    shift: 'morning',
    permissions: ['create_orders']
  });

  // Simular carregamento de dados
  useEffect(() => {
    const timer = setTimeout(() => {
      setAttendants(mockAttendants);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Abrir formulário para novo atendente
  const handleNewAttendant = () => {
    setEditingAttendant(null);
    setFormData({
      name: '',
      email: '',
      password: '',
      shift: 'morning',
      permissions: ['create_orders']
    });
    setShowForm(true);
  };

  // Abrir formulário para edição
  const handleEditAttendant = (attendant) => {
    setEditingAttendant(attendant);
    setFormData({
      name: attendant.name,
      email: attendant.email,
      password: '', // Não preenchemos a senha no modo edição
      shift: attendant.shift,
      permissions: [...attendant.permissions]
    });
    setShowForm(true);
  };

  // Alternar status ativo/inativo
  const handleToggleStatus = async (attendant) => {
    try {
      // Simular chamada API
      const updatedAttendant = {
        ...attendant,
        isActive: !attendant.isActive
      };

      setAttendants(prev => 
        prev.map(att => att._id === attendant._id ? updatedAttendant : att)
      );

      toast.success(`Atendente ${updatedAttendant.isActive ? 'ativado' : 'desativado'} com sucesso!`);
    } catch (error) {
      toast.error('Erro ao alterar status do atendente');
    }
  };

  // Copiar link do sistema de balcão
  const copyCounterLink = () => {
    navigator.clipboard.writeText(COUNTER_URL);
    toast.success('Link do sistema de balcão copiado!');
  };

  // Enviar formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingAttendant) {
        // Modo edição
        const updatedAttendant = {
          ...editingAttendant,
          name: formData.name,
          shift: formData.shift,
          permissions: formData.permissions
        };

        setAttendants(prev => 
          prev.map(att => att._id === editingAttendant._id ? updatedAttendant : att)
        );

        toast.success('Atendente atualizado com sucesso!');
      } else {
        // Modo criação
        const newAttendant = {
          _id: Date.now().toString(),
          name: formData.name,
          email: formData.email,
          shift: formData.shift,
          permissions: formData.permissions,
          isActive: true,
          orderCount: 0,
          createdAt: new Date().toISOString()
        };

        setAttendants(prev => [...prev, newAttendant]);
        toast.success('Atendente criado com sucesso!');
      }

      setShowForm(false);
      setEditingAttendant(null);
    } catch (error) {
      toast.error('Erro ao salvar atendente');
    }
  };

  // Cancelar formulário
  const handleCancel = () => {
    setShowForm(false);
    setEditingAttendant(null);
  };

  // Alternar permissão
  const togglePermission = (permission) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter(p => p !== permission)
        : [...prev.permissions, permission]
    }));
  };

  // Formatar data
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  // Obter label do turno
  const getShiftLabel = (shift) => {
    const option = shiftOptions.find(opt => opt.value === shift);
    return option ? option.label : shift;
  };

  // Filtrar apenas atendentes ativos para mostrar no início
  const sortedAttendants = useMemo(() => {
    return [...attendants].sort((a, b) => {
      if (a.isActive && !b.isActive) return -1;
      if (!a.isActive && b.isActive) return 1;
      return a.name.localeCompare(b.name);
    });
  }, [attendants]);

  if (loading) {
    return (
      <div className="page">
        <div className="page-header">
          <div className="container-xl">
            <div className="row g-2 align-items-center">
              <div className="col">
                <h2 className="page-title">Carregando atendentes...</h2>
              </div>
            </div>
          </div>
        </div>
        <div className="page-body">
          <div className="container-xl">
            <div className="text-center py-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Carregando...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <div className="container-xl">
          <div className="row g-2 align-items-center">
            <div className="col">
              <h2 className="page-title">Atendentes de Balcão</h2>
              <div className="page-pretitle">Gerenciamento de atendentes do sistema de balcão</div>
            </div>
            <div className="col-auto ms-auto d-print-none">
              <div className="btn-list">
                <button 
                  className="btn btn-outline-primary" 
                  onClick={copyCounterLink}
                  title="Copiar link do sistema de balcão"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                    <path d="M13 7h-2a2 2 0 0 0 -2 2v8a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2v-8a2 2 0 0 0 -2 -2h-2" />
                    <path d="M13 9l-2 0l0 -4l4 0l0 2" />
                  </svg>
                  Link Balcão
                </button>
                <button 
                  className="btn btn-primary" 
                  onClick={handleNewAttendant}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                    <path d="M12 5l0 14" />
                    <path d="M5 12l14 0" />
                  </svg>
                  Novo Atendente
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="page-body">
        <div className="container-xl">
          {/* Link do sistema de balcão */}
          <div className="row mb-3">
            <div className="col-12">
              <div className="card">
                <div className="card-body">
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <h4 className="mb-1">Sistema de Balcão</h4>
                      <p className="text-muted mb-0">Os atendentes acessam o sistema de balcão através deste link:</p>
                      <div className="mt-2">
                        <code className="text-primary">{COUNTER_URL}</code>
                      </div>
                    </div>
                    <button className="btn btn-outline-primary" onClick={copyCounterLink}>
                      Copiar Link
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Lista de atendentes */}
          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Lista de Atendentes</h3>
                  <div className="text-muted">
                    Total: {attendants.length} atendentes
                  </div>
                </div>
                <div className="card-body p-0">
                  {attendants.length === 0 ? (
                    <div className="text-center py-4">
                      <div className="empty-state">
                        <div className="empty-state-icon">
                          <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                            <circle cx="9" cy="7" r="4" />
                            <path d="M3 21a6 6 0 0 1 12 0" />
                            <path d="M17 21v-6" />
                            <path d="M20 18l-2 2l2 2" />
                          </svg>
                        </div>
                        <h4>Nenhum atendente cadastrado</h4>
                        <p className="text-muted">Comece criando seu primeiro atendente de balcão.</p>
                        <button className="btn btn-primary" onClick={handleNewAttendant}>
                          Criar Primeiro Atendente
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-vcenter card-table">
                        <thead>
                          <tr>
                            <th>Nome</th>
                            <th>Email</th>
                            <th>Turno</th>
                            <th>Pedidos</th>
                            <th>Status</th>
                            <th>Data de Cadastro</th>
                            <th className="w-1">Ações</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sortedAttendants.map((attendant) => (
                            <tr key={attendant._id} className={!attendant.isActive ? 'table-secondary' : ''}>
                              <td>
                                <div className="d-flex align-items-center">
                                  <div className="avatar avatar-sm me-2">
                                    <div className="avatar-title bg-primary text-white rounded-circle">
                                      {attendant.name.charAt(0).toUpperCase()}
                                    </div>
                                  </div>
                                  <div>
                                    <div className="font-weight-medium">{attendant.name}</div>
                                    <div className="text-muted">
                                      {attendant.permissions.length} permissões
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td>{attendant.email}</td>
                              <td>
                                <span className="badge bg-info">
                                  {getShiftLabel(attendant.shift)}
                                </span>
                              </td>
                              <td>
                                <span className="badge bg-outline-primary">
                                  {attendant.orderCount} pedidos
                                </span>
                              </td>
                              <td>
                                <span className={`badge ${attendant.isActive ? 'bg-success' : 'bg-danger'}`}>
                                  {attendant.isActive ? 'Ativo' : 'Inativo'}
                                </span>
                              </td>
                              <td>{formatDate(attendant.createdAt)}</td>
                              <td>
                                <div className="btn-list">
                                  <button 
                                    className="btn btn-icon btn-sm btn-outline-primary"
                                    onClick={() => handleEditAttendant(attendant)}
                                    title="Editar atendente"
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                      <path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1" />
                                      <path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z" />
                                      <path d="M16 5l3 3" />
                                    </svg>
                                  </button>
                                  <button 
                                    className={`btn btn-icon btn-sm ${attendant.isActive ? 'btn-outline-danger' : 'btn-outline-success'}`}
                                    onClick={() => handleToggleStatus(attendant)}
                                    title={attendant.isActive ? 'Desativar atendente' : 'Ativar atendente'}
                                  >
                                    {attendant.isActive ? (
                                      <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                        <path d="M6 5l0 14" />
                                        <path d="M18 5l0 14" />
                                      </svg>
                                    ) : (
                                      <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                        <path d="M7 12l5 5l10 -10" />
                                      </svg>
                                    )}
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
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de formulário */}
      {showForm && (
        <div className="modal modal-blur fade show d-block" tabIndex="-1">
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingAttendant ? 'Editar Atendente' : 'Novo Atendente'}
                </h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={handleCancel}
                ></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label required">Nome</label>
                        <input 
                          type="text" 
                          className="form-control" 
                          value={formData.name}
                          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                          required
                          placeholder="Nome completo do atendente"
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className={`form-label ${!editingAttendant ? 'required' : ''}`}>
                          Email
                        </label>
                        <input 
                          type="email" 
                          className="form-control" 
                          value={formData.email}
                          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                          required={!editingAttendant}
                          disabled={!!editingAttendant}
                          placeholder="email@exemplo.com"
                        />
                        {editingAttendant && (
                          <div className="form-hint">Email não pode ser alterado</div>
                        )}
                      </div>
                    </div>
                  </div>

                  {!editingAttendant && (
                    <div className="row">
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label required">Senha</label>
                          <input 
                            type="password" 
                            className="form-control" 
                            value={formData.password}
                            onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                            required={!editingAttendant}
                            placeholder="Mínimo 6 caracteres"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label required">Turno</label>
                        <select 
                          className="form-select" 
                          value={formData.shift}
                          onChange={(e) => setFormData(prev => ({ ...prev, shift: e.target.value }))}
                          required
                        >
                          {shiftOptions.map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Permissões</label>
                    <div className="form-selectgroup form-selectgroup-boxes d-flex flex-column">
                      {permissionOptions.map(permission => (
                        <label className="form-selectgroup-item flex-fill" key={permission.value}>
                          <input 
                            type="checkbox" 
                            className="form-selectgroup-input"
                            checked={formData.permissions.includes(permission.value)}
                            onChange={() => togglePermission(permission.value)}
                          />
                          <div className="form-selectgroup-label d-flex align-items-center justify-content-between">
                            <div>
                              <strong>{permission.label}</strong>
                              <div className="text-muted">
                                {permission.value === 'create_orders' && 'Permite criar novos pedidos'}
                                {permission.value === 'view_reports' && 'Acesso a relatórios e estatísticas'}
                                {permission.value === 'manage_products' && 'Gerenciar produtos e cardápio'}
                              </div>
                            </div>
                            <div className="form-check form-check-single form-switch">
                              <input 
                                type="checkbox" 
                                className="form-check-input"
                                checked={formData.permissions.includes(permission.value)}
                                onChange={() => togglePermission(permission.value)}
                              />
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="alert alert-info">
                    <h4>Informações importantes:</h4>
                    <ul className="mb-0">
                      <li>Atendentes usam o sistema de balcão para gerenciar pedidos</li>
                      <li>O acesso é feito através do link: <strong>{COUNTER_URL}</strong></li>
                      <li>Cada atendente tem permissões específicas para garantir segurança</li>
                      <li>Turnos ajudam a organizar a escala de trabalho</li>
                    </ul>
                  </div>
                </div>
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn me-auto" 
                    onClick={handleCancel}
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={!formData.name.trim() || (!editingAttendant && !formData.email.trim())}
                  >
                    {editingAttendant ? 'Atualizar' : 'Criar'} Atendente
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Backdrop do modal */}
      {showForm && <div className="modal-backdrop fade show"></div>}
    </div>
  );
}