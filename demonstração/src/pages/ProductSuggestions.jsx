import React, { useState, useEffect } from 'react'

// Dados simulados de produtos
const mockProducts = [
  { _id: '1', name: 'Pizza Margherita', image: 'food_1-iEOlQHK4.png', price: 35.90 },
  { _id: '2', name: 'Hambúrguer Clássico', image: 'food_2-Bviin0XJ.png', price: 28.50 },
  { _id: '3', name: 'Salada Caesar', image: 'food_3-DFGIQWuA.png', price: 22.90 },
  { _id: '4', name: 'Sushi Combo', image: 'food_4-DA8g0Kmx.png', price: 45.00 },
  { _id: '5', name: 'Tacos Mexicanos', image: 'food_5-DCZk6AQV.png', price: 32.00 },
  { _id: '6', name: 'Strogonoff', image: 'food_6-Cz8hlc5i.png', price: 38.90 }
]

// Dados simulados de sugestões
const mockSuggestions = [
  {
    _id: '1',
    productId: { _id: '1', name: 'Pizza Margherita', image: 'food_1-iEOlQHK4.png' },
    suggestedProductId: { _id: '2', name: 'Hambúrguer Clássico', image: 'food_2-Bviin0XJ.png' },
    title: 'Que tal adicionar?',
    description: 'Complete seu pedido com um hambúrguer clássico',
    order: 1,
    isActive: true
  },
  {
    _id: '2',
    productId: { _id: '3', name: 'Salada Caesar', image: 'food_3-DFGIQWuA.png' },
    suggestedProductId: { _id: '4', name: 'Sushi Combo', image: 'food_4-DA8g0Kmx.png' },
    title: 'Perfeito para compartilhar',
    description: 'Adicione um sushi combo para compartilhar',
    order: 2,
    isActive: false
  }
]

