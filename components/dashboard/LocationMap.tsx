'use client';

import React, { useMemo } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { scaleLinear } from 'd3-scale';

// GeoJSON from react-globe.gl examples (Natural Earth data) - known to work and have properties
const GEO_URL = "https://raw.githubusercontent.com/vasturiano/react-globe.gl/master/example/datasets/ne_110m_admin_0_countries.geojson";

interface LocationMapProps {
    data: { name: string; value: number; code?: string }[];
}

export default function LocationMap({ data }: LocationMapProps) {
    const [tooltip, setTooltip] = React.useState<{ content: string; x: number; y: number } | null>(null);
    const maxValue = Math.max(...data.map(d => d.value), 0);

    const colorScale = scaleLinear<string>()
        .domain([0, maxValue || 1])
        .range(["#1f2937", "#3b82f6"]); // Dark gray to Blue

    // Create a map of country names/codes to values for O(1) lookup
    const dataMap = useMemo(() => {
        const map = new Map();
        data.forEach(d => {
            // Normalize names if needed, or use codes
            map.set(d.name, d.value);
            if (d.code) map.set(d.code, d.value);
        });
        return map;
    }, [data]);

    return (
        <div style={{ width: '100%', height: '400px', background: '#111', borderRadius: '12px', overflow: 'hidden', marginBottom: '1.5rem', border: '1px solid #333', position: 'relative' }}>
            <ComposableMap
                projectionConfig={{
                    rotate: [-10, 0, 0],
                    scale: 147
                }}
                style={{ width: "100%", height: "100%" }}
            >
                <Geographies geography={GEO_URL}>
                    {({ geographies }) =>
                        geographies.map((geo) => {
                            // Try to match by name or code
                            // Natural Earth properties: NAME, ISO_A2, ADM0_A3
                            const name = geo.properties.NAME || geo.properties.name;
                            const code = geo.properties.ISO_A2 || geo.properties.iso_a2;

                            let value = dataMap.get(name);
                            if (!value && code) {
                                value = dataMap.get(code);
                            }

                            return (
                                <Geography
                                    key={geo.rsmKey}
                                    geography={geo}
                                    fill={value ? colorScale(value) : "#1f2937"}
                                    stroke="#374151"
                                    strokeWidth={0.5}
                                    style={{
                                        default: { outline: "none" },
                                        hover: { fill: "#60a5fa", outline: "none" },
                                        pressed: { outline: "none" },
                                    }}
                                    onMouseEnter={(evt) => {
                                        const { clientX, clientY } = evt;
                                        setTooltip({
                                            content: `${name}: ${value || 0} visitors`,
                                            x: clientX,
                                            y: clientY
                                        });
                                    }}
                                    onMouseMove={(evt) => {
                                        const { clientX, clientY } = evt;
                                        setTooltip(prev => prev ? { ...prev, x: clientX, y: clientY } : null);
                                    }}
                                    onMouseLeave={() => {
                                        setTooltip(null);
                                    }}
                                />
                            );
                        })
                    }
                </Geographies>
            </ComposableMap>
            {tooltip && (
                <div style={{
                    position: 'fixed',
                    top: tooltip.y - 40,
                    left: tooltip.x,
                    transform: 'translateX(-50%)',
                    background: 'rgba(0, 0, 0, 0.8)',
                    color: '#fff',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    pointerEvents: 'none',
                    zIndex: 100,
                    whiteSpace: 'nowrap'
                }}>
                    {tooltip.content}
                </div>
            )}
        </div>
    );
}
