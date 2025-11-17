import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

// Configuração da URL base (simulando o FRONTEND_URL do original)
const FRONTEND_URL = 'http://localhost:5177';

export default function MenuLinks() {
  const [storeInfo, setStoreInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [menuLink, setMenuLink] = useState('');

  // Carregar informações da loja
  useEffect(() => {
    const loadStoreInfo = () => {
      try {
        setLoading(true);
        setError(null);

        // Simular chamada API - buscar dados da loja do localStorage
        const savedStoreInfo = localStorage.getItem('demoStoreInfo');
        const savedSettings = localStorage.getItem('demoSettings');
        
        if (savedStoreInfo) {
          const storeData = JSON.parse(savedStoreInfo);
          const settings = savedSettings ? JSON.parse(savedSettings) : {};
          
          // Gerar slug da loja (simulando o backend)
          const storeSlug = storeData.name?.toLowerCase()
            .replace(/[^a-z0-9]/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '') || 'minha-loja';

          const storeWithSlug = {
            ...storeData,
            slug: storeSlug,
            isOpen: settings.isOpen !== false
          };

          setStoreInfo(storeWithSlug);
          
          // Gerar link do cardápio
          const link = `${FRONTEND_URL}/loja/${storeSlug}`;
          setMenuLink(link);
          
          // Gerar QR Code (usando API pública como no original)
          const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(link)}`;
          setQrCodeUrl(qrUrl);
        } else {
          // Loja padrão para demonstração
          const defaultStore = {
            name: 'Zappy Demo',
            description: 'Cardápio digital delivery',
            slug: 'zappy-demo',
            isOpen: true
          };
          
          setStoreInfo(defaultStore);
          const link = `${FRONTEND_URL}/loja/${defaultStore.slug}`;
          setMenuLink(link);
          const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(link)}`;
          setQrCodeUrl(qrUrl);
        }
      } catch (error) {
        console.error('Erro ao carregar informações da loja:', error);
        setError('Erro ao carregar informações da loja');
        
        // Fallback para loja padrão
        const defaultStore = {
          name: 'Zappy Demo',
          description: 'Cardápio digital delivery',
          slug: 'zappy-demo',
          isOpen: true
        };
        
        setStoreInfo(defaultStore);
        const link = `${FRONTEND_URL}/loja/${defaultStore.slug}`;
        setMenuLink(link);
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(link)}`;
        setQrCodeUrl(qrUrl);
      } finally {
        setLoading(false);
      }
    };

    // Simular delay de carregamento
    setTimeout(loadStoreInfo, 800);
  }, []);

  // Copiar link para área de transferência
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(menuLink);
      toast.success('Link copiado para a área de transferência!');
    } catch (error) {
      console.error('Erro ao copiar link:', error);
      toast.error('Erro ao copiar link');
    }
  };

  // Compartilhar via WhatsApp
  const shareViaWhatsApp = () => {
    const message = `🍽️ Confira nosso cardápio digital: ${menuLink}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  // Baixar QR Code
  const downloadQRCode = () => {
    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = `cardapio-${storeInfo?.slug || 'loja'}-qrcode.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('QR Code baixado com sucesso!');
  };

  // Tentar novamente em caso de erro
  const retryLoad = () => {
    setError(null);
    setLoading(true);
    setTimeout(() => {
      const savedStoreInfo = localStorage.getItem('demoStoreInfo');
      if (savedStoreInfo) {
        const storeData = JSON.parse(savedStoreInfo);
        const storeSlug = storeData.name?.toLowerCase()
          .replace(/[^a-z0-9]/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-|-$/g, '') || 'minha-loja';

        setStoreInfo({ ...storeData, slug: storeSlug });
        const link = `${FRONTEND_URL}/loja/${storeSlug}`;
        setMenuLink(link);
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(link)}`;
        setQrCodeUrl(qrUrl);
      }
      setLoading(false);
    }, 500);
  };

  if (loading) {
    return (
      <div className="page">
        <div className="page-header">
          <div className="container-xl">
            <div className="row g-2 align-items-center">
              <div className="col">
                <h2 className="page-title">Carregando links do cardápio...</h2>
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

  if (error) {
    return (
      <div className="page">
        <div className="page-header">
          <div className="container-xl">
            <div className="row g-2 align-items-center">
              <div className="col">
                <h2 className="page-title">Links do Cardápio</h2>
              </div>
            </div>
          </div>
        </div>
        <div className="page-body">
          <div className="container-xl">
            <div className="empty-state">
              <div className="empty-state-icon mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="icon text-danger" width="64" height="64" viewBox="0 0 24 24" strokeWidth="1" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                  <path d="M12 9v2m0 4v.01" />
                  <path d="M5 19h14a2 2 0 0 0 1.84 -2.75l-7.1 -12.25a2 2 0 0 0 -3.5 0l-7.1 12.25a2 2 0 0 0 1.75 2.75" />
                </svg>
              </div>
              <h4>Erro ao carregar informações</h4>
              <p className="text-muted">{error}</p>
              <button className="btn btn-primary" onClick={retryLoad}>
                <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                  <path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4" />
                  <path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4" />
                </svg>
                Tentar Novamente
              </button>
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
              <h2 className="page-title">Links do Cardápio</h2>
              <div className="page-pretitle">Compartilhe seu cardápio digital com clientes</div>
            </div>
          </div>
        </div>
      </div>

      <div className="page-body">
        <div className="container-xl">
          {/* Informações da loja */}
          <div className="row mb-4">
            <div className="col-12">
              <div className="card">
                <div className="card-body">
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <h4 className="mb-1">{storeInfo?.name || 'Minha Loja'}</h4>
                      <div className="text-muted">
                        {storeInfo?.description || 'Cardápio digital delivery'}
                      </div>
                      <div className="mt-2">
                        <span className={`badge ${storeInfo?.isOpen ? 'bg-success' : 'bg-danger'}`}>
                          {storeInfo?.isOpen ? '🟢 Loja Aberta' : '🔴 Loja Fechada'}
                        </span>
                      </div>
                    </div>
                    <div className="text-end">
                      <div className="text-muted small">Slug do cardápio</div>
                      <code className="text-primary">{storeInfo?.slug || 'loja'}</code>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            {/* Link Direto */}
            <div className="col-lg-6 mb-4">
              <div className="card h-100">
                <div className="card-header">
                  <h3 className="card-title">Link Direto</h3>
                  <div className="text-muted small">Compartilhe o link direto do seu cardápio</div>
                </div>
                <div className="card-body">
                  <div className="mb-3">
                    <label className="form-label">URL do Cardápio</label>
                    <div className="input-group">
                      <input 
                        type="text" 
                        className="form-control" 
                        value={menuLink}
                        readOnly
                        onClick={(e) => e.target.select()}
                      />
                      <button className="btn btn-primary" onClick={copyToClipboard}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                          <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                          <path d="M8 8m0 2a2 2 0 0 1 2 -2h8a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-8a2 2 0 0 1 -2 -2z" />
                          <path d="M16 8v-2a2 2 0 0 0 -2 -2h-8a2 2 0 0 0 -2 2v8a2 2 0 0 0 2 2h2" />
                        </svg>
                        Copiar
                      </button>
                    </div>
                  </div>
                  
                  <div className="d-grid">
                    <button className="btn btn-success" onClick={shareViaWhatsApp}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                        <path d="M3 21l1.65 -3.8a9 9 0 1 1 3.4 2.9l-5.05 .9" />
                        <path d="M9 10a0.5 .5 0 0 0 1 0v-1a0.5 .5 0 0 0 -1 0v1a5 5 0 0 0 5 5h1a0.5 .5 0 0 0 0 -1h-1a0.5 .5 0 0 0 0 1" />
                      </svg>
                      Compartilhar no WhatsApp
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* QR Code */}
            <div className="col-lg-6 mb-4">
              <div className="card h-100">
                <div className="card-header">
                  <h3 className="card-title">QR Code</h3>
                  <div className="text-muted small">Imprima ou compartilhe o QR Code do seu cardápio</div>
                </div>
                <div className="card-body text-center">
                  <div className="mb-3">
                    <div className="qr-code-container d-inline-block p-3 bg-white rounded border">
                      <img 
                        src={qrCodeUrl} 
                        alt="QR Code do Cardápio" 
                        className="img-fluid"
                        style={{ maxWidth: '200px', height: 'auto' }}
                      />
                    </div>
                  </div>
                  
                  <div className="text-muted mb-3">
                    <small>Escaneie este QR Code para acessar o cardápio</small>
                  </div>
                  
                  <div className="d-grid">
                    <button className="btn btn-outline-primary" onClick={downloadQRCode}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                        <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2" />
                        <path d="M7 11l5 5l5 -5" />
                        <path d="M12 16l0 -14" />
                      </svg>
                      Baixar QR Code
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Instruções */}
          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-body">
                  <h4 className="mb-3">Instruções de Uso</h4>
                  <div className="row">
                    <div className="col-md-6">
                      <h5>Como compartilhar:</h5>
                      <ol className="mb-0">
                        <li>Copie o link direto ou use o QR Code</li>
                        <li>Compartilhe no WhatsApp com clientes</li>
                        <li>Imprima o QR Code para colocar na mesa</li>
                        <li>Adicione o link na bio do Instagram</li>
                      </ol>
                    </div>
                    <div className="col-md-6">
                      <h5>Dicas importantes:</h5>
                      <ul className="mb-0">
                        <li>O QR Code pode ser impresso em qualquer tamanho</li>
                        <li>Teste o link antes de compartilhar</li>
                        <li>Mantenha o cardápio sempre atualizado</li>
                        <li>Use papel branco para melhor leitura do QR</li>
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