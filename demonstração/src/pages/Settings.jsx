import React, { useEffect, useMemo, useRef, useState } from 'react'

// Tela de Configurações (Demonstração)
// Replica seções principais do painel admin original e adiciona identidade da loja

const readDemoSettings = () => {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem('demoSettings')
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

const writeDemoSettings = (settings) => {
  if (typeof window === 'undefined') return
  localStorage.setItem('demoSettings', JSON.stringify(settings))
}

const readStoreInfo = () => {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem('demoStoreInfo')
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

const writeStoreInfo = (info) => {
  if (typeof window === 'undefined') return
  localStorage.setItem('demoStoreInfo', JSON.stringify(info))
}

export default function SettingsPage() {
  // Estado das configurações (mirror do admin original)
  const [pixKey, setPixKey] = useState('')
  const [isOpen, setIsOpen] = useState(true)
  const [autoAcceptOrders, setAutoAcceptOrders] = useState(false)
  const [loading, setLoading] = useState(false)

  // Banner
  const [bannerTitle, setBannerTitle] = useState('')
  const [bannerDescription, setBannerDescription] = useState('')
  const [bannerImageDataUrl, setBannerImageDataUrl] = useState('')

  // Identidade da loja (novo requisito)
  const [storeName, setStoreName] = useState('Zappy Demo')
  const [storeUser, setStoreUser] = useState('admin@demo')
  const [storeLogoDataUrl, setStoreLogoDataUrl] = useState('')
  const logoDropRef = useRef(null)
  const bannerDropRef = useRef(null)

  // Carrega valores salvos
  useEffect(() => {
    const ds = readDemoSettings()
    if (ds) {
      setPixKey(ds.pixKey || '')
      setIsOpen(typeof ds.isOpen === 'boolean' ? ds.isOpen : true)
      setAutoAcceptOrders(!!ds.autoAcceptOrders)
      if (ds.banner) {
        setBannerTitle(ds.banner.title || '')
        setBannerDescription(ds.banner.description || '')
        setBannerImageDataUrl(ds.banner.imageDataUrl || '')
      }
    }
    const si = readStoreInfo()
    if (si) {
      setStoreName(si.name || 'Zappy Demo')
      setStoreUser(si.user || 'admin@demo')
      setStoreLogoDataUrl(si.logoDataUrl || '')
    }
  }, [])

  const saveCommon = () => {
    setLoading(true)
    const payload = {
      pixKey,
      isOpen,
      autoAcceptOrders,
      banner: { title: bannerTitle, description: bannerDescription, imageDataUrl: bannerImageDataUrl }
    }
    writeDemoSettings(payload)
    setLoading(false)
  }

  const saveIdentity = () => {
    setLoading(true)
    writeStoreInfo({ name: storeName, user: storeUser, logoDataUrl: storeLogoDataUrl })
    setLoading(false)
    // Notifica o layout/Sidebar com evento simples
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('demo-store-info-updated'))
    }
  }

  const toDataUrl = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })

  const handleLogoFile = async (file) => {
    if (!file) return
    const url = await toDataUrl(file)
    setStoreLogoDataUrl(url)
  }

  const handleBannerFile = async (file) => {
    if (!file) return
    const url = await toDataUrl(file)
    setBannerImageDataUrl(url)
  }

  const onDropInit = (ref, onFile) => {
    const node = ref?.current
    if (!node) return
    const onDragOver = (e) => { e.preventDefault(); node.classList.add('dropzone-hover') }
    const onDragLeave = () => node.classList.remove('dropzone-hover')
    const onDrop = async (e) => {
      e.preventDefault(); node.classList.remove('dropzone-hover')
      const file = e.dataTransfer?.files?.[0]
      await onFile(file)
    }
    node.addEventListener('dragover', onDragOver)
    node.addEventListener('dragleave', onDragLeave)
    node.addEventListener('drop', onDrop)
    return () => {
      node.removeEventListener('dragover', onDragOver)
      node.removeEventListener('dragleave', onDragLeave)
      node.removeEventListener('drop', onDrop)
    }
  }

  useEffect(() => {
    const cleanLogo = onDropInit(logoDropRef, handleLogoFile)
    const cleanBanner = onDropInit(bannerDropRef, handleBannerFile)
    return () => {
      cleanLogo && cleanLogo()
      cleanBanner && cleanBanner()
    }
  }, [])

  return (
    <div className="page">
      <div className="page-header">
        <div className="container-xl">
          <div className="row g-2 align-items-center">
            <div className="col">
              <h2 className="page-title">Configurações</h2>
              <div className="page-pretitle">Preferências da loja e do sistema</div>
            </div>
          </div>
        </div>
      </div>

      <div className="page-body">
        <div className="container-xl">
          <div className="row row-cards">
            {/* Identidade da loja */}
            <div className="col-12">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Identidade da Loja</h3>
                </div>
                <div className="card-body">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Nome da loja</label>
                      <input type="text" className="form-control" value={storeName} onChange={(e) => setStoreName(e.target.value)} placeholder="Ex.: Lanchonete Bom Sabor" />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Usuário</label>
                      <input type="text" className="form-control" value={storeUser} onChange={(e) => setStoreUser(e.target.value)} placeholder="Ex.: admin@loja" />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Ícone / Logo</label>
                      <div className="dropzone" ref={logoDropRef}>
                        <div className="dz-instructions">
                          Arraste e solte a imagem aqui ou clique para selecionar
                        </div>
                        <input type="file" accept="image/*" className="form-control" onChange={(e) => handleLogoFile(e.target.files?.[0])} />
                      </div>
                      {storeLogoDataUrl && (
                        <div className="mt-2">
                          <img src={storeLogoDataUrl} alt="Logo" style={{ maxHeight: 64, borderRadius: 8 }} />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="card-footer">
                  <button className="btn btn-primary" disabled={loading} onClick={saveIdentity}>{loading ? 'Salvando...' : 'Salvar Identidade'}</button>
                </div>
              </div>
            </div>

            {/* Chave PIX */}
            <div className="col-12">
              <div className="card">
                <div className="card-header"><h3 className="card-title">Chave PIX</h3></div>
                <div className="card-body">
                  <div className="row g-3">
                    <div className="col-md-8">
                      <input type="text" className="form-control" value={pixKey} onChange={(e) => setPixKey(e.target.value)} placeholder="CPF, CNPJ, e-mail, telefone ou chave aleatória" />
                    </div>
                  </div>
                </div>
                <div className="card-footer">
                  <button className="btn btn-primary" disabled={loading} onClick={saveCommon}>{loading ? 'Salvando...' : 'Salvar Chave PIX'}</button>
                </div>
              </div>
            </div>

            {/* Status da loja */}
            <div className="col-md-6">
              <div className="card">
                <div className="card-header"><h3 className="card-title">Status da Loja</h3></div>
                <div className="card-body">
                  <label className="form-check form-switch">
                    <input className="form-check-input" type="checkbox" checked={isOpen} onChange={(e) => setIsOpen(e.target.checked)} />
                    <span className="form-check-label">{isOpen ? 'Loja Aberta' : 'Loja Fechada'}</span>
                  </label>
                </div>
                <div className="card-footer">
                  <button className="btn btn-primary" disabled={loading} onClick={saveCommon}>Salvar Status</button>
                </div>
              </div>
            </div>

            {/* Aceitar pedidos automaticamente */}
            <div className="col-md-6">
              <div className="card">
                <div className="card-header"><h3 className="card-title">Aceitar Pedidos Automaticamente</h3></div>
                <div className="card-body">
                  <label className="form-check form-switch">
                    <input className="form-check-input" type="checkbox" checked={autoAcceptOrders} onChange={(e) => setAutoAcceptOrders(e.target.checked)} />
                    <span className="form-check-label">{autoAcceptOrders ? 'Ativado' : 'Desativado'}</span>
                  </label>
                </div>
                <div className="card-footer">
                  <button className="btn btn-primary" disabled={loading} onClick={saveCommon}>Salvar Configuração</button>
                </div>
              </div>
            </div>

            {/* Banner principal */}
            <div className="col-12">
              <div className="card">
                <div className="card-header"><h3 className="card-title">Banner Principal</h3></div>
                <div className="card-body">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Título</label>
                      <input type="text" className="form-control" value={bannerTitle} onChange={(e) => setBannerTitle(e.target.value)} placeholder="Título do banner" />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Descrição</label>
                      <input type="text" className="form-control" value={bannerDescription} onChange={(e) => setBannerDescription(e.target.value)} placeholder="Descrição do banner" />
                    </div>
                    <div className="col-md-8">
                      <label className="form-label">Imagem</label>
                      <div className="dropzone" ref={bannerDropRef}>
                        <div className="dz-instructions">Arraste a imagem aqui ou selecione um arquivo</div>
                        <input type="file" accept="image/*" className="form-control" onChange={(e) => handleBannerFile(e.target.files?.[0])} />
                      </div>
                      {bannerImageDataUrl && (
                        <div className="mt-2">
                          <img src={bannerImageDataUrl} alt="Banner" style={{ maxHeight: 120, borderRadius: 8 }} />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="card-footer">
                  <button className="btn btn-primary" disabled={loading} onClick={saveCommon}>Salvar Banner</button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}