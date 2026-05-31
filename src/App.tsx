/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { UIOverlay } from './components/UIOverlay';
import { SceneContainer } from './components/SceneContainer';
import { SYSTEMS, SystemData, PlanetData } from './data';

type ViewMode = 'galaxy' | 'system' | 'planet';

export default function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('galaxy');
  const [selectedSystem, setSelectedSystem] = useState<SystemData | null>(null);
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetData | null>(null);

  const handleSelectSystem = (sys: SystemData) => {
    setSelectedSystem(sys);
    setViewMode('system');
  };

  const handleSelectPlanet = (planet: PlanetData) => {
    setSelectedPlanet(planet);
    setViewMode('planet');
  };

  const handleBack = () => {
    if (viewMode === 'planet') {
      setViewMode('system');
      setSelectedPlanet(null);
    } else if (viewMode === 'system') {
      setViewMode('galaxy');
      setSelectedSystem(null);
    }
  };

  const handleBeginJourney = () => {
    // Simple mock journey: jump to Solar System
    const sol = SYSTEMS.find(s => s.id === 'sol');
    if (sol) {
      handleSelectSystem(sol);
    }
  };

  return (
    <div className="w-full h-screen bg-[#020308] overflow-hidden relative font-sans selection:bg-sky-500/30">
      <UIOverlay 
        viewMode={viewMode}
        selectedSystem={selectedSystem}
        selectedPlanet={selectedPlanet}
        onBack={handleBack}
        onBeginJourney={handleBeginJourney}
      />
      
      <Canvas 
        className="touch-none" 
        camera={{ position: [0, 30, 40], fov: 45 }}
        dpr={[1, 2]} // limit pixel ratio for mobile performance
        gl={{ antialias: false, powerPreference: "high-performance" }} // mobile perf tweaks
      >
        <color attach="background" args={['#020308']} />
        <Suspense fallback={null}>
          <SceneContainer
            viewMode={viewMode}
            systems={SYSTEMS}
            selectedSystem={selectedSystem}
            selectedPlanet={selectedPlanet}
            onSelectSystem={handleSelectSystem}
            onSelectPlanet={handleSelectPlanet}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}

