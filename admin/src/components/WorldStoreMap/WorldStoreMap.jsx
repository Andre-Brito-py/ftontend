import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { scaleLinear } from 'd3-scale';
import './WorldStoreMap.css';

// TopoJSON público com países
const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

// Aliases robustos: normalizamos diversos formatos (nome local, inglês, siglas)
// e mapeamos para o campo NAME do World Atlas
const COUNTRY_ALIASES = {
  // Brasil
  'br': 'Brazil', 'brasil': 'Brazil', 'brazil': 'Brazil',
  // Estados Unidos
  'us': 'United States of America', 'usa': 'United States of America', 'united states': 'United States of America', 'eua': 'United States of America', 'estados unidos': 'United States of America',
  // Portugal
  'pt': 'Portugal', 'portugal': 'Portugal',
  // Reino Unido
  'uk': 'United Kingdom', 'united kingdom': 'United Kingdom', 'great britain': 'United Kingdom', 'gb': 'United Kingdom',
  // Rússia
  'russia': 'Russia', 'russian federation': 'Russia',
  // Outros comuns
  'uae': 'United Arab Emirates', 'united arab emirates': 'United Arab Emirates',
  'south korea': 'South Korea', 'korea, republic of': 'South Korea',
  'north korea': 'North Korea', 'korea, dem. people’s rep.': 'North Korea',
  'cote d’ivoire': "Côte d'Ivoire", "cote d'ivoire": "Côte d'Ivoire",
  'ivory coast': "Côte d'Ivoire",
  'czech republic': 'Czechia', 'czechia': 'Czechia',
  'viet nam': 'Vietnam', 'vietnam': 'Vietnam',
  'lao pdr': 'Laos', 'laos': 'Laos'
};

