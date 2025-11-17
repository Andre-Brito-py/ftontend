import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

// Usa o mesmo backend original
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4001'

// Utilitário para moeda BRL
const brl = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(v || 0))

export default function BannersPage() {
  const navigate = useNavigate()

  // Estado dos banners
  const [banners, setBanners] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Estado do formulário
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ title: '', subtitle: '', image: null, position: 'top', link: '', active: true })
  const [imagePreview, setImagePreview] = useState('')

  // Estado de exclusão
  const [deleting, setDeleting] = useState(null)

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

  // Busca banners do backend
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        setLoading(true)
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : ''
        const resp = await fetch(`${apiUrl}/api/banners?storeId=${storeId}`, {
          headers: { 'Authorization': token ? `Bearer ${token}` : '', 'X-Store-ID': storeId }
        })
        const data = await resp.json()
        if (data?.success && Array.isArray(data?.data)) {
          setBanners(data.data)
        } else {
          setBanners([])
        }
      } catch (e) {
        setError('Erro ao carregar banners.')
        setBanners([])
      } finally {
        setLoading(false)
      }
    }
    fetchBanners()
  }, [storeId])

  // Handlers do formulário
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleImageSelect = (file) => {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('Por favor, selecione uma imagem válida.')
      return
    }
    setError('')
    setForm((prev) => ({ ...prev, image: file }))
    const reader = new FileReader()
    reader.onload = (e) => setImagePreview(e.target.result)
    reader.readAsDataURL(file)
  }

  const handleFileInput = (e) => handleImageSelect(e.target.files?.[0])

  const resetForm = () => {
    setForm({ title: '', subtitle: '', image: null, position: 'top', link: '', active: true })
    setImagePreview('')
    setEditing(null)
    setShowForm(false)
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!form.title.trim()) {
      setError('Título do banner é obrigatório.')
      return
    }

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : ''
      const formData = new FormData()
      formData.append('title', form.title.trim())
      formData.append('subtitle', form.subtitle || '')
      formData.append('position', form.position)
      formData.append('link', form.link || '')
      formData.append('active', form.active)
      if (form.image) formData.append('image', form.image)

      const method = editing ? 'PUT' : 'POST'
      const endpoint = editing ? `${apiUrl}/api/banners/${editing._id}` : `${apiUrl}/api/banners`

      const resp = await fetch(endpoint, {
        method,
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'X-Store-ID': storeId
        },
        body: formData
      })

      const data = await resp.json()
      if (data?.success) {
        // Atualiza lista local
        if (editing) {
          setBanners((prev) => prev.map((b) => (b._id === editing._id ? data.data : b)))
        } else {
          setBanners((prev) => [data.data, ...prev])
        }
        resetForm()
      } else {
        setError(data?.message || 'Erro ao salvar banner.')
      }
    } catch (err) {
      setError('Erro inesperado ao enviar dados.')
    }
  }

  const handleEdit = (banner) => {
    setEditing(banner)
    setForm({
      title: banner.title || '',
      subtitle: banner.subtitle || '',
      image: null,
      position: banner.position || 'top',
      link: banner.link || '',
      active: banner.active !== false
    })
    setImagePreview(banner.imageUrl || '')
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este banner?')) return
    try {
      setDeleting(id)
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : ''
      const resp = await fetch(`${apiUrl}/api/banners/${id}`, {
        method: 'DELETE',
        headers: { Authorization: token ? `Bearer ${token}` : '', 'X-Store-ID': storeId }
      })
      const data = await resp.json()
      if (data?.success) {
        setBanners((prev) => prev.filter((b) => b._id !== id))
      } else {
        setError(data?.message || 'Erro ao excluir banner.')
      }
    } catch (err) {
      setError('Erro inesperado ao excluir.')
    } finally {
      setDeleting(null)
    }
  }

  const toggleActive = async (banner) => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : ''
      const resp = await fetch(`${apiUrl}/api/banners/${banner._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: token ? `Bearer ${token}` : '', 'X-Store-ID': storeId },
        body: JSON.stringify({ active: !banner.active })
      })
      const data = await resp.json()
      if (data?.success) {
        setBanners((prev) => prev.map((b) => (b._id === banner._id ? { ...b, active: !banner.active } : b)))
      } else {
        setError(data?.message || 'Erro ao alternar status.')
      }
    } catch (err) {
      setError('Erro inesperado ao alternar status.')
    }
  }

  return (
    <div className="container-xl">
      <div className="page-header">
        <div className="row g-2 align-items-center">
          <div className="col">
            <h2 className="page-title">Banners</h2>
            <div className="page-pretitle">Gerencie os banners da loja</div>
          </div>
          <div className="col-auto ms-auto">
            <button className="btn btn-primary" onClick={() => setShowForm(true)}>Novo Banner</button>
          </div>
        </div>
      </div>

      {error && <div className="alert alert-danger" role="alert">{error}</div>}

      {showForm && (
        <div className="row mb-4">
          <div className="col-lg-8">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">{editing ? 'Editar Banner' : 'Novo Banner'}</h3>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Imagem do Banner</label>
                    <div className="border rounded p-3 text-center" style={{ cursor: 'pointer' }} onClick={() => document.getElementById('bannerImage').click()}>
                      {imagePreview ? (
                        <img src={imagePreview} alt="Prévia" className="img-fluid rounded" style={{ maxHeight: '200px' }} />
                      ) : (
                        <div className="text-muted">Clique para selecionar uma imagem</div>
                      )}
                    </div>
                    <input id="bannerImage" type="file" accept="image/*" className="d-none" onChange={handleFileInput} />
                  </div>

                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Título</label>
                      <input className="form-control" name="title" placeholder="Ex.: Promoção de Verão" value={form.title} onChange={handleInputChange} required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Subtítulo</label>
                      <input className="form-control" name="subtitle" placeholder="Ex.: Até 50% de desconto" value={form.subtitle} onChange={handleInputChange} />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Posição</label>
                      <select className="form-select" name="position" value={form.position} onChange={handleInputChange}>
                        <option value="top">Topo</option>
                        <option value="middle">Meio</option>
                        <option value="bottom">Rodapé</option>
                      </select>
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Link (opcional)</label>
                      <input className="form-control" name="link" placeholder="https://..." value={form.link} onChange={handleInputChange} />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Status</label>
                      <div className="form-check form-switch">
                        <input className="form-check-input" type="checkbox" role="switch" name="active" checked={form.active} onChange={handleInputChange} />
                        <label className="form-check-label">{form.active ? 'Ativo' : 'Inativo'}</label>
                      </div>
                    </div>
                  </div>

                  <div className="d-flex gap-2 mt-3">
                    <button type="submit" className="btn btn-primary">Salvar</button>
                    <button type="button" className="btn btn-outline-secondary" onClick={resetForm}>Cancelar</button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">Dicas</h4>
                <ul className="mt-2">
                  <li>Use imagens com boa resolução (recomendado: 1200x400px).</li>
                  <li>O título deve ser curto e impactante.</li>
                  <li>Adicione um link para direcionar clientes a promoções.</li>
                  <li>Posição "Topo" aparece na home, "Meio" entre seções, "Rodapé" no final.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="row row-cards">
        {loading ? (
          <div className="col-12">
            <div className="card">
              <div className="card-body text-center">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Carregando...</span>
                </div>
              </div>
            </div>
          </div>
        ) : banners.length === 0 ? (
          <div className="col-12">
            <div className="card">
              <div className="card-body text-center text-muted">
                Nenhum banner cadastrado. Clique em "Novo Banner" para começar.
              </div>
            </div>
          </div>
        ) : (
          banners.map((banner) => (
            <div key={banner._id} className="col-lg-6 col-xl-4">
              <div className="card">
                {banner.imageUrl && (
                  <img src={banner.imageUrl} className="card-img-top" alt={banner.title} style={{ height: '160px', objectFit: 'cover' }} />
                )}
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h5 className="card-title mb-0">{banner.title}</h5>
                    <span className={`badge ${banner.active ? 'bg-success' : 'bg-secondary'}`}>{banner.active ? 'Ativo' : 'Inativo'}</span>
                  </div>
                  {banner.subtitle && <p className="card-text text-muted">{banner.subtitle}</p>}
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="btn-group btn-group-sm">
                      <button className="btn btn-outline-primary" onClick={() => handleEdit(banner)}>Editar</button>
                      <button className="btn btn-outline-danger" onClick={() => handleDelete(banner._id)} disabled={deleting === banner._id}>
                        {deleting === banner._id ? (
                          <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        ) : 'Excluir'}
                      </button>
                    </div>
                    <button className={`btn btn-sm ${banner.active ? 'btn-outline-secondary' : 'btn-outline-success'}`} onClick={() => toggleActive(banner)}>
                      {banner.active ? 'Desativar' : 'Ativar'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}