'use client';

import { useEffect, useState, useRef, useMemo } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import Globe to avoid SSR issues
const Globe = dynamic(() => import('react-globe.gl'), {
    ssr: false,
    loading: () => <div style={{ width: '100%', height: '100%', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666' }}>Loading Globe...</div>
});

interface Visitor {
    id: string;
    lat: number;
    lng: number;
    country: string;
    city: string;
    avatarUrl?: string; // Add avatar URL
}

interface GlobeVisualizationProps {
    visitors: Visitor[];
}

export default function GlobeVisualization({ visitors = [] }: GlobeVisualizationProps) {
    const globeEl = useRef<any>();
    const [countries, setCountries] = useState({ features: [] });
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Load country data
        fetch('https://raw.githubusercontent.com/vasturiano/react-globe.gl/master/example/datasets/ne_110m_admin_0_countries.geojson')
            .then(res => res.json())
            .then(setCountries);
    }, []);

    // Generate random avatars for visitors if not present
    const visitorsWithAvatars = useMemo(() => {
        return visitors.map(v => ({
            ...v,
            avatarUrl: v.avatarUrl || `https://api.dicebear.com/9.x/avataaars/svg?seed=${v.id}&backgroundColor=b6e3f4`
        }));
    }, [visitors]);

    useEffect(() => {
        if (globeEl.current) {
            // Auto-rotate
            globeEl.current.controls().autoRotate = true;
            globeEl.current.controls().autoRotateSpeed = 0.5;

            // Set initial point of view if needed, but auto-rotate handles it
        }
    }, [mounted]);

    if (!mounted) return null;

    return (
        <div style={{ width: '100%', height: '100%', background: '#000' }}>
            <Globe
                ref={globeEl}
                globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg"
                bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
                backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"

                // Country Borders (Polygons)
                polygonsData={countries.features}
                polygonCapColor={() => 'rgba(20, 20, 20, 0.7)'} // Dark fill
                polygonSideColor={() => 'rgba(0, 0, 0, 0)'}
                polygonStrokeColor={() => 'rgba(255, 255, 255, 0.3)'} // More visible borders
                polygonAltitude={0.01}

                // Country Labels
                labelsData={countries.features}
                labelLat={(d: any) => d.properties.LABEL_Y || d.properties.label_y || 0} // Use pre-calculated labels if available, otherwise 0 (fallback)
                labelLng={(d: any) => d.properties.LABEL_X || d.properties.label_x || 0}
                labelText={(d: any) => d.properties.NAME || d.properties.name}
                labelSize={1.5}
                labelDotRadius={0.3}
                labelColor={() => 'rgba(255, 255, 255, 0.6)'}
                labelResolution={2}
                labelAltitude={0.015}

                // HTML Elements (Avatars)
                htmlElementsData={visitorsWithAvatars}
                htmlLat={(d: any) => d.lat}
                htmlLng={(d: any) => d.lng}
                htmlElement={(d: any) => {
                    const el = document.createElement('div');
                    el.innerHTML = `
                        <div style="position: relative; transform: translate(-50%, -50%); cursor: pointer;">
                            <div style="
                                width: 32px; 
                                height: 32px; 
                                border-radius: 50%; 
                                overflow: hidden; 
                                border: 2px solid #fff; 
                                box-shadow: 0 0 10px rgba(0,0,0,0.5);
                                background: #fff;
                                transition: transform 0.2s;
                            ">
                                <img src="${d.avatarUrl}" style="width: 100%; height: 100%; object-fit: cover;" />
                            </div>
                            <div style="
                                position: absolute; 
                                bottom: -20px; 
                                left: 50%; 
                                transform: translateX(-50%); 
                                background: rgba(0,0,0,0.8); 
                                color: #fff; 
                                padding: 2px 6px; 
                                border-radius: 4px; 
                                font-size: 10px; 
                                white-space: nowrap;
                                pointer-events: none;
                            ">
                                ${d.city}
                            </div>
                        </div>
                    `;

                    // Add hover effect via JS since it's a raw DOM element
                    const circle = el.querySelector('div > div') as HTMLElement;
                    if (circle) {
                        el.addEventListener('mouseenter', () => {
                            circle.style.transform = 'scale(1.2)';
                            circle.style.borderColor = '#3b82f6';
                        });
                        el.addEventListener('mouseleave', () => {
                            circle.style.transform = 'scale(1)';
                            circle.style.borderColor = '#fff';
                        });
                    }

                    return el;
                }}
            />
        </div>
    );
}
