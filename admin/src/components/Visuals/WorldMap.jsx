import React, { useEffect, useRef } from 'react';

// WorldMap component using jsVectorMap via global CDN
// Assumes jsVectorMap CSS/JS were added to index.html
const WorldMap = ({ height = 360, zoom = true }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    // Ensure library is loaded
    const JV = window.jsVectorMap;
    if (!JV || !containerRef.current) return;

    // Values adapted from Tabler preview (world-merc)
    const values = {
      AF: 'scale2', AL: 'scale2', DZ: 'scale4', AO: 'scale3', AR: 'scale5', AT: 'scale5', AZ: 'scale3', BD: 'scale4',
      BE: 'scale5', BO: 'scale2', BR: 'scale8', BG: 'scale2', CA: 'scale7', CL: 'scale4', CN: 'scale9', CO: 'scale5',
      CZ: 'scale4', DK: 'scale5', DO: 'scale3', EC: 'scale3', EG: 'scale5', FI: 'scale5', FR: 'scale8', DE: 'scale8',
      GR: 'scale5', GT: 'scale2', HK: 'scale5', HU: 'scale4', IN: 'scale7', IR: 'scale5', IE: 'scale5', IL: 'scale5',
      IT: 'scale8', JP: 'scale9', KZ: 'scale4', KR: 'scale6', KW: 'scale4', LT: 'scale2', LU: 'scale3', MY: 'scale5',
      MX: 'scale7', MA: 'scale3', MZ: 'scale2', NL: 'scale6', NZ: 'scale4', NG: 'scale5', NO: 'scale5', PK: 'scale4',
      PE: 'scale4', PH: 'scale4', PL: 'scale10', PT: 'scale5', QA: 'scale4', RO: 'scale4', RU: 'scale7', SA: 'scale5',
      SG: 'scale5', SK: 'scale3', ZA: 'scale5', ES: 'scale7', SE: 'scale5', CH: 'scale6', TW: 'scale5', TH: 'scale5',
      TR: 'scale6', UA: 'scale4', AE: 'scale5', GB: 'scale8', US: 'scale10', VE: 'scale5', VN: 'scale4'
    };

    // Initialize map
    const map = new JV({
      selector: containerRef.current,
      map: 'world_merc',
      backgroundColor: 'transparent',
      regionStyle: {
        initial: {
          fill: 'var(--tblr-bg-surface-secondary)',
          stroke: 'var(--tblr-border-color)',
          strokeWidth: 2,
        },
        hover: {
          fill: 'color-mix(in srgb, transparent, var(--tblr-primary) 40%)'
        },
      },
      zoomOnScroll: !!zoom,
      zoomButtons: !!zoom,
      series: {
        regions: [{
          attribute: 'fill',
          scale: {
            scale1: 'color-mix(in srgb, transparent, var(--tblr-primary) 10%)',
            scale2: 'color-mix(in srgb, transparent, var(--tblr-primary) 20%)',
            scale3: 'color-mix(in srgb, transparent, var(--tblr-primary) 30%)',
            scale4: 'color-mix(in srgb, transparent, var(--tblr-primary) 40%)',
            scale5: 'color-mix(in srgb, transparent, var(--tblr-primary) 50%)',
            scale6: 'color-mix(in srgb, transparent, var(--tblr-primary) 60%)',
            scale7: 'color-mix(in srgb, transparent, var(--tblr-primary) 70%)',
            scale8: 'color-mix(in srgb, transparent, var(--tblr-primary) 80%)',
            scale9: 'color-mix(in srgb, transparent, var(--tblr-primary) 90%)',
            scale10: 'color-mix(in srgb, transparent, var(--tblr-primary) 100%)',
          },
          values,
        }],
      },
    });

    // Cleanup on unmount
    return () => {
      try { map && map.destroy && map.destroy(); } catch (_) {}
    };
  }, [zoom]);

  return (
    <div className="ratio ratio-4x3" style={{ maxHeight: height }}>
      <div>
        <div ref={containerRef} className="w-100 h-100" />
      </div>
    </div>
  );
};

export default WorldMap;