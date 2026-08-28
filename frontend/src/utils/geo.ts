import * as turf from '@turf/turf';

export function calculateBearing(coord1: [number, number], coord2: [number, number]): number {
  const point1 = turf.point(coord1);
  const point2 = turf.point(coord2);
  return turf.bearing(point1, point2);
}

export function getRouteBounds(coordinates: [number, number][]): [[number, number], [number, number]] {
  const valid = (coordinates || []).filter(
    c => Array.isArray(c) && c.length >= 2 && !isNaN(c[0]) && !isNaN(c[1]) && (c[0] !== 0 || c[1] !== 0)
  );

  if (valid.length === 0) {
    return [[72, 18], [88, 28]];
  }
  if (valid.length === 1) {
    const [lng, lat] = valid[0];
    return [[lng - 0.5, lat - 0.5], [lng + 0.5, lat + 0.5]];
  }

  const line = turf.lineString(valid);
  const bbox = turf.bbox(line); // [minX, minY, maxX, maxY]
  return [
    [bbox[0], bbox[1]],
    [bbox[2], bbox[3]],
  ];
}

export function interpolatePosition(from: [number, number], to: [number, number], progress: number): [number, number] {
  const lng = from[0] + (to[0] - from[0]) * progress;
  const lat = from[1] + (to[1] - from[1]) * progress;
  return [lng, lat];
}
