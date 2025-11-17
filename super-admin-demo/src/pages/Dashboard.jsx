import React, { useMemo } from 'react'

const brl = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0)

export default function Dashboard() {
  const stats = useMemo(() => ({
    totalStores: 24,
    totalUsers: 156,
    activeSessions: 32,
    totalRevenue: 125430,
  }), [])

  const kpis = useMemo(() => ([
    { label: 'Lojas', value: stats.totalStores },
    { label: 'Usuários', value: stats.totalUsers },
    { label: 'Sessões Ativas', value: stats.activeSessions },
    { label: 'Receita Total', value: brl(stats.totalRevenue) },
  ]), [stats])

  const recentStores = useMemo(() => ([
    { id: 1, name: 'Loja Centro', owner: 'João Silva', status: 'Ativa', revenue: 5420, createdAt: '2024-11-15' },
    { id: 2, name: 'Tech Store', owner: 'Maria Santos', status: 'Ativa', revenue: 8900, createdAt: '2024-11-14' },
    { id: 3, name: 'Fashion Boutique', owner: 'Pedro Oliveira', status: 'Pendente', revenue: 3200, createdAt: '2024-11-13' },
    { id: 4, name: 'Food Market', owner: 'Ana Costa', status: 'Ativa', revenue: 12300, createdAt: '2024-11-12' },
  ]), [])

  const recentUsers = useMemo(() => ([
    { id: 1, name: 'Carlos Mendes', email: 'carlos@email.com', role: 'admin', status: 'Ativo', lastLogin: '2024-11-16' },
    { id: 2, name: 'Julia Fernandes', email: 'julia@email.com', role: 'user', status: 'Ativo', lastLogin: '2024-11-15' },
    { id: 3, name: 'Roberto Lima', email: 'roberto@email.com', role: 'user', status: 'Inativo', lastLogin: '2024-11-10' },
    { id: 4, name: 'Patricia Souza', email: 'patricia@email.com', role: 'admin', status: 'Ativo', lastLogin: '2024-11-16' },
  ]), [])

  return (
    <div className="page">
      <div className="page-header">
        <div className="container-xl">
          <div className="row g-2 align-items-center">
            <div className="col">
              <h2 className="page-title">Dashboard Super Admin</h2>
              <div className="page-pretitle">ADMINISTRAÇÃO DE LOJAS E USUÁRIOS</div>
            </div>
            <div className="col-auto ms-auto d-print-none">
              <div className="btn-list">
                <button className="btn btn-outline-primary" onClick={() => alert('Somente visual.')}>Atualizar</button>
                <a href="/analytics" className="btn btn-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                    <path d="M3 3v18h18"/><path d="M7 14l5-5 4 4 5-5"/>
                  </svg>
                  Ver Analytics Detalhados
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="page-body">
        <div className="container-xl">
          <div className="row row-cards mb-3">
            {kpis.map((k) => (
              <div key={k.label} className="col-sm-6 col-md-3">
                <div className="card card-sm">
                  <div className="card-body">
                    <div className="d-flex align-items-center">
                      <div>
                        <div className="font-weight-medium">{k.label}</div>
                        <div className="text-secondary">{k.value}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="row">
            <div className="col-lg-6">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Lojas Recentes</h3>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table table-vcenter">
                      <thead>
                        <tr>
                          <th>NOME</th>
                          <th>PROPRIETÁRIO</th>
                          <th>STATUS</th>
                          <th>RECEITA</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentStores.map((s) => (
                          <tr key={s.id}>
                            <td>
                              <div className="fw-medium">{s.name}</div>
                              <div className="text-secondary">{new Date(s.createdAt).toLocaleDateString('pt-BR')}</div>
                            </td>
                            <td>{s.owner}</td>
                            <td>
                              <span className={`badge ${s.status === 'Ativa' ? 'bg-success' : s.status === 'Pendente' ? 'bg-warning' : 'bg-danger'}`}>{s.status}</span>
                            </td>
                            <td>{brl(s.revenue)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Usuários Recentes</h3>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table table-vcenter">
                      <thead>
                        <tr>
                          <th>NOME</th>
                          <th>EMAIL</th>
                          <th>FUNÇÃO</th>
                          <th>STATUS</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentUsers.map((u) => (
                          <tr key={u.id}>
                            <td>
                              <div className="fw-medium">{u.name}</div>
                              <div className="text-secondary">{new Date(u.lastLogin).toLocaleDateString('pt-BR')}</div>
                            </td>
                            <td>{u.email}</td>
                            <td>
                              <span className={`badge ${u.role === 'admin' ? 'bg-warning' : 'bg-info'}`}>{u.role}</span>
                            </td>
                            <td>
                              <span className={`badge ${u.status === 'Ativo' ? 'bg-success' : 'bg-danger'}`}>{u.status}</span>
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
        </div>
      </div>
    </div>
  )
}