import React, { useState } from 'react'
import EnhancedStats from '../components/EnhancedStats.jsx'
import ProfitabilityAnalysis from '../components/ProfitabilityAnalysis.jsx'

export default function StatisticsPage() {
  const [period, setPeriod] = useState('today')
  
  return (
    <div className="page">
      <div className="page-header">
        <div className="container-xl">
          <div className="row g-2 align-items-center">
            <div className="col">
              <h2 className="page-title">Estatísticas Detalhadas</h2>
              <div className="page-pretitle">Análise completa de desempenho e métricas</div>
            </div>
            <div className="col-auto ms-auto d-print-none">
              <div className="btn-list">
                <button className="btn btn-outline-primary" onClick={() => window.print()}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                    <path d="M17 17h2a2 2 0 0 0 2 -2v-4a2 2 0 0 0 -2 -2h-14a2 2 0 0 0 -2 2v4a2 2 0 0 0 2 2h2" />
                    <path d="M17 9v-4a2 2 0 0 0 -2 -2h-10a2 2 0 0 0 -2 2v8h2m8 0h8" />
                    <path d="M7 13h10" />
                  </svg>
                  Imprimir
                </button>
                <button className="btn btn-primary" onClick={() => alert('Exportação disponível em breve!')}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                    <path d="M14 3v4a1 1 0 0 0 1 1h4" />
                    <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" />
                    <path d="M12 11l0 6" />
                    <path d="M9 14l3 3l3 -3" />
                  </svg>
                  Exportar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="page-body">
        <EnhancedStats period={period} onPeriodChange={setPeriod} />
        <ProfitabilityAnalysis period={period} onPeriodChange={setPeriod} />
      </div>
    </div>
  )
}