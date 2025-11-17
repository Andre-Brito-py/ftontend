import React, { useState, useEffect, useRef } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Serviço de demonstração da Liza - Retorna dados mockados
class LizaDemoService {
  constructor() {
    this.commandPatterns = {
      menu: /(?:cardápio|cardapio|menu|produtos|itens)/i,
      availability: /(?:disponível|disponivel|indisponível|indisponivel|ativar|desativar)/i,
      price: /(?:preço|preco|valor|custo|alterar.*preço|alterar.*preco)/i,
      orders: /(?:pedidos?|encomendas?)/i,
      report: /(?:relatório|relatorio|resumo|balanço|balanco)/i,
      add: /(?:adicionar|criar|novo)/i,
      remove: /(?:remover|excluir|deletar)/i,
      help: /(?:ajuda|help|comandos)/i
    };

    // Dados mockados para demonstração
    this.mockMenuItems = [
      { _id: '1', name: 'Pizza Margherita', price: 35.90, available: true, description: 'Pizza tradicional com molho de tomate, mussarela e manjericão' },
      { _id: '2', name: 'Hambúrguer Artesanal', price: 28.50, available: true, description: 'Hambúrguer com carne bovina premium, queijo, alface e tomate' },
      { _id: '3', name: 'Salada Caesar', price: 22.90, available: false, description: 'Salada fresca com alface, croutons e molho Caesar' },
      { _id: '4', name: 'Suco Natural', price: 8.90, available: true, description: 'Suco de frutas naturais, diversos sabores' },
      { _id: '5', name: 'Tiramisu', price: 18.90, available: true, description: 'Sobremesa italiana clássica com café e mascarpone' }
    ];

    this.mockOrders = [
      { _id: 'ord123', status: 'pending', amount: 45.80, createdAt: new Date(Date.now() - 3600000) },
      { _id: 'ord124', status: 'preparing', amount: 67.30, createdAt: new Date(Date.now() - 7200000) },
      { _id: 'ord125', status: 'ready', amount: 28.50, createdAt: new Date(Date.now() - 1800000) },
      { _id: 'ord126', status: 'delivered', amount: 89.90, createdAt: new Date(Date.now() - 10800000) }
    ];

    this.mockReport = {
      completedOrders: 12,
      pendingOrders: 3,
      totalRevenue: 456.80,
      averageTicket: 38.07,
      topProduct: 'Pizza Margherita'
    };
  }

  // Processar mensagem do usuário
  async processMessage(message) {
    try {
      // Detectar tipo de comando
      const commandType = this.detectCommand(message);
      
      // Processar comando específico
      if (commandType !== 'general') {
        const commandResult = await this.executeDemoCommand(commandType, message);
        if (commandResult.handled) {
          return commandResult;
        }
      }

      // Se não foi um comando específico, retornar resposta genérica de demonstração
      return this.getDemoResponse(message);

    } catch (error) {
      console.error('Erro no LizaDemoService:', error);
      return {
        success: false,
        response: 'Desculpe, ocorreu um erro interno na demonstração. Tente novamente.'
      };
    }
  }

  // Detectar tipo de comando na mensagem
  detectCommand(message) {
    const lowerMessage = message.toLowerCase();

    if (this.commandPatterns.help.test(lowerMessage)) {
      return 'help';
    }
    if (this.commandPatterns.report.test(lowerMessage)) {
      return 'report';
    }
    if (this.commandPatterns.orders.test(lowerMessage)) {
      return 'orders';
    }
    if (this.commandPatterns.availability.test(lowerMessage) && this.commandPatterns.menu.test(lowerMessage)) {
      return 'availability';
    }
    if (this.commandPatterns.price.test(lowerMessage)) {
      return 'price';
    }
    if (this.commandPatterns.add.test(lowerMessage) && this.commandPatterns.menu.test(lowerMessage)) {
      return 'add';
    }
    if (this.commandPatterns.remove.test(lowerMessage) && this.commandPatterns.menu.test(lowerMessage)) {
      return 'remove';
    }
    if (this.commandPatterns.menu.test(lowerMessage)) {
      return 'menu';
    }

    return 'general';
  }

