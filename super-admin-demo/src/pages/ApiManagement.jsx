import React, { useState, useMemo } from 'react';
import { IconSearch, IconSettings, IconPower, IconRefresh, IconCheck, IconX, IconAlertCircle, IconKey, IconLink, IconClock, IconMessage, IconCreditCard, IconMail, IconMapPin, IconBrain, IconDatabase, IconPlus } from '@tabler/icons-react';

const ApiManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Mock data for APIs
  const apis = [
    {
      id: 1,
      name: 'WhatsApp Business API',
      provider: 'Meta',
      status: 'active',
      category: 'messaging',
      endpoint: 'https://graph.facebook.com/v18.0/',
      apiKey: 'wapp_*************************xyz123',
      lastUsed: '2024-01-15 14:30',
      requestsToday: 1247,
      requestsLimit: 5000,
      responseTime: '245ms',
      uptime: '99.9%',
      description: 'API oficial do WhatsApp Business para envio de mensagens'
    },
    {
      id: 2,
      name: 'Stripe Payment API',
      provider: 'Stripe',
      status: 'active',
      category: 'payment',
      endpoint: 'https://api.stripe.com/v1/',
      apiKey: 'sk_live_*************************abc789',
      lastUsed: '2024-01-15 15:45',
      requestsToday: 89,
      requestsLimit: 1000,
      responseTime: '120ms',
      uptime: '100%',
      description: 'Processamento de pagamentos e transações financeiras'
    },
    {
      id: 3,
      name: 'SendGrid Email API',
      provider: 'Twilio',
      status: 'maintenance',
      category: 'email',
      endpoint: 'https://api.sendgrid.com/v3/',
      apiKey: 'SG.*************************def456',
      lastUsed: '2024-01-14 09:20',
      requestsToday: 342,
      requestsLimit: 2000,
      responseTime: '890ms',
      uptime: '98.5%',
      description: 'Envio de emails transacionais e marketing'
    },
    {
      id: 4,
      name: 'Google Maps API',
      provider: 'Google',
      status: 'active',
      category: 'maps',
      endpoint: 'https://maps.googleapis.com/maps/api/',
      apiKey: 'AIza*************************ghi012',
      lastUsed: '2024-01-15 16:00',
      requestsToday: 567,
      requestsLimit: 10000,
      responseTime: '180ms',
      uptime: '99.8%',
      description: 'Serviços de geolocalização e mapeamento'
    },
    {
      id: 5,
      name: 'OpenAI GPT API',
      provider: 'OpenAI',
      status: 'inactive',
      category: 'ai',
      endpoint: 'https://api.openai.com/v1/',
      apiKey: 'sk-*************************jkl345',
      lastUsed: '2024-01-10 11:30',
      requestsToday: 0,
      requestsLimit: 100,
      responseTime: '-',
      uptime: '0%',
      description: 'Processamento de linguagem natural e geração de texto'
    },
    {
      id: 6,
      name: 'AWS S3 API',
      provider: 'Amazon',
      status: 'active',
      category: 'storage',
      endpoint: 'https://s3.amazonaws.com/',
      apiKey: 'AKIA*************************mno678',
      lastUsed: '2024-01-15 12:15',
      requestsToday: 1234,
      requestsLimit: 'Ilimitado',
      responseTime: '95ms',
      uptime: '99.99%',
      description: 'Armazenamento de objetos em nuvem'
    }
  ];

  const filteredApis = useMemo(() => {
    return apis.filter(api => {
      const matchesSearch = api.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           api.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           api.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || api.status === statusFilter;
      const matchesCategory = categoryFilter === 'all' || api.category === categoryFilter;
      
      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [searchTerm, statusFilter, categoryFilter]);

  const stats = {
    total: apis.length,
    active: apis.filter(api => api.status === 'active').length,
    maintenance: apis.filter(api => api.status === 'maintenance').length,
    inactive: apis.filter(api => api.status === 'inactive').length
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <span className="badge bg-success">Ativo</span>;
      case 'maintenance':
        return <span className="badge bg-warning">Manutenção</span>;
      case 'inactive':
        return <span className="badge bg-danger">Inativo</span>;
      default:
        return <span className="badge bg-secondary">Desconhecido</span>;
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'messaging':
        return <IconMessage className="icon" />;
      case 'payment':
        return <IconCreditCard className="icon" />;
      case 'email':
        return <IconMail className="icon" />;
      case 'maps':
        return <IconMapPin className="icon" />;
      case 'ai':
        return <IconBrain className="icon" />;
      case 'storage':
        return <IconDatabase className="icon" />;
      default:
        return <IconSettings className="icon" />;
    }
  };

  return (
    <div className="container-xl">
      {/* Page Header */}
      <div className="page-header d-print-none">
        <div className="row g-2 align-items-center">
          <div className="col">
            <h2 className="page-title">Gerenciamento de APIs</h2>
            <div className="text-muted mt-1">Configure e monitore as APIs integradas ao sistema</div>
          </div>
          <div className="col-auto ms-auto d-print-none">
            <div className="btn-list">
              <button className="btn btn-primary d-none d-sm-inline-block" data-bs-toggle="modal" data-bs-target="#modal-new-api">
                <IconPlus className="icon" />
                Nova API
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row row-cards">
        <div className="col-sm-6 col-lg-3">
          <div className="card">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="subheader">Total de APIs</div>
                <div className="ms-auto lh-1">
                  <div className="dropdown">
                    <a className="dropdown-toggle text-muted" href="#" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                      Últimos 7 dias
                    </a>
                  </div>
                </div>
              </div>
              <div className="d-flex align-items-baseline">
                <div className="h1 mb-0 me-2">{stats.total}</div>
                <div className="me-auto">
                  <span className="text-green d-inline-flex align-items-center lh-1">
                    APIs configuradas
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-sm-6 col-lg-3">
          <div className="card">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="subheader">Ativas</div>
              </div>
              <div className="d-flex align-items-baseline">
                <div className="h1 mb-0 me-2 text-success">{stats.active}</div>
                <div className="me-auto">
                  <span className="text-success d-inline-flex align-items-center lh-1">
                    Operacionais
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-sm-6 col-lg-3">
          <div className="card">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="subheader">Em Manutenção</div>
              </div>
              <div className="d-flex align-items-baseline">
                <div className="h1 mb-0 me-2 text-warning">{stats.maintenance}</div>
                <div className="me-auto">
                  <span className="text-warning d-inline-flex align-items-center lh-1">
                    Indisponíveis
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-sm-6 col-lg-3">
          <div className="card">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="subheader">Inativas</div>
              </div>
              <div className="d-flex align-items-baseline">
                <div className="h1 mb-0 me-2 text-danger">{stats.inactive}</div>
                <div className="me-auto">
                  <span className="text-danger d-inline-flex align-items-center lh-1">
                    Desativadas
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card mt-4">
        <div className="card-header">
          <h3 className="card-title">Filtros</h3>
        </div>
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-4">
              <div className="input-icon">
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Buscar APIs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <span className="input-icon-addon">
                  <IconSearch className="icon" />
                </span>
              </div>
            </div>
            <div className="col-md-4">
              <select 
                className="form-select" 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">Todos os Status</option>
                <option value="active">Ativo</option>
                <option value="maintenance">Manutenção</option>
                <option value="inactive">Inativo</option>
              </select>
            </div>
            <div className="col-md-4">
              <select 
                className="form-select" 
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="all">Todas as Categorias</option>
                <option value="messaging">Mensagens</option>
                <option value="payment">Pagamento</option>
                <option value="email">Email</option>
                <option value="maps">Mapas</option>
                <option value="ai">Inteligência Artificial</option>
                <option value="storage">Armazenamento</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* APIs List */}
      <div className="card mt-4">
        <div className="card-header">
          <h3 className="card-title">APIs Integradas</h3>
          <div className="card-actions">
            <button className="btn btn-outline-primary btn-sm">
              <IconRefresh className="icon" />
              Atualizar
            </button>
          </div>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-vcenter">
              <thead>
                <tr>
                  <th>API</th>
                  <th>Status</th>
                  <th>Categoria</th>
                  <th>Endpoint</th>
                  <th>Último Uso</th>
                  <th>Requisições</th>
                  <th>Tempo Resposta</th>
                  <th>Disponibilidade</th>
                  <th className="w-1">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredApis.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="text-center text-muted py-4">
                      Nenhuma API encontrada com os filtros aplicados
                    </td>
                  </tr>
                ) : (
                  filteredApis.map((api) => (
                    <tr key={api.id}>
                      <td>
                        <div>
                          <div className="fw-bold">{api.name}</div>
                          <div className="text-muted small">{api.provider}</div>
                          <div className="text-muted small">{api.description}</div>
                        </div>
                      </td>
                      <td>
                        {getStatusBadge(api.status)}
                      </td>
                      <td>
                        <span className="badge bg-info text-uppercase">{api.category}</span>
                      </td>
                      <td>
                        <code className="text-muted small">{api.endpoint}</code>
                      </td>
                      <td>
                        <div className="text-muted">
                          <IconClock className="icon icon-inline" />
                          {api.lastUsed}
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="progress progress-sm me-2" style={{width: '60px'}}>
                            <div 
                              className="progress-bar" 
                              style={{width: `${(api.requestsToday / (api.requestsLimit === 'Ilimitado' ? 10000 : api.requestsLimit)) * 100}%`}}
                            ></div>
                          </div>
                          <div className="small text-muted">
                            {api.requestsToday}/{api.requestsLimit}
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="text-muted">
                          {api.responseTime}
                        </div>
                      </td>
                      <td>
                        <div className="text-success">
                          <IconCheck className="icon icon-inline" />
                          {api.uptime}
                        </div>
                      </td>
                      <td>
                        <div className="btn-list flex-nowrap">
                          <button className="btn btn-white btn-sm" title="Configurar">
                            <IconSettings className="icon" />
                          </button>
                          <button 
                            className={`btn btn-sm ${
                              api.status === 'active' ? 'btn-danger' : 'btn-success'
                            }`}
                            title={api.status === 'active' ? 'Desativar' : 'Ativar'}
                          >
                            <IconPower className="icon" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiManagement;