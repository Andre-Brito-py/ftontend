import React, { useMemo, useState, useEffect } from 'react';
import axios from 'axios';
import './AdminDashboard.css';
import { useTheme } from '../../contexts/ThemeContext.jsx';
import ReactApexChart from 'react-apexcharts';
import { toast } from 'react-toastify';
// World map removido do dashboard do Admin por não ser útil aqui

// Util: rótulos amigáveis
const deliveryLabels = {
  delivery: 'Entrega',
  waiter: 'Garçom',
  in_person: 'Presencial',
  counter: 'Balcão',
};

const paymentLabels = {
  pix: 'PIX',
  dinheiro: 'Dinheiro',
  cartao_credito: 'Cartão Crédito',
  cartao_debito: 'Cartão Débito',
  vale_refeicao: 'Vale Refeição',
  vale_alimentacao: 'Vale Alimentação',
};

// Componente de gráfico usando ReactApexCharts (npm)
const ChartBlock = ({ type, options, series }) => {
  const merged = {
    chart: { type, height: 280, toolbar: { show: true } },
    ...options,
  };
  return (
    <ReactApexChart type={type} height={280} options={merged} series={series} />
  );
};

const AdminDashboard = ({ url, token }) => {
  const { theme } = useTheme?.() || { theme: 'light' };
  const isDark = theme === 'dark' || document.body.classList.contains('theme-dark');

  // Paleta Zappy baseada nas variáveis do design system
  const zappyColors = useMemo(() => {
    const css = getComputedStyle(document.documentElement);
    const getVar = (name, fallback) => (css.getPropertyValue(name)?.trim() || fallback);
    return [
      getVar('--primary-color', isDark ? '#f59e0b' : '#f97316'),
      getVar('--secondary-color', isDark ? '#60a5fa' : '#0ea5e9'),
      getVar('--success-color', isDark ? '#22c55e' : '#22c55e'),
      getVar('--warning-color', isDark ? '#fbbf24' : '#f59e0b'),
      getVar('--error-color', isDark ? '#f87171' : '#ef4444'),
    ];
  }, [isDark, theme]);
  const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' });
  const [salesType, setSalesType] = useState('all'); // delivery, waiter, in_person, counter
  const [paymentMethod, setPaymentMethod] = useState('all');
  const [chartType, setChartType] = useState('bar'); // bar | line | pie
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [dailyStats, setDailyStats] = useState([]);
  const [deliveryStats, setDeliveryStats] = useState([]);
  const [paymentStats, setPaymentStats] = useState([]);

  const headers = useMemo(() => {
    const localToken = token || localStorage.getItem('token');
    const storeId = localStorage.getItem('storeId');
    const h = {
      Authorization: localToken ? `Bearer ${localToken}` : '',
    };
    if (storeId) {
      h['X-Store-ID'] = storeId;
    }
    return h;
  }, [token]);

  const loadData = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (dateRange.startDate) params.append('startDate', dateRange.startDate);
      if (dateRange.endDate) params.append('endDate', dateRange.endDate);

      const [ordersRes, dailyRes, deliveryRes, paymentRes] = await Promise.all([
        axios.get(`${url}/api/order/list`, { headers }),
        axios.get(`${url}/api/order-stats/daily-stats?days=30`, { headers }),
        axios.get(`${url}/api/order-stats/delivery-stats?${params.toString()}`, { headers }),
        axios.get(`${url}/api/payment-stats/payment-stats`, { headers, params: {
          startDate: dateRange.startDate || undefined,
          endDate: dateRange.endDate || undefined,
        } }),
      ]);

      setOrders(ordersRes.data?.data || []);
      setDailyStats(dailyRes.data?.data?.dailyStats || []);
      setDeliveryStats(deliveryRes.data?.data?.stats || []);
      setPaymentStats(paymentRes.data?.data?.stats || []);
    } catch (err) {
      // Mostrar aviso discreto e manter UI funcional
      const msg = err?.response?.data?.message || err.message || 'Falha ao carregar dados';
      toast.error('Erro ao carregar dados do dashboard');
      console.warn('Dashboard: erro ao carregar dados ->', msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateRange.startDate, dateRange.endDate]);

  // Filtragem local em orders
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const byType = salesType === 'all' ? true : o.deliveryType === salesType;
      const byPay = paymentMethod === 'all' ? true : o.paymentMethod === paymentMethod;
      const byDate = (() => {
        if (!dateRange.startDate && !dateRange.endDate) return true;
        const d = new Date(o.createdAt);
        const s = dateRange.startDate ? new Date(dateRange.startDate) : null;
        const e = dateRange.endDate ? new Date(dateRange.endDate) : null;
        if (s && d < s) return false;
        if (e && d > e) return false;
        return true;
      })();
      return byType && byPay && byDate;
    });
  }, [orders, salesType, paymentMethod, dateRange]);

  // KPIs
  const currencyBRL = useMemo(() => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }), []);
  const isSameDay = (d1, d2) => d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
  const kpis = useMemo(() => {
    const totalOrders = filteredOrders.length;
    const totalRevenue = filteredOrders.reduce((sum, o) => sum + (o.amount || 0), 0);
    const avgTicket = totalOrders ? totalRevenue / totalOrders : 0;
    const today = new Date();
    const revenueToday = filteredOrders.reduce((sum, o) => {
      const d = new Date(o.createdAt);
      return isSameDay(d, today) ? sum + (o.amount || 0) : sum;
    }, 0);
    const payCount = new Map();
    filteredOrders.forEach((o) => {
      const pm = o.paymentMethod || 'desconhecido';
      payCount.set(pm, (payCount.get(pm) || 0) + 1);
    });
    const topPaymentKey = Array.from(payCount.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] || '—';
    const topPaymentName = paymentLabels[topPaymentKey] || topPaymentKey;
    return { totalOrders, totalRevenue, avgTicket, revenueToday, topPaymentName };
  }, [filteredOrders]);

  // Agregações: receita por dia
  const revenueByDay = useMemo(() => {
    const map = new Map();
    filteredOrders.forEach((o) => {
      const k = new Date(o.createdAt).toLocaleDateString('pt-BR');
      map.set(k, (map.get(k) || 0) + (o.amount || 0));
    });
    const labels = Array.from(map.keys());
    const values = Array.from(map.values());
    return { labels, values };
  }, [filteredOrders]);

  // Agregações: por tipo de saída
  const byType = useMemo(() => {
    const types = ['delivery', 'waiter', 'in_person', 'counter'];
    const labels = types.map((t) => deliveryLabels[t]);
    const values = types.map((t) => filteredOrders.filter((o) => o.deliveryType === t).length);
    return { labels, values };
  }, [filteredOrders]);

  // Top produtos
  const topProducts = useMemo(() => {
    const counts = new Map();
    filteredOrders.forEach((o) => {
      (o.items || []).forEach((it) => {
        const name = it.name || it.itemName || 'Produto';
        counts.set(name, (counts.get(name) || 0) + (it.quantity || 1));
      });
    });
    const arr = Array.from(counts.entries()).sort((a, b) => b[1] - a[1]).slice(0, 10);
    return { labels: arr.map((x) => x[0]), values: arr.map((x) => x[1]) };
  }, [filteredOrders]);

  // Adicionais por produto
  const addonsByProduct = useMemo(() => {
    const map = new Map(); // chave: addonName, valor: count
    filteredOrders.forEach((o) => {
      (o.items || []).forEach((it) => {
        (it.addOns || it.addons || []).forEach((ad) => {
          const name = ad.name || ad.title || 'Adicional';
          map.set(name, (map.get(name) || 0) + 1);
        });
      });
    });
    const arr = Array.from(map.entries()).sort((a, b) => b[1] - a[1]).slice(0, 10);
    return { labels: arr.map((x) => x[0]), values: arr.map((x) => x[1]) };
  }, [filteredOrders]);

  // Opções base para gráficos
  const baseOptions = {
    dataLabels: { enabled: false },
    chart: {
      background: 'transparent',
      foreColor: isDark ? '#e5e7eb' : '#374151',
    },
    grid: {
      borderColor: isDark ? '#404040' : '#e5e7eb',
      strokeDashArray: 4,
    },
    xaxis: {
      labels: {
        rotate: -45,
        style: { colors: isDark ? '#e5e7eb' : '#374151' },
      },
      axisBorder: { color: isDark ? '#525252' : '#e5e7eb' },
      axisTicks: { color: isDark ? '#525252' : '#e5e7eb' },
    },
    yaxis: {
      labels: {
        style: { colors: isDark ? '#e5e7eb' : '#374151' },
      },
    },
    legend: {
      labels: { colors: isDark ? '#e5e7eb' : '#374151' },
    },
    theme: { mode: isDark ? 'dark' : 'light' },
    tooltip: { theme: isDark ? 'dark' : 'light' },
    colors: zappyColors,
    plotOptions: {
      bar: { borderRadius: 4 },
    },
    fill: { opacity: isDark ? 0.85 : 0.9 },
  };

  if (loading) {
    return (
      <div className="container-xl">
        <div className="row row-cards mb-3">
          <div className="col-sm-6 col-md-3">
            <div className="card card-sm"><div className="card-body"><div className="placeholder-glow"><span className="placeholder col-6"></span><span className="placeholder col-8"></span></div></div></div>
          </div>
          <div className="col-sm-6 col-md-3">
            <div className="card card-sm"><div className="card-body"><div className="placeholder-glow"><span className="placeholder col-6"></span><span className="placeholder col-8"></span></div></div></div>
          </div>
          <div className="col-sm-6 col-md-3">
            <div className="card card-sm"><div className="card-body"><div className="placeholder-glow"><span className="placeholder col-6"></span><span className="placeholder col-8"></span></div></div></div>
          </div>
          <div className="col-sm-6 col-md-3">
            <div className="card card-sm"><div className="card-body"><div className="placeholder-glow"><span className="placeholder col-6"></span><span className="placeholder col-8"></span></div></div></div>
          </div>
        </div>
        <div className="row row-cards">
          <div className="col-md-6">
            <div className="card">
              <div className="card-header"><h3 className="card-title">Receita por Dia</h3></div>
              <div className="card-body">
                <div className="placeholder-glow">
                  <span className="placeholder col-12 mb-2"></span>
                  <span className="placeholder col-10 mb-2"></span>
                  <span className="placeholder col-8"></span>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card">
              <div className="card-header"><h3 className="card-title">Top Produtos</h3></div>
              <div className="card-body">
                <div className="placeholder-glow">
                  <span className="placeholder col-12 mb-2"></span>
                  <span className="placeholder col-9 mb-2"></span>
                  <span className="placeholder col-7"></span>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card">
              <div className="card-header"><h3 className="card-title">Tipos de Saída</h3></div>
              <div className="card-body">
                <div className="placeholder-glow">
                  <span className="placeholder col-12 mb-2"></span>
                  <span className="placeholder col-10 mb-2"></span>
                  <span className="placeholder col-6"></span>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card">
              <div className="card-header"><h3 className="card-title">Pagamentos</h3></div>
              <div className="card-body">
                <div className="placeholder-glow">
                  <span className="placeholder col-12 mb-2"></span>
                  <span className="placeholder col-9 mb-2"></span>
                  <span className="placeholder col-5"></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-xl admin-dashboard">
      <div className="page-header d-print-none">
        <div className="row align-items-center">
          <div className="col">
            <h2 className="page-title">Dashboard de Vendas</h2>
            <div className="page-subtitle">Visualize saídas por tipo, pagamento e produtos</div>
          </div>
          <div className="col-auto">
            <button className="btn btn-primary" onClick={loadData}>
              Recarregar dados
            </button>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="row row-cards mb-3">
        <div className="col-sm-6 col-md-3">
          <div className="card card-sm">
            <div className="card-body">
              <div className="font-weight-medium">Pedidos (filtrados)</div>
              <div className="text-secondary h2 mt-1">{kpis.totalOrders}</div>
            </div>
          </div>
        </div>
        <div className="col-sm-6 col-md-3">
          <div className="card card-sm">
            <div className="card-body">
              <div className="font-weight-medium">Receita total</div>
              <div className="text-secondary h2 mt-1">{currencyBRL.format(kpis.totalRevenue)}</div>
            </div>
          </div>
        </div>
        <div className="col-sm-6 col-md-3">
          <div className="card card-sm">
            <div className="card-body">
              <div className="font-weight-medium">Ticket médio</div>
              <div className="text-secondary h2 mt-1">{currencyBRL.format(kpis.avgTicket)}</div>
            </div>
          </div>
        </div>
        <div className="col-sm-6 col-md-3">
          <div className="card card-sm">
            <div className="card-body">
              <div className="font-weight-medium">Pagamento principal</div>
              <div className="text-secondary h2 mt-1">{kpis.topPaymentName}</div>
              <div className="text-muted">Receita hoje: {currencyBRL.format(kpis.revenueToday)}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="row row-cards mb-3">
        <div className="col-md-3">
          <div className="card">
            <div className="card-body">
              <label className="form-label">Data Inicial</label>
              <input type="date" className="form-control" value={dateRange.startDate}
                onChange={(e) => setDateRange((p) => ({ ...p, startDate: e.target.value }))} />
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card">
            <div className="card-body">
              <label className="form-label">Data Final</label>
              <input type="date" className="form-control" value={dateRange.endDate}
                onChange={(e) => setDateRange((p) => ({ ...p, endDate: e.target.value }))} />
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card">
            <div className="card-body">
              <label className="form-label">Tipo de Saída</label>
              <select className="form-select" value={salesType} onChange={(e) => setSalesType(e.target.value)}>
                <option value="all">Todas</option>
                <option value="delivery">Entrega</option>
                <option value="waiter">Garçom</option>
                <option value="in_person">Presencial</option>
                <option value="counter">Balcão</option>
              </select>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card">
            <div className="card-body">
              <label className="form-label">Forma de Pagamento</label>
              <select className="form-select" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                <option value="all">Todos</option>
                {Object.keys(paymentLabels).map((k) => (
                  <option key={k} value={k}>{paymentLabels[k]}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="row row-cards mb-3">
        <div className="col-md-3">
          <div className="card">
            <div className="card-body">
              <label className="form-label">Tipo de Gráfico</label>
              <select className="form-select" value={chartType} onChange={(e) => setChartType(e.target.value)}>
                <option value="bar">Barras</option>
                <option value="line">Linha</option>
                <option value="pie">Pizza</option>
              </select>
            </div>
          </div>
        </div>
        <div className="col-md-9">
          <div className="card">
            <div className="card-body d-flex align-items-center">
              <div className="me-3">Tipos de Saída</div>
              <div className="ms-auto text-secondary">{filteredOrders.length} pedidos filtrados</div>
            </div>
            <div className="card-body">
              <ChartBlock type={chartType}
                options={{ ...baseOptions, labels: byType.labels }}
                series={[{ name: 'Pedidos', data: byType.values }]} />
            </div>
          </div>
        </div>
      </div>

      <div className="row row-cards">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header"><h3 className="card-title">Receita por Dia</h3></div>
            <div className="card-body">
              <ChartBlock type={chartType === 'pie' ? 'line' : chartType}
                options={{ ...baseOptions, xaxis: { categories: revenueByDay.labels } }}
                series={[{ name: 'Receita (R$)', data: revenueByDay.values }]} />
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card">
            <div className="card-header"><h3 className="card-title">Top Produtos</h3></div>
            <div className="card-body">
              <ChartBlock type={chartType}
                options={{ ...baseOptions, xaxis: { categories: topProducts.labels } }}
                series={[{ name: 'Quantidade', data: topProducts.values }]} />
            </div>
          </div>
        </div>
      </div>

      <div className="row row-cards mt-3">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header"><h3 className="card-title">Adicionais mais usados</h3></div>
            <div className="card-body">
              <ChartBlock type={chartType}
                options={{ ...baseOptions, xaxis: { categories: addonsByProduct.labels } }}
                series={[{ name: 'Uso', data: addonsByProduct.values }]} />
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card">
            <div className="card-header"><h3 className="card-title">Pagamentos</h3></div>
            <div className="card-body">
              <ChartBlock type={chartType}
                options={{ ...baseOptions, labels: paymentStats.map((s) => paymentLabels[s._id] || s._id) }}
                series={[{ name: 'Pedidos', data: paymentStats.map((s) => s.count) }]} />
            </div>
          </div>
        </div>
      </div>

      {/* Mapa mundi removido: o Admin mantém apenas os gráficos originais */}
    </div>
  );
};

export default AdminDashboard;