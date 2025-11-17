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

export default new LizaDemoService();