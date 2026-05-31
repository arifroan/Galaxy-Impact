import { useRef, useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import { GalaxyMap } from './GalaxyMap';
import { StarSystem } from './StarSystem';
import { PlanetView } from './PlanetView';
import { SystemData, PlanetData } from '../data';

type ViewMode = 'galaxy' | 'system' | 'planet';

interface SceneContainerProps {
  viewMode: ViewMode;
  systems: SystemData[];
  selectedSystem: SystemData | null;
  selectedPlanet: PlanetData | null;
  onSelectSystem: (sys: SystemData) => void;
  onSelectPlanet: (planet: PlanetData) => void;
}

export function SceneContainer({ viewMode, systems, selectedSystem, selectedPlanet, onSelectSystem, onSelectPlanet }: SceneContainerProps) {
  const controlsRef = useRef<any>(null);
  const { camera } = useThree();

  useEffect(() => {
    if (!controlsRef.current) return;
    const controls = controlsRef.current;

    // Reset camera based on mode
    if (viewMode === 'galaxy') {
      camera.position.set(0, 30, 40);
      controls.target.set(0, 0, 0);
      controls.minDistance = 10;
      controls.maxDistance = 100;
    } else if (viewMode === 'system' && selectedSystem) {
      camera.position.set(0, 15, 20);
      controls.target.set(0, 0, 0);
      controls.minDistance = 5;
      controls.maxDistance = 60;
    } else if (viewMode === 'planet' && selectedPlanet) {
      camera.position.set(0, 2, 12);
      controls.target.set(0, 0, 0);
      controls.minDistance = 6;
      controls.maxDistance = 20;
    }
    controls.update();
  }, [viewMode, selectedSystem, selectedPlanet, camera]);

  return (
    <>
      <OrbitControls ref={controlsRef} enableDamping dampingFactor={0.05} />
      
      {viewMode === 'galaxy' && (
        <GalaxyMap systems={systems} onSelectSystem={onSelectSystem} />
      )}
      
      {viewMode === 'system' && selectedSystem && (
        <StarSystem system={selectedSystem} onSelectPlanet={onSelectPlanet} />
      )}
      
      {viewMode === 'planet' && selectedPlanet && selectedSystem && (
        <PlanetView planet={selectedPlanet} starColor={selectedSystem.starColor} />
      )}

      <EffectComposer>
        <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.9} intensity={1.5} mipmapBlur />
      </EffectComposer>
    </>
  );
}
