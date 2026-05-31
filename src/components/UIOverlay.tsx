import { SystemData, PlanetData } from '../data';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Info, Compass, Play } from 'lucide-react';

type ViewMode = 'galaxy' | 'system' | 'planet';

interface UIOverlayProps {
  viewMode: ViewMode;
  selectedSystem: SystemData | null;
  selectedPlanet: PlanetData | null;
  onBack: () => void;
  onBeginJourney: () => void;
  isScanning?: boolean;
}

export function UIOverlay({ viewMode, selectedSystem, selectedPlanet, onBack, onBeginJourney, isScanning }: UIOverlayProps) {
  return (
    <div className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-between overflow-hidden p-4 sm:p-6 pb-8">
      {/* Top Bar */}
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-2">
          <AnimatePresence mode="popLayout">
            {viewMode !== 'galaxy' && (
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onClick={onBack}
                className="pointer-events-auto flex items-center gap-2 text-sky-400 bg-[#020308]/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-sky-400/30 hover:bg-sky-400/20 transition-colors w-fit"
              >
                <ChevronLeft size={16} />
                <span className="text-sm font-medium tracking-wider uppercase">Back</span>
              </motion.button>
            )}
          </AnimatePresence>

          <div className="bg-[#020308]/60 backdrop-blur-md px-4 py-3 border-l-2 border-sky-400 mt-2 shadow-[0_0_15px_rgba(56,189,248,0.1)]">
            <h1 className="text-white font-sans text-xl sm:text-2xl tracking-widest uppercase font-semibold">
              {viewMode === 'galaxy' ? 'Milky Way' : viewMode === 'system' ? selectedSystem?.name : selectedPlanet?.name}
            </h1>
            <p className="text-sky-200/60 font-mono text-xs uppercase tracking-widest mt-1">
              {viewMode === 'galaxy' ? 'Sector Map : Orion Arm' : viewMode === 'system' ? 'Star System View' : 'Planetary Body Data'}
            </p>
          </div>
        </div>

        {/* Right side controls / compass */}
        <div className="pointer-events-auto flex flex-col items-end gap-4">
          {/* Scanning Indicator */}
          <div className="bg-[#020308]/60 backdrop-blur-md px-3 py-1.5 border border-sky-400/20 rounded-full flex items-center gap-2 shadow-[0_0_10px_rgba(56,189,248,0.1)]">
            {isScanning ? (
              <>
                <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse shadow-[0_0_5px_#FBBF24]" />
                <span className="text-[10px] text-amber-400 font-mono tracking-widest uppercase whitespace-nowrap">Syncing NASA DB</span>
              </>
            ) : (
              <>
                <div className="w-2 h-2 bg-emerald-400 rounded-full shadow-[0_0_5px_#34d399]" />
                <span className="text-[10px] text-emerald-400 font-mono tracking-widest uppercase whitespace-nowrap">NASA Synced</span>
              </>
            )}
          </div>

          <div className="w-12 h-12 bg-[#020308]/60 backdrop-blur-md border border-sky-400/30 rounded-full flex items-center justify-center text-sky-400 shadow-[0_0_15px_rgba(56,189,248,0.15)] relative overflow-hidden">
            <Compass size={20} />
            <div className="absolute inset-0 border-t-2 border-sky-400 rounded-full animate-spin" style={{ animationDuration: '3s' }} />
          </div>

          {/* Mini Radar / Astrolabe aesthetic hint */}
          <div className="hidden sm:flex w-24 h-24 bg-[#020308]/40 backdrop-blur-md rounded-full border border-sky-400/10 items-center justify-center relative shadow-inner">
             <div className="absolute inset-2 rounded-full border border-dashed border-sky-400/20 animate-spin-slow" />
             <div className="absolute inset-6 rounded-full border border-sky-400/10" />
             <div className="absolute w-1 h-1 bg-sky-400 rounded-full top-4 shadow-[0_0_8px_rgba(56,189,248,1)]" />
             <div className="absolute w-2 h-2 bg-amber-400 rounded-full shadow-[0_0_8px_rgba(251,191,36,1)]" />
          </div>
        </div>
      </div>

      {/* Bottom Context Info Card */}
      <div className="w-full max-w-md mx-auto sm:mx-0 sm:ml-auto pointer-events-auto">
        <AnimatePresence mode="wait">
          {viewMode === 'galaxy' && (
             <motion.div
              key="galaxy-info"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="bg-[#020308]/70 backdrop-blur-xl border border-sky-400/30 p-5 rounded-2xl shadow-[0_0_30px_rgba(56,189,248,0.1)] relative overflow-hidden group"
             >
                <div className="absolute inset-0 bg-gradient-to-t from-sky-400/10 to-transparent pointer-events-none group-hover:from-sky-400/20 transition-all duration-500" />
                <h2 className="text-sky-100 font-medium tracking-wide mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-sky-400 rounded-full animate-pulse shadow-[0_0_5px_#38BDF8]" /> Navigation Active
                </h2>
                <p className="text-sky-200/80 text-sm leading-relaxed mb-6 font-sans">
                  Pinch to zoom and drag to rotate the galaxy. Tap on highlighted star systems to explore deeper into the local arm of the galaxy.
                </p>
                <button
                  onClick={onBeginJourney}
                  className="w-full bg-sky-400/10 hover:bg-sky-400/20 border border-sky-400/80 text-sky-300 hover:text-sky-100 uppercase tracking-widest font-medium py-3 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-[inset_0_0_15px_rgba(56,189,248,0.1)]"
                >
                  <Play size={16} fill="currentColor" />
                  Begin Journey
                </button>
             </motion.div>
          )}

          {viewMode === 'system' && selectedSystem && (
            <motion.div
              key="system-info"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="bg-[#020308]/70 backdrop-blur-xl border border-amber-400/30 p-5 rounded-2xl shadow-[0_0_30px_rgba(251,191,36,0.1)] relative overflow-hidden"
             >
                <div className="absolute inset-0 bg-gradient-to-t from-amber-400/10 to-transparent pointer-events-none" />
                <h2 className="text-amber-100 font-medium tracking-wide mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shadow-[0_0_5px_#FBBF24]" /> Class G Star
                </h2>
                <p className="text-amber-200/80 text-sm leading-relaxed mb-5 font-sans border-b border-amber-400/20 pb-5">
                  {selectedSystem.description}
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col bg-amber-400/5 p-3 rounded-lg border border-amber-400/10">
                    <span className="text-[10px] text-amber-400/60 uppercase tracking-widest font-mono">Planets Detected</span>
                    <span className="text-amber-100 font-mono text-xl mt-1">{selectedSystem.planets.length}</span>
                  </div>
                  <div className="flex flex-col bg-amber-400/5 p-3 rounded-lg border border-amber-400/10">
                    <span className="text-[10px] text-amber-400/60 uppercase tracking-widest font-mono">System Status</span>
                    <span className="text-emerald-400 font-mono text-sm uppercase mt-1 tracking-wider">Stable</span>
                  </div>
                </div>
             </motion.div>
          )}

          {viewMode === 'planet' && selectedPlanet && (
            <motion.div
              key="planet-info"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="bg-[#020308]/70 backdrop-blur-xl border border-violet-500/30 p-5 rounded-2xl shadow-[0_0_30px_rgba(139,92,246,0.1)] relative overflow-hidden"
             >
                <div className="absolute inset-0 bg-gradient-to-t from-violet-500/10 to-transparent pointer-events-none" />
                <div className="flex justify-between items-center mb-4 pb-4 border-b border-violet-500/20">
                  <h2 className="text-violet-100 font-medium tracking-wide flex items-center gap-2">
                     <Info size={16} className="text-violet-400" />
                     Data Profile
                  </h2>
                  <span className="text-[10px] font-mono text-violet-300 bg-violet-400/10 px-2 py-1 rounded border border-violet-500/30 uppercase tracking-widest">
                    {selectedPlanet.type}
                  </span>
                </div>
                <p className="text-violet-200/80 text-sm leading-relaxed mb-5 font-sans">
                  {selectedPlanet.description}
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col bg-violet-500/5 p-3 rounded-lg border border-violet-500/10">
                    <span className="text-[10px] text-violet-400/60 uppercase tracking-widest font-mono">Radius</span>
                    <span className="text-violet-100 font-mono text-sm mt-1">{selectedPlanet.radius} AU</span>
                  </div>
                  <div className="flex flex-col bg-violet-500/5 p-3 rounded-lg border border-violet-500/10">
                    <span className="text-[10px] text-violet-400/60 uppercase tracking-widest font-mono">Orbit Distance</span>
                    <span className="text-violet-100 font-mono text-sm mt-1">{selectedPlanet.distanceFromStar} AU</span>
                  </div>
                </div>
             </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
