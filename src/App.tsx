/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { UIOverlay } from './components/UIOverlay';
import { SceneContainer } from './components/SceneContainer';
import { SYSTEMS, SystemData, PlanetData } from './data';
import { enrichSystemsWithNasaData } from './services/nasaService';
import { isMobile } from './utils/device';

type ViewMode = 'galaxy' | 'system' | 'planet';

export default function App() {
  const [systemsData, setSystemsData] = useState<SystemData[]>(SYSTEMS);
  const [isScanning, setIsScanning] = useState(true);

  const [viewMode, setViewMode] = useState<ViewMode>('galaxy');
  const [selectedSystem, setSelectedSystem] = useState<SystemData | null>(null);
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetData | null>(null);

  useEffect(() => {
    const fetchNasa = async () => {
      setIsScanning(true);
      try {
        const enriched = await enrichSystemsWithNasaData(SYSTEMS);
        setSystemsData(enriched);
      } catch (e) {
        console.error("NASA Sync failed", e);
      } finally {
        setIsScanning(false);
      }
    };
    fetchNasa();
  }, []);

  const handleSelectSystem = (sys: SystemData) => {
    const freshSys = systemsData.find(s => s.id === sys.id) || sys;
    setSelectedSystem(freshSys);
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
    const sol = systemsData.find(s => s.id === 'sol');
    if (sol) {
      handleSelectSystem(sol);
    }
  };

  // Keep selected references fresh if background scan completes while viewing them
  useEffect(() => {
    if (selectedSystem) {
      const freshSys = systemsData.find(s => s.id === selectedSystem.id);
      if (freshSys && freshSys.description !== selectedSystem.description) {
        setSelectedSystem(freshSys);
      }
    }
    if (selectedPlanet && selectedSystem) {
      const freshSys = systemsData.find(s => s.id === selectedSystem.id);
      if (freshSys) {
        const freshPlanet = freshSys.planets.find(p => p.id === selectedPlanet.id);
        if (freshPlanet && freshPlanet.description !== selectedPlanet.description) {
          setSelectedPlanet(freshPlanet);
        }
      }
    }
  }, [systemsData, selectedSystem, selectedPlanet]);

  return (
    <div className="w-full h-screen bg-[#020308] overflow-hidden relative font-sans selection:bg-sky-500/30">
      <UIOverlay 
        viewMode={viewMode}
        selectedSystem={selectedSystem}
        selectedPlanet={selectedPlanet}
        onBack={handleBack}
        onBeginJourney={handleBeginJourney}
        isScanning={isScanning}
      />
      
      <Canvas 
        className="touch-none" 
        camera={{ position: [0, 30, 40], fov: 45 }}
        dpr={[1, Math.min(window.devicePixelRatio || 2, 2)]} // limit pixel ratio for mobile performance
        gl={{ antialias: !isMobile, powerPreference: "high-performance" }} // mobile perf tweaks
        shadows={!isMobile}
      >
        <color attach="background" args={['#020308']} />
        <Suspense fallback={null}>
          <SceneContainer
            viewMode={viewMode}
            systems={systemsData}
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

