import React, { useState, useMemo } from 'react';

const CashbackPage = () => {
  const [config, setConfig] = useState({
    isActive: true,
    globalPercentage: 5.0,
    rules: {
      minPurchaseAmount: 50.00,
      validityDays: 30,
      maxUsagePerOrder: 100.00
    }
  });

  const [reportPeriod, setReportPeriod] = useState('30');
  const [showRules, setShowRules] = useState(false);
  const [newRule, setNewRule] = useState({
    type: 'category',
    target: '',
    percentage: 0,
    minAmount: 0
  });

  // Mock data for reports
  const reports = useMemo(() => {
    const baseData = {
      '7': {
        stats: {
          totalEarned: 1250.50,
          totalUsed: 890.25,
          earnedTransactions: 45,
          usedTransactions: 32,
          totalExpired: 150.00,
          expiredTransactions: 8
        },
        topCustomers: [
          { customerName: 'João Silva', customerPhone: '(11) 98765-4321', totalEarned: 125.50, transactionCount: 8 },
          { customerName: 'Maria Santos', customerPhone: '(21) 99876-5432', totalEarned: 98.75, transactionCount: 6 },
          { customerName: 'Pedro Oliveira', customerPhone: '(31) 91234-5678', totalEarned: 87.25, transactionCount: 5 }
        ]
      },
      '30': {
        stats: {
          totalEarned: 4850.75,
          totalUsed: 3290.50,
          earnedTransactions: 180,
          usedTransactions: 125,
          totalExpired: 450.00,
          expiredTransactions: 25
        },
        topCustomers: [
          { customerName: 'João Silva', customerPhone: '(11) 98765-4321', totalEarned: 485.50, transactionCount: 25 },
          { customerName: 'Maria Santos', customerPhone: '(21) 99876-5432', totalEarned: 398.75, transactionCount: 22 },
          { customerName: 'Pedro Oliveira', customerPhone: '(31) 91234-5678', totalEarned: 287.25, transactionCount: 18 },
          { customerName: 'Ana Costa', customerPhone: '(41) 92345-6789', totalEarned: 245.80, transactionCount: 15 }
        ]
      },
      '90': {
        stats: {
          totalEarned: 12850.90,
          totalUsed: 9290.75,
          earnedTransactions: 520,
          usedTransactions: 380,
          totalExpired: 1200.00,
          expiredTransactions: 65
        },
        topCustomers: [
          { customerName: 'João Silva', customerPhone: '(11) 98765-4321', totalEarned: 1285.50, transactionCount: 68 },
          { customerName: 'Maria Santos', customerPhone: '(21) 99876-5432', totalEarned: 998.75, transactionCount: 58 },
          { customerName: 'Pedro Oliveira', customerPhone: '(31) 91234-5678', totalEarned: 887.25, transactionCount: 45 },
          { customerName: 'Ana Costa', customerPhone: '(41) 92345-6789', totalEarned: 745.80, transactionCount: 38 },
          { customerName: 'Carlos Lima', customerPhone: '(51) 93456-7890', totalEarned: 650.25, transactionCount: 32 }
        ]
      }
    };
    return baseData[reportPeriod] || baseData['30'];
  }, [reportPeriod]);

  const currentBalance = useMemo(() => {
    return (reports.stats.totalEarned || 0) - (reports.stats.totalUsed || 0);
  }, [reports]);

  const handleConfigChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setConfig(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setConfig(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSaveConfig = (e) => {
    e.preventDefault();
    alert('Configurações de cashback salvas com sucesso!');
  };

  const handleExpireCashback = () => {
    if (confirm('Tem certeza que deseja expirar o cashback antigo?')) {
      alert('Cashback antigo expirado com sucesso!');
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value || 0);
  };

  return (
    <div className="page">
      <div className="page-header">
        <div className="container-xl">
          <div className="row g-2 align-items-center">
            <div className="col">
              <h2 className="page-title">Sistema de Cashback</h2>
              <div className="page-pretitle">Configure e gerencie o cashback dos clientes</div>
            </div>
            <div className="col-auto ms-auto d-print-none">
              <div className="btn-list">
                <button className="btn btn-outline-primary" onClick={() => setShowRules(!showRules)}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                    <path d="M9 12h6" /><path d="M12 9v6" />
                    <path d="M4 6h16" /><path d="M4 12h16" /><path d="M4 18h16" />
                  </svg>
                  Regras Avançadas
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="page-body">
        <div className="container-xl">
          {/* Status Overview */}
          <div className="row row-cards mb-4">
            <div className="col-sm-6 col-lg-3">
              <div className="card card-sm">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div className="subheader">Cashback Concedido</div>
                    <div className="ms-auto lh-1">
                      <span className="text-success">💰</span>
                    </div>
                  </div>
                  <div className="h1 mb-0 text-success">{formatCurrency(reports.stats.totalEarned)}</div>
                  <div className="d-flex mb-2">
                    <div>{reports.stats.earnedTransactions} transações</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-sm-6 col-lg-3">
              <div className="card card-sm">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div className="subheader">Cashback Utilizado</div>
                    <div className="ms-auto lh-1">
                      <span className="text-info">💳</span>
                    </div>
                  </div>
                  <div className="h1 mb-0 text-info">{formatCurrency(reports.stats.totalUsed)}</div>
                  <div className="d-flex mb-2">
                    <div>{reports.stats.usedTransactions} transações</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-sm-6 col-lg-3">
              <div className="card card-sm">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div className="subheader">Saldo em Aberto</div>
                    <div className="ms-auto lh-1">
                      <span className="text-warning">📊</span>
                    </div>
                  </div>
                  <div className="h1 mb-0 text-warning">{formatCurrency(currentBalance)}</div>
                  <div className="d-flex mb-2">
                    <div>Disponível para clientes</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-sm-6 col-lg-3">
              <div className="card card-sm">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div className="subheader">Cashback Expirado</div>
                    <div className="ms-auto lh-1">
                      <span className="text-danger">⏰</span>
                    </div>
                  </div>
                  <div className="h1 mb-0 text-danger">{formatCurrency(reports.stats.totalExpired)}</div>
                  <div className="d-flex mb-2">
                    <div>{reports.stats.expiredTransactions} transações</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            {/* Configurações */}
            <div className="col-lg-8">
              <div className="card mb-4">
                <div className="card-header">
                  <h3 className="card-title">Configurações do Sistema</h3>
                  <div className="card-actions">
                    <label className="form-check form-switch mb-0">
                      <input 
                        className="form-check-input" 
                        type="checkbox" 
                        checked={config.isActive}
                        onChange={(e) => handleConfigChange('isActive', e.target.checked)}
                      />
                      <span className="form-check-label">Sistema Ativo</span>
                    </label>
                  </div>
                </div>
                <div className="card-body">
                  <form onSubmit={handleSaveConfig}>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Percentual Global de Cashback (%)</label>
                          <input 
                            type="number"
                            className="form-control"
                            min="0"
                            max="100"
                            step="0.1"
                            value={config.globalPercentage}
                            onChange={(e) => handleConfigChange('globalPercentage', parseFloat(e.target.value) || 0)}
                            disabled={!config.isActive}
                          />
                          <small className="form-hint">Percentual padrão aplicado a todos os produtos</small>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Valor Mínimo de Compra (R$)</label>
                          <input 
                            type="number"
                            className="form-control"
                            min="0"
                            step="0.01"
                            value={config.rules.minPurchaseAmount}
                            onChange={(e) => handleConfigChange('rules.minPurchaseAmount', parseFloat(e.target.value) || 0)}
                            disabled={!config.isActive}
                          />
                          <small className="form-hint">Valor mínimo para gerar cashback</small>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Validade do Cashback (dias)</label>
                          <input 
                            type="number"
                            className="form-control"
                            min="1"
                            value={config.rules.validityDays}
                            onChange={(e) => handleConfigChange('rules.validityDays', parseInt(e.target.value) || 30)}
                            disabled={!config.isActive}
                          />
                          <small className="form-hint">Dias até o cashback expirar</small>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Limite Máximo de Uso por Pedido (R$)</label>
                          <input 
                            type="number"
                            className="form-control"
                            min="0"
                            step="0.01"
                            value={config.rules.maxUsagePerOrder}
                            onChange={(e) => handleConfigChange('rules.maxUsagePerOrder', parseFloat(e.target.value) || 0)}
                            disabled={!config.isActive}
                          />
                          <small className="form-hint">Valor máximo de cashback que pode ser usado em um pedido (0 = sem limite)</small>
                        </div>
                      </div>
                    </div>
                    <div className="d-flex gap-2">
                      <button type="submit" className="btn btn-primary" disabled={!config.isActive}>
                        Salvar Configurações
                      </button>
                      <button type="button" className="btn btn-outline-danger" onClick={handleExpireCashback}>
                        Expirar Cashback Antigo
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            {/* Regras Avançadas */}
            <div className="col-lg-4">
              <div className="card mb-4">
                <div className="card-header">
                  <h3 className="card-title">Regras Avançadas</h3>
                </div>
                <div className="card-body">
                  <div className="mb-3">
                    <label className="form-label">Tipo de Regra</label>
                    <select 
                      className="form-select"
                      value={newRule.type}
                      onChange={(e) => setNewRule({...newRule, type: e.target.value})}
                      disabled={!config.isActive}
                    >
                      <option value="category">Por Categoria</option>
                      <option value="product">Por Produto</option>
                      <option value="customer">Por Cliente</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Alvo</label>
                    <input 
                      type="text"
                      className="form-control"
                      placeholder="Ex: Bebidas, Pizza Margherita, Cliente VIP"
                      value={newRule.target}
                      onChange={(e) => setNewRule({...newRule, target: e.target.value})}
                      disabled={!config.isActive}
                    />
                  </div>
                  <div className="row">
                    <div className="col-6">
                      <div className="mb-3">
                        <label className="form-label">Percentual (%)</label>
                        <input 
                          type="number"
                          className="form-control"
                          min="0"
                          max="100"
                          step="0.1"
                          value={newRule.percentage}
                          onChange={(e) => setNewRule({...newRule, percentage: parseFloat(e.target.value) || 0})}
                          disabled={!config.isActive}
                        />
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="mb-3">
                        <label className="form-label">Valor Mínimo (R$)</label>
                        <input 
                          type="number"
                          className="form-control"
                          min="0"
                          step="0.01"
                          value={newRule.minAmount}
                          onChange={(e) => setNewRule({...newRule, minAmount: parseFloat(e.target.value) || 0})}
                          disabled={!config.isActive}
                        />
                      </div>
                    </div>
                  </div>
                  <button className="btn btn-outline-primary w-100" disabled={!config.isActive}>
                    Adicionar Regra
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Relatórios e Top Clientes */}
          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Relatórios de Cashback</h3>
                  <div className="card-actions">
                    <select 
                      className="form-select"
                      value={reportPeriod}
                      onChange={(e) => setReportPeriod(e.target.value)}
                    >
                      <option value="7">Últimos 7 dias</option>
                      <option value="30">Últimos 30 dias</option>
                      <option value="90">Últimos 90 dias</option>
                    </select>
                  </div>
                </div>
                <div className="card-body">
                  {reports.topCustomers && reports.topCustomers.length > 0 && (
                    <div className="table-responsive">
                      <table className="table table-vcenter">
                        <thead>
                          <tr>
                            <th>Cliente</th>
                            <th>Telefone</th>
                            <th className="text-end">Cashback Ganho</th>
                            <th className="text-end">Transações</th>
                            <th className="text-end">Saldo Atual</th>
                          </tr>
                        </thead>
                        <tbody>
                          {reports.topCustomers.map((customer, index) => (
                            <tr key={index}>
                              <td>
                                <div className="d-flex py-1 align-items-center">
                                  <div className="avatar avatar-sm me-2">
                                    <span className="avatar-title bg-primary rounded-circle">
                                      {customer.customerName.charAt(0)}
                                    </span>
                                  </div>
                                  <div className="flex-fill">
                                    <div className="font-weight-medium">{customer.customerName}</div>
                                    <div className="text-muted">Cliente #{index + 1}</div>
                                  </div>
                                </div>
                              </td>
                              <td>{customer.customerPhone}</td>
                              <td className="text-end text-success">
                                <strong>{formatCurrency(customer.totalEarned)}</strong>
                              </td>
                              <td className="text-end">
                                <span className="badge bg-blue">{customer.transactionCount}</span>
                              </td>
                              <td className="text-end text-warning">
                                <strong>{formatCurrency(customer.totalEarned * 0.7)}</strong>
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
    </div>
  );
};

export default CashbackPage;