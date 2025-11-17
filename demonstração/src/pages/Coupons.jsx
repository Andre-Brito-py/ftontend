import React, { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

// Utilitário de formatação
const brl = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0)

// Carrega e persiste cupons em localStorage (apenas demonstração)
const loadCoupons = () => {
  try {
    const raw = localStorage.getItem('demoCoupons')
    if (raw) return JSON.parse(raw)
  } catch {}
  // Mock inicial
  return [
    { id: 'WELCOME10', description: '10% off na primeira compra', type: 'percent', value: 10, active: true, minOrder: 0, startAt: null, endAt: null, usageLimit: 100 },
    { id: 'FRETE10', description: 'R$ 10 de desconto no frete', type: 'fixed', value: 10, active: true, minOrder: 50, startAt: null, endAt: null, usageLimit: 50 }
  ]
}
const saveCoupons = (items) => {
  localStorage.setItem('demoCoupons', JSON.stringify(items))
}

export default function CouponsPage() {
  const navigate = useNavigate()
  const [coupons, setCoupons] = useState(loadCoupons())
  const [query, setQuery] = useState('')
  useEffect(() => { saveCoupons(coupons) }, [coupons])

  const filtered = useMemo(() => {
    return coupons.filter(c => query ? c.id.toLowerCase().includes(query.toLowerCase()) || (c.description || '').toLowerCase().includes(query.toLowerCase()) : true)
  }, [coupons, query])

  const toggleActive = (id) => {
    setCoupons(prev => prev.map(c => c.id === id ? { ...c, active: !c.active } : c))
  }
  const removeCoupon = (id) => {
    if (!confirm('Excluir este cupom?')) return
    setCoupons(prev => prev.filter(c => c.id !== id))
  }

  return (
    <div className="page-body">
      <div className="container-xl">
        <div className="row g-2 align-items-center mb-3">
          <div className="col">
            <h2 className="page-title">Cupons de Desconto</h2>
            <div className="page-pretitle">Gerencie seus códigos promocionais</div>
          </div>
          <div className="col-auto ms-auto d-print-none">
            <div className="btn-list">
              <Link className="btn btn-primary" to="/cupons/novo">Novo cupom</Link>
            </div>
          </div>
        </div>

        <div className="card mb-3">
          <div className="card-body">
            <div className="row g-2">
              <div className="col-md-6">
                <input className="form-control" placeholder="Buscar por código ou descrição" value={query} onChange={e => setQuery(e.target.value)} />
              </div>
            </div>
          </div>
        </div>

        <div className="row row-cards">
          {filtered.map(c => (
            <div className="col-md-6" key={c.id}>
              <div className="card">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <h3 className="card-title mb-1">{c.id} {c.active ? <span className="badge bg-success ms-2">ativo</span> : <span className="badge bg-secondary ms-2">inativo</span>}</h3>
                      <div className="text-muted">{c.description || 'Sem descrição'}</div>
                    </div>
                    <div className="btn-list">
                      <button className="btn btn-outline-primary btn-sm" onClick={() => navigate(`/cupons/novo?edit=${encodeURIComponent(c.id)}`)}>Editar</button>
                      <button className="btn btn-outline-warning btn-sm" onClick={() => toggleActive(c.id)}>{c.active ? 'Desativar' : 'Ativar'}</button>
                      <button className="btn btn-outline-danger btn-sm" onClick={() => removeCoupon(c.id)}>Excluir</button>
                    </div>
                  </div>

                  <div className="mt-2">
                    <div className="row g-3">
                      <div className="col-sm-4">
                        <div className="text-muted">Tipo</div>
                        <div>{c.type === 'percent' ? 'Percentual' : 'Valor fixo'}</div>
                      </div>
                      <div className="col-sm-4">
                        <div className="text-muted">Desconto</div>
                        <div>{c.type === 'percent' ? `${c.value}%` : brl(c.value)}</div>
                      </div>
                      <div className="col-sm-4">
                        <div className="text-muted">Pedido mínimo</div>
                        <div>{c.minOrder ? brl(c.minOrder) : 'Sem mínimo'}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="col-12">
              <div className="card"><div className="card-body text-muted">Nenhum cupom encontrado.</div></div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}