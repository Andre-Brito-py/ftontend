import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

// Dados mockados para demonstração
const mockTables = [
  {
    _id: '1',
    tableNumber: 1,
    displayName: 'Mesa 1',
    capacity: 4,
    location: 'Área interna',
    notes: 'Mesa próxima à janela',
    isActive: true,
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=http://localhost:5174/waiter-order/demo?table=1&token=waiter_demo_token',
    status: 'available'
  },
  {
    _id: '2',
    tableNumber: 2,
    displayName: 'Mesa 2',
    capacity: 2,
    location: 'Área interna',
    notes: 'Mesa para casal',
    isActive: true,
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=http://localhost:5174/waiter-order/demo?table=2&token=waiter_demo_token',
    status: 'occupied'
  },
  {
    _id: '3',
    tableNumber: 3,
    displayName: 'Mesa 3',
    capacity: 6,
    location: 'Área externa',
    notes: 'Mesa grande para grupo',
    isActive: true,
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=http://localhost:5174/waiter-order/demo?table=3&token=waiter_demo_token',
    status: 'available'
  },
  {
    _id: '4',
    tableNumber: 4,
    displayName: 'Mesa 4',
    capacity: 4,
    location: 'Área externa',
    notes: '',
    isActive: false,
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=http://localhost:5174/waiter-order/demo?table=4&token=waiter_demo_token',
    status: 'reserved'
  }
];

// URL do sistema de garçom (demo)
const FRONTEND_URL = 'http://localhost:5174';

