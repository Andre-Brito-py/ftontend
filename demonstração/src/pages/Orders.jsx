import React, { useMemo, useState } from 'react'

const mockOrders = Array.from({ length: 25 }).map((_, i) => ({
  id: 1000 + i,
  customer: ['Ana', 'Bruno', 'Carla', 'Diego', 'Eva'][i % 5],
  total: [29.9, 45.5, 89.0, 17.0, 62.4][i % 5],
  method: ['PIX', 'Crédito', 'Débito', 'Dinheiro'][i % 4],
  status: ['Pago', 'Pendente', 'Cancelado'][i % 3],
  date: new Date(Date.now() - i * 86400000).toLocaleDateString('pt-BR')
}))

export default function OrdersPage() {
  const [query, setQuery] = useState('')
  const [method, setMethod] = useState('')

  const filtered = useMemo(() => {
    return mockOrders.filter(o =>
      (query ? String(o.id).includes(query) || o.customer.toLowerCase().includes(query.toLowerCase()) : true) &&
      (method ? o.method === method : true)
    )
  }, [query, method])

  return (
    <div className="page-body">
      <div className="container-xl">
        <div className="row g-2 align-items-center mb-3">
          <div className="col">
            <h2 className="page-title">Pedidos</h2>
            <div className="page-pretitle">Demonstração com estilos do Tabler</div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="row mb-3">
              <div className="col-md-6">
                <input className="form-control" placeholder="Buscar por ID ou cliente" value={query} onChange={e => setQuery(e.target.value)} />
              </div>
              <div className="col-md-3">
                <select className="form-select" value={method} onChange={e => setMethod(e.target.value)}>
                  <option value="">Todos métodos</option>
                  <option>PIX</option>
                  <option>Crédito</option>
                  <option>Débito</option>
                  <option>Dinheiro</option>
                </select>
              </div>
            </div>

            <div className="table-responsive">
              <table className="table table-vcenter">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Cliente</th>
                    <th>Data</th>
                    <th>Método</th>
                    <th>Status</th>
                    <th className="text-end">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(o => (
                    <tr key={o.id}>
                      <td>{o.id}</td>
                      <td>{o.customer}</td>
                      <td>{o.date}</td>
                      <td><span className="badge bg-secondary-lt">{o.method}</span></td>
                      <td>{o.status}</td>
                      <td className="text-end">R$ {o.total.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}