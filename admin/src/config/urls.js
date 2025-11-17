// Configuração centralizada de URLs para evitar hardcoding
// Este arquivo deve ser atualizado quando as portas mudarem

const URLS = {
  // URLs de desenvolvimento (preferem .env quando disponível)
  FRONTEND_URL: import.meta.env?.VITE_FRONTEND_URL || 'http://localhost:5175', // Cliente/garçom
  ADMIN_URL: import.meta.env?.VITE_ADMIN_URL || 'http://localhost:5173',       // Painel admin
  BACKEND_URL: import.meta.env?.VITE_BACKEND_URL || '',  // Backend API via proxy em desenvolvimento (default '')
  COUNTER_URL: import.meta.env?.VITE_COUNTER_URL || 'http://localhost:5174',   // Sistema de balcão
  
  // URLs de produção (para quando a aplicação for para produção)
  PRODUCTION: {
    FRONTEND_URL: import.meta.env?.VITE_FRONTEND_URL || 'https://your-frontend-domain.com',
    ADMIN_URL: import.meta.env?.VITE_ADMIN_URL || 'https://your-admin-domain.com',
    BACKEND_URL: import.meta.env?.VITE_BACKEND_URL || 'https://your-backend-domain.com'
  }
};

// Função para obter a URL correta baseada no ambiente
export const getUrls = () => {
  const isProduction = import.meta.env?.MODE === 'production';
  return isProduction ? URLS.PRODUCTION : URLS;
};

// Exportar URLs individuais para facilitar o uso
export const { FRONTEND_URL, ADMIN_URL, BACKEND_URL, COUNTER_URL } = getUrls();

export default URLS;