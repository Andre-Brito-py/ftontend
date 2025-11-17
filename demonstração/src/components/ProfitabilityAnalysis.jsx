import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';

export default function ProfitabilityAnalysis({ period, onPeriodChange }) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Simple theme detection without observer to prevent infinite loops
    const checkTheme = () => {
      const body = document.body;
      setIsDarkMode(body.classList.contains('theme-dark'));
    };

    checkTheme();
    
    // Check theme periodically instead of using MutationObserver
    const interval = setInterval(checkTheme, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const getMockData = (period) => {
    const baseData = {
      today: {
        couponRevenue: 8500,
        couponCost: 3200,
        couponProfit: 5300,
        cashbackEarned: 12000,
        cashbackRedeemed: 8500,
        cashbackExpired: 1500,
        cashbackProfit: 2000
      },
      week: {
        couponRevenue: 45000,
        couponCost: 18000,
        couponProfit: 27000,
        cashbackEarned: 65000,
        cashbackRedeemed: 48000,
        cashbackExpired: 8000,
        cashbackProfit: 9000
      },
      month: {
        couponRevenue: 180000,
        couponCost: 72000,
        couponProfit: 108000,
        cashbackEarned: 250000,
        cashbackRedeemed: 185000,
        cashbackExpired: 35000,
        cashbackProfit: 30000
      },
      year: {
        couponRevenue: 2100000,
        couponCost: 840000,
        couponProfit: 1260000,
        cashbackEarned: 3000000,
        cashbackRedeemed: 2200000,
        cashbackExpired: 400000,
        cashbackProfit: 400000
      }
    };

    return baseData[period] || baseData.today;
  };

  const data = getMockData(period);

  const couponProfitabilityOptions = {
    chart: {
      type: 'bar',
      height: 350,
      toolbar: { show: false }
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        endingShape: 'rounded'
      },
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    xaxis: {
      categories: ['Cupons'],
      labels: {
        style: {
          colors: isDarkMode ? '#ffffff' : '#000000'
        }
      }
    },
    yaxis: {
      title: {
        text: 'Valor (R$)',
        style: {
          color: isDarkMode ? '#ffffff' : '#000000'
        }
      },
      labels: {
        style: {
          colors: isDarkMode ? '#ffffff' : '#000000'
        }
      }
    },
    fill: {
      opacity: 1
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return "R$ " + val.toLocaleString('pt-BR')
        }
      }
    },
    legend: {
      labels: {
        colors: isDarkMode ? '#ffffff' : '#000000'
      }
    }
  };

  const couponProfitabilitySeries = [
    {
      name: 'Receita',
      data: [data.couponRevenue]
    },
    {
      name: 'Custo',
      data: [data.couponCost]
    },
    {
      name: 'Lucro',
      data: [data.couponProfit]
    }
  ];

  const couponROIOptions = {
    chart: {
      height: 350,
      type: 'radialBar',
    },
    plotOptions: {
      radialBar: {
        dataLabels: {
          name: {
            fontSize: '22px',
            color: isDarkMode ? '#ffffff' : '#000000'
          },
          value: {
            fontSize: '16px',
            color: isDarkMode ? '#ffffff' : '#000000'
          },
          total: {
            show: true,
            label: 'ROI Total',
            color: isDarkMode ? '#ffffff' : '#000000',
            formatter: function () {
              return ((data.couponProfit / data.couponCost) * 100).toFixed(1) + '%'
            }
          }
        }
      }
    },
    labels: ['ROI Cupons'],
    colors: ['#20E647']
  };

  const couponROISeries = [(data.couponProfit / data.couponCost) * 100];

  const cashbackProfitabilityOptions = {
    chart: {
      height: 350,
      type: 'area',
      toolbar: { show: false }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth'
    },
    xaxis: {
      categories: ['Ganhos', 'Resgatados', 'Expirados', 'Lucro'],
      labels: {
        style: {
          colors: isDarkMode ? '#ffffff' : '#000000'
        }
      }
    },
    yaxis: {
      title: {
        text: 'Valor (R$)',
        style: {
          color: isDarkMode ? '#ffffff' : '#000000'
        }
      },
      labels: {
        style: {
          colors: isDarkMode ? '#ffffff' : '#000000'
        }
      }
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return "R$ " + val.toLocaleString('pt-BR')
        }
      }
    },
    legend: {
      labels: {
        colors: isDarkMode ? '#ffffff' : '#000000'
      }
    }
  };

  const cashbackProfitabilitySeries = [
    {
      name: 'Cashback',
      data: [data.cashbackEarned, data.cashbackRedeemed, data.cashbackExpired, data.cashbackProfit]
    }
  ];

  const comparativeOptions = {
    chart: {
      height: 350,
      type: 'line',
      toolbar: { show: false }
    },
    stroke: {
      width: 7,
      curve: 'smooth'
    },
    xaxis: {
      categories: ['Período Atual'],
      labels: {
        style: {
          colors: isDarkMode ? '#ffffff' : '#000000'
        }
      }
    },
    yaxis: {
      title: {
        text: 'Lucro (R$)',
        style: {
          color: isDarkMode ? '#ffffff' : '#000000'
        }
      },
      labels: {
        style: {
          colors: isDarkMode ? '#ffffff' : '#000000'
        }
      }
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return "R$ " + val.toLocaleString('pt-BR')
        }
      }
    },
    legend: {
      labels: {
        colors: isDarkMode ? '#ffffff' : '#000000'
      }
    }
  };

  const comparativeSeries = [
    {
      name: 'Cupons',
      data: [data.couponProfit]
    },
    {
      name: 'Cashback',
      data: [data.cashbackProfit]
    }
  ];

  return (
    <div className="container-xl">
      <div className="row mb-4">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Análise de Lucratividade - Cupons e Cashback</h3>
              <div className="card-actions">
                <div className="btn-group">
                  <button 
                    className={`btn btn-sm ${period === 'today' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => onPeriodChange('today')}
                  >
                    Hoje
                  </button>
                  <button 
                    className={`btn btn-sm ${period === 'week' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => onPeriodChange('week')}
                  >
                    Semana
                  </button>
                  <button 
                    className={`btn btn-sm ${period === 'month' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => onPeriodChange('month')}
                  >
                    Mês
                  </button>
                  <button 
                    className={`btn btn-sm ${period === 'year' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => onPeriodChange('year')}
                  >
                    Ano
                  </button>
                </div>
              </div>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6 mb-4">
                  <h4 className="mb-3">Lucratividade dos Cupons</h4>
                  <ReactApexChart options={couponProfitabilityOptions} series={couponProfitabilitySeries} type="bar" height={350} />
                </div>
                <div className="col-md-6 mb-4">
                  <h4 className="mb-3">ROI dos Cupons</h4>
                  <ReactApexChart options={couponROIOptions} series={couponROISeries} type="radialBar" height={350} />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-4">
                  <h4 className="mb-3">Análise do Cashback</h4>
                  <ReactApexChart options={cashbackProfitabilityOptions} series={cashbackProfitabilitySeries} type="area" height={350} />
                </div>
                <div className="col-md-6 mb-4">
                  <h4 className="mb-3">Comparativo: Cupons vs Cashback</h4>
                  <ReactApexChart options={comparativeOptions} series={comparativeSeries} type="line" height={350} />
                </div>
              </div>

              <div className="row mt-4">
                <div className="col-12">
                  <h4 className="mb-3">Resumo de Lucratividade</h4>
                  <div className="table-responsive">
                    <table className="table table-vcenter">
                      <thead>
                        <tr>
                          <th>Métrica</th>
                          <th className="text-end">Cupons</th>
                          <th className="text-end">Cashback</th>
                          <th className="text-end">Total</th>
                          <th className="text-end">Eficiência</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>
                            <div className="d-flex align-items-center">
                              <div className="text-truncate">
                                <strong>Receita Gerada</strong>
                              </div>
                            </div>
                          </td>
                          <td className="text-end text-success fw-bold">R$ {data.couponRevenue.toLocaleString('pt-BR')}</td>
                          <td className="text-end text-success fw-bold">R$ {data.cashbackEarned.toLocaleString('pt-BR')}</td>
                          <td className="text-end text-success fw-bold">R$ {(data.couponRevenue + data.cashbackEarned).toLocaleString('pt-BR')}</td>
                          <td className="text-end">
                            <span className="badge bg-success">Alta</span>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <div className="d-flex align-items-center">
                              <div className="text-truncate">
                                <strong>Custo/Resgate</strong>
                              </div>
                            </div>
                          </td>
                          <td className="text-end text-danger fw-bold">R$ {data.couponCost.toLocaleString('pt-BR')}</td>
                          <td className="text-end text-danger fw-bold">R$ {data.cashbackRedeemed.toLocaleString('pt-BR')}</td>
                          <td className="text-end text-danger fw-bold">R$ {(data.couponCost + data.cashbackRedeemed).toLocaleString('pt-BR')}</td>
                          <td className="text-end">
                            <span className="badge bg-warning">Média</span>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <div className="d-flex align-items-center">
                              <div className="text-truncate">
                                <strong>Lucro Líquido</strong>
                              </div>
                            </div>
                          </td>
                          <td className="text-end text-primary fw-bold">R$ {data.couponProfit.toLocaleString('pt-BR')}</td>
                          <td className="text-end text-primary fw-bold">R$ {data.cashbackProfit.toLocaleString('pt-BR')}</td>
                          <td className="text-end text-primary fw-bold">R$ {(data.couponProfit + data.cashbackProfit).toLocaleString('pt-BR')}</td>
                          <td className="text-end">
                            <span className="badge bg-success">Excelente</span>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <div className="d-flex align-items-center">
                              <div className="text-truncate">
                                <strong>ROI (%)</strong>
                              </div>
                            </div>
                          </td>
                          <td className="text-end fw-bold">{((data.couponProfit / data.couponCost) * 100).toFixed(1)}%</td>
                          <td className="text-end fw-bold">{((data.cashbackProfit / data.cashbackEarned) * 100).toFixed(1)}%</td>
                          <td className="text-end fw-bold">{(((data.couponProfit + data.cashbackProfit) / (data.couponCost + data.cashbackEarned)) * 100).toFixed(1)}%</td>
                          <td className="text-end">
                            <div className="progress progress-sm">
                              <div className="progress-bar bg-success" style={{width: '85%'}}></div>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="row mt-4">
                <div className="col-md-3">
                  <div className="card card-sm">
                    <div className="card-body">
                      <div className="row align-items-center">
                        <div className="col-auto">
                          <span className="bg-green text-white avatar">
                            <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                              <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                              <path d="M3 21h18" />
                              <path d="M5 21v-16a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v16m-6 -10h4m-4 4h4m-4 4h4" />
                            </svg>
                          </span>
                        </div>
                        <div className="col">
                          <div className="font-weight-medium">
                            R$ {(data.couponProfit + data.cashbackProfit).toLocaleString('pt-BR')}
                          </div>
                          <div className="text-secondary">
                            Lucro Total
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="card card-sm">
                    <div className="card-body">
                      <div className="row align-items-center">
                        <div className="col-auto">
                          <span className="bg-blue text-white avatar">
                            <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                              <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                              <path d="M9 12l2 2l4 -4" />
                              <path d="M21 12c0 4.97 -4.03 9 -9 9s-9 -4.03 -9 -9s4.03 -9 9 -9s9 4.03 9 9z" />
                            </svg>
                          </span>
                        </div>
                        <div className="col">
                          <div className="font-weight-medium">
                            {(((data.couponProfit + data.cashbackProfit) / (data.couponCost + data.cashbackEarned)) * 100).toFixed(1)}%
                          </div>
                          <div className="text-secondary">
                            ROI Total
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="card card-sm">
                    <div className="card-body">
                      <div className="row align-items-center">
                        <div className="col-auto">
                          <span className="bg-yellow text-white avatar">
                            <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                              <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                              <path d="M12 2l3.09 6.26l6.91 1l-5 4.87l1.18 6.88l-6.18 -3.25l-6.18 3.25l1.18 -6.88l-5 -4.87l6.91 -1z" />
                            </svg>
                          </span>
                        </div>
                        <div className="col">
                          <div className="font-weight-medium">
                            R$ {data.couponRevenue.toLocaleString('pt-BR')}
                          </div>
                          <div className="text-secondary">
                            Receita Cupons
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="card card-sm">
                    <div className="card-body">
                      <div className="row align-items-center">
                        <div className="col-auto">
                          <span className="bg-purple text-white avatar">
                            <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                              <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                              <path d="M12 2c5.523 0 10 4.477 10 10s-4.477 10 -10 10s-10 -4.477 -10 -10s4.477 -10 10 -10z" />
                              <path d="M12 6v6l4 2" />
                            </svg>
                          </span>
                        </div>
                        <div className="col">
                          <div className="font-weight-medium">
                            R$ {data.cashbackEarned.toLocaleString('pt-BR')}
                          </div>
                          <div className="text-secondary">
                            Cashback Gerado
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}