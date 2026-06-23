// Scroll remap: creates "dwell zones" where the camera pauses at each screen,
// giving the user time to read and click. Between dwells, smoothstep-eased travel.

export function getScreenPositions(projectCount) {
  return Array.from(
    { length: projectCount },
    (_, i) => 0.12 + (i / projectCount) * 0.72
  );
}

export function buildScrollRemap(projectCount, dwellFraction = 0.08) {
  const screenTs = getScreenPositions(projectCount);
  const totalDwell = screenTs.length * dwellFraction;
  const totalTravel = 1 - totalDwell - 0.04; // 4% reserved for start/end padding

  const camPoints = [0, ...screenTs, 0.99];
  const distances = [];
  for (let i = 0; i < camPoints.length - 1; i++) {
    distances.push(camPoints[i + 1] - camPoints[i]);
  }
  const sumDistances = distances.reduce((a, b) => a + b, 0);

  const stops = [[0, 0]];
  let p = 0.02; // start padding

  for (let i = 1; i < camPoints.length; i++) {
    const travelP = (distances[i - 1] / sumDistances) * totalTravel;
    p += travelP;
    stops.push([p, camPoints[i]]);
    if (i < camPoints.length - 1) {
      p += dwellFraction;
      stops.push([p, camPoints[i]]);
    }
  }

  // Normalize so last stop reaches progress = 1
  const lastP = stops[stops.length - 1][0];
  const scale = 1 / lastP;
  stops.forEach((s) => { s[0] *= scale; });

  return { stops, screenTs };
}

export function remapProgress(progress, stops) {
  if (progress <= stops[0][0]) return stops[0][1];
  if (progress >= stops[stops.length - 1][0]) return stops[stops.length - 1][1];

  for (let i = 0; i < stops.length - 1; i++) {
    const [p0, t0] = stops[i];
    const [p1, t1] = stops[i + 1];
    if (progress >= p0 && progress <= p1) {
      const localT = (progress - p0) / (p1 - p0);
      const smooth = localT * localT * (3 - 2 * localT);
      return t0 + (t1 - t0) * smooth;
    }
  }
  return stops[stops.length - 1][1];
}