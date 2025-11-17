import React, { useState, useEffect } from 'react';

// Hook para gerenciar metas e períodos
export const useGoalsConfig = () => {
  const [goals, setGoals] = useState({
    sales: 90,
    customers: 85,
    products: 95,
    orders: 92,
    avgTicket: 80,
    satisfaction: 88
  });

  const [comparisonPeriods, setComparisonPeriods] = useState({
    current: 'week',
    previous: 'previous_week'
  });

  const [targets, setTargets] = useState({
    daily: { revenue: 1500, orders: 150, customers: 100 },
    weekly: { revenue: 10000, orders: 1000, customers: 700 },
    monthly: { revenue: 40000, orders: 4000, customers: 2800 },
    yearly: { revenue: 480000, orders: 48000, customers: 33600 }
  });

  // Carregar configurações do localStorage
  useEffect(() => {
    const savedGoals = localStorage.getItem('statisticsGoals');
    const savedPeriods = localStorage.getItem('comparisonPeriods');
    const savedTargets = localStorage.getItem('statisticsTargets');

    if (savedGoals) {
      setGoals(JSON.parse(savedGoals));
    }
    if (savedPeriods) {
      setComparisonPeriods(JSON.parse(savedPeriods));
    }
    if (savedTargets) {
      setTargets(JSON.parse(savedTargets));
    }
  }, []);

  // Salvar configurações no localStorage
  const saveGoals = (newGoals) => {
    setGoals(newGoals);
    localStorage.setItem('statisticsGoals', JSON.stringify(newGoals));
  };

  const saveComparisonPeriods = (newPeriods) => {
    setComparisonPeriods(newPeriods);
    localStorage.setItem('comparisonPeriods', JSON.stringify(newPeriods));
  };

  const saveTargets = (newTargets) => {
    setTargets(newTargets);
    localStorage.setItem('statisticsTargets', JSON.stringify(newTargets));
  };

  return {
    goals,
    comparisonPeriods,
    targets,
    saveGoals,
    saveComparisonPeriods,
    saveTargets
  };
};

