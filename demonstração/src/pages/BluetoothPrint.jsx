import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

// Dados mockados para demonstração
const mockPrinters = [
  {
    id: 'printer_001',
    name: 'IMPRESSORA_TERMICA_001',
    address: '00:11:22:33:44:55',
    rssi: -45,
    type: 'thermal',
    model: 'EPSON TM-T20'
  },
  {
    id: 'printer_002', 
    name: 'IMPRESSORA_COZINHA',
    address: '00:11:22:33:44:66',
    rssi: -62,
    type: 'thermal',
    model: 'BEMATECH MP-4200'
  },
  {
    id: 'printer_003',
    name: 'IMPRESSORA_BALCAO',
    address: '00:11:22:33:44:77',
    rssi: -38,
    type: 'thermal',
    model: 'DARUMA DR700'
  }
];

export default function BluetoothPrint() {
  const [printers, setPrinters] = useState([]);
  const [selectedPrinter, setSelectedPrinter] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [loading, setLoading] = useState(true);

  // Simular carregamento inicial
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      // Verificar se há uma impressora conectada (simulação)
      const connectedPrinter = localStorage.getItem('connectedPrinter');
      if (connectedPrinter) {
        const printer = mockPrinters.find(p => p.id === connectedPrinter);
        if (printer) {
          setSelectedPrinter(printer);
          setIsConnected(true);
        }
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Buscar impressoras (simulação)
  const scanPrinters = async () => {
    try {
      setIsScanning(true);
      toast.info('Buscando impressoras Bluetooth...');

      // Simular chamada API
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Retornar impressoras mockadas com variação de sinal
      const scannedPrinters = mockPrinters.map(printer => ({
        ...printer,
        rssi: printer.rssi + Math.floor(Math.random() * 10) - 5 // Variação de -5 a +5
      }));

      setPrinters(scannedPrinters);
      toast.success(`${scannedPrinters.length} impressora(s) encontrada(s)!`);
    } catch (error) {
      toast.error('Erro ao buscar impressoras');
    } finally {
      setIsScanning(false);
    }
  };

  // Conectar impressora
  const connectPrinter = async (printer) => {
    try {
      setIsConnecting(true);
      toast.info(`Conectando à ${printer.name}...`);

      // Simular chamada API
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Simular conexão bem-sucedida
      setSelectedPrinter(printer);
      setIsConnected(true);
      localStorage.setItem('connectedPrinter', printer.id);
      
      toast.success(`Conectado à ${printer.name} com sucesso!`);
    } catch (error) {
      toast.error('Erro ao conectar impressora');
    } finally {
      setIsConnecting(false);
    }
  };

  // Desconectar impressora
  const disconnectPrinter = async () => {
    try {
      toast.info('Desconectando impressora...');

      // Simular chamada API
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Limpar conexão
      setSelectedPrinter(null);
      setIsConnected(false);
      localStorage.removeItem('connectedPrinter');
      
      toast.success('Impressora desconectada com sucesso!');
    } catch (error) {
      toast.error('Erro ao desconectar impressora');
    }
  };

  // Testar impressão
  const testPrint = async () => {
    if (!selectedPrinter) {
      toast.warning('Nenhuma impressora conectada');
      return;
    }

    try {
      toast.info('Enviando teste de impressão...');

      // Simular chamada API
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Simular conteúdo do teste
      const testContent = `
================================
        TESTE DE IMPRESSÃO
================================

Impressora: ${selectedPrinter.name}
Modelo: ${selectedPrinter.model}
Endereço: ${selectedPrinter.address}
Data/Hora: ${new Date().toLocaleString('pt-BR')}

================================
     IMPRESSÃO BEM SUCEDIDA!
================================

`;

      toast.success('Teste de impressão enviado com sucesso!');
      
      // Mostrar preview do que seria impresso
      console.log('=== CONTEÚDO DO TESTE ===');
      console.log(testContent);
      
    } catch (error) {
      toast.error('Erro ao enviar teste de impressão');
    }
  };

  // Obter intensidade do sinal
  const getSignalStrength = (rssi) => {
    if (rssi >= -50) return { level: 'Excelente', color: 'success', bars: 4 };
    if (rssi >= -60) return { level: 'Bom', color: 'info', bars: 3 };
    if (rssi >= -70) return { level: 'Regular', color: 'warning', bars: 2 };
    return { level: 'Fraco', color: 'danger', bars: 1 };
  };

  // Formatar endereço MAC
  const formatMacAddress = (address) => {
    return address.toUpperCase().replace(/(.{2})/g, '$1:').slice(0, -1);
  };

  if (loading) {
    return (
      <div className="page">
        <div className="page-header">
          <div className="container-xl">
            <div className="row g-2 align-items-center">
              <div className="col">
                <h2 className="page-title">Carregando impressoras...</h2>
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
              <h2 className="page-title">Impressora Bluetooth</h2>
              <div className="page-pretitle">Gerenciamento de impressoras térmicas para pedidos</div>
            </div>
            <div className="col-auto ms-auto d-print-none">
              <div className="btn-list">
                <button 
                  className="btn btn-primary" 
                  onClick={scanPrinters}
                  disabled={isScanning}
                >
                  {isScanning ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Buscando...
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                        <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
                        <path d="M21 21l-6 -6" />
                      </svg>
                      Buscar Impressoras
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="page-body">
        <div className="container-xl">
          {/* Status da conexão */}
          <div className="row mb-3">
            <div className="col-12">
              <div className="card">
                <div className="card-body">
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <h4 className="mb-1">Status da Conexão</h4>
                      <div className="text-muted">
                        {isConnected ? (
                          <span className="text-success">
                            <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-inline" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                              <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                              <path d="M7 12l5 5l10 -10" />
                            </svg>
                            Conectado à {selectedPrinter.name}
                          </span>
                        ) : (
                          <span className="text-warning">
                            <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-inline" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                              <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                              <path d="M12 9v2m0 4v.01" />
                              <path d="M5 19h14a2 2 0 0 0 1.84 -2.75l-7.1 -12.25a2 2 0 0 0 -3.5 0l-7.1 12.25a2 2 0 0 0 1.75 2.75" />
                            </svg>
                            Nenhuma impressora conectada
                          </span>
                        )}
                      </div>
                      {selectedPrinter && (
                        <div className="mt-2">
                          <small className="text-muted">
                            <strong>Modelo:</strong> {selectedPrinter.model} | 
                            <strong>Endereço:</strong> {formatMacAddress(selectedPrinter.address)}
                          </small>
                        </div>
                      )}
                    </div>
                    {isConnected && (
                      <button 
                        className="btn btn-outline-danger"
                        onClick={disconnectPrinter}
                        disabled={isConnecting}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                          <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                          <path d="M6 5l0 14" />
                          <path d="M18 5l0 14" />
                        </svg>
                        Desconectar
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Teste de impressão */}
          {isConnected && (
            <div className="row mb-3">
              <div className="col-12">
                <div className="card">
                  <div className="card-body">
                    <div className="d-flex align-items-center justify-content-between">
                      <div>
                        <h4 className="mb-1">Teste de Impressão</h4>
                        <div className="text-muted">
                          Envie um teste para verificar se a impressora está funcionando corretamente
                        </div>
                      </div>
                      <button 
                        className="btn btn-outline-primary"
                        onClick={testPrint}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                          <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                          <path d="M17 17h2a2 2 0 0 0 2 -2v-4a2 2 0 0 0 -2 -2h-14a2 2 0 0 0 -2 2v4a2 2 0 0 0 2 2h2" />
                          <path d="M17 9v-4a2 2 0 0 0 -2 -2h-6a2 2 0 0 0 -2 2v4" />
                          <path d="M7 13m0 2a2 2 0 0 1 2 -2h6a2 2 0 0 1 2 2v4a2 2 0 0 1 -2 2h-6a2 2 0 0 1 -2 -2z" />
                        </svg>
                        Imprimir Teste
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Lista de impressoras */}
          {printers.length > 0 && (
            <div className="row">
              <div className="col-12">
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">Impressoras Encontradas</h3>
                    <div className="text-muted">
                      Selecione uma impressora para conectar
                    </div>
                  </div>
                  <div className="card-body">
                    <div className="row row-cards">
                      {printers.map((printer) => {
                        const signal = getSignalStrength(printer.rssi);
                        const isSelected = selectedPrinter?.id === printer.id;
                        
                        return (
                          <div key={printer.id} className="col-md-6 col-lg-4">
                            <div className={`card ${isSelected ? 'card-active border-primary' : ''}`}>
                              <div className="card-body">
                                <div className="d-flex align-items-center justify-content-between mb-3">
                                  <div>
                                    <h4 className="card-title mb-1">{printer.name}</h4>
                                    <div className="text-muted">
                                      {printer.model}
                                    </div>
                                  </div>
                                  <div className="text-end">
                                    <div className={`badge bg-${signal.color} mb-1`}>
                                      {signal.level}
                                    </div>
                                    <div className="text-muted small">
                                      {printer.rssi} dBm
                                    </div>
                                  </div>
                                </div>

                                <div className="mb-3">
                                  <div className="d-flex align-items-center justify-content-between mb-2">
                                    <span className="text-muted">Sinal:</span>
                                    <div className="d-flex gap-1">
                                      {[1, 2, 3, 4].map((bar) => (
                                        <div
                                          key={bar}
                                          className={`signal-bar ${bar <= signal.bars ? `bg-${signal.color}` : 'bg-secondary'}`}
                                          style={{
                                            width: '4px',
                                            height: `${12 + bar * 2}px`,
                                            borderRadius: '1px'
                                          }}
                                        />
                                      ))}
                                    </div>
                                  </div>
                                  <div className="d-flex align-items-center justify-content-between">
                                    <span className="text-muted">Endereço:</span>
                                    <code className="small">{formatMacAddress(printer.address)}</code>
                                  </div>
                                </div>

                                <div className="d-flex gap-2">
                                  {isConnected && isSelected ? (
                                    <button 
                                      className="btn btn-outline-success btn-sm w-100"
                                      disabled
                                    >
                                      <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-inline" width="16" height="16" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                        <path d="M7 12l5 5l10 -10" />
                                      </svg>
                                      Conectado
                                    </button>
                                  ) : (
                                    <button 
                                      className="btn btn-primary btn-sm w-100"
                                      onClick={() => connectPrinter(printer)}
                                      disabled={isConnecting}
                                    >
                                      {isConnecting ? (
                                        <>
                                          <span className="spinner-border spinner-border-sm me-1" role="status"></span>
                                          Conectando...
                                        </>
                                      ) : (
                                        <>
                                          <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-inline" width="16" height="16" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                            <path d="M7 7h10v6a3 3 0 0 1 -3 3h-4a3 3 0 0 1 -3 -3v-6" />
                                            <path d="M7 11l0 -4" />
                                            <path d="M17 11l0 -4" />
                                            <path d="M10 10l0 -2" />
                                            <path d="M14 10l0 -2" />
                                          </svg>
                                          Conectar
                                        </>
                                      )}
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Instruções */}
          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-body">
                  <h4 className="mb-3">Instruções de Uso</h4>
                  <div className="row">
                    <div className="col-md-6">
                      <h5>Para conectar uma impressora:</h5>
                      <ol className="mb-0">
                        <li>Certifique-se de que a impressora está ligada</li>
                        <li>Ative o Bluetooth no dispositivo</li>
                        <li>Clique em "Buscar Impressoras"</li>
                        <li>Selecione a impressora desejada</li>
                        <li>Clique em "Conectar"</li>
                      </ol>
                    </div>
                    <div className="col-md-6">
                      <h5>Dicas importantes:</h5>
                      <ul className="mb-0">
                        <li>Mantenha o dispositivo próximo à impressora</li>
                        <li>Evite interferências de outros dispositivos Bluetooth</li>
                        <li>Teste a impressão após conectar</li>
                        <li>Desconecte quando não estiver usando</li>
                        <li>Renove a conexão periodicamente</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Estado vazio */}
          {printers.length === 0 && !isScanning && (
            <div className="row">
              <div className="col-12">
                <div className="card">
                  <div className="card-body text-center py-4">
                    <div className="empty-state">
                      <div className="empty-state-icon mb-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="64" height="64" viewBox="0 0 24 24" strokeWidth="1" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                          <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                          <path d="M7 7h10v6a3 3 0 0 1 -3 3h-4a3 3 0 0 1 -3 -3v-6" />
                          <path d="M7 11l0 -4" />
                          <path d="M17 11l0 -4" />
                          <path d="M10 10l0 -2" />
                          <path d="M14 10l0 -2" />
                        </svg>
                      </div>
                      <h4>Nenhuma impressora encontrada</h4>
                      <p className="text-muted">
                        Clique em "Buscar Impressoras" para procurar dispositivos Bluetooth disponíveis
                      </p>
                      <button 
                        className="btn btn-primary"
                        onClick={scanPrinters}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                          <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                          <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
                          <path d="M21 21l-6 -6" />
                        </svg>
                        Buscar Agora
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}