export default function WaiterManagement() {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [waiterLink, setWaiterLink] = useState('');
  const [showQRModal, setShowQRModal] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);
  const [showTableForm, setShowTableForm] = useState(false);
  const [editingTable, setEditingTable] = useState(null);
  const [formData, setFormData] = useState({
    tableNumber: '',
    displayName: '',
    capacity: 2,
    location: '',
    notes: ''
  });

  // Simular carregamento de dados
  useEffect(() => {
    const timer = setTimeout(() => {
      setTables(mockTables);
      // Gerar link do garçom
      setWaiterLink(`${FRONTEND_URL}/waiter-order/demo?token=waiter_demo_token`);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Copiar link do garçom
  const copyWaiterLink = () => {
    navigator.clipboard.writeText(waiterLink);
    toast.success('Link do garçom copiado!');
  };

  // Copiar link da mesa específica
  const copyTableLink = (table) => {
    const tableLink = `${waiterLink}&table=${table.tableNumber}`;
    navigator.clipboard.writeText(tableLink);
    toast.success(`Link da ${table.displayName} copiado!`);
  };

  // Abrir modal de QR Code
  const openQRModal = (table) => {
    setSelectedTable(table);
    setShowQRModal(true);
  };

  // Abrir formulário de nova mesa
  const handleNewTable = () => {
    setEditingTable(null);
    setFormData({
      tableNumber: tables.length + 1,
      displayName: `Mesa ${tables.length + 1}`,
      capacity: 2,
      location: '',
      notes: ''
    });
    setShowTableForm(true);
  };

  // Abrir formulário de edição
  const handleEditTable = (table) => {
    setEditingTable(table);
    setFormData({
      tableNumber: table.tableNumber,
      displayName: table.displayName,
      capacity: table.capacity,
      location: table.location,
      notes: table.notes
    });
    setShowTableForm(true);
  };

  // Alternar status da mesa
  const toggleTableStatus = async (table) => {
    try {
      const updatedTable = {
        ...table,
        isActive: !table.isActive
      };

      setTables(prev => 
        prev.map(tbl => tbl._id === table._id ? updatedTable : tbl)
      );

      toast.success(`Mesa ${updatedTable.isActive ? 'ativada' : 'desativada'} com sucesso!`);
    } catch (error) {
      toast.error('Erro ao alterar status da mesa');
    }
  };

  // Enviar formulário da mesa
  const handleTableSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingTable) {
        // Modo edição
        const updatedTable = {
          ...editingTable,
          tableNumber: formData.tableNumber,
          displayName: formData.displayName,
          capacity: parseInt(formData.capacity),
          location: formData.location,
          notes: formData.notes
        };

        setTables(prev => 
          prev.map(tbl => tbl._id === editingTable._id ? updatedTable : tbl)
        );

        toast.success('Mesa atualizada com sucesso!');
      } else {
        // Modo criação
        const newTable = {
          _id: Date.now().toString(),
          tableNumber: parseInt(formData.tableNumber),
          displayName: formData.displayName,
          capacity: parseInt(formData.capacity),
          location: formData.location,
          notes: formData.notes,
          isActive: true,
          qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${FRONTEND_URL}/waiter-order/demo?table=${formData.tableNumber}&token=waiter_demo_token`,
          status: 'available'
        };

        setTables(prev => [...prev, newTable]);
        toast.success('Mesa criada com sucesso!');
      }

      setShowTableForm(false);
      setEditingTable(null);
    } catch (error) {
      toast.error('Erro ao salvar mesa');
    }
  };

  // Cancelar formulário
  const handleCancel = () => {
    setShowTableForm(false);
    setEditingTable(null);
  };

  // Imprimir QR Code
  const printQRCode = () => {
    if (selectedTable) {
      const printWindow = window.open('', '_blank');
      printWindow.document.write(`
        <html>
          <head>
            <title>QR Code - ${selectedTable.displayName}</title>
            <style>
              body { font-family: Arial, sans-serif; text-align: center; padding: 20px; }
              .qr-container { margin: 20px auto; }
              .table-info { margin: 20px 0; }
              .instructions { font-size: 12px; color: #666; margin-top: 20px; }
            </style>
          </head>
          <body>
            <div class="table-info">
              <h2>${selectedTable.displayName}</h2>
              <p>Capacidade: ${selectedTable.capacity} pessoas</p>
              <p>Local: ${selectedTable.location || 'Não especificado'}</p>
            </div>
            <div class="qr-container">
              <img src="${selectedTable.qrCodeUrl}" alt="QR Code" />
            </div>
            <div class="instructions">
              <p>Escaneie este QR Code para acessar o cardápio e fazer pedidos</p>
              <p>Ou acesse: ${FRONTEND_URL}/waiter-order/demo?table=${selectedTable.tableNumber}&token=waiter_demo_token</p>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  // Baixar QR Code
  const downloadQRCode = () => {
    if (selectedTable) {
      const link = document.createElement('a');
      link.href = selectedTable.qrCodeUrl;
      link.download = `qr-code-mesa-${selectedTable.tableNumber}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Obter cor do status
  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'success';
      case 'occupied': return 'danger';
      case 'reserved': return 'warning';
      default: return 'secondary';
    }
  };

  // Obter texto do status
  const getStatusText = (status) => {
    switch (status) {
      case 'available': return 'Disponível';
      case 'occupied': return 'Ocupada';
      case 'reserved': return 'Reservada';
      default: return 'Indisponível';
    }
  };

  if (loading) {
    return (
      <div className="page">
        <div className="page-header">
          <div className="container-xl">
            <div className="row g-2 align-items-center">
              <div className="col">
                <h2 className="page-title">Carregando gerenciamento de garçom...</h2>
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
              <h2 className="page-title">Gerenciamento de Garçom</h2>
              <div className="page-pretitle">Sistema de pedidos por garçom com QR Code</div>
            </div>
            <div className="col-auto ms-auto d-print-none">
              <div className="btn-list">
                <button 
                  className="btn btn-outline-primary" 
                  onClick={copyWaiterLink}
                  title="Copiar link do garçom"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                    <path d="M13 7h-2a2 2 0 0 0 -2 2v8a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2v-8a2 2 0 0 0 -2 -2h-2" />
                    <path d="M13 9l-2 0l0 -4l4 0l0 2" />
                  </svg>
                  Link Garçom
                </button>
                <button 
                  className="btn btn-primary" 
                  onClick={handleNewTable}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                    <path d="M12 5l0 14" />
                    <path d="M5 12l14 0" />
                  </svg>
                  Nova Mesa
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="page-body">
        <div className="container-xl">
          {/* Link do garçom */}
          <div className="row mb-3">
            <div className="col-12">
              <div className="card">
                <div className="card-body">
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <h4 className="mb-1">Link de Acesso do Garçom</h4>
                      <p className="text-muted mb-0">Compartilhe este link com os garçons para acesso ao sistema de pedidos:</p>
                      <div className="mt-2">
                        <code className="text-primary">{waiterLink}</code>
                      </div>
                      <div className="mt-2">
                        <small className="text-muted">
                          💡 <strong>Dica:</strong> Adicione <code>?table=N</code> ao link para direcionar diretamente a uma mesa específica
                        </small>
                      </div>
                    </div>
                    <button className="btn btn-outline-primary" onClick={copyWaiterLink}>
                      Copiar Link
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Estatísticas rápidas */}
          <div className="row mb-3">
            <div className="col-md-3">
              <div className="card card-sm">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div className="subheader">Total de Mesas</div>
                    <div className="ms-auto">
                      <div className="h4 mb-0">{tables.length}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card card-sm">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div className="subheader">Mesas Ativas</div>
                    <div className="ms-auto">
                      <div className="h4 mb-0 text-success">{tables.filter(t => t.isActive).length}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card card-sm">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div className="subheader">Mesas Ocupadas</div>
                    <div className="ms-auto">
                      <div className="h4 mb-0 text-danger">{tables.filter(t => t.status === 'occupied').length}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card card-sm">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div className="subheader">Capacidade Total</div>
                    <div className="ms-auto">
                      <div className="h4 mb-0">{tables.reduce((sum, t) => sum + t.capacity, 0)}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Lista de mesas */}
          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Mesas do Restaurante</h3>
                  <div className="text-muted">
                    Gerencie as mesas e seus QR Codes para pedidos via garçom
                  </div>
                </div>
                <div className="card-body">
                  {tables.length === 0 ? (
                    <div className="text-center py-4">
                      <div className="empty-state">
                        <div className="empty-state-icon">
                          <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                            <path d="M4 6h16l-2 14H6z" />
                            <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            <path d="M8 12h8" />
                          </svg>
                        </div>
                        <h4>Nenhuma mesa cadastrada</h4>
                        <p className="text-muted">Comece criando suas mesas para atendimento via garçom.</p>
                        <button className="btn btn-primary" onClick={handleNewTable}>
                          Criar Primeira Mesa
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="row row-cards">
                      {tables.map((table) => (
                        <div key={table._id} className="col-md-6 col-lg-4">
                          <div className={`card ${!table.isActive ? 'card-muted' : ''}`}>
                            <div className="card-body">
                              <div className="d-flex align-items-center justify-content-between mb-3">
                                <div>
                                  <h4 className="card-title mb-1">{table.displayName}</h4>
                                  <div className="text-muted">
                                    {table.capacity} pessoas • {table.location || 'Sem local'}
                                  </div>
                                </div>
                                <div className="d-flex align-items-center gap-2">
                                  <span className={`badge bg-${getStatusColor(table.status)}`}>
                                    {getStatusText(table.status)}
                                  </span>
                                  {!table.isActive && (
                                    <span className="badge bg-secondary">Inativa</span>
                                  )}
                                </div>
                              </div>

                              {table.notes && (
                                <div className="mb-3">
                                  <small className="text-muted">{table.notes}</small>
                                </div>
                              )}

                              <div className="d-flex gap-2 mb-3">
                                <button 
                                  className="btn btn-outline-primary btn-sm"
                                  onClick={() => openQRModal(table)}
                                  title="Ver QR Code"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="16" height="16" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                    <path d="M4 4m0 1a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z" />
                                    <path d="M7 17l0 4" />
                                    <path d="M17 7l4 0" />
                                    <path d="M10 12m0 1a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z" />
                                    <path d="M17 17l0 4" />
                                  </svg>
                                  QR Code
                                </button>
                                <button 
                                  className="btn btn-outline-success btn-sm"
                                  onClick={() => copyTableLink(table)}
                                  title="Copiar link da mesa"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="16" height="16" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                    <path d="M13 7h-2a2 2 0 0 0 -2 2v8a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2v-8a2 2 0 0 0 -2 -2h-2" />
                                    <path d="M13 9l-2 0l0 -4l4 0l0 2" />
                                  </svg>
                                  Link
                                </button>
                              </div>

                              <div className="d-flex gap-2">
                                <button 
                                  className="btn btn-icon btn-sm btn-outline-primary"
                                  onClick={() => handleEditTable(table)}
                                  title="Editar mesa"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="16" height="16" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                    <path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1" />
                                    <path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z" />
                                    <path d="M16 5l3 3" />
                                  </svg>
                                </button>
                                <button 
                                  className={`btn btn-icon btn-sm ${table.isActive ? 'btn-outline-danger' : 'btn-outline-success'}`}
                                  onClick={() => toggleTableStatus(table)}
                                  title={table.isActive ? 'Desativar mesa' : 'Ativar mesa'}
                                >
                                  {table.isActive ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="16" height="16" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                      <path d="M6 5l0 14" />
                                      <path d="M18 5l0 14" />
                                    </svg>
                                  ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="16" height="16" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                      <path d="M7 12l5 5l10 -10" />
                                    </svg>
                                  )}
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de QR Code */}
      {showQRModal && selectedTable && (
        <div className="modal modal-blur fade show d-block" tabIndex="-1">
          <div className="modal-dialog modal-md" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">QR Code - {selectedTable.displayName}</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowQRModal(false)}
                ></button>
              </div>
              <div className="modal-body text-center">
                <div className="mb-3">
                  <img 
                    src={selectedTable.qrCodeUrl} 
                    alt={`QR Code ${selectedTable.displayName}`}
                    className="img-fluid"
                    style={{ maxWidth: '300px' }}
                  />
                </div>
                <div className="mb-3">
                  <p className="mb-1"><strong>Capacidade:</strong> {selectedTable.capacity} pessoas</p>
                  <p className="mb-1"><strong>Local:</strong> {selectedTable.location || 'Não especificado'}</p>
                  {selectedTable.notes && (
                    <p className="mb-1"><strong>Observações:</strong> {selectedTable.notes}</p>
                  )}
                </div>
                <div className="alert alert-info">
                  <small>
                    <strong>Como usar:</strong> O garçom escaneia este QR Code ou acessa o link para fazer pedidos desta mesa.
                  </small>
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-outline-secondary" 
                  onClick={() => setShowQRModal(false)}
                >
                  Fechar
                </button>
                <button 
                  type="button" 
                  className="btn btn-outline-primary" 
                  onClick={printQRCode}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="16" height="16" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                    <path d="M17 17h2a2 2 0 0 0 2 -2v-4a2 2 0 0 0 -2 -2h-14a2 2 0 0 0 -2 2v4a2 2 0 0 0 2 2h2" />
                    <path d="M17 9v-4a2 2 0 0 0 -2 -2h-6a2 2 0 0 0 -2 2v4" />
                    <path d="M7 13m0 2a2 2 0 0 1 2 -2h6a2 2 0 0 1 2 2v4a2 2 0 0 1 -2 2h-6a2 2 0 0 1 -2 -2z" />
                  </svg>
                  Imprimir
                </button>
                <button 
                  type="button" 
                  className="btn btn-primary" 
                  onClick={downloadQRCode}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="16" height="16" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                    <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2" />
                    <path d="M7 11l5 5l5 -5" />
                    <path d="M12 4l0 12" />
                  </svg>
                  Baixar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de formulário de mesa */}
      {showTableForm && (
        <div className="modal modal-blur fade show d-block" tabIndex="-1">
          <div className="modal-dialog modal-md" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingTable ? 'Editar Mesa' : 'Nova Mesa'}
                </h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={handleCancel}
                ></button>
              </div>
              <form onSubmit={handleTableSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label required">Número da Mesa</label>
                    <input 
                      type="number" 
                      className="form-control" 
                      value={formData.tableNumber}
                      onChange={(e) => setFormData(prev => ({ ...prev, tableNumber: e.target.value }))}
                      required
                      min="1"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label required">Nome de Exibição</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={formData.displayName}
                      onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
                      required
                      placeholder="ex: Mesa 1, VIP 1, Varanda 1"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label required">Capacidade</label>
                    <select 
                      className="form-select" 
                      value={formData.capacity}
                      onChange={(e) => setFormData(prev => ({ ...prev, capacity: parseInt(e.target.value) }))}
                      required
                    >
                      {[1,2,3,4,5,6,7,8,9,10,11,12].map(num => (
                        <option key={num} value={num}>{num} pessoa{num > 1 ? 's' : ''}</option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Localização</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={formData.location}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="ex: Área interna, Varanda, VIP"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Observações</label>
                    <textarea 
                      className="form-control" 
                      rows="2"
                      value={formData.notes}
                      onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="Observações sobre a mesa (opcional)"
                    />
                  </div>
                  <div className="alert alert-info">
                    <small>
                      💡 <strong>Informação:</strong> Cada mesa terá um QR Code único que os garçons podem escanear para fazer pedidos.
                    </small>
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
                    disabled={!formData.displayName.trim() || !formData.tableNumber}
                  >
                    {editingTable ? 'Atualizar' : 'Criar'} Mesa
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Backdrop dos modais */}
      {(showQRModal || showTableForm) && <div className="modal-backdrop fade show"></div>}
    </div>
  );
}