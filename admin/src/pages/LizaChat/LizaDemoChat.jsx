import React, { useState, useEffect, useRef } from 'react';
import './LizaChat.css';
import lizaDemoService from '../../services/lizaDemoService.js';
import { toast } from 'react-toastify';

const LizaDemoChat = ({ url, token }) => {
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
    // Adicionar um pequeno delay para garantir que o DOM foi atualizado
    const timer = setTimeout(() => {
      scrollToBottom();
    }, 100);
    
    return () => clearTimeout(timer);
  }, [messages]);

  // Função para enviar mensagem para a Liza Demo
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
      // Enviar para Liza Demo
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
    // Verificar se text é null ou undefined
    if (!text) {
      return '';
    }
    // Converter markdown básico para HTML
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
    <div className="liza-chat-container">
      <div className="liza-chat-header">
        <div className="liza-avatar">
          <span>🤖</span>
        </div>
        <div className="liza-info">
          <h3>Liza Demo - Assistente Virtual</h3>
          <p>Versão de demonstração com dados simulados</p>
        </div>
        <button 
          className="daily-report-btn"
          onClick={requestDemoReport}
          title="Solicitar Resumo Diário de Demonstração"
        >
          📊 Demo Resumo
        </button>
      </div>
      
      <div className="liza-chat-messages">
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
      
      <div className="liza-chat-input">
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
    </div>
  );
};

export default LizaDemoChat;