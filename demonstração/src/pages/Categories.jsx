import React, { useMemo } from 'react'

// Usa as mesmas imagens de categorias do backend original via /images
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4001'

export default function CategoriesPage() {
  const storeId = typeof window !== 'undefined' ? localStorage.getItem('storeId') : null
  const qs = storeId ? `?storeId=${storeId}` : ''

  // Categorias padrão idênticas às seeds do backend
  const categories = useMemo(() => ([
    { name: 'Bolos', description: 'Bolos e tortas', isActive: true, image: 'bolos.png' },
    { name: 'Comidas Exóticas', description: 'Sabores especiais do mundo', isActive: true, image: 'comidas_exoticas.png' },
    { name: 'Massas', description: 'Massas com molhos variados', isActive: true, image: 'massas.png' },
    { name: 'Refeições', description: 'Pratos principais da casa', isActive: true, image: 'refeições.png' },
    { name: 'Rolinhos', description: 'Rolinhos e acompanhamentos', isActive: true, image: 'rolinhos.png' },
    { name: 'Sanduíches Naturais', description: 'Opções leves e saudáveis', isActive: true, image: 'sanduiches_naturais.png' },
    { name: 'Sobremesas', description: 'Doces e delícias', isActive: true, image: 'sobremesas.png' }
  ]), [])

  return (
    <div className="container-xl">
      <div className="page-header">
        <h2 className="page-title">Gerenciar Categorias</h2>
        <div className="ms-auto">
          <a className="btn btn-primary" href="/categorias/nova">Nova categoria</a>
        </div>
      </div>

      <div className="row row-cards">
        {categories.map((cat) => (
          <div key={cat.name} className="col-sm-6 col-lg-4">
            <div className={`card ${cat.isActive ? '' : 'border-danger'}`}>
              <div className="card-img-top" style={{ height: 160, overflow: 'hidden' }}>
                <img src={`${apiUrl}/images/${encodeURIComponent(cat.image)}${qs}`} alt={cat.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div className="card-body">
                <div className="d-flex align-items-center mb-2">
                  <div>
                    <div className="h4 m-0">{cat.name}</div>
                    <div className="text-secondary-dark">{cat.description}</div>
                  </div>
                  <span className={`badge ms-auto ${cat.isActive ? 'bg-success' : 'bg-danger'}`}>
                    {cat.isActive ? 'Ativa' : 'Inativa'}
                  </span>
                </div>
                <div className="d-flex gap-2">
                  <button className="btn btn-outline-primary btn-sm">Editar</button>
                  <button className="btn btn-outline-warning btn-sm">Desativar</button>
                  <button className="btn btn-outline-danger btn-sm">Excluir</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}