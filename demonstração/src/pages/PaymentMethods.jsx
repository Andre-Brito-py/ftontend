import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

// Métodos de pagamento disponíveis (mesmos do painel original)
const paymentMethods = [
  {
    value: 'dinheiro',
    label: 'Dinheiro',
    description: 'Pagamento em espécie',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
        <path d="M6 6l1.5 1.5" />
        <path d="M16.5 16.5l1.5 1.5" />
        <path d="M3 12h2" />
        <path d="M19 12h2" />
        <path d="M12 3v2" />
        <path d="M12 19v2" />
        <path d="M6 16.5l1.5 -1.5" />
        <path d="M16.5 7.5l1.5 -1.5" />
      </svg>
    )
  },
  {
    value: 'pix',
    label: 'PIX',
    description: 'Transferência instantânea',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M3 12h5l3 5l4 -8l3 3h4" />
        <path d="M3 12v-2a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v2" />
        <path d="M3 12v8a2 2 0 0 0 2 2h14a2 2 0 0 0 2 -2v-8" />
      </svg>
    )
  },
  {
    value: 'cartao_credito',
    label: 'Cartão de Crédito',
    description: 'Parcelamento disponível',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M3 7h18a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-18a2 2 0 0 1 -2 -2v-8a2 2 0 0 1 2 -2" />
        <path d="M3 10l18 0" />
        <path d="M7 16l.5 0" />
        <path d="M10 16l.5 0" />
      </svg>
    )
  },
  {
    value: 'cartao_debito',
    label: 'Cartão de Débito',
    description: 'Pagamento à vista',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M3 7h18a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-18a2 2 0 0 1 -2 -2v-8a2 2 0 0 1 2 -2" />
        <path d="M3 10l18 0" />
        <path d="M7 15l.5 0" />
        <path d="M10 15l.5 0" />
      </svg>
    )
  },
  {
    value: 'vale_refeicao',
    label: 'Vale Refeição',
    description: 'Ticket refeição',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M5 7l0 12l14 0l0 -12z" />
        <path d="M5 11l14 0" />
        <path d="M5 15l14 0" />
        <path d="M9 7l0 -4l6 0l0 4" />
      </svg>
    )
  },
  {
    value: 'vale_alimentacao',
    label: 'Vale Alimentação',
    description: 'Ticket alimentação',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M6 5l12 0l0 14l-12 0z" />
        <path d="M6 10l12 0" />
        <path d="M6 14l12 0" />
        <path d="M10 5l0 -2l4 0l0 2" />
      </svg>
    )
  }
];