  // Executar comando de demonstração
  async executeDemoCommand(commandType, message) {
    switch (commandType) {
      case 'help':
        return this.showDemoHelp();
      
      case 'menu':
        return this.handleDemoMenuCommand(message);
      
      case 'availability':
        return this.handleDemoAvailabilityCommand(message);
      
      case 'price':
        return this.handleDemoPriceCommand(message);
      
      case 'orders':
        return this.handleDemoOrdersCommand(message);
      
      case 'report':
        return this.handleDemoReportCommand(message);
      
      case 'add':
        return this.handleDemoAddCommand(message);
      
      case 'remove':
        return this.handleDemoRemoveCommand(message);
      
      default:
        return { handled: false };
    }
  }

  // Mostrar ajuda de demonstração
  showDemoHelp() {
    const helpText = `🤖 **Comandos da Liza (DEMO):**

` +
      `📋 **Cardápio:**
` +
      `• "consultar cardápio" - Ver produtos de demonstração
` +
      `• "disponibilizar [item]" - Marcar item como disponível (simulação)
` +
      `• "indisponibilizar [item]" - Marcar item como indisponível (simulação)
` +
      `• "alterar preço [item] [valor]" - Alterar preço (simulação)
` +
      `• "adicionar [item]" - Adicionar novo produto (simulação)
` +
      `• "remover [item]" - Remover produto (simulação)

` +
      `📦 **Pedidos:**
` +
      `• "pedidos em andamento" - Ver pedidos de demonstração
` +
      `• "todos os pedidos" - Ver todos os pedidos de demonstração

` +
      `📊 **Relatórios:**
` +
      `• "relatório do dia" - Resumo diário de demonstração
` +
      `• "resumo de hoje" - Estatísticas do dia (dados simulados)

` +
      `ℹ️ **Esta é uma demonstração com dados simulados**`;

    return {
      success: true,
      response: helpText,
      handled: true
    };
  }

  // Lidar com comandos do cardápio (demo)
  handleDemoMenuCommand(message) {
    try {
      if (this.mockMenuItems.length === 0) {
        return {
          success: true,
          response: '📋 Cardápio vazio. Nenhum produto cadastrado.',
          handled: true
        };
      }

      let response = `📋 **Cardápio Demonstração (${this.mockMenuItems.length} itens):**

`;
      this.mockMenuItems.forEach((item, index) => {
        const status = item.available !== false ? '✅' : '❌';
        response += `${index + 1}. ${status} **${item.name}** - R$ ${item.price?.toFixed(2) || '0.00'}
`;
        if (item.description) {
          response += `   _${item.description}_
`;
        }
        response += '\n';
      });

      response += `\nℹ️ **Dados de demonstração - não afetam o sistema real**`;

      return {
        success: true,
        response: response.trim(),
        handled: true,
        data: this.mockMenuItems
      };
    } catch (error) {
      return {
        success: false,
        response: '❌ Erro interno ao consultar cardápio de demonstração.',
        handled: true
      };
    }
  }

  // Lidar com comandos de disponibilidade (demo)
  handleDemoAvailabilityCommand(message) {
    try {
      const itemName = this.extractItemName(message);
      if (!itemName) {
        return {
          success: false,
          response: '❌ Por favor, especifique o nome do item. Ex: "disponibilizar Pizza Margherita"',
          handled: true
        };
      }

      // Simular busca de item
      const item = this.mockMenuItems.find(item => 
        item.name.toLowerCase().includes(itemName.toLowerCase())
      );

      if (!item) {
        return {
          success: false,
          response: `❌ Item "${itemName}" não encontrado no cardápio de demonstração.`,
          handled: true
        };
      }

      const makeAvailable = /(?:disponível|disponivel|ativar)/i.test(message);
      
      // Simular atualização
      item.available = makeAvailable;
      const status = makeAvailable ? 'disponibilizado' : 'indisponibilizado';
      
      return {
        success: true,
        response: `✅ **${item.name}** foi ${status} com sucesso! *(Demonstração)*`,
        handled: true
      };
    } catch (error) {
      return {
        success: false,
        response: '❌ Erro interno ao alterar disponibilidade.',
        handled: true
      };
    }
  }