// Componente de configuração de metas
export const GoalsConfigModal = ({ show, onClose }) => {
  const { goals, saveGoals, targets, saveTargets } = useGoalsConfig();
  const [tempGoals, setTempGoals] = useState(goals);
  const [tempTargets, setTempTargets] = useState(targets);
  const [activeTab, setActiveTab] = useState('goals');

  const handleSave = () => {
    saveGoals(tempGoals);
    saveTargets(tempTargets);
    onClose();
  };

  const handleReset = () => {
    const defaultGoals = {
      sales: 90,
      customers: 85,
      products: 95,
      orders: 92,
      avgTicket: 80,
      satisfaction: 88
    };
    
    const defaultTargets = {
      daily: { revenue: 1500, orders: 150, customers: 100 },
      weekly: { revenue: 10000, orders: 1000, customers: 700 },
      monthly: { revenue: 40000, orders: 4000, customers: 2800 },
      yearly: { revenue: 480000, orders: 48000, customers: 33600 }
    };
    
    setTempGoals(defaultGoals);
    setTempTargets(defaultTargets);
  };

  if (!show) return null;

  return (
    <div className="modal modal-blur fade show d-block" tabIndex="-1">
      <div className="modal-dialog modal-lg" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Configurar Metas e Períodos</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          
          <div className="modal-body">
            <ul className="nav nav-tabs mb-3">
              <li className="nav-item">
                <button 
                  className={`nav-link ${activeTab === 'goals' ? 'active' : ''}`}
                  onClick={() => setActiveTab('goals')}
                >
                  Metas de Performance
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className={`nav-link ${activeTab === 'targets' ? 'active' : ''}`}
                  onClick={() => setActiveTab('targets')}
                >
                  Metas de Vendas
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className={`nav-link ${activeTab === 'periods' ? 'active' : ''}`}
                  onClick={() => setActiveTab('periods')}
                >
                  Períodos de Comparação
                </button>
              </li>
            </ul>

            {activeTab === 'goals' && (
              <div>
                <p className="text-muted mb-3">Defina as metas de performance para cada métrica:</p>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Vendas (%)</label>
                    <input 
                      type="number" 
                      className="form-control" 
                      value={tempGoals.sales}
                      onChange={(e) => setTempGoals({...tempGoals, sales: parseInt(e.target.value) || 0})}
                      min="0" 
                      max="100"
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Clientes (%)</label>
                    <input 
                      type="number" 
                      className="form-control" 
                      value={tempGoals.customers}
                      onChange={(e) => setTempGoals({...tempGoals, customers: parseInt(e.target.value) || 0})}
                      min="0" 
                      max="100"
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Produtos (%)</label>
                    <input 
                      type="number" 
                      className="form-control" 
                      value={tempGoals.products}
                      onChange={(e) => setTempGoals({...tempGoals, products: parseInt(e.target.value) || 0})}
                      min="0" 
                      max="100"
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Pedidos (%)</label>
                    <input 
                      type="number" 
                      className="form-control" 
                      value={tempGoals.orders}
                      onChange={(e) => setTempGoals({...tempGoals, orders: parseInt(e.target.value) || 0})}
                      min="0" 
                      max="100"
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Ticket Médio (%)</label>
                    <input 
                      type="number" 
                      className="form-control" 
                      value={tempGoals.avgTicket}
                      onChange={(e) => setTempGoals({...tempGoals, avgTicket: parseInt(e.target.value) || 0})}
                      min="0" 
                      max="100"
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Satisfação (%)</label>
                    <input 
                      type="number" 
                      className="form-control" 
                      value={tempGoals.satisfaction}
                      onChange={(e) => setTempGoals({...tempGoals, satisfaction: parseInt(e.target.value) || 0})}
                      min="0" 
                      max="100"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'targets' && (
              <div>
                <p className="text-muted mb-3">Defina as metas de vendas para cada período:</p>
                
                <div className="mb-3">
                  <h6>Meta Diária</h6>
                  <div className="row">
                    <div className="col-md-4 mb-2">
                      <label className="form-label">Receita (R$)</label>
                      <input 
                        type="number" 
                        className="form-control" 
                        value={tempTargets.daily.revenue}
                        onChange={(e) => setTempTargets({
                          ...tempTargets, 
                          daily: {...tempTargets.daily, revenue: parseFloat(e.target.value) || 0}
                        })}
                        step="0.01"
                      />
                    </div>
                    <div className="col-md-4 mb-2">
                      <label className="form-label">Pedidos</label>
                      <input 
                        type="number" 
                        className="form-control" 
                        value={tempTargets.daily.orders}
                        onChange={(e) => setTempTargets({
                          ...tempTargets, 
                          daily: {...tempTargets.daily, orders: parseInt(e.target.value) || 0}
                        })}
                      />
                    </div>
                    <div className="col-md-4 mb-2">
                      <label className="form-label">Clientes</label>
                      <input 
                        type="number" 
                        className="form-control" 
                        value={tempTargets.daily.customers}
                        onChange={(e) => setTempTargets({
                          ...tempTargets, 
                          daily: {...tempTargets.daily, customers: parseInt(e.target.value) || 0}
                        })}
                      />
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <h6>Meta Semanal</h6>
                  <div className="row">
                    <div className="col-md-4 mb-2">
                      <label className="form-label">Receita (R$)</label>
                      <input 
                        type="number" 
                        className="form-control" 
                        value={tempTargets.weekly.revenue}
                        onChange={(e) => setTempTargets({
                          ...tempTargets, 
                          weekly: {...tempTargets.weekly, revenue: parseFloat(e.target.value) || 0}
                        })}
                        step="0.01"
                      />
                    </div>
                    <div className="col-md-4 mb-2">
                      <label className="form-label">Pedidos</label>
                      <input 
                        type="number" 
                        className="form-control" 
                        value={tempTargets.weekly.orders}
                        onChange={(e) => setTempTargets({
                          ...tempTargets, 
                          weekly: {...tempTargets.weekly, orders: parseInt(e.target.value) || 0}
                        })}
                      />
                    </div>
                    <div className="col-md-4 mb-2">
                      <label className="form-label">Clientes</label>
                      <input 
                        type="number" 
                        className="form-control" 
                        value={tempTargets.weekly.customers}
                        onChange={(e) => setTempTargets({
                          ...tempTargets, 
                          weekly: {...tempTargets.weekly, customers: parseInt(e.target.value) || 0}
                        })}
                      />
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <h6>Meta Mensal</h6>
                  <div className="row">
                    <div className="col-md-4 mb-2">
                      <label className="form-label">Receita (R$)</label>
                      <input 
                        type="number" 
                        className="form-control" 
                        value={tempTargets.monthly.revenue}
                        onChange={(e) => setTempTargets({
                          ...tempTargets, 
                          monthly: {...tempTargets.monthly, revenue: parseFloat(e.target.value) || 0}
                        })}
                        step="0.01"
                      />
                    </div>
                    <div className="col-md-4 mb-2">
                      <label className="form-label">Pedidos</label>
                      <input 
                        type="number" 
                        className="form-control" 
                        value={tempTargets.monthly.orders}
                        onChange={(e) => setTempTargets({
                          ...tempTargets, 
                          monthly: {...tempTargets.monthly, orders: parseInt(e.target.value) || 0}
                        })}
                      />
                    </div>
                    <div className="col-md-4 mb-2">
                      <label className="form-label">Clientes</label>
                      <input 
                        type="number" 
                        className="form-control" 
                        value={tempTargets.monthly.customers}
                        onChange={(e) => setTempTargets({
                          ...tempTargets, 
                          monthly: {...tempTargets.monthly, customers: parseInt(e.target.value) || 0}
                        })}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'periods' && (
              <div>
                <p className="text-muted mb-3">Configure os períodos de comparação:</p>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Período Atual</label>
                    <select className="form-select">
                      <option value="today">Hoje</option>
                      <option value="week">Esta Semana</option>
                      <option value="month">Este Mês</option>
                      <option value="year">Este Ano</option>
                    </select>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Período de Comparação</label>
                    <select className="form-select">
                      <option value="previous_week">Semana Anterior</option>
                      <option value="previous_month">Mês Anterior</option>
                      <option value="previous_year">Ano Anterior</option>
                      <option value="same_period_last_month">Mesmo Período Mês Anterior</option>
                      <option value="same_period_last_year">Mesmo Período Ano Anterior</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-link" onClick={handleReset}>
              Restaurar Padrões
            </button>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="button" className="btn btn-primary" onClick={handleSave}>
              Salvar Configurações
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Botão de configuração rápida
export const GoalsConfigButton = ({ onClick }) => (
  <button 
    className="btn btn-outline-secondary btn-sm" 
    onClick={onClick}
    title="Configurar Metas e Períodos"
  >
    <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
      <path d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z" />
      <path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
    </svg>
    Configurar Metas
  </button>
);