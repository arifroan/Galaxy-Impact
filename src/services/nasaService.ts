import { SystemData } from '../data';

export async function fetchNasaDescription(query: string, isSystem: boolean): Promise<string | null> {
  try {
    const searchQuery = isSystem ? `${query} star system` : `${query} planet`;
    const res = await fetch(`https://images-api.nasa.gov/search?q=${encodeURIComponent(searchQuery)}&media_type=image`);
    
    if (!res.ok) return null;
    const json = await res.json();
    
    const items = json?.collection?.items || [];
    for (const item of items) {
      let desc = item?.data?.[0]?.description as string;
      if (desc && desc.length > 20) {
        // Strip HTML tags for clean rendering
        desc = desc.replace(/<[^>]*>?/gm, '');
        
        // Filter out explicit photo captions to favor encyclopedic facts
        if (!desc.toLowerCase().includes("this image") && !desc.toLowerCase().includes("photograph reveals") && !desc.toLowerCase().includes("artist's concept") && !desc.toLowerCase().includes("artist concept")) {
           const match = desc.match(/([^.!?]+[.!?]+){1,3}/); // Grab up to 3 sentences
           const shortDesc = match ? match[0].trim() : desc.substring(0, 200) + '...';
           return `NASA Open DB: ${shortDesc}`;
        }
      }
    }
    
    // Fallback to the first item's description if no encyclopedic match is found
    if (items.length > 0) {
        let desc = items[0].data[0].description as string;
        desc = desc.replace(/<[^>]*>?/gm, '');
        const match = desc.match(/([^.!?]+[.!?]+){1,2}/);
        const shortDesc = match ? match[0].trim() : desc.substring(0, 150) + '...';
        return `NASA Open DB: ${shortDesc}`;
    }
    
  } catch (e) {
    console.warn(`NASA Database synchronization failed for ${query} due to network/cors limits.`, e);
  }
  return null;
}

export async function enrichSystemsWithNasaData(systems: SystemData[]): Promise<SystemData[]> {
  const enriched = JSON.parse(JSON.stringify(systems)) as SystemData[];
  const promises = [];
  
  for (const system of enriched) {
    promises.push(
      fetchNasaDescription(system.name, true).then(nasaDesc => {
        if (nasaDesc) system.description = nasaDesc;
      })
    );
    for (const planet of system.planets) {
      promises.push(
        fetchNasaDescription(planet.name, false).then(nasaDesc => {
          if (nasaDesc) planet.description = nasaDesc;
        })
      );
    }
  }
  
  // Concurrently fetch all descriptions to optimize start time & scanning
  await Promise.all(promises);
  return enriched;
}