  // Lidar com comandos de preço (demo)
  handleDemoPriceCommand(message) {
    try {
      const itemName = this.extractItemName(message);
      const newPrice = this.extractPrice(message);
      
      if (!itemName || !newPrice) {
        return {
          success: false,
          response: '❌ Por favor, especifique o item e o novo preço. Ex: "alterar preço Pizza Margherita 25.90"',
          handled: true
        };
      }

      // Simular busca de item
      const item = this.mockMenuItems.find(item => 
        item.name.toLowerCase().includes(itemName.toLowerCase())
      );

      if (!item) {
        return {
          success: false,
          response: `❌ Item "${itemName}" não encontrado no cardápio de demonstração.`,
          handled: true
        };
      }

      // Simular atualização de preço
      const oldPrice = item.price;
      item.price = newPrice;
      
      return {
        success: true,
        response: `✅ Preço de **${item.name}** alterado de R$ ${oldPrice.toFixed(2)} para **R$ ${newPrice.toFixed(2)}**! *(Demonstração)*`,
        handled: true
      };
    } catch (error) {
      return {
        success: false,
        response: '❌ Erro interno ao alterar preço.',
        handled: true
      };
    }
  }

  // Lidar com comandos de pedidos (demo)
  handleDemoOrdersCommand(message) {
    try {
      const isActiveOnly = /(?:andamento|ativo|pendente)/i.test(message);
      
      if (this.mockOrders.length === 0) {
        const message = isActiveOnly ? 'Nenhum pedido em andamento.' : 'Nenhum pedido encontrado.';
        return {
          success: true,
          response: `📦 ${message}`,
          handled: true
        };
      }

      const filteredOrders = isActiveOnly 
        ? this.mockOrders.filter(order => order.status !== 'delivered')
        : this.mockOrders;

      const title = isActiveOnly ? 'Pedidos em Andamento (Demo)' : 'Todos os Pedidos (Demo)';
      let response = `📦 **${title} (${filteredOrders.length}):**\n\n`;
      
      filteredOrders.forEach((order, index) => {
        const statusEmoji = this.getStatusEmoji(order.status);
        const total = order.amount || 0;
        response += `${index + 1}. ${statusEmoji} **Pedido #${order._id?.slice(-6) || 'N/A'}**\n`;
        response += `   💰 R$ ${total.toFixed(2)} | 📅 ${new Date(order.createdAt).toLocaleString('pt-BR')}\n\n`;
      });

      response += `\nℹ️ **Dados de demonstração - não afetam pedidos reais**`;

      return {
        success: true,
        response: response.trim(),
        handled: true,
        data: filteredOrders
      };
    } catch (error) {
      return {
        success: false,
        response: '❌ Erro interno ao consultar pedidos de demonstração.',
        handled: true
      };
    }
  }

  // Lidar com comandos de relatório (demo)
  handleDemoReportCommand(message) {
    try {
      const response = `📊 **Relatório do Dia - Demonstração - ${new Date().toLocaleDateString('pt-BR')}**\n\n` +
        `🛍️ **Pedidos Concluídos:** ${this.mockReport.completedOrders}\n` +
        `⏳ **Pedidos Pendentes:** ${this.mockReport.pendingOrders}\n` +
        `💰 **Faturamento:** R$ ${this.mockReport.totalRevenue?.toFixed(2) || '0.00'}\n` +
        `🎯 **Ticket Médio:** R$ ${this.mockReport.averageTicket?.toFixed(2) || '0.00'}\n` +
        `🏆 **Mais Vendido:** ${this.mockReport.topProduct || 'N/A'}\n\n` +
        `📈 **Status:** ${this.mockReport.completedOrders > 0 ? 'Ativo' : 'Sem vendas hoje'}\n\n` +
        `ℹ️ **Este é um relatório de demonstração com dados simulados**`;

      return {
        success: true,
        response: response,
        handled: true,
        data: this.mockReport
      };
    } catch (error) {
      return {
        success: false,
        response: '❌ Erro interno ao gerar relatório de demonstração.',
        handled: true
      };
    }
  }