export default function ProductSuggestionsPage() {
  const [suggestions, setSuggestions] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingSuggestion, setEditingSuggestion] = useState(null)
  const [formData, setFormData] = useState({
    productId: '',
    suggestedProductId: '',
    title: 'Que tal adicionar?',
    description: '',
    order: 0,
    isActive: true
  })

  useEffect(() => {
    // Simular carregamento de dados
    setTimeout(() => {
      setSuggestions(mockSuggestions)
      setProducts(mockProducts)
      setLoading(false)
    }, 500)
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (formData.productId === formData.suggestedProductId) {
      alert('Um produto não pode ser sugestão de si mesmo')
      return
    }

    const product = products.find(p => p._id === formData.productId)
    const suggestedProduct = products.find(p => p._id === formData.suggestedProductId)

    if (editingSuggestion) {
      // Editar sugestão existente
      setSuggestions(prev => prev.map(s => 
        s._id === editingSuggestion._id 
          ? {
              ...s,
              productId: { _id: product._id, name: product.name, image: product.image },
              suggestedProductId: { _id: suggestedProduct._id, name: suggestedProduct.name, image: suggestedProduct.image },
              title: formData.title,
              description: formData.description,
              order: formData.order,
              isActive: formData.isActive
            }
          : s
      ))
      alert('Sugestão atualizada com sucesso!')
    } else {
      // Criar nova sugestão
      const newSuggestion = {
        _id: Date.now().toString(),
        productId: { _id: product._id, name: product.name, image: product.image },
        suggestedProductId: { _id: suggestedProduct._id, name: suggestedProduct.name, image: suggestedProduct.image },
        title: formData.title,
        description: formData.description,
        order: formData.order,
        isActive: formData.isActive
      }
      setSuggestions(prev => [...prev, newSuggestion])
      alert('Sugestão criada com sucesso!')
    }

    handleCloseModal()
  }

  const handleEdit = (suggestion) => {
    setEditingSuggestion(suggestion)
    setFormData({
      productId: suggestion.productId._id,
      suggestedProductId: suggestion.suggestedProductId._id,
      title: suggestion.title,
      description: suggestion.description,
      order: suggestion.order,
      isActive: suggestion.isActive
    })
    setShowModal(true)
  }

  const handleDelete = (suggestionId) => {
    if (window.confirm('Tem certeza que deseja excluir esta sugestão?')) {
      setSuggestions(prev => prev.filter(s => s._id !== suggestionId))
      alert('Sugestão excluída com sucesso!')
    }
  }

  const toggleActive = (suggestion) => {
    setSuggestions(prev => prev.map(s => 
      s._id === suggestion._id 
        ? { ...s, isActive: !s.isActive }
        : s
    ))
    alert('Status atualizado com sucesso!')
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingSuggestion(null)
    setFormData({
      productId: '',
      suggestedProductId: '',
      title: 'Que tal adicionar?',
      description: '',
      order: 0,
      isActive: true
    })
  }

  if (loading) {
    return (
      <div className="container-xl">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Carregando...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container-xl">
      <div className="page-header">
        <div className="row g-2 align-items-center">
          <div className="col">
            <h2 className="page-title">Sugestões de Produtos</h2>
            <div className="page-pretitle">Configure sugestões de produtos complementares</div>
          </div>
          <div className="col-auto ms-auto">
            <button className="btn btn-primary" onClick={() => setShowModal(true)}>
              <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                <path d="M12 5l0 14" />
                <path d="M5 12l14 0" />
              </svg>
              Nova Sugestão
            </button>
          </div>
        </div>
      </div>

      <div className="row row-cards">
        <div className="col-12">
          <div className="card">
            <div className="table-responsive">
              <table className="table table-vcenter card-table">
                <thead>
                  <tr>
                    <th>Produto Principal</th>
                    <th>Produto Sugerido</th>
                    <th>Título</th>
                    <th>Ordem</th>
                    <th>Status</th>
                    <th className="w-1">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {suggestions.map((suggestion) => (
                    <tr key={suggestion._id}>
                      <td>
                        <div className="d-flex align-items-center">
                          <img 
                            src={`/pratos/${suggestion.productId.image}`}
                            alt={suggestion.productId.name}
                            className="avatar avatar-sm me-3"
                            style={{ objectFit: 'cover' }}
                          />
                          <div>
                            <div className="font-weight-medium">{suggestion.productId.name}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <img 
                            src={`/pratos/${suggestion.suggestedProductId.image}`}
                            alt={suggestion.suggestedProductId.name}
                            className="avatar avatar-sm me-3"
                            style={{ objectFit: 'cover' }}
                          />
                          <div>
                            <div className="font-weight-medium">{suggestion.suggestedProductId.name}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="text-muted">{suggestion.title}</div>
                        {suggestion.description && (
                          <div className="small text-muted">{suggestion.description}</div>
                        )}
                      </td>
                      <td>
                        <span className="badge bg-blue text-blue-fg">{suggestion.order}</span>
                      </td>
                      <td>
                        <button 
                          className={`badge ${suggestion.isActive ? 'bg-green text-green-fg' : 'bg-red text-red-fg'}`}
                          onClick={() => toggleActive(suggestion)}
                          style={{ cursor: 'pointer', border: 'none', background: 'transparent' }}
                        >
                          {suggestion.isActive ? 'Ativo' : 'Inativo'}
                        </button>
                      </td>
                      <td>
                        <div className="btn-list flex-nowrap">
                          <button 
                            className="btn btn-white btn-sm"
                            onClick={() => handleEdit(suggestion)}
                          >
                            Editar
                          </button>
                          <button 
                            className="btn btn-white btn-sm"
                            onClick={() => handleDelete(suggestion._id)}
                          >
                            Excluir
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {suggestions.length === 0 && (
                <div className="empty">
                  <div className="empty-img">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icon-tabler-bulb">
                      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                      <path d="M3 12h1m8 -9v1m8 8h1m-15.4 -6.4l.7 .7m12.1 -.7l-.7 .7" />
                      <path d="M9 12a5 5 0 1 1 10 0a5 5 0 0 1 -10 0" />
                      <path d="M9 16a5 5 0 1 1 6 0a3.5 3.5 0 0 1 -6 0" />
                      <path d="M9.5 20l1.5 2l1.5 -2" />
                    </svg>
                  </div>
                  <p className="empty-title">Nenhuma sugestão encontrada</p>
                  <p className="empty-subtitle text-muted">
                    Crie sua primeira sugestão de produto para começar a vender mais.
                  </p>
                  <div className="empty-action">
                    <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                        <path d="M12 5l0 14" />
                        <path d="M5 12l14 0" />
                      </svg>
                      Criar primeira sugestão
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal modal-blur fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingSuggestion ? 'Editar Sugestão' : 'Nova Sugestão'}
                </h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={handleCloseModal}
                ></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Produto Principal</label>
                        <select 
                          className="form-select"
                          value={formData.productId}
                          onChange={(e) => setFormData({...formData, productId: e.target.value})}
                          required
                        >
                          <option value="">Selecione um produto</option>
                          {products.map(product => (
                            <option key={product._id} value={product._id}>
                              {product.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Produto Sugerido</label>
                        <select 
                          className="form-select"
                          value={formData.suggestedProductId}
                          onChange={(e) => setFormData({...formData, suggestedProductId: e.target.value})}
                          required
                        >
                          <option value="">Selecione um produto</option>
                          {products.map(product => (
                            <option key={product._id} value={product._id}>
                              {product.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">Título da Sugestão</label>
                    <input 
                      type="text"
                      className="form-control"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      placeholder="Ex: Que tal adicionar?"
                      required
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">Descrição</label>
                    <textarea 
                      className="form-control"
                      rows="3"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      placeholder="Descreva a sugestão..."
                    />
                  </div>
                  
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Ordem de Exibição</label>
                        <input 
                          type="number"
                          className="form-control"
                          value={formData.order}
                          onChange={(e) => setFormData({...formData, order: parseInt(e.target.value) || 0})}
                          min="0"
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-check">
                          <input 
                            type="checkbox"
                            className="form-check-input"
                            checked={formData.isActive}
                            onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                          />
                          <span className="form-check-label">Ativo</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-white"
                    onClick={handleCloseModal}
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingSuggestion ? 'Atualizar' : 'Criar'} Sugestão
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}