export default function PaymentMethods() {
  const [acceptedMethods, setAcceptedMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Carregar configurações salvas
  useEffect(() => {
    const loadSettings = () => {
      try {
        const saved = localStorage.getItem('demoPaymentMethods');
        if (saved) {
          setAcceptedMethods(JSON.parse(saved));
        } else {
          // Métodos padrão ativados
          setAcceptedMethods(['dinheiro', 'pix', 'cartao_credito']);
        }
      } catch (error) {
        console.error('Erro ao carregar configurações:', error);
        setAcceptedMethods(['dinheiro', 'pix', 'cartao_credito']);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  // Alternar método de pagamento
  const toggleMethod = (methodValue) => {
    setAcceptedMethods(prev => {
      const isCurrentlyAccepted = prev.includes(methodValue);
      
      // Validar: não permitir desativar todos os métodos
      if (isCurrentlyAccepted && prev.length === 1) {
        toast.warning('É necessário aceitar pelo menos um método de pagamento');
        return prev;
      }
      
      if (isCurrentlyAccepted) {
        return prev.filter(method => method !== methodValue);
      } else {
        return [...prev, methodValue];
      }
    });
  };

  // Salvar configurações
  const saveSettings = async () => {
    try {
      setSaving(true);
      
      // Simular chamada API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Salvar no localStorage
      localStorage.setItem('demoPaymentMethods', JSON.stringify(acceptedMethods));
      
      // Disparar evento para atualizar outras partes do sistema
      window.dispatchEvent(new CustomEvent('demo-payment-methods-updated'));
      
      toast.success('Formas de pagamento salvas com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      toast.error('Erro ao salvar formas de pagamento');
    } finally {
      setSaving(false);
    }
  };

  // Verificar se há mudanças
  const hasChanges = () => {
    const saved = localStorage.getItem('demoPaymentMethods');
    if (!saved) return acceptedMethods.length > 0;
    const savedMethods = JSON.parse(saved);
    return JSON.stringify(acceptedMethods.sort()) !== JSON.stringify(savedMethods.sort());
  };

  if (loading) {
    return (
      <div className="page">
        <div className="page-header">
          <div className="container-xl">
            <div className="row g-2 align-items-center">
              <div className="col">
                <h2 className="page-title">Carregando formas de pagamento...</h2>
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
              <h2 className="page-title">Formas de Pagamento</h2>
              <div className="page-pretitle">Configure quais métodos de pagamento sua loja aceita</div>
            </div>
            <div className="col-auto ms-auto d-print-none">
              <div className="btn-list">
                <button 
                  className="btn btn-primary" 
                  onClick={saveSettings}
                  disabled={saving || !hasChanges()}
                >
                  {saving ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Salvando...
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                        <path d="M6 4l12 0l0 16l-12 0z" />
                        <path d="M9 12l2 2l4 -4" />
                      </svg>
                      Salvar Configurações
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
          {/* Status e contador */}
          <div className="row mb-3">
            <div className="col-12">
              <div className="card">
                <div className="card-body">
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <h4 className="mb-1">Métodos Ativos</h4>
                      <div className="text-muted">
                        {acceptedMethods.length} de {paymentMethods.length} métodos de pagamento ativados
                      </div>
                    </div>
                    <div className="text-end">
                      <div className="h2 mb-0 text-primary">{acceptedMethods.length}</div>
                      <small className="text-muted">Ativos</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Grid de métodos de pagamento */}
          <div className="row row-cards">
            {paymentMethods.map((method) => {
              const isAccepted = acceptedMethods.includes(method.value);
              
              return (
                <div key={method.value} className="col-md-6 col-lg-4">
                  <div className={`card ${isAccepted ? 'border-primary bg-primary-lt' : ''}`}>
                    <div className="card-body">
                      <div className="d-flex align-items-center mb-3">
                        <div className={`me-3 ${isAccepted ? 'text-primary' : 'text-muted'}`}>
                          {method.icon}
                        </div>
                        <div className="flex-grow-1">
                          <h4 className="card-title mb-1">{method.label}</h4>
                          <div className="text-muted small">{method.description}</div>
                        </div>
                        <div>
                          <input 
                            type="checkbox" 
                            className="form-check-input" 
                            checked={isAccepted}
                            onChange={() => toggleMethod(method.value)}
                            id={`method-${method.value}`}
                          />
                        </div>
                      </div>
                      
                      <div className="d-flex align-items-center justify-content-between">
                        <small className={`${isAccepted ? 'text-primary' : 'text-muted'}`}>
                          {isAccepted ? '✓ Ativado' : '✗ Desativado'}
                        </small>
                        <label 
                          htmlFor={`method-${method.value}`}
                          className="btn btn-sm btn-outline-primary"
                          style={{ cursor: 'pointer' }}
                        >
                          {isAccepted ? 'Desativar' : 'Ativar'}
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Instruções */}
          <div className="row mt-4">
            <div className="col-12">
              <div className="card">
                <div className="card-body">
                  <h4 className="mb-3">Instruções</h4>
                  <div className="row">
                    <div className="col-md-6">
                      <h5>Como configurar:</h5>
                      <ol className="mb-0">
                        <li>Marque os métodos de pagamento que sua loja aceita</li>
                        <li>Clique em "Salvar Configurações" para aplicar as mudanças</li>
                        <li>Os clientes verão apenas os métodos ativados no checkout</li>
                      </ol>
                    </div>
                    <div className="col-md-6">
                      <h5>Dicas importantes:</h5>
                      <ul className="mb-0">
                        <li>Ative pelo menos um método de pagamento</li>
                        <li>PIX e cartão são os mais utilizados</li>
                        <li>Dinheiro é essencial para entregas</li>
                        <li>Vales são úteis para clientes corporativos</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}