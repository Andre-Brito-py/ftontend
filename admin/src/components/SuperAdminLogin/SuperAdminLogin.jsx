import React, { useState } from 'react';
import './SuperAdminLogin.css';
import axios from 'axios';
import { toast } from 'react-toastify';

const SuperAdminLogin = ({ url, setToken, setSuperAdmin }) => {
  const [data, setData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData(data => ({ ...data, [name]: value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    
    try {
      const endpoint = isRegister ? '/api/system/super-admin/create' : '/api/system/super-admin/login';

      // Tentar chamada direta ao backend; em caso de erro de rede em dev, usar proxy do Vite como fallback
      let response;
      try {
        console.log('[SuperAdminLogin] POST absolute URL:', `${url}${endpoint}`);
        response = await axios.post(`${url}${endpoint}`, data, { timeout: 10000 });
      } catch (err) {
        const isNetworkError = !err.response;
        const isDev = !!import.meta.env?.DEV;
        // Fallback para proxy do Vite em ambiente de desenvolvimento
        if (isNetworkError && isDev) {
          console.warn('[SuperAdminLogin] Network error, trying proxy fallback:', endpoint);
          response = await axios.post(endpoint, data, { timeout: 10000 });
        } else {
          throw err;
        }
      }
      
      if (response.data.success) {
        setToken(response.data.token);
        setSuperAdmin(true);
        localStorage.setItem('superAdminToken', response.data.token);
        localStorage.setItem('userRole', 'super_admin');
        toast.success(isRegister ? 'Super Admin criado com sucesso!' : 'Login realizado com sucesso!');
      } else {
        toast.error(response.data.message || 'Erro na operação');
      }
    } catch (error) {
      console.error('Erro na operação:', error);
      const backendMessage = error.response?.data?.message;
      if (backendMessage) {
        toast.error(backendMessage);
      } else {
        toast.error('Erro ao conectar com o servidor');
      }
      if (error.response?.status === 400 && isRegister) {
        toast.error('Super Admin já existe. Faça login.');
        try {
          setIsRegister(false);
        } catch (setError) {
          console.error('Erro ao alterar modo:', setError);
        }
      } else {
        // Mantém uma mensagem genérica para erros de rede sem detalhes
        toast.error('Erro de conexão. Verifique se o servidor está rodando.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='super-admin-login-container'>
      <div className='super-admin-login-form'>
        <h2>{isRegister ? 'Criar Super Admin' : 'Super Admin Login'}</h2>
        <form onSubmit={onSubmit}>
          {isRegister && (
            <div className='form-group'>
              <label>Nome:</label>
              <input
                name='name'
                onChange={onChangeHandler}
                value={data.name}
                type='text'
                placeholder='Digite seu nome completo'
                required
              />
            </div>
          )}
          
          <div className='form-group'>
            <label>Email:</label>
            <input
              name='email'
              onChange={onChangeHandler}
              value={data.email}
              type='email'
              placeholder='Digite seu email'
              required
            />
          </div>
          
          <div className='form-group'>
            <label>Senha:</label>
            <div className='password-input-group'>
              <input
                name='password'
                onChange={onChangeHandler}
                value={data.password}
                type={showPassword ? 'text' : 'password'}
                placeholder='Digite sua senha'
                required
              />
              <button 
                type="button" 
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
                title={showPassword ? "Ocultar senha" : "Mostrar senha"}
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
          </div>
          
          <button type='submit' disabled={loading}>
            {loading ? 'Processando...' : (isRegister ? 'Criar Super Admin' : 'Entrar')}
          </button>
        </form>
        
        <div className='toggle-mode'>
          <button 
            type='button' 
            onClick={() => {
              setIsRegister(!isRegister);
              setData({ name: '', email: '', password: '' });
            }}
            className='toggle-button'
          >
            {isRegister ? 'Já tem conta? Fazer login' : 'Criar primeiro Super Admin'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminLogin;