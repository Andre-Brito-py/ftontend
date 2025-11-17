import React from 'react'
import { Link } from 'react-router-dom'

export default function ProductsPage() {
  return (
    <div className="container-xl">
      <div className="page-header">
        <div className="row g-2 align-items-center">
          <div className="col">
            <h2 className="page-title">Produtos</h2>
            <div className="page-pretitle">Gerencie os itens do seu cardápio</div>
          </div>
          <div className="col-auto ms-auto">
            <Link className="btn btn-primary" to="/produtos/novo">Novo produto</Link>
          </div>
        </div>
      </div>

      <div className="row row-cards">
        <div className="col-12">
          <div className="card">
            <div className="card-body text-secondary">
              Esta é uma página de demonstração. A listagem pode ser conectada ao backend futuramente.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}