  // Comandos de adicionar (demo)
  handleDemoAddCommand(message) {
    return {
      success: true,
      response: '➕ Para adicionar itens reais, use o painel "Adicionar Item" no menu lateral. *(Esta é uma demonstração)*',
      handled: true
    };
  }

  // Comandos de remover (demo)
  handleDemoRemoveCommand(message) {
    return {
      success: true,
      response: '🗑️ Para remover itens reais, use o painel "Lista de Itens" no menu lateral. *(Esta é uma demonstração)*',
      handled: true
    };
  }

  // Obter resposta genérica de demonstração
  getDemoResponse(message) {
    const demoResponses = [
      `🤖 **Liza Demo:** Entendi sua mensagem: "${message}". Como assistente de demonstração, posso ajudar com comandos específicos como:\n\n` +
      `• "consultar cardápio" - Ver produtos demo\n` +
      `• "pedidos em andamento" - Ver pedidos demo\n` +
      `• "relatório do dia" - Ver relatório demo\n` +
      `• "ajuda" - Ver todos os comandos`,
      
      `🤖 **Liza Demo:** Obrigado pela sua mensagem! Esta é uma versão de demonstração.\n\n` +
      `Tente comandos como:\n` +
      `• "consultar cardápio"\n` +
      `• "pedidos em andamento"\n` +
      `• "relatório do dia"`,
      
      `🤖 **Liza Demo:** Estou aqui para demonstrar as funcionalidades!\n\n` +
      `Comandos disponíveis:\n` +
      `• "consultar cardápio" - Ver produtos\n` +
      `• "pedidos em andamento" - Ver pedidos\n` +
      `• "relatório do dia" - Ver relatório`
    ];

    const randomResponse = demoResponses[Math.floor(Math.random() * demoResponses.length)];
    
    return {
      success: true,
      response: randomResponse,
      handled: true
    };
  }

  // Utilitários
  extractItemName(message) {
    const cleaned = message
      .replace(/(?:disponível|disponivel|indisponível|indisponivel|ativar|desativar|alterar|preço|preco)/gi, '')
      .trim();
    
    return cleaned || null;
  }

  extractPrice(message) {
    const priceMatch = message.match(/(?:R\$\s*)?([0-9]+(?:[.,][0-9]{1,2})?)/i);
    if (priceMatch) {
      return parseFloat(priceMatch[1].replace(',', '.'));
    }
    return null;
  }

  getStatusEmoji(status) {
    const statusMap = {
      'pending': '⏳',
      'preparing': '👨‍🍳',
      'ready': '✅',
      'delivered': '🚚',
      'completed': '✅',
      'cancelled': '❌'
    };
    return statusMap[status] || '📦';
  }
}

const lizaDemoService = new LizaDemoService();

