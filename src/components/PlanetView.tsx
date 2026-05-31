import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { PlanetData, MoonData } from '../data';
import { Html } from '@react-three/drei';
import { isMobile } from '../utils/device';

function Moon({ moon }: { moon: MoonData }) {
  const groupRef = useRef<THREE.Group>(null);
  const initialRotation = useRef(Math.random() * Math.PI * 2);
  // Add some slight tilt and rotation based on distance
  const speed = useRef(1.0 / moon.distanceFromPlanet + (Math.random() * 0.1 - 0.05));

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * speed.current;
    }
  });

  return (
    <group ref={groupRef} rotation={[0, initialRotation.current, 0]}>
      {/* Orbital Ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[moon.distanceFromPlanet - 0.02, moon.distanceFromPlanet + 0.02, isMobile ? 32 : 64]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.15} side={THREE.DoubleSide} />
      </mesh>
      
      {/* Moon Body */}
      <group position={[moon.distanceFromPlanet, 0, 0]}>
        <mesh castShadow={!isMobile} receiveShadow={!isMobile}>
          <sphereGeometry args={[moon.radius, isMobile ? 16 : 32, isMobile ? 16 : 32]} />
          <meshStandardMaterial color={moon.color} roughness={0.9} />
        </mesh>
        <Html distanceFactor={15} position={[0, -moon.radius - 0.5, 0]} center zIndexRange={[100, 0]}>
          <div className="px-1.5 py-0.5 bg-[#020308]/60 backdrop-blur-md rounded border border-white/10 text-white/70 font-mono text-[10px] whitespace-nowrap pointer-events-none uppercase">
            {moon.name}
          </div>
        </Html>
      </group>
    </group>
  );
}

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
      <directionalLight position={[10, 2, 5]} intensity={2} color={starColor} castShadow={!isMobile} shadow-bias={-0.001} />
      <ambientLight intensity={0.05} color="#ffffff" />
      
      <group ref={planetRef}>
        <mesh castShadow={!isMobile} receiveShadow={!isMobile}>
          <sphereGeometry args={[4, isMobile ? 32 : 64, isMobile ? 32 : 64]} />
          <meshStandardMaterial color={planet.color} roughness={0.8} metalness={0.1} />
        </mesh>
        
        {/* Atmosphere glow */}
        <mesh>
          <sphereGeometry args={[4.2, isMobile ? 32 : 64, isMobile ? 32 : 64]} />
          <meshBasicMaterial color={planet.color} transparent opacity={0.1} blending={THREE.AdditiveBlending} side={THREE.BackSide} />
        </mesh>
        {!isMobile && (
          <mesh>
            <sphereGeometry args={[4.4, 64, 64]} />
            <meshBasicMaterial color={planet.color} transparent opacity={0.05} blending={THREE.AdditiveBlending} side={THREE.BackSide} />
          </mesh>
        )}
      </group>

      {/* Moons - orbiting the center (planet's position) */}
      {planet.moons && planet.moons.map((moon) => (
        <Moon key={moon.id} moon={moon} />
      ))}
    </group>
  );
}
