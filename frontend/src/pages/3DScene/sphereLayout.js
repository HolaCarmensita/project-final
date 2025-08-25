// Calculates evenly distributed sphere positions for N items
export function getSpherePosition(index, count, radius = 20) {
  const offset = 2 / count;
  const increment = Math.PI * (3 - Math.sqrt(5));
  const y = index * offset - 1 + offset / 2;
  const r = Math.sqrt(1 - y * y);
  const phi = index * increment;
  const x = Math.cos(phi) * r;
  const z = Math.sin(phi) * r;
  return [x * radius, y * radius, z * radius];
}
