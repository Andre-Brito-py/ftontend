import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

// Usa o mesmo backend original
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4001'

export default function CreateCategoryPage() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const dropRef = useRef(null)

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

  const handleInputFile = (e) => {
    const f = e.target.files?.[0]
    onFileSelect(f)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    if (dropRef.current) dropRef.current.classList.add('dropzone-hover')
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    if (dropRef.current) dropRef.current.classList.remove('dropzone-hover')
  }

  const handleDrop = (e) => {
    e.preventDefault()
    if (dropRef.current) dropRef.current.classList.remove('dropzone-hover')
    const f = e.dataTransfer?.files?.[0]
    onFileSelect(f)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!name?.trim()) {
      setError('O nome da categoria é obrigatório.')
      return
    }
    if (!imageFile) {
      setError('Selecione ou arraste a imagem da categoria.')
      return
    }

    try {
      setSubmitting(true)
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : ''
      const formData = new FormData()
      formData.append('name', name.trim())
      formData.append('description', description || '')
      formData.append('storeId', storeId)
      formData.append('image', imageFile)

      const resp = await fetch(`${apiUrl}/api/category/add`, {
        method: 'POST',
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'X-Store-ID': storeId
        },
        body: formData
      })
      const data = await resp.json()

      if (data?.success) {
        setSuccess('Categoria criada com sucesso!')
        setTimeout(() => navigate('/categorias'), 1200)
      } else {
        setError(data?.message || 'Falha ao criar categoria.')
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
            <h2 className="page-title">Nova Categoria</h2>
            <div className="page-pretitle">Crie uma categoria com ícone</div>
          </div>
          <div className="col-auto ms-auto">
            <button className="btn btn-outline-secondary" onClick={() => navigate('/categorias')}>Voltar</button>
          </div>
        </div>
      </div>

      <div className="row row-cards">
        <div className="col-lg-8">
          <div className="card">
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Nome da categoria</label>
                  <input className="form-control" placeholder="Ex.: Massas" value={name} onChange={(e) => setName(e.target.value)} />
                </div>

                <div className="mb-3">
                  <label className="form-label">Descrição (opcional)</label>
                  <textarea className="form-control" rows={3} placeholder="Breve descrição" value={description} onChange={(e) => setDescription(e.target.value)} />
                </div>

                <div className="mb-3">
                  <label className="form-label">Ícone da categoria</label>
                  <div
                    ref={dropRef}
                    className="dropzone"
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    {imagePreview ? (
                      <div className="dz-preview">
                        <img src={imagePreview} alt="Prévia" />
                      </div>
                    ) : (
                      <div className="dz-instructions">
                        <div className="mb-2">Arraste uma imagem aqui ou clique para selecionar.</div>
                        <button type="button" className="btn btn-outline-primary" onClick={() => dropRef.current?.querySelector('input[type=file]')?.click()}>Escolher arquivo</button>
                      </div>
                    )}
                    <input type="file" accept="image/*" className="d-none" onChange={handleInputFile} />
                  </div>
                  <div className="form-hint">Use imagens quadradas (512x512) para melhor qualidade.</div>
                </div>

                {error && (<div className="alert alert-danger" role="alert">{error}</div>)}
                {success && (<div className="alert alert-success" role="alert">{success}</div>)}

                <div className="d-flex gap-2">
                  <button type="submit" className="btn btn-primary" disabled={submitting}>
                    {submitting ? 'Enviando...' : 'Criar categoria'}
                  </button>
                  <button type="button" className="btn btn-outline-secondary" onClick={() => navigate('/categorias')}>Cancelar</button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card">
            <div className="card-body">
              <div className="text-secondary">Dicas de ícone</div>
              <ul className="mt-2">
                <li>Formato PNG transparente recomendado.</li>
                <li>Fundo claro e contraste com tema laranja.</li>
                <li>Evite texto no ícone; foque no pictograma.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}