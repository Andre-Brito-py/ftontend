import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const WhatsAppCampaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showLizaConfigModal, setShowLizaConfigModal] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [activeTab, setActiveTab] = useState('campaigns');
  const [loading, setLoading] = useState(false);

  // Estado para formulário de campanha
  const [campaignForm, setCampaignForm] = useState({
    name: '',
    message: '',
    targetAudience: 'all',
    scheduledDate: '',
    scheduledTime: '',
    status: 'draft'
  });

  // Estado para formulário de template
  const [templateForm, setTemplateForm] = useState({
    name: '',
    category: 'marketing',
    content: '',
    variables: []
  });

  // Estado para configurações do WhatsApp
  const [whatsappConfig, setWhatsappConfig] = useState({
    phoneNumber: '',
    apiKey: '',
    isConnected: false,
    messageLimit: 1000,
    messagesSent: 0,
    businessName: '',
    welcomeMessage: '',
    autoReplyEnabled: true,
    lizaIntegrationEnabled: true
  });

  // Estado para configurações da Liza
  const [lizaConfig, setLizaConfig] = useState({
    isActive: true,
    responseTime: 'immediate',
    aiPersonality: 'friendly',
    supportedTopics: ['menu', 'orders', 'hours', 'contact', 'promotions'],
    customInstructions: '',
    fallbackMessage: 'Desculpe, não consegui entender. Por favor, entre em contato com nosso atendimento.',
    learningMode: true
  });

  // Estado para conversas do WhatsApp
  const [whatsappChats, setWhatsappChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);

  // Dados simulados iniciais
  useEffect(() => {
    const mockCampaigns = [
      {
        id: 1,
        name: 'Promoção de Segunda-feira',
        message: '🎉 Aproveite nossa promoção especial de segunda! 20% OFF em todos os pedidos acima de R$ 50,00. Use o código: SEGUNDA20',
        targetAudience: 'all',
        scheduledDate: '2024-01-15',
        scheduledTime: '10:00',
        status: 'sent',
        sentCount: 245,
        deliveredCount: 238,
        readCount: 189,
        createdAt: '2024-01-14T10:30:00'
      },
      {
        id: 2,
        name: 'Lançamento de Novo Produto',
        message: '🔥 Novidade! Lançamos nosso novo combo familiar. Peça agora e ganhe um brinde especial! \n\n📱 Acesse: [link]',
        targetAudience: 'vip',
        scheduledDate: '2024-01-20',
        scheduledTime: '14:00',
        status: 'scheduled',
        sentCount: 0,
        deliveredCount: 0,
        readCount: 0,
        createdAt: '2024-01-18T15:45:00'
      },
      {
        id: 3,
        name: 'Campanha de Aniversário',
        message: '🎂 É dia de festa! Comemore conosco e ganhe 15% de desconto em todo o cardápio. Válido por 7 dias!',
        targetAudience: 'birthday',
        scheduledDate: '',
        scheduledTime: '',
        status: 'draft',
        sentCount: 0,
        deliveredCount: 0,
        readCount: 0,
        createdAt: '2024-01-16T09:15:00'
      }
    ];

    const mockTemplates = [
      {
        id: 1,
        name: 'Boas-vindas',
        category: 'utility',
        content: 'Olá {{name}}, seja bem-vindo(a) ao {{storeName}}! 🎉\n\nAgradecemos por escolher nosso delivery. Para fazer seu primeiro pedido, acesse: {{menuLink}}',
        variables: ['name', 'storeName', 'menuLink'],
        isApproved: true
      },
      {
        id: 2,
        name: 'Pedido Confirmado',
        category: 'utility',
        content: '✅ Pedido confirmado!\n\n📋 Número do pedido: {{orderNumber}}\n💰 Total: {{totalAmount}}\n⏰ Tempo estimado: {{deliveryTime}}\n\nAcompanhe seu pedido em: {{trackingLink}}',
        variables: ['orderNumber', 'totalAmount', 'deliveryTime', 'trackingLink'],
        isApproved: true
      },
      {
        id: 3,
        name: 'Promoção Semanal',
        category: 'marketing',
        content: '🚀 Promoção especial da semana!\n\n📅 {{offerDescription}}\n💸 {{discount}}% de desconto\n⏳ Válido até {{validDate}}\n\nCorra e aproveite! {{orderLink}}',
        variables: ['offerDescription', 'discount', 'validDate', 'orderLink'],
        isApproved: false
      }
    ];

    const mockConfig = {
      phoneNumber: '5511999999999',
      apiKey: 'demo-key-12345',
      isConnected: true,
      messageLimit: 1000,
      messagesSent: 684,
      businessName: 'Zappy Delivery',
      welcomeMessage: 'Olá! Seja bem-vindo(a) ao Zappy Delivery! 🍕 Como posso ajudar você hoje?',
      autoReplyEnabled: true,
      lizaIntegrationEnabled: true
    };

    const mockChats = [
      {
        id: 1,
        customerName: 'João Silva',
        customerPhone: '5511987654321',
        lastMessage: 'Olá, gostaria de fazer um pedido',
        lastMessageTime: '2024-01-20T14:30:00',
        unreadCount: 2,
        status: 'active',
        isLizaActive: true,
        messages: [
          {
            id: 1,
            sender: 'customer',
            content: 'Olá, gostaria de fazer um pedido',
            timestamp: '2024-01-20T14:30:00',
            type: 'text'
          },
          {
            id: 2,
            sender: 'liza',
            content: 'Olá João! 👋 Eu sou a Liza, assistente virtual do Zappy Delivery. Fico feliz em ajudar com seu pedido! Você pode me dizer qual item do cardápio gostaria?',
            timestamp: '2024-01-20T14:30:15',
            type: 'text'
          },
          {
            id: 3,
            sender: 'customer',
            content: 'Qual é o cardápio de hoje?',
            timestamp: '2024-01-20T14:31:00',
            type: 'text'
          }
        ]
      },
      {
        id: 2,
        customerName: 'Maria Santos',
        customerPhone: '5511981234567',
        lastMessage: 'Quero saber sobre promoções',
        lastMessageTime: '2024-01-20T13:45:00',
        unreadCount: 1,
        status: 'active',
        isLizaActive: false,
        messages: [
          {
            id: 1,
            sender: 'customer',
            content: 'Quero saber sobre promoções',
            timestamp: '2024-01-20T13:45:00',
            type: 'text'
          },
          {
            id: 2,
            sender: 'liza',
            content: 'Oi Maria! 🎉 Temos promoções especiais hoje! A Pizza Grande está com 20% OFF e o Combo Familiar com R$ 15 de desconto. Gostaria de ver o cardápio completo?',
            timestamp: '2024-01-20T13:45:20',
            type: 'text'
          }
        ]
      },
      {
        id: 3,
        customerName: 'Pedro Oliveira',
        customerPhone: '5511976543210',
        lastMessage: 'Muito obrigado pela ajuda!',
        lastMessageTime: '2024-01-20T12:15:00',
        unreadCount: 0,
        status: 'closed',
        isLizaActive: false,
        messages: [
          {
            id: 1,
            sender: 'customer',
            content: 'Preciso de ajuda com meu pedido',
            timestamp: '2024-01-20T12:10:00',
            type: 'text'
          },
          {
            id: 2,
            sender: 'liza',
            content: 'Claro Pedro! Posso ajudar com seu pedido. Qual é o número do pedido ou posso pesquisar pelo seu telefone?',
            timestamp: '2024-01-20T12:10:30',
            type: 'text'
          },
          {
            id: 3,
            sender: 'customer',
            content: 'Muito obrigado pela ajuda!',
            timestamp: '2024-01-20T12:15:00',
            type: 'text'
          }
        ]
      }
    ];

    setCampaigns(mockCampaigns);
    setTemplates(mockTemplates);
    setWhatsappConfig(mockConfig);
    setWhatsappChats(mockChats);
  }, []);

  const handleCreateCampaign = () => {
    if (!campaignForm.name || !campaignForm.message) {
      toast.error('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    setLoading(true);
    
    setTimeout(() => {
      const newCampaign = {
        id: campaigns.length + 1,
        ...campaignForm,
        sentCount: 0,
        deliveredCount: 0,
        readCount: 0,
        createdAt: new Date().toISOString(),
        status: campaignForm.scheduledDate ? 'scheduled' : 'draft'
      };

      setCampaigns([...campaigns, newCampaign]);
      setShowCampaignModal(false);
      setCampaignForm({
        name: '',
        message: '',
        targetAudience: 'all',
        scheduledDate: '',
        scheduledTime: '',
        status: 'draft'
      });
      
      setLoading(false);
      toast.success('Campanha criada com sucesso!');
    }, 1500);
  };

  const handleCreateTemplate = () => {
    if (!templateForm.name || !templateForm.content) {
      toast.error('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    setLoading(true);
    
    setTimeout(() => {
      const variables = templateForm.content.match(/\{\{(.*?)\}\}/g) || [];
      const newTemplate = {
        id: templates.length + 1,
        ...templateForm,
        variables: variables.map(v => v.replace(/\{\{(.*?)\}\}/, '$1')),
        isApproved: false
      };

      setTemplates([...templates, newTemplate]);
      setShowTemplateModal(false);
      setTemplateForm({
        name: '',
        category: 'marketing',
        content: '',
        variables: []
      });
      
      setLoading(false);
      toast.success('Template criado com sucesso! Aguardando aprovação.');
    }, 1500);
  };

  const handleSendCampaign = (campaign) => {
    if (campaign.status === 'sent') {
      toast.warning('Esta campanha já foi enviada.');
      return;
    }

    setLoading(true);
    
    setTimeout(() => {
      const updatedCampaigns = campaigns.map(c => 
        c.id === campaign.id 
          ? { ...c, status: 'sent', sentCount: 245, deliveredCount: 238, readCount: 189 }
          : c
      );
      
      setCampaigns(updatedCampaigns);
      setLoading(false);
      toast.success('Campanha enviada com sucesso!');
    }, 2000);
  };

  const handleDeleteCampaign = (campaignId) => {
    if (window.confirm('Tem certeza que deseja excluir esta campanha?')) {
      setCampaigns(campaigns.filter(c => c.id !== campaignId));
      toast.success('Campanha excluída com sucesso!');
    }
  };

  const handleConnectWhatsApp = () => {
    if (!whatsappConfig.phoneNumber) {
      toast.error('Por favor, insira um número de telefone válido.');
      return;
    }

    setLoading(true);
    
    setTimeout(() => {
      setWhatsappConfig({ ...whatsappConfig, isConnected: true });
      setLoading(false);
      toast.success('WhatsApp conectado com sucesso!');
    }, 2000);
  };

  const handleUpdateLizaConfig = () => {
    setLoading(true);
    
    setTimeout(() => {
      setLoading(false);
      toast.success('Configurações da Liza atualizadas com sucesso!');
    }, 1500);
  };

  const handleUpdateWhatsAppNumber = () => {
    if (!whatsappConfig.phoneNumber || !whatsappConfig.businessName) {
      toast.error('Por favor, preencha o número e nome do WhatsApp.');
      return;
    }

    setLoading(true);
    
    setTimeout(() => {
      setLoading(false);
      toast.success('Número WhatsApp atualizado com sucesso!');
    }, 1500);
  };

  const handleSendManualMessage = (chatId, message) => {
    if (!message.trim()) return;

    const newMessage = {
      id: Date.now(),
      sender: 'admin',
      content: message,
      timestamp: new Date().toISOString(),
      type: 'text'
    };

    setWhatsappChats(chats => 
      chats.map(chat => 
        chat.id === chatId 
          ? { ...chat, messages: [...chat.messages, newMessage], lastMessage: message, lastMessageTime: newMessage.timestamp }
          : chat
      )
    );
    
    toast.success('Mensagem enviada com sucesso!');
  };

  const handleToggleLizaForChat = (chatId) => {
    setWhatsappChats(chats => 
      chats.map(chat => 
        chat.id === chatId 
          ? { ...chat, isLizaActive: !chat.isLizaActive }
          : chat
      )
    );
    
    toast.success('Status da Liza alterado!');
  };

  const getStatusBadge = (status) => {
    const badges = {
      draft: '<span class="badge bg-secondary">Rascunho</span>',
      scheduled: '<span class="badge bg-warning">Agendado</span>',
      sent: '<span class="badge bg-success">Enviado</span>',
      failed: '<span class="badge bg-danger">Falhou</span>'
    };
    return badges[status] || '<span class="badge bg-secondary">Desconhecido</span>';
  };

  const getTargetAudienceLabel = (audience) => {
    const labels = {
      all: 'Todos os clientes',
      vip: 'Clientes VIP',
      birthday: 'Aniversariantes',
      inactive: 'Clientes inativos',
      new: 'Novos clientes'
    };
    return labels[audience] || audience;
  };

  return (
    <div className="page">
      <style jsx="true">{`
        .whatsapp-campaigns {
          padding: 1.5rem;
        }
        .stats-card {
          background: linear-gradient(135deg, #25D366, #128C7E);
          color: white;
          border: none;
        }
        .stats-card .card-title {
          color: white;
          opacity: 0.9;
        }
        .stats-card .h2 {
          color: white;
          font-weight: 700;
        }
        .campaign-card {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .campaign-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        .template-preview {
          background: #f8f9fa;
          border-radius: 8px;
          padding: 1rem;
          font-family: monospace;
          font-size: 0.9rem;
          line-height: 1.4;
        }
        .progress-bar-custom {
          height: 8px;
          border-radius: 4px;
        }
        .whatsapp-icon {
          color: #25D366;
        }
        .nav-tabs .nav-link.active {
          border-color: #25D366;
          color: #25D366;
        }
      `}</style>

      <div className="page-header">
        <div className="container-xl">
          <div className="row g-2 align-items-center">
            <div className="col">
              <h2 className="page-title">WhatsApp Business</h2>
              <div className="page-pretitle">Campanhas e automação de mensagens</div>
            </div>
            <div className="col-auto ms-auto d-print-none">
              <div className="btn-list">
                <button 
                  className="btn btn-outline-primary" 
                  onClick={() => setShowTemplateModal(true)}
                  disabled={loading}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                    <path d="M14 3v4a1 1 0 0 0 1 1h4" />
                    <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" />
                    <line x1="9" y1="9" x2="10" y2="9" />
                    <line x1="9" y1="13" x2="15" y2="13" />
                    <line x1="9" y1="17" x2="15" y2="17" />
                  </svg>
                  Novo Template
                </button>
                <button 
                  className="btn btn-primary whatsapp-icon" 
                  onClick={() => setShowCampaignModal(true)}
                  disabled={loading}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                    <path d="M3 21l1.65 -3.8a9 9 0 1 1 3.4 2.9l-5.2 .12" />
                    <path d="M9 10a0.5 .5 0 0 0 1 0v-1a0.5 .5 0 0 0 -1 0v1a5 5 0 0 0 5 5h1a0.5 .5 0 0 0 0 -1h-1a0.5 .5 0 0 0 0 1" />
                  </svg>
                  Nova Campanha
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="page-body">
        <div className="container-xl">
          {/* Status do WhatsApp */}
          <div className="row mb-4">
            <div className="col-12">
              <div className="card">
                <div className="card-body">
                  <div className="row align-items-center">
                    <div className="col">
                      <div className="d-flex align-items-center">
                        <div className="whatsapp-icon me-3">
                          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                            <path d="M3 21l1.65 -3.8a9 9 0 1 1 3.4 2.9l-5.2 .12" />
                            <path d="M9 10a0.5 .5 0 0 0 1 0v-1a0.5 .5 0 0 0 -1 0v1a5 5 0 0 0 5 5h1a0.5 .5 0 0 0 0 -1h-1a0.5 .5 0 0 0 0 1" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="mb-1">Status do WhatsApp Business</h3>
                          <div className="text-muted">
                            {whatsappConfig.isConnected ? (
                              <span className="text-success">
                                <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                  <path d="M5 12l5 5l10 -10" />
                                </svg>
                                Conectado • {whatsappConfig.phoneNumber}
                              </span>
                            ) : (
                              <span className="text-warning">
                                <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                  <circle cx="12" cy="12" r="9" />
                                  <line x1="12" y1="8" x2="12" y2="12" />
                                  <line x1="12" y1="16" x2="12.01" y2="16" />
                                </svg>
                                Desconectado
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-auto">
                      {!whatsappConfig.isConnected ? (
                        <button 
                          className="btn btn-success" 
                          onClick={handleConnectWhatsApp}
                          disabled={loading}
                        >
                          {loading ? (
                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          ) : null}
                          Conectar WhatsApp
                        </button>
                      ) : (
                        <div className="text-end">
                          <div className="text-muted small">Limite de mensagens</div>
                          <div className="h5 mb-0">{whatsappConfig.messagesSent}/{whatsappConfig.messageLimit}</div>
                          <div className="progress progress-bar-custom mt-1">
                            <div 
                              className="progress-bar bg-success" 
                              style={{width: `${(whatsappConfig.messagesSent / whatsappConfig.messageLimit) * 100}%`}}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Abas de navegação */}
          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-header">
                  <ul className="nav nav-tabs card-header-tabs" data-bs-toggle="tabs">
                    <li className="nav-item">
                      <a 
                        href="#" 
                        className={`nav-link ${activeTab === 'campaigns' ? 'active' : ''}`}
                        onClick={(e) => { e.preventDefault(); setActiveTab('campaigns'); }}
                      >
                        Campanhas
                      </a>
                    </li>
                    <li className="nav-item">
                      <a 
                        href="#" 
                        className={`nav-link ${activeTab === 'templates' ? 'active' : ''}`}
                        onClick={(e) => { e.preventDefault(); setActiveTab('templates'); }}
                      >
                        Templates
                      </a>
                    </li>
                    <li className="nav-item">
                      <a 
                        href="#" 
                        className={`nav-link ${activeTab === 'analytics' ? 'active' : ''}`}
                        onClick={(e) => { e.preventDefault(); setActiveTab('analytics'); }}
                      >
                        Análises
                      </a>
                    </li>
                    <li className="nav-item">
                      <a 
                        href="#" 
                        className={`nav-link ${activeTab === 'liza' ? 'active' : ''}`}
                        onClick={(e) => { e.preventDefault(); setActiveTab('liza'); }}
                      >
                        Assistente Liza
                      </a>
                    </li>
                    <li className="nav-item">
                      <a 
                        href="#" 
                        className={`nav-link ${activeTab === 'config' ? 'active' : ''}`}
                        onClick={(e) => { e.preventDefault(); setActiveTab('config'); }}
                      >
                        Configurações
                      </a>
                    </li>
                  </ul>
                </div>
                <div className="card-body">
                  {/* Aba Campanhas */}
                  {activeTab === 'campaigns' && (
                    <div>
                      <div className="table-responsive">
                        <table className="table table-vcenter">
                          <thead>
                            <tr>
                              <th>Nome da Campanha</th>
                              <th>Público-alvo</th>
                              <th>Status</th>
                              <th>Envios</th>
                              <th>Entregas</th>
                              <th>Leituras</th>
                              <th>Agendamento</th>
                              <th width="150">Ações</th>
                            </tr>
                          </thead>
                          <tbody>
                            {campaigns.map((campaign) => (
                              <tr key={campaign.id}>
                                <td>
                                  <div className="d-flex py-1 align-items-center">
                                    <div className="flex-fill">
                                      <div className="font-weight-medium">{campaign.name}</div>
                                      <div className="text-muted small">{campaign.message.substring(0, 50)}...</div>
                                    </div>
                                  </div>
                                </td>
                                <td>
                                  <span className="badge bg-light text-dark">
                                    {getTargetAudienceLabel(campaign.targetAudience)}
                                  </span>
                                </td>
                                <td>
                                  <span dangerouslySetInnerHTML={{ __html: getStatusBadge(campaign.status) }} />
                                </td>
                                <td>
                                  <span className="badge bg-blue-lt">{campaign.sentCount}</span>
                                </td>
                                <td>
                                  <span className="badge bg-green-lt">{campaign.deliveredCount}</span>
                                </td>
                                <td>
                                  <span className="badge bg-purple-lt">{campaign.readCount}</span>
                                </td>
                                <td>
                                  {campaign.scheduledDate ? (
                                    <div>
                                      <div>{new Date(campaign.scheduledDate).toLocaleDateString('pt-BR')}</div>
                                      <div className="text-muted small">{campaign.scheduledTime}</div>
                                    </div>
                                  ) : (
                                    <span className="text-muted">-</span>
                                  )}
                                </td>
                                <td>
                                  <div className="btn-list flex-nowrap">
                                    {campaign.status === 'draft' && (
                                      <button 
                                        className="btn btn-white btn-sm"
                                        onClick={() => handleSendCampaign(campaign)}
                                        disabled={loading}
                                      >
                                        Enviar
                                      </button>
                                    )}
                                    <button 
                                      className="btn btn-white btn-sm"
                                      onClick={() => {
                                        setSelectedCampaign(campaign);
                                        setCampaignForm(campaign);
                                        setShowCampaignModal(true);
                                      }}
                                    >
                                      Editar
                                    </button>
                                    <button 
                                      className="btn btn-white btn-sm"
                                      onClick={() => handleDeleteCampaign(campaign.id)}
                                    >
                                      Excluir
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Aba Templates */}
                  {activeTab === 'templates' && (
                    <div>
                      {Array.isArray(templates) && templates.length > 0 ? (
                        <div className="row">
                          {templates.map((template) => (
                            <div className="col-md-6 col-lg-4 mb-4" key={template.id}>
                              <div className="card campaign-card h-100">
                                <div className="card-header">
                                  <div className="d-flex justify-content-between align-items-center">
                                    <h4 className="card-title mb-0">{template.name}</h4>
                                    <span className={`badge bg-${template.isApproved ? 'success' : 'warning'}-lt`}>
                                      {template.isApproved ? 'Aprovado' : 'Pendente'}
                                    </span>
                                  </div>
                                </div>
                                <div className="card-body">
                                  <div className="mb-3">
                                    <span className="badge bg-light text-dark text-uppercase">
                                      {template.category}
                                    </span>
                                  </div>
                                  <div className="template-preview mb-3">
                                    <pre style={{margin: 0, whiteSpace: 'pre-wrap', fontFamily: 'inherit'}}>{template.content}</pre>
                                  </div>
                                  {template.variables && Array.isArray(template.variables) && template.variables.length > 0 && (
                                    <div className="mb-3">
                                      <strong>Variáveis:</strong>
                                      <div className="mt-1">
                                        {template.variables.map((variable, index) => (
                                          <span key={index} className="badge bg-info-lt me-1">{`{${variable}}`}</span>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                                <div className="card-footer">
                                  <div className="btn-list">
                                    <button className="btn btn-white btn-sm">Editar</button>
                                    <button className="btn btn-primary btn-sm">Usar</button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-5">
                          <svg xmlns="http://www.w3.org/2000/svg" className="icon text-muted mb-3" width="48" height="48" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                            <path d="M14 3v4a1 1 0 0 0 1 1h4" />
                            <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" />
                            <line x1="9" y1="9" x2="10" y2="9" />
                            <line x1="9" y1="13" x2="15" y2="13" />
                            <line x1="9" y1="17" x2="15" y2="17" />
                          </svg>
                          <h4 className="text-muted">Nenhum template encontrado</h4>
                          <p className="text-muted">Crie seu primeiro template de mensagem para começar.</p>
                          <button 
                            className="btn btn-primary" 
                            onClick={() => setShowTemplateModal(true)}
                          >
                            Criar Template
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Aba Análises */}
                  {activeTab === 'analytics' && (
                    <div>
                      <div className="row">
                        <div className="col-md-3">
                          <div className="card">
                            <div className="card-body text-center">
                              <div className="h3 text-blue mb-1">1,247</div>
                              <div className="text-muted">Total de Envios</div>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div className="card">
                            <div className="card-body text-center">
                              <div className="h3 text-green mb-1">1,189</div>
                              <div className="text-muted">Mensagens Entregues</div>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div className="card">
                            <div className="card-body text-center">
                              <div className="h3 text-purple mb-1">892</div>
                              <div className="text-muted">Mensagens Lidas</div>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div className="card">
                            <div className="card-body text-center">
                              <div className="h3 text-orange mb-1">75.1%</div>
                              <div className="text-muted">Taxa de Leitura</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Aba Assistente Liza */}
                  {activeTab === 'liza' && (
                    <div>
                      <div className="row">
                        <div className="col-md-8">
                          <div className="card">
                            <div className="card-header">
                              <h3 className="card-title">Conversas com Clientes</h3>
                              <div className="card-actions">
                                <button className="btn btn-primary btn-sm" onClick={() => setShowLizaConfigModal(true)}>
                                  Configurar Liza
                                </button>
                              </div>
                            </div>
                            <div className="card-body p-0">
                              <div className="list-group list-group-flush">
                                {whatsappChats.map((chat) => (
                                  <div 
                                    key={chat.id} 
                                    className={`list-group-item list-group-item-action ${selectedChat?.id === chat.id ? 'active' : ''}`}
                                    onClick={() => setSelectedChat(chat)}
                                    style={{cursor: 'pointer'}}
                                  >
                                    <div className="row align-items-center">
                                      <div className="col-auto">
                                        <span className="avatar avatar-sm" style={{backgroundColor: chat.isLizaActive ? '#25D366' : '#6c757d'}}>
                                          {chat.customerName.charAt(0)}
                                        </span>
                                      </div>
                                      <div className="col">
                                        <div className="d-flex justify-content-between align-items-center">
                                          <div>
                                            <h4 className="mb-0">{chat.customerName}</h4>
                                            <div className="text-muted small">{chat.customerPhone}</div>
                                          </div>
                                          <div className="text-end">
                                            <div className="text-muted small">{new Date(chat.lastMessageTime).toLocaleTimeString('pt-BR', {hour: '2-digit', minute: '2-digit'})}</div>
                                            {chat.unreadCount > 0 && (
                                              <span className="badge bg-red">{chat.unreadCount}</span>
                                            )}
                                          </div>
                                        </div>
                                        <div className="mt-1">
                                          <div className="d-flex justify-content-between align-items-center">
                                            <div className="text-muted small text-truncate" style={{maxWidth: '300px'}}>
                                              {chat.lastMessage}
                                            </div>
                                            <div>
                                              <span className={`badge ${chat.isLizaActive ? 'bg-success' : 'bg-secondary'}-lt`}>
                                                {chat.isLizaActive ? 'Liza Ativa' : 'Manual'}
                                              </span>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-4">
                          {selectedChat ? (
                            <div className="card h-100">
                              <div className="card-header">
                                <div className="d-flex justify-content-between align-items-center">
                                  <h3 className="card-title">{selectedChat.customerName}</h3>
                                  <div className="btn-list">
                                    <button 
                                      className={`btn btn-sm ${selectedChat.isLizaActive ? 'btn-success' : 'btn-secondary'}`}
                                      onClick={() => handleToggleLizaForChat(selectedChat.id)}
                                    >
                                      {selectedChat.isLizaActive ? 'Liza On' : 'Liza Off'}
                                    </button>
                                  </div>
                                </div>
                              </div>
                              <div className="card-body" style={{height: '400px', overflowY: 'auto'}}>
                                <div className="chat-messages">
                                  {selectedChat.messages.map((message) => (
                                    <div key={message.id} className={`mb-3 ${message.sender === 'customer' ? 'text-end' : ''}`}>
                                      <div className={`d-inline-block p-2 rounded ${message.sender === 'customer' ? 'bg-primary text-white' : 'bg-light'}`}>
                                        {message.content}
                                      </div>
                                      <div className="text-muted small mt-1">
                                        {new Date(message.timestamp).toLocaleTimeString('pt-BR', {hour: '2-digit', minute: '2-digit'})}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              <div className="card-footer">
                                <div className="input-group">
                                  <input 
                                    type="text" 
                                    className="form-control" 
                                    placeholder="Digite sua mensagem..."
                                    onKeyPress={(e) => {
                                      if (e.key === 'Enter') {
                                        handleSendManualMessage(selectedChat.id, e.target.value);
                                        e.target.value = '';
                                      }
                                    }}
                                  />
                                  <button className="btn btn-primary" type="button">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                      <line x1="10" y1="14" x2="21" y2="3" />
                                      <path d="M21 3l-6.5 18a0.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a0.55 .55 0 0 1 0 -1l18 -6.5" />
                                    </svg>
                                  </button>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="card h-100">
                              <div className="card-body text-center d-flex align-items-center justify-content-center">
                                <div>
                                  <svg xmlns="http://www.w3.org/2000/svg" className="icon text-muted mb-3" width="48" height="48" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                    <path d="M3 21l1.65 -3.8a9 9 0 1 1 3.4 2.9l-5.2 .12" />
                                    <path d="M9 10a0.5 .5 0 0 0 1 0v-1a0.5 .5 0 0 0 -1 0v1a5 5 0 0 0 5 5h1a0.5 .5 0 0 0 0 -1h-1a0.5 .5 0 0 0 0 1" />
                                  </svg>
                                  <h4 className="text-muted">Selecione uma conversa</h4>
                                  <p className="text-muted">Clique em uma conversa para visualizar e interagir com o cliente</p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Aba Configurações */}
                  {activeTab === 'config' && (
                    <div>
                      <div className="row">
                        <div className="col-md-6">
                          <div className="card">
                            <div className="card-header">
                              <h3 className="card-title">Configurações do WhatsApp Business</h3>
                            </div>
                            <div className="card-body">
                              <div className="mb-3">
                                <label className="form-label">Número do WhatsApp</label>
                                <input 
                                  type="text" 
                                  className="form-control" 
                                  value={whatsappConfig.phoneNumber}
                                  onChange={(e) => setWhatsappConfig({...whatsappConfig, phoneNumber: e.target.value})}
                                  placeholder="5511999999999"
                                />
                                <div className="form-hint">Formato: Código do país + DDD + número</div>
                              </div>
                              <div className="mb-3">
                                <label className="form-label">Nome do Negócio</label>
                                <input 
                                  type="text" 
                                  className="form-control" 
                                  value={whatsappConfig.businessName}
                                  onChange={(e) => setWhatsappConfig({...whatsappConfig, businessName: e.target.value})}
                                  placeholder="Nome da sua empresa"
                                />
                              </div>
                              <div className="mb-3">
                                <label className="form-label">Mensagem de Boas-vindas</label>
                                <textarea 
                                  className="form-control" 
                                  rows="3"
                                  value={whatsappConfig.welcomeMessage}
                                  onChange={(e) => setWhatsappConfig({...whatsappConfig, welcomeMessage: e.target.value})}
                                  placeholder="Olá! Seja bem-vindo(a) à nossa loja!"
                                ></textarea>
                              </div>
                              <div className="mb-3">
                                <label className="form-check">
                                  <input 
                                    type="checkbox" 
                                    className="form-check-input" 
                                    checked={whatsappConfig.autoReplyEnabled}
                                    onChange={(e) => setWhatsappConfig({...whatsappConfig, autoReplyEnabled: e.target.checked})}
                                  />
                                  <span className="form-check-label">Ativar respostas automáticas</span>
                                </label>
                              </div>
                              <div className="mb-3">
                                <label className="form-check">
                                  <input 
                                    type="checkbox" 
                                    className="form-check-input" 
                                    checked={whatsappConfig.lizaIntegrationEnabled}
                                    onChange={(e) => setWhatsappConfig({...whatsappConfig, lizaIntegrationEnabled: e.target.checked})}
                                  />
                                  <span className="form-check-label">Integrar com Liza (IA)</span>
                                </label>
                              </div>
                              <button 
                                className="btn btn-primary" 
                                onClick={handleUpdateWhatsAppNumber}
                                disabled={loading}
                              >
                                {loading ? (
                                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                ) : null}
                                Salvar Configurações
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="card">
                            <div className="card-header">
                              <h3 className="card-title">Configurações da Liza</h3>
                            </div>
                            <div className="card-body">
                              <div className="mb-3">
                                <label className="form-label">Tempo de Resposta</label>
                                <select 
                                  className="form-select" 
                                  value={lizaConfig.responseTime}
                                  onChange={(e) => setLizaConfig({...lizaConfig, responseTime: e.target.value})}
                                >
                                  <option value="immediate">Imediato</option>
                                  <option value="5s">5 segundos</option>
                                  <option value="10s">10 segundos</option>
                                  <option value="30s">30 segundos</option>
                                </select>
                              </div>
                              <div className="mb-3">
                                <label className="form-label">Personalidade da IA</label>
                                <select 
                                  className="form-select" 
                                  value={lizaConfig.aiPersonality}
                                  onChange={(e) => setLizaConfig({...lizaConfig, aiPersonality: e.target.value})}
                                >
                                  <option value="friendly">Amigável</option>
                                  <option value="professional">Profissional</option>
                                  <option value="casual">Descontraído</option>
                                  <option value="formal">Formal</option>
                                </select>
                              </div>
                              <div className="mb-3">
                                <label className="form-label">Instruções Personalizadas</label>
                                <textarea 
                                  className="form-control" 
                                  rows="3"
                                  value={lizaConfig.customInstructions}
                                  onChange={(e) => setLizaConfig({...lizaConfig, customInstructions: e.target.value})}
                                  placeholder="Instruções específicas para a Liza..."
                                ></textarea>
                              </div>
                              <div className="mb-3">
                                <label className="form-label">Mensagem de Fallback</label>
                                <textarea 
                                  className="form-control" 
                                  rows="2"
                                  value={lizaConfig.fallbackMessage}
                                  onChange={(e) => setLizaConfig({...lizaConfig, fallbackMessage: e.target.value})}
                                  placeholder="Mensagem quando a Liza não entende..."
                                ></textarea>
                              </div>
                              <div className="mb-3">
                                <label className="form-check">
                                  <input 
                                    type="checkbox" 
                                    className="form-check-input" 
                                    checked={lizaConfig.learningMode}
                                    onChange={(e) => setLizaConfig({...lizaConfig, learningMode: e.target.checked})}
                                  />
                                  <span className="form-check-label">Modo de aprendizado ativo</span>
                                </label>
                              </div>
                              <button 
                                className="btn btn-success" 
                                onClick={handleUpdateLizaConfig}
                                disabled={loading}
                              >
                                {loading ? (
                                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                ) : null}
                                Atualizar Liza
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
          </div>
        </div>
      </div>

      {/* Modal de Campanha */}
      {showCampaignModal && (
        <div className="modal modal-blur fade show d-block" tabIndex="-1" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{selectedCampaign ? 'Editar Campanha' : 'Nova Campanha'}</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => {
                    setShowCampaignModal(false);
                    setSelectedCampaign(null);
                    setCampaignForm({
                      name: '',
                      message: '',
                      targetAudience: 'all',
                      scheduledDate: '',
                      scheduledTime: '',
                      status: 'draft'
                    });
                  }}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Nome da Campanha</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={campaignForm.name}
                    onChange={(e) => setCampaignForm({...campaignForm, name: e.target.value})}
                    placeholder="Ex: Promoção de Segunda-feira"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Mensagem</label>
                  <textarea 
                    className="form-control" 
                    rows="4"
                    value={campaignForm.message}
                    onChange={(e) => setCampaignForm({...campaignForm, message: e.target.value})}
                    placeholder="Digite sua mensagem..."
                  ></textarea>
                  <div className="form-hint">Máximo de 4096 caracteres</div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Público-alvo</label>
                      <select 
                        className="form-select" 
                        value={campaignForm.targetAudience}
                        onChange={(e) => setCampaignForm({...campaignForm, targetAudience: e.target.value})}
                      >
                        <option value="all">Todos os clientes</option>
                        <option value="vip">Clientes VIP</option>
                        <option value="birthday">Aniversariantes</option>
                        <option value="inactive">Clientes inativos</option>
                        <option value="new">Novos clientes</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Agendar para</label>
                      <input 
                        type="date" 
                        className="form-control" 
                        value={campaignForm.scheduledDate}
                        onChange={(e) => setCampaignForm({...campaignForm, scheduledDate: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
                {campaignForm.scheduledDate && (
                  <div className="mb-3">
                    <label className="form-label">Horário</label>
                    <input 
                      type="time" 
                      className="form-control" 
                      value={campaignForm.scheduledTime}
                      onChange={(e) => setCampaignForm({...campaignForm, scheduledTime: e.target.value})}
                    />
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn me-auto" 
                  onClick={() => {
                    setShowCampaignModal(false);
                    setSelectedCampaign(null);
                    setCampaignForm({
                      name: '',
                      message: '',
                      targetAudience: 'all',
                      scheduledDate: '',
                      scheduledTime: '',
                      status: 'draft'
                    });
                  }}
                >
                  Cancelar
                </button>
                <button 
                  type="button" 
                  className="btn btn-primary" 
                  onClick={handleCreateCampaign}
                  disabled={loading}
                >
                  {loading ? (
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  ) : null}
                  {selectedCampaign ? 'Atualizar' : 'Criar'} Campanha
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Template */}
      {showTemplateModal && (
        <div className="modal modal-blur fade show d-block" tabIndex="-1" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Novo Template</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => {
                    setShowTemplateModal(false);
                    setTemplateForm({
                      name: '',
                      category: 'marketing',
                      content: '',
                      variables: []
                    });
                  }}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Nome do Template</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={templateForm.name}
                    onChange={(e) => setTemplateForm({...templateForm, name: e.target.value})}
                    placeholder="Ex: Boas-vindas"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Categoria</label>
                  <select 
                    className="form-select" 
                    value={templateForm.category}
                    onChange={(e) => setTemplateForm({...templateForm, category: e.target.value})}
                  >
                    <option value="marketing">Marketing</option>
                    <option value="utility">Utilitário</option>
                    <option value="authentication">Autenticação</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Conteúdo</label>
                  <textarea 
                    className="form-control" 
                    rows="4"
                    value={templateForm.content}
                    onChange={(e) => setTemplateForm({...templateForm, content: e.target.value})}
                    placeholder="Use {{variavel}} para variáveis dinâmicas..."
                  ></textarea>
                  <div className="form-hint">
                    Use {'{{variavel}}'} para criar variáveis dinâmicas. Ex: Olá {'{{nome}}'}!
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn me-auto" 
                  onClick={() => {
                    setShowTemplateModal(false);
                    setTemplateForm({
                      name: '',
                      category: 'marketing',
                      content: '',
                      variables: []
                    });
                  }}
                >
                  Cancelar
                </button>
                <button 
                  type="button" 
                  className="btn btn-primary" 
                  onClick={handleCreateTemplate}
                  disabled={loading}
                >
                  {loading ? (
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  ) : null}
                  Criar Template
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Configuração da Liza */}
      {showLizaConfigModal && (
        <div className="modal modal-blur fade show d-block" tabIndex="-1" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Configurações Avançadas da Liza</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowLizaConfigModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Tópicos Suportados</label>
                      <div className="form-check mb-2">
                        <input 
                          type="checkbox" 
                          className="form-check-input" 
                          checked={lizaConfig.supportedTopics.includes('menu')}
                          onChange={(e) => {
                            const topics = e.target.checked 
                              ? [...lizaConfig.supportedTopics, 'menu']
                              : lizaConfig.supportedTopics.filter(t => t !== 'menu');
                            setLizaConfig({...lizaConfig, supportedTopics: topics});
                          }}
                        />
                        <span className="form-check-label">Cardápio e Produtos</span>
                      </div>
                      <div className="form-check mb-2">
                        <input 
                          type="checkbox" 
                          className="form-check-input" 
                          checked={lizaConfig.supportedTopics.includes('orders')}
                          onChange={(e) => {
                            const topics = e.target.checked 
                              ? [...lizaConfig.supportedTopics, 'orders']
                              : lizaConfig.supportedTopics.filter(t => t !== 'orders');
                            setLizaConfig({...lizaConfig, supportedTopics: topics});
                          }}
                        />
                        <span className="form-check-label">Pedidos e Entregas</span>
                      </div>
                      <div className="form-check mb-2">
                        <input 
                          type="checkbox" 
                          className="form-check-input" 
                          checked={lizaConfig.supportedTopics.includes('hours')}
                          onChange={(e) => {
                            const topics = e.target.checked 
                              ? [...lizaConfig.supportedTopics, 'hours']
                              : lizaConfig.supportedTopics.filter(t => t !== 'hours');
                            setLizaConfig({...lizaConfig, supportedTopics: topics});
                          }}
                        />
                        <span className="form-check-label">Horário de Funcionamento</span>
                      </div>
                      <div className="form-check mb-2">
                        <input 
                          type="checkbox" 
                          className="form-check-input" 
                          checked={lizaConfig.supportedTopics.includes('contact')}
                          onChange={(e) => {
                            const topics = e.target.checked 
                              ? [...lizaConfig.supportedTopics, 'contact']
                              : lizaConfig.supportedTopics.filter(t => t !== 'contact');
                            setLizaConfig({...lizaConfig, supportedTopics: topics});
                          }}
                        />
                        <span className="form-check-label">Informações de Contato</span>
                      </div>
                      <div className="form-check mb-2">
                        <input 
                          type="checkbox" 
                          className="form-check-input" 
                          checked={lizaConfig.supportedTopics.includes('promotions')}
                          onChange={(e) => {
                            const topics = e.target.checked 
                              ? [...lizaConfig.supportedTopics, 'promotions']
                              : lizaConfig.supportedTopics.filter(t => t !== 'promotions');
                            setLizaConfig({...lizaConfig, supportedTopics: topics});
                          }}
                        />
                        <span className="form-check-label">Promoções e Cupons</span>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Respostas Rápidas Personalizadas</label>
                      <textarea 
                        className="form-control" 
                        rows="6"
                        value={lizaConfig.customInstructions}
                        onChange={(e) => setLizaConfig({...lizaConfig, customInstructions: e.target.value})}
                        placeholder="Adicione instruções específicas para a Liza responder..."
                      ></textarea>
                      <div className="form-hint">
                        Ex: Sempre mencione nossos horários de atendimento, fale sobre promoções atuais, etc.
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Limite de Caracteres por Resposta</label>
                      <select className="form-select">
                        <option value="200">200 caracteres</option>
                        <option value="400">400 caracteres</option>
                        <option value="600">600 caracteres</option>
                        <option value="800">800 caracteres</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Tempo Máximo de Espera</label>
                      <select className="form-select">
                        <option value="5">5 minutos</option>
                        <option value="10">10 minutos</option>
                        <option value="15">15 minutos</option>
                        <option value="30">30 minutos</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn me-auto" 
                  onClick={() => setShowLizaConfigModal(false)}
                >
                  Cancelar
                </button>
                <button 
                  type="button" 
                  className="btn btn-success" 
                  onClick={() => {
                    handleUpdateLizaConfig();
                    setShowLizaConfigModal(false);
                  }}
                  disabled={loading}
                >
                  {loading ? (
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  ) : null}
                  Salvar Configurações
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WhatsAppCampaigns;