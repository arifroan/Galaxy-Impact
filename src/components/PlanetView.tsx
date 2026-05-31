import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { PlanetData } from '../data';

export function PlanetView({ planet, starColor }: { planet: PlanetData, starColor: string }) {
  const planetRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (planetRef.current) {
      planetRef.current.rotation.y += delta * 0.2;
    }
  });

  return (
    <group>
      {/* Light from the central star relative to this planet */}
      <directionalLight position={[10, 2, 5]} intensity={2} color={starColor} />
      <ambientLight intensity={0.1} color="#ffffff" />
      
      <mesh ref={planetRef}>
        <sphereGeometry args={[4, 64, 64]} />
        <meshStandardMaterial color={planet.color} roughness={0.8} metalness={0.1} />
      </mesh>
      
      {/* Atmosphere glow */}
      <mesh>
        <sphereGeometry args={[4.2, 64, 64]} />
        <meshBasicMaterial color={planet.color} transparent opacity={0.1} blending={THREE.AdditiveBlending} side={THREE.BackSide} />
      </mesh>
      <mesh>
        <sphereGeometry args={[4.4, 64, 64]} />
        <meshBasicMaterial color={planet.color} transparent opacity={0.05} blending={THREE.AdditiveBlending} side={THREE.BackSide} />
      </mesh>
    </group>
  );
}