const WorldStoreMap = ({ url = '', token }) => {
  const [countriesData, setCountriesData] = useState({}); // { [country]: { total, active } }
  const [countryStores, setCountryStores] = useState({}); // { [country]: [{ name, status }] }
  const [maxCount, setMaxCount] = useState(0);
  const [maxActiveCount, setMaxActiveCount] = useState(0);
  const [hoverInfo, setHoverInfo] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${url}/api/system/stores?limit=1000`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const stores = response.data?.data?.stores || response.data?.stores || [];

        const data = {};
        const byCountry = {};
        for (const s of stores) {
          // Extrair país de diferentes formatos (objeto ou string)
          const addressObjCountry = s?.settings?.address?.country;
          const restaurantAddress = s?.settings?.restaurantAddress; // pode ser string
          const restaurantAddrCountry = typeof restaurantAddress === 'object' ? restaurantAddress?.country : undefined;
          let countryRaw = addressObjCountry || restaurantAddrCountry || s?.country;

          // Se não houver país explícito, tentar inferir a partir da string do endereço
          if (!countryRaw && typeof restaurantAddress === 'string') {
            const addrLower = restaurantAddress.toLowerCase();
            if (addrLower.includes('brasil') || addrLower.includes('brazil')) countryRaw = 'br';
            else if (addrLower.includes('portugal')) countryRaw = 'pt';
            else if (addrLower.includes('eua') || addrLower.includes('usa') || addrLower.includes('united states') || addrLower.includes('estados unidos')) countryRaw = 'us';
            else if (addrLower.includes('reino unido') || addrLower.includes('united kingdom') || addrLower.includes('great britain')) countryRaw = 'uk';
          }

          if (!countryRaw) continue;
          const key = countryRaw.toString().trim().toLowerCase();
          const fixed = COUNTRY_ALIASES[key] || countryRaw.toString().trim();
          if (!data[fixed]) data[fixed] = { total: 0, active: 0 };
          data[fixed].total += 1;
          // Considera loja ativa se status === 'active'
          if (s?.status === 'active') data[fixed].active += 1;
          if (!byCountry[fixed]) byCountry[fixed] = [];
          byCountry[fixed].push({ name: s?.name || 'Loja', status: s?.status || 'pending' });
        }
        setCountriesData(data);
        setCountryStores(byCountry);
        setMaxCount(Object.values(data).reduce((m, v) => Math.max(m, v.total), 0));
        setMaxActiveCount(Object.values(data).reduce((m, v) => Math.max(m, v.active), 0));
      } catch (err) {
        // Sem toast aqui para evitar ruído; a página pai pode tratar erros
        console.error('Erro ao carregar lojas para o mapa:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStores();
  }, [url, token]);

  const totalColorScale = useMemo(() => {
    // Paleta azul para total de lojas
    return scaleLinear()
      .domain([0, Math.max(1, maxCount)])
      .range(['#cfe0ff', '#1e66ff']);
  }, [maxCount]);

  const activeColorScale = useMemo(() => {
    // Paleta verde para países com lojas ativas
    return scaleLinear()
      .domain([0, Math.max(1, maxActiveCount)])
      .range(['#d6f5d6', '#2ecc71']);
  }, [maxActiveCount]);

  return (
    <div className="world-map-card">
      <div className="world-map-header">
        <h3>🌍 Lojas por País</h3>
        <span className="world-map-subtitle">Visualização global das lojas registradas</span>
      </div>
      <div className="world-map-content">
        {loading ? (
          <div className="world-map-loading">Carregando mapa...</div>
        ) : (
          <ComposableMap projectionConfig={{ scale: 160 }}>
            <Geographies geography={GEO_URL}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const name = geo.properties?.NAME;
                  const totals = countriesData[name] || { total: 0, active: 0 };
                  const count = totals.total;
                  const active = totals.active;
                  // Países com lojas ativas ganham destaque em paleta verde proporcional
                  const fill = active > 0
                    ? activeColorScale(active)
                    : (count > 0 ? totalColorScale(count) : '#d8e6ff');
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      onMouseEnter={(e) => {
                        const { clientX, clientY } = e;
                        setHoverInfo({ name, count, active, x: clientX, y: clientY });
                      }}
                      onMouseMove={(e) => {
                        const { clientX, clientY } = e;
                        setHoverInfo((prev) => prev ? { ...prev, x: clientX, y: clientY } : null);
                      }}
                      onMouseLeave={() => setHoverInfo(null)}
                      onClick={() => setSelectedCountry(name)}
                      style={{
                        default: { fill, outline: 'none' },
                        hover: { fill: '#6aa9ff', outline: 'none' },
                        pressed: { fill: '#2f6ded', outline: 'none' }
                      }}
                    />
                  );
                })
              }
            </Geographies>
          </ComposableMap>
        )}
        {hoverInfo && (
          <div
            className="world-map-tooltip"
            style={{ left: hoverInfo.x + 12, top: hoverInfo.y + 12 }}
          >
            <div className="tooltip-name">{hoverInfo.name}</div>
            <div className="tooltip-count">
              {hoverInfo.count} loja(s) • {hoverInfo.active} ativa(s)
            </div>
          </div>
        )}
      </div>
      <div className="world-map-legend">
        <span>0</span>
        <div className="legend-gradient" />
        <span>{maxCount}</span>
      </div>
      <div className="world-map-legend" style={{ marginTop: '0.25rem' }}>
        <span>Ativas</span>
        <div className="legend-gradient" style={{ background: 'linear-gradient(90deg, #d6f5d6, #2ecc71)' }} />
        <span>{maxActiveCount}</span>
      </div>

      {selectedCountry && (
        <div className="world-map-store-list">
          <div className="store-list-header">
            <h4>Lojas em {selectedCountry}</h4>
            <button className="btn-clear" onClick={() => setSelectedCountry(null)}>Limpar seleção</button>
          </div>
          <div className="store-list-items">
            {(countryStores[selectedCountry] || []).map((store, idx) => (
              <div key={`${store.name}-${idx}`} className="store-item">
                <span className="store-name">{store.name}</span>
                <span className={`status-badge ${store.status === 'active' ? 'active' : 'inactive'}`}>
                  {store.status === 'active' ? 'Ativa' : 'Inativa'}
                </span>
              </div>
            ))}
            {(!countryStores[selectedCountry] || countryStores[selectedCountry].length === 0) && (
              <div className="store-item empty">Nenhuma loja encontrada.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default WorldStoreMap;