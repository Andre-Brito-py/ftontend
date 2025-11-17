import React, { useState, useMemo } from 'react';

const TablesPage = () => {
  const [tables, setTables] = useState([
    {
      _id: '1',
      tableNumber: 1,
      displayName: 'Mesa 1',
      capacity: 4,
      location: 'Área externa',
      notes: 'Mesa preferida dos clientes',
      isActive: true,
      qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://restaurante.com/mesa/1',
      status: 'available',
      currentReservation: null
    },
    {
      _id: '2',
      tableNumber: 2,
      displayName: 'Mesa 2',
      capacity: 2,
      location: 'Área interna',
      notes: 'Mesa para casais',
      isActive: true,
      qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://restaurante.com/mesa/2',
      status: 'occupied',
      currentReservation: {
        customerName: 'João Silva',
        time: '19:30',
        guests: 2
      }
    },
    {
      _id: '3',
      tableNumber: 3,
      displayName: 'Mesa VIP 3',
      capacity: 6,
      location: 'Sala VIP',
      notes: 'Mesa VIP com vista panorâmica',
      isActive: true,
      qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://restaurante.com/mesa/3',
      status: 'reserved',
      currentReservation: {
        customerName: 'Maria Santos',
        time: '20:00',
        guests: 4
      }
    },
    {
      _id: '4',
      tableNumber: 4,
      displayName: 'Mesa 4',
      capacity: 4,
      location: 'Área externa',
      notes: '',
      isActive: true,
      qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://restaurante.com/mesa/4',
      status: 'available',
      currentReservation: null
    },
    {
      _id: '5',
      tableNumber: 5,
      displayName: 'Mesa 5',
      capacity: 8,
      location: 'Salão principal',
      notes: 'Mesa grande para grupos',
      isActive: true,
      qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://restaurante.com/mesa/5',
      status: 'available',
      currentReservation: null
    },
    {
      _id: '6',
      tableNumber: 6,
      displayName: 'Mesa 6',
      capacity: 2,
      location: 'Área interna',
      notes: '',
      isActive: false,
      qrCodeUrl: '',
      status: 'maintenance',
      currentReservation: null
    }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingTable, setEditingTable] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterLocation, setFilterLocation] = useState('all');

  // Form states
  const [formData, setFormData] = useState({
    tableNumber: '',
    displayName: '',
    capacity: '',
    location: '',
    notes: '',
    isActive: true
  });

  const locations = useMemo(() => {
    const uniqueLocations = [...new Set(tables.map(table => table.location))];
    return uniqueLocations.filter(Boolean);
  }, [tables]);

  const filteredTables = useMemo(() => {
    return tables.filter(table => {
      const matchesSearch = table.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           table.tableNumber.toString().includes(searchTerm);
      const matchesStatus = filterStatus === 'all' || table.status === filterStatus;
      const matchesLocation = filterLocation === 'all' || table.location === filterLocation;
      
      return matchesSearch && matchesStatus && matchesLocation;
    });
  }, [tables, searchTerm, filterStatus, filterLocation]);

  const stats = useMemo(() => {
    const total = tables.length;
    const available = tables.filter(t => t.status === 'available').length;
    const occupied = tables.filter(t => t.status === 'occupied').length;
    const reserved = tables.filter(t => t.status === 'reserved').length;
    const maintenance = tables.filter(t => t.status === 'maintenance').length;
    const active = tables.filter(t => t.isActive).length;

    return { total, available, occupied, reserved, maintenance, active };
  }, [tables]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'success';
      case 'occupied': return 'danger';
      case 'reserved': return 'warning';
      case 'maintenance': return 'secondary';
      default: return 'secondary';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'available': return 'Disponível';
      case 'occupied': return 'Ocupada';
      case 'reserved': return 'Reservada';
      case 'maintenance': return 'Manutenção';
      default: return status;
    }
  };

  const handleAddNew = () => {
    setEditingTable(null);
    setFormData({
      tableNumber: '',
      displayName: '',
      capacity: '',
      location: '',
      notes: '',
      isActive: true
    });
    setShowForm(true);
  };

  const handleEdit = (table) => {
    setEditingTable(table);
    setFormData({
      tableNumber: table.tableNumber,
      displayName: table.displayName,
      capacity: table.capacity,
      location: table.location,
      notes: table.notes,
      isActive: table.isActive
    });
    setShowForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingTable) {
      setTables(tables.map(table => 
        table._id === editingTable._id 
          ? { ...table, ...formData }
          : table
      ));
    } else {
      const newTable = {
        _id: Date.now().toString(),
        ...formData,
        tableNumber: parseInt(formData.tableNumber),
        capacity: parseInt(formData.capacity),
        status: 'available',
        currentReservation: null,
        qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://restaurante.com/mesa/${formData.tableNumber}`
      };
      setTables([...tables, newTable]);
    }
    
    setShowForm(false);
    setEditingTable(null);
  };

  const handleToggleStatus = (tableId) => {
    setTables(tables.map(table => 
      table._id === tableId 
        ? { ...table, isActive: !table.isActive }
        : table
    ));
  };

  const handleDelete = (tableId) => {
    if (window.confirm('Tem certeza que deseja excluir esta mesa?')) {
      setTables(tables.filter(table => table._id !== tableId));
    }
  };

  const handleGenerateQR = (tableId) => {
    const table = tables.find(t => t._id === tableId);
    if (table) {
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://restaurante.com/mesa/${table.tableNumber}`;
      setTables(tables.map(t => 
        t._id === tableId ? { ...t, qrCodeUrl: qrUrl } : t
      ));
      alert('QR Code gerado com sucesso!');
    }
  };

  const handlePrintQR = (table) => {
    if (table.qrCodeUrl) {
      const printWindow = window.open('', '_blank');
      printWindow.document.write(`
        <html>
          <head><title>QR Code - Mesa ${table.tableNumber}</title></head>
          <body style="text-align: center; padding: 20px; font-family: Arial;">
            <h2>Mesa ${table.displayName}</h2>
            <img src="${table.qrCodeUrl}" alt="QR Code" style="max-width: 200px;">
            <p>Escaneie para acessar o cardápio</p>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    } else {
      alert('QR Code não disponível. Gere o QR Code primeiro.');
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div className="container-xl">
          <div className="row g-2 align-items-center">
            <div className="col">
              <h2 className="page-title">Gerenciamento de Mesas</h2>
              <div className="page-pretitle">Controle e gerenciamento das mesas do restaurante</div>
            </div>
            <div className="col-auto ms-auto d-print-none">
              <div className="btn-list">
                <button className="btn btn-primary" onClick={handleAddNew}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                    <path d="M12 5l0 14" /><path d="M5 12l14 0" />
                  </svg>
                  Adicionar Mesa
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="page-body">
        <div className="container-xl">
          {/* Stats Cards */}
          <div className="row row-cards mb-4">
            <div className="col-sm-6 col-lg-2">
              <div className="card card-sm">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div className="subheader">Total de Mesas</div>
                    <div className="ms-auto lh-1">
                      <span className="text-muted">💺</span>
                    </div>
                  </div>
                  <div className="h1 mb-0">{stats.total}</div>
                </div>
              </div>
            </div>
            <div className="col-sm-6 col-lg-2">
              <div className="card card-sm">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div className="subheader">Disponíveis</div>
                    <div className="ms-auto lh-1">
                      <span className="text-success">✅</span>
                    </div>
                  </div>
                  <div className="h1 mb-0 text-success">{stats.available}</div>
                </div>
              </div>
            </div>
            <div className="col-sm-6 col-lg-2">
              <div className="card card-sm">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div className="subheader">Ocupadas</div>
                    <div className="ms-auto lh-1">
                      <span className="text-danger">❌</span>
                    </div>
                  </div>
                  <div className="h1 mb-0 text-danger">{stats.occupied}</div>
                </div>
              </div>
            </div>
            <div className="col-sm-6 col-lg-2">
              <div className="card card-sm">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div className="subheader">Reservadas</div>
                    <div className="ms-auto lh-1">
                      <span className="text-warning">⚠️</span>
                    </div>
                  </div>
                  <div className="h1 mb-0 text-warning">{stats.reserved}</div>
                </div>
              </div>
            </div>
            <div className="col-sm-6 col-lg-2">
              <div className="card card-sm">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div className="subheader">Manutenção</div>
                    <div className="ms-auto lh-1">
                      <span className="text-secondary">🔧</span>
                    </div>
                  </div>
                  <div className="h1 mb-0 text-secondary">{stats.maintenance}</div>
                </div>
              </div>
            </div>
            <div className="col-sm-6 col-lg-2">
              <div className="card card-sm">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div className="subheader">Ativas</div>
                    <div className="ms-auto lh-1">
                      <span className="text-info">✨</span>
                    </div>
                  </div>
                  <div className="h1 mb-0 text-info">{stats.active}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="card mb-4">
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-4">
                  <label className="form-label">Buscar mesa</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Número ou nome da mesa..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Status</label>
                  <select 
                    className="form-select"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="all">Todos os status</option>
                    <option value="available">Disponível</option>
                    <option value="occupied">Ocupada</option>
                    <option value="reserved">Reservada</option>
                    <option value="maintenance">Manutenção</option>
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="form-label">Localização</label>
                  <select 
                    className="form-select"
                    value={filterLocation}
                    onChange={(e) => setFilterLocation(e.target.value)}
                  >
                    <option value="all">Todas as localizações</option>
                    {locations.map(location => (
                      <option key={location} value={location}>{location}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          {showForm && (
            <div className="card mb-4">
              <div className="card-header">
                <h3 className="card-title">{editingTable ? 'Editar Mesa' : 'Adicionar Nova Mesa'}</h3>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Número da Mesa *</label>
                        <input 
                          type="number" 
                          className="form-control"
                          value={formData.tableNumber}
                          onChange={(e) => setFormData({...formData, tableNumber: e.target.value})}
                          required
                          min="1"
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Nome de Exibição</label>
                        <input 
                          type="text" 
                          className="form-control"
                          value={formData.displayName}
                          onChange={(e) => setFormData({...formData, displayName: e.target.value})}
                          placeholder="Ex: Mesa VIP, Mesa Janela..."
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Capacidade (pessoas)</label>
                        <input 
                          type="number" 
                          className="form-control"
                          value={formData.capacity}
                          onChange={(e) => setFormData({...formData, capacity: e.target.value})}
                          min="1"
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Localização</label>
                        <input 
                          type="text" 
                          className="form-control"
                          value={formData.location}
                          onChange={(e) => setFormData({...formData, location: e.target.value})}
                          placeholder="Ex: Área externa, Salão principal..."
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Observações</label>
                    <textarea 
                      className="form-control"
                      rows="3"
                      value={formData.notes}
                      onChange={(e) => setFormData({...formData, notes: e.target.value})}
                      placeholder="Observações sobre a mesa..."
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-check">
                      <input 
                        type="checkbox" 
                        className="form-check-input"
                        checked={formData.isActive}
                        onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                      />
                      <span className="form-check-label">Mesa ativa</span>
                    </label>
                  </div>
                  <div className="d-flex gap-2">
                    <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>
                      Cancelar
                    </button>
                    <button type="submit" className="btn btn-primary">
                      {editingTable ? 'Atualizar' : 'Criar Mesa'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Tables Grid */}
          <div className="row">
            {filteredTables.length === 0 ? (
              <div className="col-12">
                <div className="card">
                  <div className="card-body text-center py-5">
                    <h3>Nenhuma mesa encontrada</h3>
                    <p className="text-muted">Não há mesas que correspondam aos filtros selecionados.</p>
                    <button className="btn btn-primary" onClick={handleAddNew}>
                      Adicionar Primeira Mesa
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              filteredTables.map(table => (
                <div key={table._id} className="col-lg-4 col-md-6 mb-4">
                  <div className={`card ${!table.isActive ? 'opacity-75' : ''}`}>
                    <div className={`card-status-top bg-${getStatusColor(table.status)}`}></div>
                    <div className="card-header">
                      <div className="d-flex justify-content-between align-items-center">
                        <h3 className="card-title">{table.displayName}</h3>
                        <div className="d-flex gap-2">
                          <span className={`badge bg-${getStatusColor(table.status)}`}>
                            {getStatusLabel(table.status)}
                          </span>
                          {!table.isActive && (
                            <span className="badge bg-secondary">Inativa</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="card-body">
                      <div className="row mb-3">
                        <div className="col-6">
                          <div className="text-muted">Número</div>
                          <div className="h4">#{table.tableNumber}</div>
                        </div>
                        <div className="col-6">
                          <div className="text-muted">Capacidade</div>
                          <div className="h4">{table.capacity} <small>pessoas</small></div>
                        </div>
                      </div>
                      
                      {table.location && (
                        <div className="mb-3">
                          <div className="text-muted">Localização</div>
                          <div>{table.location}</div>
                        </div>
                      )}

                      {table.notes && (
                        <div className="mb-3">
                          <div className="text-muted">Observações</div>
                          <div>{table.notes}</div>
                        </div>
                      )}

                      {table.currentReservation && (
                        <div className="mb-3 p-2 bg-light rounded">
                          <div className="text-muted">Reserva Atual</div>
                          <div><strong>{table.currentReservation.customerName}</strong></div>
                          <div className="small text-muted">
                            {table.currentReservation.guests} pessoas • {table.currentReservation.time}
                          </div>
                        </div>
                      )}

                      {table.qrCodeUrl && (
                        <div className="text-center mb-3">
                          <img src={table.qrCodeUrl} alt={`QR Code ${table.displayName}`} className="img-fluid" style={{maxWidth: '120px'}} />
                          <div className="small text-muted mt-1">QR Code</div>
                        </div>
                      )}
                    </div>
                    <div className="card-footer">
                      <div className="d-flex gap-2 flex-wrap">
                        <button className="btn btn-sm btn-outline-primary" onClick={() => handleEdit(table)}>
                          Editar
                        </button>
                        <button 
                          className="btn btn-sm btn-outline-secondary" 
                          onClick={() => handleToggleStatus(table._id)}
                        >
                          {table.isActive ? 'Desativar' : 'Ativar'}
                        </button>
                        {!table.qrCodeUrl ? (
                          <button 
                            className="btn btn-sm btn-outline-info" 
                            onClick={() => handleGenerateQR(table._id)}
                          >
                            Gerar QR
                          </button>
                        ) : (
                          <button 
                            className="btn btn-sm btn-outline-info" 
                            onClick={() => handlePrintQR(table)}
                          >
                            Imprimir QR
                          </button>
                        )}
                        <button 
                          className="btn btn-sm btn-outline-danger" 
                          onClick={() => handleDelete(table._id)}
                        >
                          Excluir
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TablesPage;