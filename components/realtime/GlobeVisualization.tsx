'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere } from '@react-three/drei';
import * as THREE from 'three';

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

function Globe({ visitors }: { visitors: Visitor[] }) {
    const globeRef = useRef<THREE.Mesh>(null);

    useFrame(() => {
        if (globeRef.current) {
            globeRef.current.rotation.y += 0.001;
        }
    });

    // Convert lat/lng to 3D position
    const getPosition = (lat: number, lng: number, radius: number) => {
        const phi = (90 - lat) * (Math.PI / 180);
        const theta = (lng + 180) * (Math.PI / 180);
        const x = -(radius * Math.sin(phi) * Math.cos(theta));
        const z = radius * Math.sin(phi) * Math.sin(theta);
        const y = radius * Math.cos(phi);
        return [x, y, z] as [number, number, number];
    };

    return (
        <group>
            {/* Earth Sphere */}
            <Sphere ref={globeRef} args={[2, 64, 64]}>
                <meshStandardMaterial
                    color="#1a1a1a"
                    emissive="#111111"
                    roughness={0.7}
                    metalness={0.1}
                    wireframe={true}
                />
            </Sphere>

            {/* Inner Sphere to block background */}
            <Sphere args={[1.95, 64, 64]}>
                <meshBasicMaterial color="#000" />
            </Sphere>

            {/* Visitor Markers */}
            {visitors.map((visitor) => {
                const position = getPosition(visitor.lat, visitor.lng, 2.05);
                return (
                    <mesh key={visitor.id} position={position}>
                        <sphereGeometry args={[0.05, 16, 16]} />
                        <meshBasicMaterial color="#3b82f6" />
                    </mesh>
                );
            })}
        </group>
    );
}

export default function GlobeVisualization({ visitors = [] }: GlobeVisualizationProps) {
    return (
        <div style={{ width: '100%', height: '600px', background: '#000' }}>
            <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} />
                <Globe visitors={visitors} />
                <OrbitControls enableZoom={false} autoRotate={false} />
            </Canvas>
        </div>
    );
}
