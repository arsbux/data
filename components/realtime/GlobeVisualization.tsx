'use client';

import createGlobe from 'cobe';
import { useEffect, useRef } from 'react';

interface Visitor {
    id: string;
    lat: number;
    lng: number;
    country: string;
    city: string;
}

interface GlobeVisualizationProps {
    visitors: Visitor[];
}

export default function GlobeVisualization({ visitors = [] }: GlobeVisualizationProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const pointerInteracting = useRef<number | null>(null);
    const pointerInteractionMovement = useRef(0);

    useEffect(() => {
        let phi = 0;

        if (!canvasRef.current) return;

        const globe = createGlobe(canvasRef.current, {
            devicePixelRatio: 2,
            width: canvasRef.current.clientWidth * 2,
            height: canvasRef.current.clientHeight * 2,
            phi: 0,
            theta: 0,
            dark: 1,
            diffuse: 1.2,
            mapSamples: 16000,
            mapBrightness: 6,
            baseColor: [0.3, 0.3, 0.3],
            markerColor: [0.1, 0.8, 1],
            glowColor: [0.1, 0.1, 0.2],
            markers: visitors.map(v => ({ location: [v.lat, v.lng], size: 0.05 })),
            onRender: (state) => {
                // Called on every animation frame.
                if (!pointerInteracting.current) {
                    phi += 0.003;
                }
                state.phi = phi + pointerInteractionMovement.current;
            },
        });

        return () => {
            globe.destroy();
        };
    }, [visitors]);

    return (
        <div style={{ width: '100%', height: '100%', position: 'relative', background: '#000' }}>
            <canvas
                ref={canvasRef}
                style={{ width: '100%', height: '100%', contain: 'layout paint size', opacity: 0, transition: 'opacity 1s ease', cursor: 'grab' }}
                onPointerDown={(e) => {
                    pointerInteracting.current = e.clientX - pointerInteractionMovement.current;
                    if (canvasRef.current) canvasRef.current.style.cursor = 'grabbing';
                }}
                onPointerUp={() => {
                    pointerInteracting.current = null;
                    if (canvasRef.current) canvasRef.current.style.cursor = 'grab';
                }}
                onPointerOut={() => {
                    pointerInteracting.current = null;
                    if (canvasRef.current) canvasRef.current.style.cursor = 'grab';
                }}
                onMouseMove={(e) => {
                    if (pointerInteracting.current !== null) {
                        const delta = e.clientX - pointerInteracting.current;
                        pointerInteractionMovement.current = delta * 0.005;
                    }
                }}
                onTouchMove={(e) => {
                    if (pointerInteracting.current !== null && e.touches[0]) {
                        const delta = e.touches[0].clientX - pointerInteracting.current;
                        pointerInteractionMovement.current = delta * 0.005;
                    }
                }}
            />
            {/* Fade in effect */}
            <style jsx>{`
                canvas {
                    opacity: 1 !important;
                }
            `}</style>
        </div>
    );
}
