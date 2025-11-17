import React, { useEffect, useRef } from 'react';
import jsVectorMap from 'jsvectormap';
import 'jsvectormap/dist/jsvectormap.min.css';
import 'jsvectormap/dist/maps/world.js';

const WorldMapCard = ({ title = 'Mapa de Pedidos (Mundi)', markers = [], onRegionTip }) => {
  const mapRef = useRef(null);
  const instanceRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current) return;
    if (instanceRef.current) {
      instanceRef.current.destroy();
    }

    const isDark = document.body.classList.contains('theme-dark');
    instanceRef.current = new jsVectorMap({
      selector: mapRef.current,
      map: 'world',
      zoomButtons: true,
      regionStyle: {
        initial: { fill: isDark ? '#2f3640' : '#e9ecef' },
        hover: { fill: isDark ? '#3e4550' : '#dee2e6' },
        selected: { fill: '#0ea5e9' },
      },
      markerStyle: {
        initial: { r: 6, fill: '#0ea5e9' },
        hover: { r: 8 },
      },
      labels: { regions: { render: (code) => code.toUpperCase() } },
      markers,
      onRegionTooltipShow: (tooltip, code) => {
        if (onRegionTip) onRegionTip(tooltip, code);
      },
    });

    return () => {
      if (instanceRef.current) instanceRef.current.destroy();
    };
  }, [markers]);

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">{title}</h3>
      </div>
      <div className="card-body">
        <div ref={mapRef} style={{ height: 400, width: '100%' }} />
      </div>
    </div>
  );
};

export default WorldMapCard;