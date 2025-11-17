import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

const brl = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0)
const loadCoupons = () => { try { const raw = localStorage.getItem('demoCoupons'); if (raw) return JSON.parse(raw) } catch {} ; return [] }
const saveCoupons = (items) => localStorage.setItem('demoCoupons', JSON.stringify(items))

export default function CreateCouponPage() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const editingId = params.get('edit')
  const coupons = useMemo(() => loadCoupons(), [])
  const existing = useMemo(() => coupons.find(c => c.id === editingId), [coupons, editingId])

  const [form, setForm] = useState(() => existing || {
    id: '', description: '', type: 'percent', value: 10, minOrder: 0,
    startAt: '', endAt: '', usageLimit: 0, active: true
  })
  const [errors, setErrors] = useState({})

  useEffect(() => { if (existing) setForm(existing) }, [existing])

  const validate = () => {
    const e = {}
    if (!form.id || form.id.trim().length < 3) e.id = 'Código com 3+ caracteres'
    if (form.type !== 'percent' && form.type !== 'fixed') e.type = 'Tipo inválido'
    if (Number(form.value) <= 0) e.value = 'Valor de desconto deve ser maior que zero'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const onSubmit = (ev) => {
    ev.preventDefault()
    if (!validate()) return
    const items = loadCoupons()
    const idx = items.findIndex(c => c.id === form.id)
    const payload = { ...form, value: Number(form.value), minOrder: Number(form.minOrder || 0), usageLimit: Number(form.usageLimit || 0) }
    if (idx >= 0) items[idx] = payload; else items.push(payload)
    saveCoupons(items)
    navigate('/cupons')
  }

  return (
    <div className="page-body">
      <div className="container-xl">
        <div className="row g-2 align-items-center mb-3">
          <div className="col">
            <h2 className="page-title">{editingId ? `Editar Cupom ${editingId}` : 'Novo Cupom'}</h2>
            <div className="page-pretitle">Defina código, tipo e regras de aplicação</div>
          </div>
        </div>

        <form onSubmit={onSubmit}>
          <div className="row row-cards">
            <div className="col-md-8">
              <div className="card">
                <div className="card-body">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Código do Cupom</label>
                      <input className={`form-control ${errors.id ? 'is-invalid' : ''}`} value={form.id} onChange={e => setForm(f => ({ ...f, id: e.target.value.toUpperCase().replace(/\s/g, '') }))} placeholder="EX: BEMVINDO10" />
                      {errors.id && <div className="invalid-feedback">{errors.id}</div>}
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Descrição</label>
                      <input className="form-control" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Ex.: 10% na primeira compra" />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Tipo de Desconto</label>
                      <select className={`form-select ${errors.type ? 'is-invalid' : ''}`} value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                        <option value="percent">Percentual (%)</option>
                        <option value="fixed">Valor fixo (R$)</option>
                      </select>
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Valor</label>
                      <input type="number" min="0" step="0.01" className={`form-control ${errors.value ? 'is-invalid' : ''}`} value={form.value} onChange={e => setForm(f => ({ ...f, value: e.target.value }))} />
                      {errors.value && <div className="invalid-feedback">{errors.value}</div>}
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Pedido Mínimo</label>
                      <input type="number" min="0" step="0.01" className="form-control" value={form.minOrder} onChange={e => setForm(f => ({ ...f, minOrder: e.target.value }))} />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label">Início</label>
                      <input type="date" className="form-control" value={form.startAt || ''} onChange={e => setForm(f => ({ ...f, startAt: e.target.value }))} />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Fim</label>
                      <input type="date" className="form-control" value={form.endAt || ''} onChange={e => setForm(f => ({ ...f, endAt: e.target.value }))} />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Limite de Uso</label>
                      <input type="number" min="0" className="form-control" value={form.usageLimit} onChange={e => setForm(f => ({ ...f, usageLimit: e.target.value }))} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card">
                <div className="card-body">
                  <div className="form-check form-switch">
                    <input className="form-check-input" type="checkbox" id="activeSwitch" checked={form.active} onChange={e => setForm(f => ({ ...f, active: e.target.checked }))} />
                    <label className="form-check-label" htmlFor="activeSwitch">Cupom ativo</label>
                  </div>
                  <div className="mt-3 text-muted">Resumo</div>
                  <ul className="list-unstyled mb-0">
                    <li><strong>Código:</strong> {form.id || '(defina)'}</li>
                    <li><strong>Tipo:</strong> {form.type === 'percent' ? 'Percentual' : 'Valor fixo'}</li>
                    <li><strong>Valor:</strong> {form.type === 'percent' ? `${form.value}%` : brl(form.value)}</li>
                    <li><strong>Mínimo:</strong> {form.minOrder ? brl(form.minOrder) : '—'}</li>
                    <li><strong>Janela:</strong> {(form.startAt || '—') + ' até ' + (form.endAt || '—')}</li>
                    <li><strong>Limite:</strong> {form.usageLimit || '—'}</li>
                  </ul>
                </div>
                <div className="card-footer">
                  <div className="btn-list">
                    <button type="button" className="btn" onClick={() => navigate('/cupons')}>Cancelar</button>
                    <button type="submit" className="btn btn-primary">Salvar cupom</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}