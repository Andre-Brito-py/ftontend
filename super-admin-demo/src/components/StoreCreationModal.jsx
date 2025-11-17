import React, { useState, useEffect } from 'react'
import { IconX, IconBuilding, IconUser, IconMail, IconPhone, IconMapPin, IconCurrencyDollar, IconWorld, IconCheck, IconAlertCircle } from '@tabler/icons-react'
import backendService from '../services/backendService.js'
import authService from '../services/authService.js'

const StoreCreationModal = ({ isOpen, onClose, onStoreCreated }) => {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    // Step 1: Basic Info
    name: '',
    slug: '',
    email: '',
    phone: '',
    
    // Step 2: Address & Location
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Brasil',
    
    // Step 3: Admin Info
    adminName: '',
    adminEmail: '',
    adminPhone: '',
    
    // Step 4: Configuration
    plan: 'basic',
    paymentMethod: 'monthly',
    autoRenew: true,
    
    // Google Sign-in
    useGoogleSignIn: false,
    googleAccount: null
  })
  
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [googleScriptLoaded, setGoogleScriptLoaded] = useState(false)

  // Google Sign-in initialization
  useEffect(() => {
    if (isOpen && !googleScriptLoaded) {
      // Set up global callback for Google Sign-in
      window.handleGoogleSignInCallback = handleGoogleSignIn
      
      authService.initializeGoogleSignIn().then(loaded => {
        setGoogleScriptLoaded(loaded)
      })
    }
    
    // Cleanup when modal closes
    return () => {
      if (!isOpen) {
        delete window.handleGoogleSignInCallback
      }
    }
  }, [isOpen, googleScriptLoaded])

  // Initialize Google Sign-in button when script is loaded
  useEffect(() => {
    if (googleScriptLoaded && isOpen) {
      authService.renderGoogleButton('google-signin-button', {
        theme: 'outline',
        size: 'large',
        text: 'signin_with',
        shape: 'rectangular',
        width: '100%'
      })
    }
  }, [googleScriptLoaded, isOpen])

  const handleGoogleSignIn = (response) => {
    try {
      // The response from Google is passed directly to authService
      const userInfo = authService.handleGoogleSignIn(response)
      
      setFormData(prev => ({
        ...prev,
        useGoogleSignIn: true,
        googleAccount: userInfo,
        adminEmail: userInfo.email,
        adminName: userInfo.name
      }))
    } catch (error) {
      console.error('Google Sign-in error:', error)
      setErrors(prev => ({ ...prev, google: 'Erro ao fazer login com Google' }))
    }
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
    
    // Auto-generate slug from name
    if (field === 'name') {
      const slug = value.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
      setFormData(prev => ({ ...prev, slug }))
    }
  }

  const validateStep = (step) => {
    const newErrors = {}
    
    switch (step) {
      case 1:
        if (!formData.name.trim()) newErrors.name = 'Nome da loja é obrigatório'
        if (!formData.email.trim()) newErrors.email = 'Email é obrigatório'
        if (!formData.phone.trim()) newErrors.phone = 'Telefone é obrigatório'
        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          newErrors.email = 'Email inválido'
        }
        break
      case 2:
        if (!formData.address.trim()) newErrors.address = 'Endereço é obrigatório'
        if (!formData.city.trim()) newErrors.city = 'Cidade é obrigatória'
        if (!formData.state.trim()) newErrors.state = 'Estado é obrigatório'
        if (!formData.zipCode.trim()) newErrors.zipCode = 'CEP é obrigatório'
        break
      case 3:
        if (!formData.adminName.trim()) newErrors.adminName = 'Nome do administrador é obrigatório'
        if (!formData.adminEmail.trim()) newErrors.adminEmail = 'Email do administrador é obrigatório'
        if (formData.adminEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.adminEmail)) {
          newErrors.adminEmail = 'Email inválido'
        }
        break
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4))
    }
  }

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  const handleSubmit = async () => {
    if (!validateStep(4)) return
    
    setIsSubmitting(true)
    
    try {
      // Prepare store data for backend
      const storeData = {
        name: formData.name,
        slug: formData.slug,
        email: formData.email,
        phone: formData.phone,
        address: {
          street: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country
        },
        admin: {
          name: formData.adminName,
          email: formData.adminEmail,
          phone: formData.adminPhone
        },
        plan: formData.plan,
        paymentMethod: formData.paymentMethod,
        autoRenew: formData.autoRenew,
        googleSignIn: formData.useGoogleSignIn,
        googleAccount: formData.googleAccount
      }
      
      // Create store via backend
      let response
      if (formData.useGoogleSignIn && formData.googleAccount) {
        const googleToken = authService.getGoogleToken()
        response = await backendService.createStoreWithGoogle(storeData, googleToken)
      } else {
        response = await backendService.createStore(storeData)
      }
      
      if (response.success) {
        // Create store object for frontend
        const newStore = {
          id: response.data.id || Date.now(),
          name: formData.name,
          slug: formData.slug,
          email: formData.email,
          phone: formData.phone,
          address: `${formData.address}, ${formData.city}, ${formData.state}`,
          status: 'Pendente',
          createdAt: new Date().toISOString().split('T')[0],
          plan: formData.plan,
          admin: {
            name: formData.adminName,
            email: formData.adminEmail,
            phone: formData.adminPhone
          },
          googleSignIn: formData.useGoogleSignIn,
          revenue: 0,
          orders: 0
        }
        
        onStoreCreated(newStore)
        onClose()
        
        // Reset form
        setCurrentStep(1)
        setFormData({
          name: '', slug: '', email: '', phone: '',
          address: '', city: '', state: '', zipCode: '', country: 'Brasil',
          adminName: '', adminEmail: '', adminPhone: '',
          plan: 'basic', paymentMethod: 'monthly', autoRenew: true,
          useGoogleSignIn: false, googleAccount: null
        })
        setErrors({})
      } else {
        setErrors({ submit: response.message || 'Erro ao criar loja' })
      }
      
    } catch (error) {
      console.error('Store creation error:', error)
      setErrors({ submit: 'Erro ao criar loja. Tente novamente.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="step-content">
            <div className="mb-4">
              <label className="form-label">Nome da Loja *</label>
              <input
                type="text"
                className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Ex: Loja Centro, Tech Store"
              />
              {errors.name && <div className="invalid-feedback">{errors.name}</div>}
            </div>
            
            <div className="mb-4">
              <label className="form-label">Slug da Loja</label>
              <input
                type="text"
                className="form-control"
                value={formData.slug}
                onChange={(e) => handleInputChange('slug', e.target.value)}
                placeholder="URL amigável (gerado automaticamente)"
              />
            </div>
            
            <div className="row">
              <div className="col-md-6 mb-4">
                <label className="form-label">Email da Loja *</label>
                <input
                  type="email"
                  className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="loja@exemplo.com"
                />
                {errors.email && <div className="invalid-feedback">{errors.email}</div>}
              </div>
              
              <div className="col-md-6 mb-4">
                <label className="form-label">Telefone da Loja *</label>
                <input
                  type="tel"
                  className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="(11) 1234-5678"
                />
                {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
              </div>
            </div>
          </div>
        )
        
      case 2:
        return (
          <div className="step-content">
            <div className="mb-4">
              <label className="form-label">Endereço *</label>
              <input
                type="text"
                className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="Rua, número, complemento"
              />
              {errors.address && <div className="invalid-feedback">{errors.address}</div>}
            </div>
            
            <div className="row">
              <div className="col-md-6 mb-4">
                <label className="form-label">Cidade *</label>
                <input
                  type="text"
                  className={`form-control ${errors.city ? 'is-invalid' : ''}`}
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  placeholder="São Paulo"
                />
                {errors.city && <div className="invalid-feedback">{errors.city}</div>}
              </div>
              
              <div className="col-md-3 mb-4">
                <label className="form-label">Estado *</label>
                <input
                  type="text"
                  className={`form-control ${errors.state ? 'is-invalid' : ''}`}
                  value={formData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  placeholder="SP"
                  maxLength="2"
                />
                {errors.state && <div className="invalid-feedback">{errors.state}</div>}
              </div>
              
              <div className="col-md-3 mb-4">
                <label className="form-label">CEP *</label>
                <input
                  type="text"
                  className={`form-control ${errors.zipCode ? 'is-invalid' : ''}`}
                  value={formData.zipCode}
                  onChange={(e) => handleInputChange('zipCode', e.target.value)}
                  placeholder="01234-567"
                />
                {errors.zipCode && <div className="invalid-feedback">{errors.zipCode}</div>}
              </div>
            </div>
            
            <div className="mb-4">
              <label className="form-label">País</label>
              <select
                className="form-select"
                value={formData.country}
                onChange={(e) => handleInputChange('country', e.target.value)}
              >
                <option value="Brasil">Brasil</option>
                <option value="Portugal">Portugal</option>
                <option value="Estados Unidos">Estados Unidos</option>
              </select>
            </div>
          </div>
        )
        
      case 3:
        return (
          <div className="step-content">
            <div className="mb-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">Administrador da Loja</h5>
                <button
                  type="button"
                  className="btn btn-outline-primary btn-sm"
                  onClick={() => setFormData(prev => ({ ...prev, useGoogleSignIn: !prev.useGoogleSignIn }))}
                >
                  {formData.useGoogleSignIn ? 'Cancelar Google' : 'Usar Google'}
                </button>
              </div>
              
              {formData.useGoogleSignIn && (
                <div className="mb-4 p-3 bg-light rounded">
                  <div id="google-signin-button"></div>
                  {formData.googleAccount && (
                    <div className="mt-3 d-flex align-items-center">
                      {formData.googleAccount.picture && (
                        <img
                          src={formData.googleAccount.picture}
                          alt="Profile"
                          className="rounded-circle me-2"
                          width="32"
                          height="32"
                        />
                      )}
                      <div>
                        <div className="fw-medium">{formData.googleAccount.name}</div>
                        <small className="text-muted">{formData.googleAccount.email}</small>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <div className="row">
              <div className="col-md-6 mb-4">
                <label className="form-label">Nome do Administrador *</label>
                <input
                  type="text"
                  className={`form-control ${errors.adminName ? 'is-invalid' : ''}`}
                  value={formData.adminName}
                  onChange={(e) => handleInputChange('adminName', e.target.value)}
                  placeholder="João Silva"
                  disabled={formData.useGoogleSignIn && formData.googleAccount}
                />
                {errors.adminName && <div className="invalid-feedback">{errors.adminName}</div>}
              </div>
              
              <div className="col-md-6 mb-4">
                <label className="form-label">Email do Administrador *</label>
                <input
                  type="email"
                  className={`form-control ${errors.adminEmail ? 'is-invalid' : ''}`}
                  value={formData.adminEmail}
                  onChange={(e) => handleInputChange('adminEmail', e.target.value)}
                  placeholder="admin@exemplo.com"
                  disabled={formData.useGoogleSignIn && formData.googleAccount}
                />
                {errors.adminEmail && <div className="invalid-feedback">{errors.adminEmail}</div>}
              </div>
            </div>
            
            <div className="mb-4">
              <label className="form-label">Telefone do Administrador</label>
              <input
                type="tel"
                className="form-control"
                value={formData.adminPhone}
                onChange={(e) => handleInputChange('adminPhone', e.target.value)}
                placeholder="(11) 9876-5432"
              />
            </div>
          </div>
        )
        
      case 4:
        return (
          <div className="step-content">
            <div className="mb-4">
              <label className="form-label">Plano de Assinatura</label>
              <div className="row">
                <div className="col-md-4 mb-3">
                  <div className="card card-body border-2 cursor-pointer"
                       style={{ cursor: 'pointer', borderColor: formData.plan === 'basic' ? '#0d6efd' : '#dee2e6' }}
                       onClick={() => handleInputChange('plan', 'basic')}>
                    <div className="text-center">
                      <h5>Basic</h5>
                      <h3 className="text-primary">R$ 29</h3>
                      <small className="text-muted">por mês</small>
                      <ul className="list-unstyled mt-3">
                        <li>✓ Até 100 produtos</li>
                        <li>✓ 1 usuário</li>
                        <li>✓ Suporte básico</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="col-md-4 mb-3">
                  <div className="card card-body border-2 cursor-pointer"
                       style={{ cursor: 'pointer', borderColor: formData.plan === 'professional' ? '#0d6efd' : '#dee2e6' }}
                       onClick={() => handleInputChange('plan', 'professional')}>
                    <div className="text-center">
                      <h5>Professional</h5>
                      <h3 className="text-primary">R$ 79</h3>
                      <small className="text-muted">por mês</small>
                      <ul className="list-unstyled mt-3">
                        <li>✓ Até 500 produtos</li>
                        <li>✓ 3 usuários</li>
                        <li>✓ Suporte prioritário</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="col-md-4 mb-3">
                  <div className="card card-body border-2 cursor-pointer"
                       style={{ cursor: 'pointer', borderColor: formData.plan === 'enterprise' ? '#0d6efd' : '#dee2e6' }}
                       onClick={() => handleInputChange('plan', 'enterprise')}>
                    <div className="text-center">
                      <h5>Enterprise</h5>
                      <h3 className="text-primary">R$ 199</h3>
                      <small className="text-muted">por mês</small>
                      <ul className="list-unstyled mt-3">
                        <li>✓ Produtos ilimitados</li>
                        <li>✓ Usuários ilimitados</li>
                        <li>✓ Suporte VIP 24/7</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="row">
              <div className="col-md-6 mb-4">
                <label className="form-label">Forma de Pagamento</label>
                <select
                  className="form-select"
                  value={formData.paymentMethod}
                  onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                >
                  <option value="monthly">Mensal</option>
                  <option value="quarterly">Trimestral (10% desconto)</option>
                  <option value="yearly">Anual (20% desconto)</option>
                </select>
              </div>
              
              <div className="col-md-6 mb-4">
                <div className="form-check mt-4">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="autoRenew"
                    checked={formData.autoRenew}
                    onChange={(e) => handleInputChange('autoRenew', e.target.checked)}
                  />
                  <label className="form-check-label" htmlFor="autoRenew">
                    Renovação automática
                  </label>
                </div>
              </div>
            </div>
            
            {errors.submit && (
              <div className="alert alert-danger">
                <IconAlertCircle className="icon me-2" />
                {errors.submit}
              </div>
            )}
          </div>
        )
        
      default:
        return null
    }
  }

  if (!isOpen) return null

  return (
    <div className="modal modal-blur fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Criar Nova Loja</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          
          <div className="modal-body">
            {/* Progress Steps */}
            <div className="steps mb-4">
              <div className="step-item completed" style={{ opacity: currentStep >= 1 ? 1 : 0.5 }}>
                <div className="step-counter">1</div>
                <div className="step-title">Informações Básicas</div>
              </div>
              
              <div className="step-item" style={{ opacity: currentStep >= 2 ? 1 : 0.5 }}>
                <div className="step-counter">2</div>
                <div className="step-title">Endereço</div>
              </div>
              
              <div className="step-item" style={{ opacity: currentStep >= 3 ? 1 : 0.5 }}>
                <div className="step-counter">3</div>
                <div className="step-title">Administrador</div>
              </div>
              
              <div className="step-item" style={{ opacity: currentStep >= 4 ? 1 : 0.5 }}>
                <div className="step-counter">4</div>
                <div className="step-title">Plano & Pagamento</div>
              </div>
            </div>
            
            {/* Step Content */}
            {renderStep()}
          </div>
          
          <div className="modal-footer">
            <button type="button" className="btn me-auto" onClick={onClose}>
              Cancelar
            </button>
            
            {currentStep > 1 && (
              <button type="button" className="btn btn-secondary" onClick={handlePrevious}>
                Anterior
              </button>
            )}
            
            {currentStep < 4 ? (
              <button type="button" className="btn btn-primary" onClick={handleNext}>
                Próximo
              </button>
            ) : (
              <button 
                type="button" 
                className="btn btn-success" 
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="spinner-border spinner-border-sm me-2" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    Criando...
                  </>
                ) : (
                  <>
                    <IconCheck className="icon me-2" />
                    Criar Loja
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .steps {
          display: flex;
          justify-content: space-between;
          position: relative;
        }
        
        .step-item {
          flex: 1;
          text-align: center;
          position: relative;
        }
        
        .step-item:not(:last-child)::after {
          content: '';
          position: absolute;
          top: 15px;
          left: 50%;
          width: 100%;
          height: 2px;
          background: #e9ecef;
          z-index: -1;
        }
        
        .step-counter {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: #0d6efd;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 8px;
          font-weight: 500;
        }
        
        .step-title {
          font-size: 0.875rem;
          color: #6c757d;
        }
        
        .step-item.completed .step-title {
          color: #0d6efd;
          font-weight: 500;
        }
        
        .cursor-pointer {
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .cursor-pointer:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
        
        [data-bs-theme="dark"] .cursor-pointer:hover {
          box-shadow: 0 4px 8px rgba(0,0,0,0.3);
        }
      `}</style>
    </div>
  )
}

export default StoreCreationModal