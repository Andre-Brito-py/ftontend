import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

// Usa o mesmo backend original
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4001'

// Utilitário para moeda BRL
const brl = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(v || 0))

export default function CreateProductPage() {
  const navigate = useNavigate()

  // Campos básicos
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState('')
  const [categories, setCategories] = useState([])

  // Imagem
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  const dropRef = useRef(null)

  // Sistema de adicionais: novo inline x antigo extras
  const [useOldSystem, setUseOldSystem] = useState(false)

  // Novo sistema inline: categorias de adicionais e itens
  const [addonCategories, setAddonCategories] = useState([]) // [{id, name, description, maxSelection, isRequired}]
  const [currentAddonCategory, setCurrentAddonCategory] = useState({ name: '', description: '', maxSelection: 1, isRequired: false })
  const [categoryAddons, setCategoryAddons] = useState({}) // { [categoryId]: [{id, name, price, description}] }
  const [selectedCategoryForAddon, setSelectedCategoryForAddon] = useState('')
  const [currentAddon, setCurrentAddon] = useState({ name: '', price: '', description: '' })

  // Sistema antigo: extras
  const [extras, setExtras] = useState([]) // [{name, price, description}]
  const [currentExtra, setCurrentExtra] = useState({ name: '', price: '', description: '' })

  // Estado geral
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const storeId = useMemo(() => {
    const ls = typeof window !== 'undefined' ? localStorage.getItem('storeId') : null
    return ls || '507f1f77bcf86cd799439012' // demo storeId de simulação
  }, [])

  // Faz login simulado se não houver token
  useEffect(() => {
    const ensureToken = async () => {
      const existing = typeof window !== 'undefined' ? localStorage.getItem('token') : null
      if (existing) return
      try {
        const resp = await fetch(`${apiUrl}/api/store/admin/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: 'admin@loja1.com', password: 'admin123' })
        })
        const data = await resp.json()
        if (data?.success && data?.token) {
          localStorage.setItem('token', data.token)
          if (data?.user?.storeId) localStorage.setItem('storeId', data.user.storeId)
        }
      } catch (e) {
        // sem bloqueio; seguirá sem token
      }
    }
    ensureToken()
  }, [])

  // Busca categorias ativas do backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const resp = await fetch(`${apiUrl}/api/category/active?storeId=${storeId}`, {
          headers: { 'X-Store-ID': storeId }
        })
        const data = await resp.json()
        if (data?.success && Array.isArray(data?.data)) {
          setCategories(data.data)
          if (!category && data.data.length > 0) setCategory(data.data[0].name)
        }
      } catch (e) {
        // falha silenciosa; usuário pode digitar categoria manualmente
      }
    }
    fetchCategories()
  }, [storeId])

  // Dropzone
  const onFileSelect = (file) => {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('Por favor, selecione uma imagem válida.')
      return
    }
    setError('')
    setImageFile(file)
    const reader = new FileReader()
    reader.onload = (e) => setImagePreview(e.target.result)
    reader.readAsDataURL(file)
  }
  const handleInputFile = (e) => onFileSelect(e.target.files?.[0])
  const handleDragOver = (e) => { e.preventDefault(); dropRef.current?.classList.add('dropzone-hover') }
  const handleDragLeave = (e) => { e.preventDefault(); dropRef.current?.classList.remove('dropzone-hover') }
  const handleDrop = (e) => { e.preventDefault(); dropRef.current?.classList.remove('dropzone-hover'); onFileSelect(e.dataTransfer?.files?.[0]) }

  // Handlers de categoria de adicional (novo sistema)
  const onAddonCategoryChange = (e) => {
    const { name, type, value, checked } = e.target
    const v = type === 'checkbox' ? checked : value
    setCurrentAddonCategory((prev) => ({ ...prev, [name]: name === 'maxSelection' ? Number(v) : v }))
  }
  const addAddonCategory = () => {
    if (!currentAddonCategory.name.trim()) { setError('Nome da categoria de adicional é obrigatório.'); return }
    const newCat = { id: Date.now().toString(), ...currentAddonCategory, maxSelection: Number(currentAddonCategory.maxSelection) }
    setAddonCategories((prev) => [...prev, newCat])
    setCategoryAddons((prev) => ({ ...prev, [newCat.id]: [] }))
    setCurrentAddonCategory({ name: '', description: '', maxSelection: 1, isRequired: false })
    setError('')
  }
  const removeAddonCategory = (categoryId) => {
    setAddonCategories((prev) => prev.filter((c) => c.id !== categoryId))
    setCategoryAddons((prev) => { const clone = { ...prev }; delete clone[categoryId]; return clone })
    if (selectedCategoryForAddon === categoryId) setSelectedCategoryForAddon('')
  }

  // Handlers de adicional
  const onAddonChange = (e) => {
    const { name, value } = e.target
    setCurrentAddon((prev) => ({ ...prev, [name]: value }))
  }
  const addAddon = () => {
    if (!selectedCategoryForAddon) { setError('Selecione uma categoria de adicional.'); return }
    if (!currentAddon.name.trim() || !currentAddon.price) { setError('Nome e preço do adicional são obrigatórios.'); return }
    const newAddon = { id: Date.now().toString(), name: currentAddon.name.trim(), price: Number(currentAddon.price), description: currentAddon.description || '' }
    setCategoryAddons((prev) => ({ ...prev, [selectedCategoryForAddon]: [...(prev[selectedCategoryForAddon] || []), newAddon] }))
    setCurrentAddon({ name: '', price: '', description: '' })
    setError('')
  }
  const removeAddon = (categoryId, addonId) => {
    setCategoryAddons((prev) => ({ ...prev, [categoryId]: (prev[categoryId] || []).filter((a) => a.id !== addonId) }))
  }

  // Handlers de extra (sistema antigo)
  const onExtraChange = (e) => {
    const { name, value } = e.target
    setCurrentExtra((prev) => ({ ...prev, [name]: value }))
  }
  const addExtra = () => {
    if (!currentExtra.name.trim() || !currentExtra.price) { setError('Nome e preço do extra são obrigatórios.'); return }
    setExtras((prev) => [...prev, { name: currentExtra.name.trim(), price: Number(currentExtra.price), description: currentExtra.description || '' }])
    setCurrentExtra({ name: '', price: '', description: '' })
    setError('')
  }
  const removeExtra = (idx) => setExtras((prev) => prev.filter((_, i) => i !== idx))

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!name.trim()) { setError('O nome do produto é obrigatório.'); return }
    if (!price) { setError('O preço do produto é obrigatório.'); return }
    if (!category?.trim()) { setError('Selecione uma categoria.'); return }
    if (!imageFile) { setError('Selecione ou arraste a imagem do produto.'); return }

    try {
      setSubmitting(true)
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : ''

      const formData = new FormData()
      formData.append('name', name.trim())
      formData.append('description', description || '')
      formData.append('price', Number(price))
      formData.append('category', category)
      formData.append('image', imageFile)

      if (useOldSystem) {
        formData.append('extras', JSON.stringify(extras))
        formData.append('useOldSystem', 'true')
      } else {
        // Converter para formato esperado pelo backend
        const inlineAddonCategories = addonCategories.map((cat) => ({
          name: cat.name,
          description: cat.description,
          maxSelection: cat.maxSelection,
          isRequired: cat.isRequired
        }))
        const categoryAddonsForBackend = {}
        addonCategories.forEach((cat) => {
          const addons = categoryAddons[cat.id] || []
          categoryAddonsForBackend[cat.name] = addons.map((a) => ({ name: a.name, price: a.price, description: a.description }))
        })
        formData.append('addonCategories', JSON.stringify(inlineAddonCategories))
        formData.append('categoryAddons', JSON.stringify(categoryAddonsForBackend))
        formData.append('useOldSystem', 'false')
      }

      const resp = await fetch(`${apiUrl}/api/food/add`, {
        method: 'POST',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'X-Store-ID': storeId
        },
        body: formData
      })
      const data = await resp.json()

      if (data?.success) {
        setSuccess('Produto criado com sucesso!')
        // reset
        setName('')
        setDescription('')
        setPrice('')
        setImageFile(null)
        setImagePreview('')
        setUseOldSystem(false)
        setAddonCategories([])
        setCategoryAddons({})
        setSelectedCategoryForAddon('')
        setCurrentAddonCategory({ name: '', description: '', maxSelection: 1, isRequired: false })
        setCurrentAddon({ name: '', price: '', description: '' })
        setExtras([])
        setCurrentExtra({ name: '', price: '', description: '' })
        setTimeout(() => navigate('/produtos'), 1200)
      } else {
        setError(data?.message || 'Falha ao criar produto.')
      }
    } catch (err) {
      setError('Erro inesperado ao enviar dados.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="container-xl">
      <div className="page-header">
        <div className="row g-2 align-items-center">
          <div className="col">
            <h2 className="page-title">Novo Produto</h2>
            <div className="page-pretitle">Crie um produto com adicionais</div>
          </div>
          <div className="col-auto ms-auto">
            <button className="btn btn-outline-secondary" onClick={() => navigate('/produtos')}>Voltar</button>
          </div>
        </div>
      </div>

      <div className="row row-cards">
        <div className="col-lg-8">
          <div className="card">
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Imagem do produto</label>
                  <div
                    ref={dropRef}
                    className="dropzone"
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    {imagePreview ? (
                      <div className="dz-preview"><img src={imagePreview} alt="Prévia" /></div>
                    ) : (
                      <div className="dz-instructions">
                        <div className="mb-2">Arraste uma imagem aqui ou clique para selecionar.</div>
                        <button type="button" className="btn btn-outline-primary" onClick={() => dropRef.current?.querySelector('input[type=file]')?.click()}>Escolher arquivo</button>
                      </div>
                    )}
                    <input type="file" accept="image/*" className="d-none" onChange={handleInputFile} />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Nome do produto</label>
                  <input className="form-control" placeholder="Ex.: Pizza Margherita" value={name} onChange={(e) => setName(e.target.value)} />
                </div>

                <div className="mb-3">
                  <label className="form-label">Descrição</label>
                  <textarea className="form-control" rows={3} placeholder="Detalhes do produto" value={description} onChange={(e) => setDescription(e.target.value)} />
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Categoria</label>
                    <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value)}>
                      {categories.length > 0 ? (
                        categories.map((c) => <option key={c._id || c.name} value={c.name}>{c.name}</option>)
                      ) : (
                        <option value="">Selecione</option>
                      )}
                    </select>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Preço</label>
                    <div className="input-group">
                      <span className="input-group-text">R$</span>
                      <input className="form-control" type="number" step="0.01" placeholder="0,00" value={price} onChange={(e) => setPrice(e.target.value)} />
                      <span className="input-group-text">{brl(price)}</span>
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Sistema de adicionais</label>
                  <div className="form-check">
                    <input className="form-check-input" type="radio" name="addonSystem" id="sysInline" checked={!useOldSystem} onChange={() => setUseOldSystem(false)} />
                    <label className="form-check-label" htmlFor="sysInline">Categorias de adicionais (Recomendado)</label>
                  </div>
                  <div className="form-check">
                    <input className="form-check-input" type="radio" name="addonSystem" id="sysOld" checked={useOldSystem} onChange={() => setUseOldSystem(true)} />
                    <label className="form-check-label" htmlFor="sysOld">Sistema antigo de extras</label>
                  </div>
                </div>

                {!useOldSystem && (
                  <div className="mb-4">
                    <div className="d-flex align-items-center mb-2">
                      <h3 className="m-0">Categorias de Adicionais</h3>
                    </div>
                    <div className="card mb-3">
                      <div className="card-body">
                        <div className="row g-2">
                          <div className="col-md-3"><input className="form-control" name="name" placeholder="Nome" value={currentAddonCategory.name} onChange={onAddonCategoryChange} /></div>
                          <div className="col-md-5"><input className="form-control" name="description" placeholder="Descrição (opcional)" value={currentAddonCategory.description} onChange={onAddonCategoryChange} /></div>
                          <div className="col-md-2"><input className="form-control" type="number" min={1} max={10} name="maxSelection" placeholder="Máx." value={currentAddonCategory.maxSelection} onChange={onAddonCategoryChange} /></div>
                          <div className="col-md-2 d-flex align-items-center"><div className="form-check"><input className="form-check-input" type="checkbox" name="isRequired" checked={currentAddonCategory.isRequired} onChange={onAddonCategoryChange} /><label className="form-check-label">Obrigatória</label></div></div>
                        </div>
                        <div className="mt-2"><button type="button" className="btn btn-outline-primary" onClick={addAddonCategory}>Adicionar Categoria</button></div>
                      </div>
                    </div>

                    {addonCategories.length > 0 && (
                      <div className="mb-3">
                        <h4>Categorias Criadas</h4>
                        {addonCategories.map((cat) => (
                          <div className="card mb-2" key={cat.id}>
                            <div className="card-body">
                              <div className="d-flex justify-content-between align-items-center">
                                <div>
                                  <strong>{cat.name}</strong>
                                  {cat.description && <span className="text-secondary"> — {cat.description}</span>}
                                  <div className="text-secondary small">Máx: {cat.maxSelection} • {cat.isRequired ? 'Obrigatória' : 'Opcional'}</div>
                                </div>
                                <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => removeAddonCategory(cat.id)}>Remover</button>
                              </div>

                              {(categoryAddons[cat.id] || []).length > 0 && (
                                <div className="mt-2">
                                  <div className="text-secondary">Adicionais:</div>
                                  {(categoryAddons[cat.id] || []).map((a) => (
                                    <div key={a.id} className="d-flex justify-content-between align-items-center py-1">
                                      <span>{a.name} — {brl(a.price)} {a.description && (<span className="text-secondary">({a.description})</span>)}</span>
                                      <button type="button" className="btn btn-link text-danger p-0" onClick={() => removeAddon(cat.id, a.id)}>Remover</button>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {addonCategories.length > 0 && (
                      <div className="card">
                        <div className="card-body">
                          <h4 className="card-title">Adicionar Adicionais</h4>
                          <div className="row g-2 align-items-center">
                            <div className="col-md-3">
                              <select className="form-select" value={selectedCategoryForAddon} onChange={(e) => setSelectedCategoryForAddon(e.target.value)}>
                                <option value="">Selecione a categoria</option>
                                {addonCategories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                              </select>
                            </div>
                            <div className="col-md-3"><input className="form-control" name="name" placeholder="Nome do adicional" value={currentAddon.name} onChange={onAddonChange} /></div>
                            <div className="col-md-2"><input className="form-control" name="price" type="number" step="0.01" placeholder="Preço" value={currentAddon.price} onChange={onAddonChange} /></div>
                            <div className="col-md-3"><input className="form-control" name="description" placeholder="Descrição (opcional)" value={currentAddon.description} onChange={onAddonChange} /></div>
                            <div className="col-md-1"><button type="button" className="btn btn-outline-primary w-100" onClick={addAddon}>Adicionar</button></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {useOldSystem && (
                  <div className="mb-4">
                    <h3>Extras do Produto</h3>
                    {extras.length > 0 && (
                      <div className="card mb-2">
                        <div className="card-body">
                          {extras.map((e, idx) => (
                            <div className="d-flex justify-content-between align-items-center py-1" key={`${e.name}-${idx}`}>
                              <span><strong>{e.name}</strong> — {brl(e.price)} {e.description && (<span className="text-secondary">({e.description})</span>)}</span>
                              <button type="button" className="btn btn-link text-danger p-0" onClick={() => removeExtra(idx)}>Remover</button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="card">
                      <div className="card-body">
                        <div className="row g-2">
                          <div className="col-md-4"><input className="form-control" name="name" placeholder="Nome do extra" value={currentExtra.name} onChange={onExtraChange} /></div>
                          <div className="col-md-3"><input className="form-control" name="price" type="number" step="0.01" placeholder="Preço" value={currentExtra.price} onChange={onExtraChange} /></div>
                          <div className="col-md-4"><input className="form-control" name="description" placeholder="Descrição (opcional)" value={currentExtra.description} onChange={onExtraChange} /></div>
                          <div className="col-md-1"><button type="button" className="btn btn-outline-primary w-100" onClick={addExtra}>Adicionar</button></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {error && (<div className="alert alert-danger" role="alert">{error}</div>)}
                {success && (<div className="alert alert-success" role="alert">{success}</div>)}

                <div className="d-flex gap-2">
                  <button type="submit" className="btn btn-primary" disabled={submitting}>
                    {submitting ? 'Enviando...' : 'Criar produto'}
                  </button>
                  <button type="button" className="btn btn-outline-secondary" onClick={() => navigate('/produtos')}>Cancelar</button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card">
            <div className="card-body">
              <div className="text-secondary">Dicas</div>
              <ul className="mt-2">
                <li>Use imagens quadradas para melhor qualidade.</li>
                <li>Categorize adicionais em grupos lógicos (ex.: Molhos, Toppings).</li>
                <li>Use "Obrigatória" quando o cliente sempre deve escolher.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}