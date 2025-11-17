import React, { useEffect, useRef, useState } from 'react';
import { IconMapPin, IconSun, IconMoon } from '@tabler/icons-react';

// Importar jsVectorMap e os mapas de forma assíncrona
const loadJsVectorMap = async () => {
  const jsVectorMap = (await import('jsvectormap')).default;
  await import('jsvectormap/dist/maps/world.js');
  return jsVectorMap;
};

const WorldMap = ({ stores = [], onCountryClick }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const [mapError, setMapError] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Detectar modo claro/escuro
  useEffect(() => {
    const checkDarkMode = () => {
      const htmlElement = document.documentElement;
      setIsDarkMode(htmlElement.classList.contains('dark') || 
                   htmlElement.getAttribute('data-bs-theme') === 'dark');
    };

    checkDarkMode();
    
    // Observar mudanças no tema
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class', 'data-bs-theme']
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;

    const initializeMap = async () => {
      try {
        setMapError(false);
        
        // Verificar se há stores válidos
        if (!Array.isArray(stores) || stores.length === 0) {
          console.warn('Nenhum dado de loja disponível para o mapa');
          return;
        }
        
        // Carregar jsVectorMap dinamicamente
        const jsVectorMap = await loadJsVectorMap();
        
        if (!jsVectorMap) {
          throw new Error('jsVectorMap não pôde ser carregado');
        }
        
        // Preparar dados do mapa com base nos stores
        const mapData = {};
        const countryColors = {};
        
        stores.forEach(store => {
          if (store?.countryCode) {
            // Mapear códigos ISO para os códigos usados pelo jsVectorMap
            const isoCode = getCountryISOCode(store.countryCode);
            if (isoCode) {
              mapData[isoCode] = store.stores || 1;
              countryColors[isoCode] = store.color || '#28a745';
            }
          }
        });

        // Garantir que não há instância anterior e limpar conteúdo
        if (mapInstance.current) {
          try {
            mapInstance.current.destroy();
          } catch {}
          mapInstance.current = null;
        }
        if (mapRef.current) {
          mapRef.current.innerHTML = '';
          mapRef.current.style.overflow = 'hidden';
          mapRef.current.style.position = 'relative';
        }

        // Criar o mapa
        mapInstance.current = new jsVectorMap({
          selector: mapRef.current,
          map: 'world',
          backgroundColor: 'transparent',
          regionStyle: {
            initial: {
              fill: isDarkMode ? 'var(--tblr-gray-800)' : 'var(--tblr-bg-surface-secondary)', // Cor de fundo para países
              stroke: isDarkMode ? 'var(--tblr-gray-600)' : 'var(--tblr-border-color)', // Cor das bordas
              strokeWidth: 1,
            },
            hover: {
              fill: 'var(--tblr-primary)',
              stroke: 'var(--tblr-primary)',
              cursor: 'pointer',
            },
            selected: {
              fill: 'var(--tblr-primary)',
              stroke: 'var(--tblr-primary)',
            }
          },
          zoomOnScroll: true,
          zoomButtons: true,
          
          // Dados das regiões (países) - Escala de cores adaptativa usando color-mix
          series: {
            regions: [{
              attribute: 'fill',
              scale: {
                scale1: isDarkMode ? 'color-mix(in srgb, var(--tblr-primary) 10%, transparent)' : 'color-mix(in srgb, var(--tblr-primary) 10%, transparent)',
                scale2: isDarkMode ? 'color-mix(in srgb, var(--tblr-primary) 20%, transparent)' : 'color-mix(in srgb, var(--tblr-primary) 20%, transparent)',
                scale3: isDarkMode ? 'color-mix(in srgb, var(--tblr-primary) 30%, transparent)' : 'color-mix(in srgb, var(--tblr-primary) 30%, transparent)',
                scale4: isDarkMode ? 'color-mix(in srgb, var(--tblr-primary) 40%, transparent)' : 'color-mix(in srgb, var(--tblr-primary) 40%, transparent)',
                scale5: isDarkMode ? 'color-mix(in srgb, var(--tblr-primary) 50%, transparent)' : 'color-mix(in srgb, var(--tblr-primary) 50%, transparent)',
                scale6: isDarkMode ? 'color-mix(in srgb, var(--tblr-primary) 60%, transparent)' : 'color-mix(in srgb, var(--tblr-primary) 60%, transparent)',
                scale7: isDarkMode ? 'color-mix(in srgb, var(--tblr-primary) 70%, transparent)' : 'color-mix(in srgb, var(--tblr-primary) 70%, transparent)',
                scale8: isDarkMode ? 'color-mix(in srgb, var(--tblr-primary) 80%, transparent)' : 'color-mix(in srgb, var(--tblr-primary) 80%, transparent)',
                scale9: isDarkMode ? 'color-mix(in srgb, var(--tblr-primary) 90%, transparent)' : 'color-mix(in srgb, var(--tblr-primary) 90%, transparent)',
                scale10: isDarkMode ? 'var(--tblr-primary)' : 'var(--tblr-primary)',
              },
              values: mapData,
            }]
          },

          // Eventos
          onRegionClick: function(event, code) {
            if (!Array.isArray(stores)) return;
            
            const country = stores.find(store => 
              getCountryISOCode(store.countryCode) === code
            );
            if (country && onCountryClick) {
              onCountryClick(country);
            }
          },

          // Tooltip personalizado adaptativo usando variáveis CSS do Tabler
          onRegionTooltipShow: function(event, tooltip, code) {
            if (!Array.isArray(stores)) return;
            
            const country = stores.find(store => 
              getCountryISOCode(store.countryCode) === code
            );
            if (country && tooltip) {
              const tooltipContent = `
                <div class="p-2" style="background: var(--tblr-bg-surface-inverted); color: var(--tblr-text-inverted); border: 1px solid var(--tblr-border-color-translucent); border-radius: var(--tblr-border-radius);">
                  <div class="d-flex align-items-center mb-1">
                    <div class="avatar avatar-xs me-2" style="background-color: ${country.color}">
                      <span class="avatar-title">${country.stores}</span>
                    </div>
                    <div>
                      <div class="strong">${country.name}</div>
                      <div class="text-muted small" style="color: var(--tblr-text-muted) !important;">${country.stores} lojas</div>
                    </div>
                  </div>
                  <div class="text-muted small" style="color: var(--tblr-text-muted) !important;">
                    Receita: R$ ${country.revenue?.toLocaleString('pt-BR')}
                  </div>
                  <div class="text-muted small" style="color: var(--tblr-text-muted) !important;">
                    Usuários: ${country.users?.toLocaleString('pt-BR')}
                  </div>
                </div>
              `;
              
              // Tentar diferentes métodos possíveis
              try {
                if (typeof tooltip.text === 'function') {
                  tooltip.text(tooltipContent);
                } else if (typeof tooltip.html === 'function') {
                  tooltip.html(tooltipContent);
                } else {
                  // Fallback: retornar o conteúdo
                  return tooltipContent;
                }
              } catch (e) {
                console.warn('Erro ao configurar tooltip:', e);
              }
            }
          },

          // Marcadores com cores adaptativas
          markers: Array.isArray(stores) ? stores.map(store => ({
            coords: store.coords || getCountryCoords(store.countryCode),
            name: store.name,
            countryCode: store.countryCode,
          })).filter(marker => marker.coords) : [],

          markerStyle: {
            initial: {
              r: 6,
              stroke: 'var(--tblr-white)',
              strokeWidth: 2,
              fill: 'var(--tblr-primary)',
            },
            hover: {
              r: 8,
              fill: isDarkMode ? 'color-mix(in srgb, var(--tblr-primary) 120%, #000)' : 'color-mix(in srgb, var(--tblr-primary) 90%, #000)',
            }
          },

          labels: {
            markers: {
              render: function(marker) {
                return marker.name || '';
              },
            },
          },
        });

      } catch (error) {
        console.error('Erro ao criar o mapa:', error);
        setMapError(true);
      }
    };

    initializeMap();
    // Cleanup correto quando dependências mudarem ou ao desmontar
    return () => {
      if (mapInstance.current) {
        try {
          mapInstance.current.destroy();
        } catch {}
        mapInstance.current = null;
      }
      if (mapRef.current) {
        try {
          mapRef.current.innerHTML = '';
        } catch {}
      }
    };
  }, [stores, onCountryClick, isDarkMode]);

  // Se não há dados, mostrar mensagem apropriada
  if (!Array.isArray(stores) || stores.length === 0) {
    return (
      <div className="card">
        <div className="card-body text-center py-5">
          <div className="mb-3">
            <IconMapPin size={48} className="text-muted" />
          </div>
          <h4 className="text-muted">Dados de lojas não disponíveis</h4>
          <p className="text-muted">Aguarde o carregamento dos dados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-body">
        <div className="row g-3 align-items-center mb-3">
          <div className="col">
            <h3 className="card-title">Mapa Mundial de Lojas</h3>
            <div className="text-muted">
              Clique em um país para ver detalhes
            </div>
          </div>
          <div className="col-auto">
            <div className="d-flex gap-2 align-items-center">
              {/* Indicador de modo */}
              <div className="d-flex align-items-center me-2">
                {isDarkMode ? (
                  <IconMoon size={16} className="text-yellow me-1" />
                ) : (
                  <IconSun size={16} className="text-yellow me-1" />
                )}
                <small className="text-muted">
                  {isDarkMode ? 'Modo Escuro' : 'Modo Claro'}
                </small>
              </div>
              
              {/* Legendas */}
              <div className="d-flex gap-2">
                <div className="d-flex align-items-center">
                  <div className="badge bg-primary me-2"></div>
                  <small className="text-muted">Alta atividade</small>
                </div>
                <div className="d-flex align-items-center">
                  <div className="badge bg-secondary me-2"></div>
                  <small className="text-muted">Baixa atividade</small>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {mapError ? (
          <div className="text-center py-5">
            <div className="mb-3">
              <IconMapPin size={48} className="text-muted" />
            </div>
            <h4 className="text-muted">Mapa temporariamente indisponível</h4>
            <p className="text-muted">Os dados das lojas estão sendo carregados...</p>
            <div className="row g-3 mt-3">
              {stores.map(store => (
                <div key={store.id} className="col-md-6 col-lg-4">
                  <div 
                    className="card card-sm cursor-pointer" 
                    onClick={() => onCountryClick && onCountryClick(store)}
                    style={{borderLeft: `4px solid ${store.color}`}}
                  >
                    <div className="card-body p-3">
                      <div className="d-flex align-items-center">
                        <div className="me-3">
                          <div className="avatar avatar-sm" style={{backgroundColor: store.color}}>
                            <span className="avatar-title">{store.stores}</span>
                          </div>
                        </div>
                        <div>
                          <div className="strong">{store.name}</div>
                          <div className="text-muted small">
                            {store.stores} lojas • R$ {store.revenue?.toLocaleString('pt-BR')}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="w-100 h-100">
            <div 
              ref={mapRef} 
              className="w-100 h-100 rounded"
              style={{
                backgroundColor: isDarkMode ? 'var(--tblr-gray-900)' : 'var(--tblr-bg-surface)',
                border: `1px solid var(--tblr-border-color)`,
                overflow: 'hidden',
                position: 'relative',
                minHeight: '750px'
              }}
            ></div>
          </div>
        )}
      </div>
    </div>
  );
};

// Função auxiliar para mapear códigos de país
function getCountryISOCode(countryCode) {
  const mapping = {
    'br': 'BR',
    'usa': 'US',
    'ca': 'CA',
    'mx': 'MX',
    'ar': 'AR',
    'gb': 'GB',
    'de': 'DE',
    'fr': 'FR',
    'it': 'IT',
    'es': 'ES',
    'pt': 'PT',
    'au': 'AU',
    'jp': 'JP',
    'cn': 'CN',
    'in': 'IN',
    'ru': 'RU',
    'za': 'ZA',
    'eg': 'EG',
    'ng': 'NG',
  };
  return mapping[countryCode?.toLowerCase()] || countryCode?.toUpperCase();
}

// Função auxiliar para obter coordenadas aproximadas dos países
function getCountryCoords(countryCode) {
  const coords = {
    'br': [-14.235, -51.9253],
    'usa': [37.0902, -95.7129],
    'ca': [56.1304, -106.3468],
    'mx': [23.6345, -102.5528],
    'ar': [-38.4161, -63.6167],
    'gb': [55.3781, -3.4360],
    'de': [51.1657, 10.4515],
    'fr': [46.2276, 2.2137],
    'it': [41.8719, 12.5674],
    'es': [40.4637, -3.7492],
    'pt': [39.3999, -8.2245],
    'au': [-25.2744, 133.7751],
    'jp': [36.2048, 138.2529],
    'cn': [35.8617, 104.1954],
    'in': [20.5937, 78.9629],
    'ru': [61.5240, 105.3188],
    'za': [-30.5595, 22.9375],
    'eg': [26.8206, 30.8025],
    'ng': [9.0820, 8.6753],
  };
  return coords[countryCode?.toLowerCase()];
}

export default WorldMap;