const LizaDemoChat = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Olá! Eu sou a Liza Demo, sua assistente virtual de demonstração. Como posso ajudar você hoje?\n\n💡 **Dica:** Tente comandos como 'consultar cardápio', 'pedidos em andamento' ou 'relatório do dia' para ver a funcionalidade em ação!",
      sender: 'liza',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: "smooth",
        block: "end",
        inline: "nearest"
      });
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      scrollToBottom();
    }, 100);
    
    return () => clearTimeout(timer);
  }, [messages]);

  const sendMessageToDemoAI = async (messageText) => {
    try {
      const result = await lizaDemoService.processMessage(messageText);
      
      return {
        text: result.response,
        sender: 'liza',
        timestamp: new Date(),
        type: result.success ? 'text' : 'error',
        data: result.data || null
      };
    } catch (error) {
      console.error('Erro ao enviar mensagem para Liza Demo:', error);
      return {
        text: 'Desculpe, estou com dificuldades técnicas na demonstração. Tente novamente.',
        sender: 'liza',
        timestamp: new Date(),
        type: 'error'
      };
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    
    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    const messageText = inputMessage;
    setInputMessage('');
    setIsLoading(true);
    
    try {
      const aiResponse = await sendMessageToDemoAI(messageText);
      
      // Mostrar toast para ações bem-sucedidas
      if (aiResponse.type === 'text' && aiResponse.text.includes('✅')) {
        toast.success('Ação de demonstração realizada com sucesso!');
      } else if (aiResponse.type === 'error') {
        toast.error('Erro na demonstração');
      }
      
      const lizaMessage = {
        id: Date.now() + 1,
        text: aiResponse.text,
        sender: 'liza',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, lizaMessage]);
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      const errorResponse = {
        id: Date.now() + 1,
        text: 'Desculpe, ocorreu um erro na demonstração. Tente novamente.',
        sender: 'liza',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorResponse]);
      toast.error('Erro de comunicação na demonstração');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatMessage = (text) => {
    if (!text) {
      return '';
    }
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br/>');
  };

  const requestDemoReport = async () => {
    const reportMessage = {
      id: Date.now(),
      text: "Liza, resumo de hoje",
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, reportMessage]);
    setIsLoading(true);
    
    const aiResponse = await sendMessageToDemoAI("relatório do dia");
    
    const lizaMessage = {
      id: Date.now() + 1,
      text: aiResponse.text,
      sender: 'liza',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, lizaMessage]);
    setIsLoading(false);
  };

  return (
    <div className="liza-demo-container">
      <style jsx>{`
        .liza-demo-container {
          display: flex;
          flex-direction: column;
          height: calc(100vh - 200px);
          max-width: 1200px;
          margin: 0 auto;
          background: #f8fafc;
          border-radius: 12px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }

        .liza-demo-header {
          display: flex;
          align-items: center;
          padding: 20px;
          background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
          color: white;
          gap: 15px;
        }

        .liza-demo-avatar {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          backdrop-filter: blur(10px);
        }

        .liza-demo-info {
          flex: 1;
        }

        .liza-demo-info h3 {
          margin: 0;
          font-size: 20px;
          font-weight: 600;
        }

        .liza-demo-info p {
          margin: 5px 0 0 0;
          opacity: 0.9;
          font-size: 14px;
        }

        .demo-report-btn {
          background: rgba(255, 255, 255, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.3);
          color: white;
          padding: 8px 16px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.2s ease;
          backdrop-filter: blur(10px);
        }

        .demo-report-btn:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: translateY(-1px);
        }

        .liza-demo-messages {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
          background: #ffffff;
        }

        .message {
          display: flex;
          margin-bottom: 16px;
          animation: slideIn 0.3s ease;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .user-message {
          justify-content: flex-end;
        }

        .liza-message {
          justify-content: flex-start;
        }

        .message-content {
          max-width: 70%;
          padding: 12px 16px;
          border-radius: 12px;
          position: relative;
        }

        .user-message .message-content {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-bottom-right-radius: 4px;
        }

        .liza-message .message-content {
          background: #f1f5f9;
          color: #1e293b;
          border-bottom-left-radius: 4px;
        }

        .message-text {
          font-size: 14px;
          line-height: 1.4;
          margin-bottom: 4px;
        }

        .message-time {
          font-size: 11px;
          opacity: 0.7;
          text-align: right;
        }

        .typing-indicator {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 8px 0;
        }

        .typing-indicator span {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #94a3b8;
          animation: typing 1.4s infinite;
        }

        .typing-indicator span:nth-child(2) {
          animation-delay: 0.2s;
        }

        .typing-indicator span:nth-child(3) {
          animation-delay: 0.4s;
        }

        @keyframes typing {
          0%, 60%, 100% {
            transform: translateY(0);
          }
          30% {
            transform: translateY(-10px);
          }
        }

        .liza-demo-input {
          padding: 20px;
          background: #ffffff;
          border-top: 1px solid #e2e8f0;
        }

        .quick-actions {
          display: flex;
          gap: 8px;
          margin-bottom: 16px;
          flex-wrap: wrap;
        }

        .quick-btn {
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
          color: #475569;
          padding: 8px 12px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 12px;
          font-weight: 500;
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        .quick-btn:hover {
          background: #e2e8f0;
          transform: translateY(-1px);
        }

        .demo-notice {
          background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
          color: white;
          padding: 12px 16px;
          border-radius: 8px;
          margin-bottom: 16px;
          text-align: center;
          font-size: 13px;
          font-weight: 500;
          box-shadow: 0 2px 4px rgba(245, 158, 11, 0.2);
        }

        .demo-notice p {
          margin: 0;
          line-height: 1.4;
        }

        .input-area {
          display: flex;
          gap: 12px;
          align-items: flex-end;
        }

        .input-area textarea {
          flex: 1;
          padding: 12px 16px;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          resize: none;
          font-family: inherit;
          font-size: 14px;
          line-height: 1.4;
          transition: border-color 0.2s ease;
          outline: none;
        }

        .input-area textarea:focus {
          border-color: #f59e0b;
        }

        .input-area textarea:disabled {
          background: #f8fafc;
          cursor: not-allowed;
        }

        .send-btn {
          background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
          border: none;
          color: white;
          padding: 12px 16px;
          border-radius: 12px;
          cursor: pointer;
          font-size: 16px;
          transition: all 0.2s ease;
          min-width: 50px;
          height: 46px;
        }

        .send-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(245, 158, 11, 0.3);
        }

        .send-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }

        /* Responsividade */
        @media (max-width: 768px) {
          .liza-demo-container {
            height: calc(100vh - 150px);
            margin: 10px;
          }
          
          .liza-demo-header {
            padding: 15px;
          }
          
          .liza-demo-info h3 {
            font-size: 18px;
          }
          
          .message-content {
            max-width: 85%;
          }
          
          .liza-demo-messages {
            padding: 15px;
          }
          
          .liza-demo-input {
            padding: 15px;
          }
          
          .quick-actions {
            gap: 6px;
          }
          
          .quick-btn {
            font-size: 11px;
            padding: 6px 10px;
          }
        }

        @media (max-width: 480px) {
          .liza-demo-header {
            flex-direction: column;
            text-align: center;
            gap: 10px;
          }
          
          .demo-report-btn {
            align-self: stretch;
          }
          
          .input-area {
            flex-direction: column;
            gap: 8px;
          }
          
          .send-btn {
            align-self: flex-end;
            min-width: 80px;
          }
        }
      `}</style>
      
      <div className="liza-demo-header">
        <div className="liza-demo-avatar">
          <span>🤖</span>
        </div>
        <div className="liza-demo-info">
          <h3>Liza Demo - Assistente Virtual</h3>
          <p>Versão de demonstração com dados simulados</p>
        </div>
        <button 
          className="demo-report-btn"
          onClick={requestDemoReport}
          title="Solicitar Resumo Diário de Demonstração"
        >
          📊 Demo Resumo
        </button>
      </div>
      
      <div className="liza-demo-messages">
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`message ${message.sender === 'user' ? 'user-message' : 'liza-message'}`}
          >
            <div className="message-content">
              <div 
                className="message-text"
                dangerouslySetInnerHTML={{ __html: formatMessage(message.text) }}
              />
              <div className="message-time">
                {message.timestamp.toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="message liza-message">
            <div className="message-content">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <div className="liza-demo-input">
        <div className="quick-actions">
          <button onClick={() => setInputMessage("consultar cardápio")} className="quick-btn">
            📋 Demo Cardápio
          </button>
          <button onClick={() => setInputMessage("pedidos em andamento")} className="quick-btn">
            📦 Demo Pedidos
          </button>
          <button onClick={() => setInputMessage("relatório do dia")} className="quick-btn">
            📊 Demo Relatório
          </button>
          <button onClick={() => setInputMessage("Ajuda")} className="quick-btn">
            ❓ Demo Ajuda
          </button>
        </div>
        
        <div className="demo-notice">
          <p>ℹ️ <strong>Modo Demonstração:</strong> Dados simulados para teste e apresentação</p>
        </div>
        
        <div className="input-area">
          <textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Digite sua mensagem para a Liza Demo..."
            rows="2"
            disabled={isLoading}
          />
          <button 
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading}
            className="send-btn"
          >
            📤
          </button>
        </div>
      </div>
      
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default LizaDemoChat;