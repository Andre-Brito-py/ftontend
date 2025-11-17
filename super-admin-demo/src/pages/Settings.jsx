import React, { useEffect, useMemo, useRef, useState } from 'react'
import { IconSun, IconMoon, IconBell, IconShield, IconDatabase, IconPalette, IconLanguage, IconClock, IconMail, IconPhone, IconMapPin, IconBuilding, IconUser, IconKey, IconRefresh, IconCheck, IconX } from '@tabler/icons-react'

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general')
  const [settings, setSettings] = useState({
    // Configurações Gerais
    companyName: 'Super Admin Demo',
    companyEmail: 'admin@demo.com',
    companyPhone: '+55 (11) 99999-9999',
    companyAddress: 'São Paulo, SP, Brasil',
    timezone: 'America/Sao_Paulo',
    language: 'pt-BR',
    dateFormat: 'DD/MM/YYYY',
    
    // Preferências de Tema
    theme: 'auto',
    primaryColor: '#066fd1',
    
    // Notificações
    emailNotifications: true,
    pushNotifications: false,
    smsNotifications: false,
    notificationSound: true,
    
    // Segurança
    twoFactorAuth: false,
    sessionTimeout: 30,
    passwordExpiry: 90,
    loginAttempts: 5,
    
    // API e Integrações
    apiRateLimit: 1000,
    apiKeyExpiry: 365,
    webhookUrl: '',
    
    // Backup e Manutenção
    autoBackup: true,
    backupFrequency: 'daily',
    backupRetention: 30,
    maintenanceMode: false
  })
  
  const [originalSettings, setOriginalSettings] = useState(settings)
  const [hasChanges, setHasChanges] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')
  const [isDarkMode, setIsDarkMode] = useState(false)

  // Detectar modo claro/escuro
  useEffect(() => {
    const checkDarkMode = () => {
      const htmlElement = document.documentElement
      setIsDarkMode(htmlElement.classList.contains('dark') || 
                   htmlElement.getAttribute('data-bs-theme') === 'dark')
    }

    checkDarkMode()
    const observer = new MutationObserver(checkDarkMode)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class', 'data-bs-theme']
    })
    return () => observer.disconnect()
  }, [])

  // Detectar mudanças
  useEffect(() => {
    const changed = JSON.stringify(settings) !== JSON.stringify(originalSettings)
    setHasChanges(changed)
  }, [settings, originalSettings])

  const handleInputChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // Simular salvamento
      await new Promise(resolve => setTimeout(resolve, 1000))
      setOriginalSettings(settings)
      setSaveMessage('Configurações salvas com sucesso!')
      setTimeout(() => setSaveMessage(''), 3000)
    } catch (error) {
      setSaveMessage('Erro ao salvar configurações')
      setTimeout(() => setSaveMessage(''), 3000)
    } finally {
      setIsSaving(false)
    }
  }

  const handleReset = () => {
    setSettings(originalSettings)
    setSaveMessage('Alterações descartadas')
    setTimeout(() => setSaveMessage(''), 3000)
  }

  const tabs = [
    { id: 'general', label: 'Geral', icon: <IconBuilding size={18} /> },
    { id: 'appearance', label: 'Aparência', icon: <IconPalette size={18} /> },
    { id: 'notifications', label: 'Notificações', icon: <IconBell size={18} /> },
    { id: 'security', label: 'Segurança', icon: <IconShield size={18} /> },
    { id: 'api', label: 'API & Integrações', icon: <IconKey size={18} /> },
    { id: 'backup', label: 'Backup & Manutenção', icon: <IconDatabase size={18} /> }
  ]

  const timezones = [
    { value: 'America/Sao_Paulo', label: 'São Paulo (BRT)' },
    { value: 'America/New_York', label: 'Nova York (EST)' },
    { value: 'America/Los_Angeles', label: 'Los Angeles (PST)' },
    { value: 'Europe/London', label: 'Londres (GMT)' },
    { value: 'Europe/Paris', label: 'Paris (CET)' },
    { value: 'Asia/Tokyo', label: 'Tóquio (JST)' },
    { value: 'Asia/Shanghai', label: 'Xangai (CST)' },
    { value: 'Australia/Sydney', label: 'Sydney (AEDT)' }
  ]

  const languages = [
    { value: 'pt-BR', label: 'Português (Brasil)' },
    { value: 'en-US', label: 'English (US)' },
    { value: 'es-ES', label: 'Español' },
    { value: 'fr-FR', label: 'Français' },
    { value: 'de-DE', label: 'Deutsch' },
    { value: 'it-IT', label: 'Italiano' },
    { value: 'ja-JP', label: '日本語' },
    { value: 'zh-CN', label: '中文' }
  ]

  const dateFormats = [
    { value: 'DD/MM/YYYY', label: '31/12/2024' },
    { value: 'MM/DD/YYYY', label: '12/31/2024' },
    { value: 'YYYY-MM-DD', label: '2024-12-31' },
    { value: 'DD-MM-YYYY', label: '31-12-2024' }
  ]

  const renderGeneralTab = () => (
    <div className="row g-3">
      <div className="col-md-6">
        <div className="mb-3">
          <label className="form-label">Nome da Empresa</label>
          <input
            type="text"
            className="form-control"
            value={settings.companyName}
            onChange={(e) => handleInputChange('companyName', e.target.value)}
            placeholder="Digite o nome da empresa"
          />
        </div>
      </div>
      <div className="col-md-6">
        <div className="mb-3">
          <label className="form-label">Email da Empresa</label>
          <input
            type="email"
            className="form-control"
            value={settings.companyEmail}
            onChange={(e) => handleInputChange('companyEmail', e.target.value)}
            placeholder="email@empresa.com"
          />
        </div>
      </div>
      <div className="col-md-6">
        <div className="mb-3">
          <label className="form-label">Telefone</label>
          <input
            type="tel"
            className="form-control"
            value={settings.companyPhone}
            onChange={(e) => handleInputChange('companyPhone', e.target.value)}
            placeholder="+55 (11) 99999-9999"
          />
        </div>
      </div>
      <div className="col-md-6">
        <div className="mb-3">
          <label className="form-label">Endereço</label>
          <input
            type="text"
            className="form-control"
            value={settings.companyAddress}
            onChange={(e) => handleInputChange('companyAddress', e.target.value)}
            placeholder="Cidade, Estado, País"
          />
        </div>
      </div>
      <div className="col-md-6">
        <div className="mb-3">
          <label className="form-label">Fuso Horário</label>
          <select
            className="form-select"
            value={settings.timezone}
            onChange={(e) => handleInputChange('timezone', e.target.value)}
          >
            {timezones.map(tz => (
              <option key={tz.value} value={tz.value}>{tz.label}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="col-md-6">
        <div className="mb-3">
          <label className="form-label">Idioma</label>
          <select
            className="form-select"
            value={settings.language}
            onChange={(e) => handleInputChange('language', e.target.value)}
          >
            {languages.map(lang => (
              <option key={lang.value} value={lang.value}>{lang.label}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="col-md-6">
        <div className="mb-3">
          <label className="form-label">Formato de Data</label>
          <select
            className="form-select"
            value={settings.dateFormat}
            onChange={(e) => handleInputChange('dateFormat', e.target.value)}
          >
            {dateFormats.map(format => (
              <option key={format.value} value={format.value}>{format.label}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )

  const renderAppearanceTab = () => (
    <div className="row g-3">
      <div className="col-md-6">
        <div className="mb-3">
          <label className="form-label">Tema</label>
          <div className="btn-group w-100" role="group">
            <input
              type="radio"
              className="btn-check"
              name="theme"
              id="theme-auto"
              checked={settings.theme === 'auto'}
              onChange={() => handleInputChange('theme', 'auto')}
            />
            <label className="btn btn-outline-primary" htmlFor="theme-auto">
              <IconSun size={16} className="me-1" /> Automático
            </label>
            <input
              type="radio"
              className="btn-check"
              name="theme"
              id="theme-light"
              checked={settings.theme === 'light'}
              onChange={() => handleInputChange('theme', 'light')}
            />
            <label className="btn btn-outline-primary" htmlFor="theme-light">
              <IconSun size={16} className="me-1" /> Claro
            </label>
            <input
              type="radio"
              className="btn-check"
              name="theme"
              id="theme-dark"
              checked={settings.theme === 'dark'}
              onChange={() => handleInputChange('theme', 'dark')}
            />
            <label className="btn btn-outline-primary" htmlFor="theme-dark">
              <IconMoon size={16} className="me-1" /> Escuro
            </label>
          </div>
        </div>
      </div>
      <div className="col-md-6">
        <div className="mb-3">
          <label className="form-label">Cor Primária</label>
          <div className="d-flex align-items-center gap-2">
            <input
              type="color"
              className="form-control form-control-color"
              value={settings.primaryColor}
              onChange={(e) => handleInputChange('primaryColor', e.target.value)}
              title="Escolha a cor primária"
            />
            <input
              type="text"
              className="form-control"
              value={settings.primaryColor}
              onChange={(e) => handleInputChange('primaryColor', e.target.value)}
              placeholder="#066fd1"
              style={{ maxWidth: '100px' }}
            />
          </div>
        </div>
      </div>
      <div className="col-12">
        <div className="alert alert-info">
          <div className="d-flex align-items-center">
            <IconPalette size={20} className="me-2" />
            <div>
              <strong>Modo atual:</strong> {isDarkMode ? 'Escuro' : 'Claro'}
              <br />
              <small className="text-muted">As cores serão aplicadas automaticamente com base no tema do sistema</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderNotificationsTab = () => (
    <div className="row g-3">
      <div className="col-12">
        <div className="mb-3">
          <div className="form-label mb-3">Tipos de Notificações</div>
          <div className="mb-2">
            <label className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                checked={settings.emailNotifications}
                onChange={(e) => handleInputChange('emailNotifications', e.target.checked)}
              />
              <span className="form-check-label">Notificações por Email</span>
              <small className="form-check-description text-muted">
                Receber notificações importantes por email
              </small>
            </label>
          </div>
          <div className="mb-2">
            <label className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                checked={settings.pushNotifications}
                onChange={(e) => handleInputChange('pushNotifications', e.target.checked)}
              />
              <span className="form-check-label">Notificações Push</span>
              <small className="form-check-description text-muted">
                Receber notificações no navegador
              </small>
            </label>
          </div>
          <div className="mb-2">
            <label className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                checked={settings.smsNotifications}
                onChange={(e) => handleInputChange('smsNotifications', e.target.checked)}
              />
              <span className="form-check-label">Notificações SMS</span>
              <small className="form-check-description text-muted">
                Receber notificações por SMS (requer configuração adicional)
              </small>
            </label>
          </div>
          <div className="mb-2">
            <label className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                checked={settings.notificationSound}
                onChange={(e) => handleInputChange('notificationSound', e.target.checked)}
              />
              <span className="form-check-label">Som de Notificação</span>
              <small className="form-check-description text-muted">
                Tocar som ao receber notificações
              </small>
            </label>
          </div>
        </div>
      </div>
    </div>
  )

  const renderSecurityTab = () => (
    <div className="row g-3">
      <div className="col-md-6">
        <div className="mb-3">
          <label className="form-label">Autenticação de Dois Fatores</label>
          <div className="form-check form-switch">
            <input
              type="checkbox"
              className="form-check-input"
              checked={settings.twoFactorAuth}
              onChange={(e) => handleInputChange('twoFactorAuth', e.target.checked)}
            />
            <label className="form-check-label">
              Ativar 2FA para todos os usuários
            </label>
          </div>
        </div>
      </div>
      <div className="col-md-6">
        <div className="mb-3">
          <label className="form-label">Tempo de Sessão (minutos)</label>
          <input
            type="number"
            className="form-control"
            value={settings.sessionTimeout}
            onChange={(e) => handleInputChange('sessionTimeout', parseInt(e.target.value))}
            min="5"
            max="480"
          />
          <small className="form-text text-muted">Tempo até expirar a sessão por inatividade</small>
        </div>
      </div>
      <div className="col-md-6">
        <div className="mb-3">
          <label className="form-label">Expiração de Senha (dias)</label>
          <input
            type="number"
            className="form-control"
            value={settings.passwordExpiry}
            onChange={(e) => handleInputChange('passwordExpiry', parseInt(e.target.value))}
            min="0"
            max="365"
          />
          <small className="form-text text-muted">0 para não expirar</small>
        </div>
      </div>
      <div className="col-md-6">
        <div className="mb-3">
          <label className="form-label">Tentativas de Login</label>
          <input
            type="number"
            className="form-control"
            value={settings.loginAttempts}
            onChange={(e) => handleInputChange('loginAttempts', parseInt(e.target.value))}
            min="1"
            max="10"
          />
          <small className="form-text text-muted">Tentativas antes de bloquear o usuário</small>
        </div>
      </div>
    </div>
  )

  const renderApiTab = () => (
    <div className="row g-3">
      <div className="col-md-6">
        <div className="mb-3">
          <label className="form-label">Limite de Requisições por Hora</label>
          <input
            type="number"
            className="form-control"
            value={settings.apiRateLimit}
            onChange={(e) => handleInputChange('apiRateLimit', parseInt(e.target.value))}
            min="100"
            max="10000"
          />
          <small className="form-text text-muted">Número máximo de requisições por hora</small>
        </div>
      </div>
      <div className="col-md-6">
        <div className="mb-3">
          <label className="form-label">Validade da API Key (dias)</label>
          <input
            type="number"
            className="form-control"
            value={settings.apiKeyExpiry}
            onChange={(e) => handleInputChange('apiKeyExpiry', parseInt(e.target.value))}
            min="1"
            max="365"
          />
          <small className="form-text text-muted">Tempo de validade das chaves de API</small>
        </div>
      </div>
      <div className="col-12">
        <div className="mb-3">
          <label className="form-label">Webhook URL</label>
          <input
            type="url"
            className="form-control"
            value={settings.webhookUrl}
            onChange={(e) => handleInputChange('webhookUrl', e.target.value)}
            placeholder="https://seu-dominio.com/webhook"
          />
          <small className="form-text text-muted">URL para receber webhooks do sistema</small>
        </div>
      </div>
    </div>
  )

  const renderBackupTab = () => (
    <div className="row g-3">
      <div className="col-md-6">
        <div className="mb-3">
          <label className="form-label">Backup Automático</label>
          <div className="form-check form-switch">
            <input
              type="checkbox"
              className="form-check-input"
              checked={settings.autoBackup}
              onChange={(e) => handleInputChange('autoBackup', e.target.checked)}
            />
            <label className="form-check-label">
              Ativar backup automático
            </label>
          </div>
        </div>
      </div>
      <div className="col-md-6">
        <div className="mb-3">
          <label className="form-label">Frequência do Backup</label>
          <select
            className="form-select"
            value={settings.backupFrequency}
            onChange={(e) => handleInputChange('backupFrequency', e.target.value)}
            disabled={!settings.autoBackup}
          >
            <option value="hourly">A cada hora</option>
            <option value="daily">Diário</option>
            <option value="weekly">Semanal</option>
            <option value="monthly">Mensal</option>
          </select>
        </div>
      </div>
      <div className="col-md-6">
        <div className="mb-3">
          <label className="form-label">Retenção de Backup (dias)</label>
          <input
            type="number"
            className="form-control"
            value={settings.backupRetention}
            onChange={(e) => handleInputChange('backupRetention', parseInt(e.target.value))}
            min="1"
            max="365"
            disabled={!settings.autoBackup}
          />
          <small className="form-text text-muted">Tempo para manter os backups</small>
        </div>
      </div>
      <div className="col-md-6">
        <div className="mb-3">
          <label className="form-label">Modo de Manutenção</label>
          <div className="form-check form-switch">
            <input
              type="checkbox"
              className="form-check-input"
              checked={settings.maintenanceMode}
              onChange={(e) => handleInputChange('maintenanceMode', e.target.checked)}
            />
            <label className="form-check-label">
              Ativar modo de manutenção
            </label>
          </div>
          <small className="form-text text-muted">Sistema ficará indisponível para usuários</small>
        </div>
      </div>
    </div>
  )

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general': return renderGeneralTab()
      case 'appearance': return renderAppearanceTab()
      case 'notifications': return renderNotificationsTab()
      case 'security': return renderSecurityTab()
      case 'api': return renderApiTab()
      case 'backup': return renderBackupTab()
      default: return renderGeneralTab()
    }
  }

  return (
    <div className="container-fluid">
      <div className="page-header mb-4">
        <div className="row align-items-center">
          <div className="col">
            <h2 className="page-title">Configurações</h2>
            <div className="page-pretitle">Gerenciar preferências do sistema</div>
          </div>
          <div className="col-auto ms-auto">
            <div className="btn-list">
              {hasChanges && (
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={handleReset}
                  disabled={isSaving}
                >
                  <IconX size={16} className="me-1" />
                  Descartar
                </button>
              )}
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSave}
                disabled={!hasChanges || isSaving}
              >
                {isSaving ? (
                  <IconRefresh size={16} className="me-1 animate-spin" />
                ) : (
                  <IconCheck size={16} className="me-1" />
                )}
                {isSaving ? 'Salvando...' : 'Salvar Alterações'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {saveMessage && (
        <div className={`alert alert-${saveMessage.includes('sucesso') ? 'success' : 'danger'} alert-dismissible mb-4`}>
          <span>{saveMessage}</span>
          <button type="button" className="btn-close" onClick={() => setSaveMessage('')}></button>
        </div>
      )}

      <div className="row">
        <div className="col-md-3">
          <div className="card sticky-top" style={{ top: '1rem' }}>
            <div className="card-body p-0">
              <div className="nav nav-pills flex-column" role="tablist">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    className={`nav-link text-start ${activeTab === tab.id ? 'active' : ''}`}
                    onClick={() => setActiveTab(tab.id)}
                    type="button"
                    role="tab"
                  >
                    <span className="nav-link-icon me-2">{tab.icon}</span>
                    <span className="nav-link-title">{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-9">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">
                {tabs.find(tab => tab.id === activeTab)?.label}
              </h3>
              <div className="card-actions">
                <span className={`badge ${hasChanges ? 'bg-warning' : 'bg-success'}`}>
                  {hasChanges ? 'Modificado' : 'Salvo'}
                </span>
              </div>
            </div>
            <div className="card-body">
              {renderTabContent()}
            </div>
            <div className="card-footer text-end">
              <div className="d-flex justify-content-between align-items-center">
                <small className="text-muted">
                  Última atualização: {new Date().toLocaleString('pt-BR')}
                </small>
                <div className="btn-list">
                  {hasChanges && (
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={handleReset}
                      disabled={isSaving}
                    >
                      <IconX size={16} className="me-1" />
                      Descartar
                    </button>
                  )}
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleSave}
                    disabled={!hasChanges || isSaving}
                  >
                    {isSaving ? (
                      <IconRefresh size={16} className="me-1 animate-spin" />
                    ) : (
                      <IconCheck size={16} className="me-1" />
                    )}
                    {isSaving ? 'Salvando...' : 'Salvar Alterações'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings