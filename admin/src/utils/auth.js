// Utilitários simples para gerenciar tokens JWT no frontend

export const isValidJwt = (token) => {
  if (!token || typeof token !== 'string') return false;
  const parts = token.split('.');
  return parts.length === 3 && parts.every(p => p.length > 0);
};

export const getSuperAdminToken = () => {
  const token = typeof window !== 'undefined'
    ? window.localStorage.getItem('superAdminToken')
    : null;
  return isValidJwt(token) ? token : null;
};

export const getAdminToken = () => {
  const token = typeof window !== 'undefined'
    ? window.localStorage.getItem('token')
    : null;
  return isValidJwt(token) ? token : null;
};

export const clearAuth = () => {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem('superAdminToken');
  window.localStorage.removeItem('token');
  window.localStorage.removeItem('userRole');
  window.localStorage.removeItem('storeId');
  window.localStorage.removeItem('storeName');
};