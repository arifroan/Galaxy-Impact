import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { SystemData, PlanetData } from '../data';
import { Html } from '@react-three/drei';

export function StarSystem({ system, onSelectPlanet }: { system: SystemData, onSelectPlanet: (planet: PlanetData) => void }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.05;
    }
  });

  return (
    <group>
      {/* Central Star */}
      <mesh>
        <sphereGeometry args={[2, isMobile ? 16 : 32, isMobile ? 16 : 32]} />
        <meshBasicMaterial color={new THREE.Color(system.starColor).multiplyScalar(2.0)} toneMapped={false} />
      </mesh>
      <pointLight color={system.starColor} intensity={5} distance={100} castShadow shadow-bias={-0.001} />
      
      {/* Star Halo */}
      <mesh>
        <sphereGeometry args={[4, isMobile ? 16 : 32, isMobile ? 16 : 32]} />
        <meshBasicMaterial color={system.starColor} transparent opacity={0.15} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
      </mesh>
      {!isMobile && (
        <mesh>
          <sphereGeometry args={[8, 32, 32]} />
          <meshBasicMaterial color={system.starColor} transparent opacity={0.05} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
        </mesh>
      )}

      <group ref={groupRef}>
        {system.planets.map((planet) => (
          <group key={planet.id}>
            {/* Orbit Ring */}
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[planet.distanceFromStar - 0.02, planet.distanceFromStar + 0.02, 64]} />
              <meshBasicMaterial color="#ffffff" transparent opacity={0.1} side={THREE.DoubleSide} />
            </mesh>

            {/* Planet */}
            <group position={[planet.distanceFromStar, 0, 0]} onClick={(e) => { e.stopPropagation(); onSelectPlanet(planet); }}>
              <mesh castShadow={!isMobile} receiveShadow={!isMobile}>
                <sphereGeometry args={[planet.radius * 0.4, isMobile ? 16 : 32, isMobile ? 16 : 32]} />
                <meshStandardMaterial color={planet.color} roughness={0.7} metalness={0.2} />
              </mesh>
              {/* Atmosphere Glow */}
              <mesh>
                 <sphereGeometry args={[planet.radius * 0.4 * 1.1, isMobile ? 16 : 32, isMobile ? 16 : 32]} />
                 <meshBasicMaterial color={planet.color} transparent opacity={0.2} blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.BackSide} />
              </mesh>
              {/* Touch target expansion */}
              <mesh visible={false}>
                <sphereGeometry args={[planet.radius * 0.4 > 1 ? planet.radius * 0.4 + 0.5 : 1, 16, 16]} />
                <meshBasicMaterial />
              </mesh>
              <Html distanceFactor={15} position={[0, -planet.radius * 0.4 - 0.5, 0]} center zIndexRange={[100, 0]}>
                <div className="px-2 py-1 bg-[#020308]/80 backdrop-blur-md rounded border border-white/20 text-white text-xs whitespace-nowrap pointer-events-none">
                  {planet.name}
                </div>
              </Html>
            </group>
          </group>
        ))}
      </group>
    </group>
  );
}
