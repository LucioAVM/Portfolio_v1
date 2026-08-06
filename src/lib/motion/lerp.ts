/** Interpolación lineal; `t` más bajo = más suave / con más inercia. */
export function lerp(current: number, target: number, t: number): number {
  return current + (target - current) * t;
}

export function nearlyEqual(a: number, b: number, epsilon = 0.0004): boolean {
  return Math.abs(a - b) < epsilon;
}
