export type MoonData = {
  id: string;
  name: string;
  radius: number;
  distanceFromPlanet: number;
  color: string;
};

export type PlanetData = {
  id: string;
  name: string;
  description: string;
  type: string;
  radius: number;
  distanceFromStar: number;
  color: string;
  moons?: MoonData[];
};

export type SystemData = {
  id: string;
  name: string;
  description: string;
  position: [number, number, number]; // x, y, z in galaxy
  starColor: string;
  planets: PlanetData[];
};

export const SYSTEMS: SystemData[] = [
  {
    id: "sol",
    name: "Solar System",
    description: "Our home system, located in the Orion Cygnus Arm. A G-type main-sequence star system harboring diverse planetary bodies, governed by complex orbital dynamics and supporting the only known biosphere.",
    position: [10, 0, 5],
    starColor: "#FBBF24", // Core Gold
    planets: [
      { id: "earth", name: "Earth", description: "The Blue Marble. A terrestrial planet with a nitrogen-oxygen atmosphere, vast liquid water oceans, and an active geology.", type: "Terrestrial", radius: 1, distanceFromStar: 3, color: "#38BDF8", moons: [{ id: "moon", name: "Moon", radius: 0.27, distanceFromPlanet: 5.5, color: "#d1d5db" }] },
      { id: "mars", name: "Mars", description: "The Red Planet. Characterised by its iron oxide surface dust, ancient river valleys, and the largest volcano in the system (Olympus Mons).", type: "Terrestrial", radius: 0.53, distanceFromStar: 4.5, color: "#ef4444", moons: [{ id: "phobos", name: "Phobos", radius: 0.05, distanceFromPlanet: 4.5, color: "#9ca3af" }, { id: "deimos", name: "Deimos", radius: 0.03, distanceFromPlanet: 6.5, color: "#6b7280" }] },
      { id: "jupiter", name: "Jupiter", description: "A massive gas giant composed primarily of hydrogen and helium, featuring complex cloud bands and a long-lived anticyclonic storm known as the Great Red Spot.", type: "Gas Giant", radius: 3, distanceFromStar: 8, color: "#d97706", moons: [{ id: "io", name: "Io", radius: 0.3, distanceFromPlanet: 6, color: "#fef08a" }, { id: "europa", name: "Europa", radius: 0.25, distanceFromPlanet: 7.5, color: "#e5e7eb" }, { id: "ganymede", name: "Ganymede", radius: 0.4, distanceFromPlanet: 9.5, color: "#9ca3af" }, { id: "callisto", name: "Callisto", radius: 0.38, distanceFromPlanet: 11.5, color: "#6b7280" }] }
    ]
  },
  {
    id: "trappist-1",
    name: "TRAPPIST-1",
    description: "An ultra-cool red dwarf star located 39.6 light-years away in the constellation Aquarius. Hosts seven temperate terrestrial planets, three of which orbit in the habitable zone.",
    position: [-15, 2, 8],
    starColor: "#ef4444", // Red Dwarf
    planets: [
      { id: "trappist-1d", name: "TRAPPIST-1d", description: "A compact rocky exoplanet orbiting near the inner edge of the habitable zone, roughly a third the mass of Earth.", type: "Terrestrial", radius: 0.77, distanceFromStar: 2.2, color: "#9ca3af" },
      { id: "trappist-1e", name: "TRAPPIST-1e", description: "One of the most Earth-like exoplanets discovered, with a density suggesting a rocky composition and the potential for liquid water.", type: "Terrestrial", radius: 0.92, distanceFromStar: 3.1, color: "#0d9488" },
      { id: "trappist-1f", name: "TRAPPIST-1f", description: "A potentially water-rich world in the outer habitable zone, which might be enveloped by a thick layer of ice or oceans.", type: "Ocean World", radius: 1.04, distanceFromStar: 4.3, color: "#60a5fa" }
    ]
  },
  {
    id: "alpha-centauri",
    name: "Alpha Centauri",
    description: "The closest star system to the Solar System, consisting of a binary pair (A and B) and a faint red dwarf (Proxima Centauri).",
    position: [12, 1, 6],
    starColor: "#fcd34d",
    planets: [
      { id: "proxima-b", name: "Proxima b", description: "A rocky exoplanet orbiting Proxima Centauri in its habitable zone. Due to its proximity, it is subjected to stellar flares.", type: "Terrestrial", radius: 1.1, distanceFromStar: 2.5, color: "#10b981" }
    ]
  },
  {
    id: "kepler-22",
    name: "Kepler-22",
    description: "A G-type star roughly 620 light-years away. Home to Kepler-22b, the first exoplanet discovered by the Kepler Space Telescope to orbit within the habitable zone of a Sun-like star.",
    position: [25, -8, -15],
    starColor: "#fde047",
    planets: [
      { id: "kepler-22b", name: "Kepler-22b", description: "A super-Earth likely covered by a global liquid ocean, though its exact composition remains obscured by potential planetary atmospherics.", type: "Super-Earth", radius: 2.4, distanceFromStar: 5, color: "#3b82f6" }
    ]
  },
  {
    id: "kepler-186",
    name: "Kepler-186",
    description: "A red dwarf system located approximately 582 light-years away in the constellation Cygnus. Known for hosting the first Earth-sized planet in a habitable zone.",
    position: [-20, 5, -10],
    starColor: "#fca5a5",
    planets: [
      { id: "kepler-186f", name: "Kepler-186f", description: "The first Earth-sized exoplanet discovered in a habitable zone. Its star emits mostly infrared radiation, which would influence hypothetical plant life to appear red or black.", type: "Terrestrial", radius: 1.11, distanceFromStar: 4, color: "#6ee7b7" }
    ]
  }
];
