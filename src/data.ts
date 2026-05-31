export type PlanetData = {
  id: string;
  name: string;
  description: string;
  type: string;
  radius: number;
  distanceFromStar: number;
  color: string;
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
    description: "Our home system, located in the Orion Arm.",
    position: [10, 0, 5],
    starColor: "#FBBF24", // Core Gold
    planets: [
      { id: "earth", name: "Earth", description: "The Blue Marble. A terrestrial planet.", type: "Terrestrial", radius: 1, distanceFromStar: 3, color: "#38BDF8" },
      { id: "mars", name: "Mars", description: "The Red Planet. Dusty and cold.", type: "Terrestrial", radius: 0.53, distanceFromStar: 4.5, color: "#ef4444" },
      { id: "jupiter", name: "Jupiter", description: "A massive gas giant with swirling storms.", type: "Gas Giant", radius: 3, distanceFromStar: 8, color: "#d97706" }
    ]
  },
  {
    id: "alpha-centauri",
    name: "Alpha Centauri",
    description: "The closest star system to the Solar System.",
    position: [12, 1, 6],
    starColor: "#fcd34d",
    planets: [
      { id: "proxima-b", name: "Proxima b", description: "A rocky exoplanet in the habitable zone.", type: "Terrestrial", radius: 1.1, distanceFromStar: 2, color: "#10b981" }
    ]
  },
  {
    id: "sirius",
    name: "Sirius System",
    description: "Contains Sirius A, the brightest star in the night sky.",
    position: [-5, -2, 15],
    starColor: "#bae6fd",
    planets: [
      { id: "sirius-c", name: "Sirius C", description: "A hypothetical terrestrial planet.", type: "Terrestrial", radius: 1.2, distanceFromStar: 5, color: "#94a3b8" }
    ]
  },
  {
    id: "kepler-186",
    name: "Kepler-186",
    description: "A red dwarf system known for its Earth-sized exoplanets.",
    position: [-20, 5, -10],
    starColor: "#fca5a5",
    planets: [
      { id: "kepler-186f", name: "Kepler-186f", description: "The first Earth-sized exoplanet discovered in a habitable zone.", type: "Terrestrial", radius: 1.1, distanceFromStar: 4, color: "#6ee7b7" }
    ]
  }
];
