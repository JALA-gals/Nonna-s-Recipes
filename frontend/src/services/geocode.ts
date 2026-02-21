export type LatLng = { lat: number; lng: number };

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function fetchNominatim(url: string) {
  const res = await fetch(url, {
    headers: {
      "User-Agent": "nonna-recipes-hackathon/1.0",
      Accept: "application/json",
    },
  });
  return res;
}

export async function geocodePlace(
  place: string,
  countryCode?: string
): Promise<LatLng | null> {
  const p = place.trim();
  if (!p) return null;

  const cc = countryCode?.trim().toLowerCase();
  const queryText = cc && cc.length === 2 ? `${p}, ${cc.toUpperCase()}` : p;

  const params = new URLSearchParams({
    format: "json",
    limit: "1",
    q: queryText,
  });

  if (cc && cc.length === 2) {
    params.set("countrycodes", cc);
  }

  const url = `https://nominatim.openstreetmap.org/search?${params.toString()}`;
  console.log("GEOCODE URL:", url);

  // Try up to 3 times if rate-limited
  for (let attempt = 1; attempt <= 3; attempt++) {
    const res = await fetchNominatim(url);
    console.log("GEOCODE STATUS:", res.status, "attempt", attempt);

    if (res.status === 429) {
      // rate limit: wait a bit and retry
      await sleep(800 * attempt);
      continue;
    }

    if (!res.ok) return null;

    const data = (await res.json()) as any[];
    console.log("GEOCODE RAW RESULT:", data?.[0]);

    if (!data?.length) return null;

    const lat = Number(data[0].lat);
    const lng = Number(data[0].lon);

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
    return { lat, lng };
  }

  // If we got rate-limited every time
  console.log("GEOCODE FAILED: rate limited");
  return null;
}