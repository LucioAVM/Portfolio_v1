/**
 * Iluminación por símbolo del hero (independiente de los glows de fondo).
 *
 * Contrato CSS (--sym-*) aplicado en `.hero-symbol-3d`:
 * - --sym-face: color cara frontal
 * - --sym-bevel-color: color bisel superior iluminado
 * - --sym-bevel-x / --sym-bevel-y: offset del bisel hacia la luz dominante
 * - --sym-rim-strength: opacidad del bisel (1 en foco → ~0.35 al dispersar)
 * - --sym-depth-opacity: opacidad sombra de profundidad
 *
 * Reutilizable en WebGL: mapear a mesh.material.color y luces direccionales.
 */

export type Corner = 'tl' | 'tr' | 'bl' | 'br';

export type SymbolLightState = {
  corner: Corner;
  progress: number;
  tx: number;
  ty: number;
  rotX: number;
  rotZ: number;
};

const CORNER_BASE: Record<Corner, { x: number; y: number }> = {
  tl: { x: 0.34, y: 0.38 },
  tr: { x: 0.66, y: 0.38 },
  bl: { x: 0.32, y: 0.62 },
  br: { x: 0.68, y: 0.62 },
};

const LIGHTS = {
  key: { x: 0.25, y: 0.2 },
  rim: { x: 0.88, y: 0.12 },
  fill: { x: 0.12, y: 0.88 },
} as const;

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function parseHex(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
}

function mixRgb(hexA: string, hexB: string, t: number): string {
  const [ar, ag, ab] = parseHex(hexA);
  const [br, bg, bb] = parseHex(hexB);
  const mix = clamp(t, 0, 1);
  const r = Math.round(ar + (br - ar) * mix);
  const g = Math.round(ag + (bg - ag) * mix);
  const b = Math.round(ab + (bb - ab) * mix);
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

function lightWeight(symX: number, symY: number, lx: number, ly: number): number {
  const dx = lx - symX;
  const dy = ly - symY;
  return 1 / (dx * dx + dy * dy + 0.02);
}

function cornerRimMultiplier(corner: Corner): number {
  if (corner === 'tr' || corner === 'br') return 1.25;
  if (corner === 'bl') return 0.6;
  return 1;
}

function cornerFillMultiplier(corner: Corner): number {
  if (corner === 'bl') return 1.2;
  if (corner === 'tl') return 0.85;
  return 0.5;
}

export function updateSymbolLights(symbolScrollEl: HTMLElement, state: SymbolLightState): void {
  const mesh = symbolScrollEl.querySelector<HTMLElement>('.hero-symbol-3d');
  if (!mesh) return;

  const base = CORNER_BASE[state.corner];
  const symX = clamp(base.x + (state.tx / 100) * 0.32, 0.05, 0.95);
  const symY = clamp(base.y + (state.ty / 100) * 0.28, 0.05, 0.95);
  const progress = clamp(state.progress, 0, 1);

  let wKey = lightWeight(symX, symY, LIGHTS.key.x, LIGHTS.key.y);
  let wRim = lightWeight(symX, symY, LIGHTS.rim.x, LIGHTS.rim.y);
  let wFill = lightWeight(symX, symY, LIGHTS.fill.x, LIGHTS.fill.y);

  wKey *= 1 - progress * 0.75;
  wRim *= 1 + progress * cornerRimMultiplier(state.corner);
  wFill *= 1 + progress * cornerFillMultiplier(state.corner);

  const sum = wKey + wRim + wFill || 1;

  const dirX =
    (wKey * (LIGHTS.key.x - symX) + wRim * (LIGHTS.rim.x - symX) + wFill * (LIGHTS.fill.x - symX)) /
    sum;
  const dirY =
    (wKey * (LIGHTS.key.y - symY) + wRim * (LIGHTS.rim.y - symY) + wFill * (LIGHTS.fill.y - symY)) /
    sum;

  const bevelXPx = clamp(dirX * -10, -2.5, 2.5);
  const bevelYPx = clamp(dirY * -10, -2.5, 2.5);

  const rimTint = clamp((wRim / sum) * progress * cornerRimMultiplier(state.corner), 0, 1);
  const rimStrength = 1 - progress * 0.65;
  const depthOpacity = 1 - progress * 0.3;

  const faceColor = mixRgb('#1e1e1e', '#141414', progress);
  const bevelColor = mixRgb('#3a3a3a', '#4ade80', rimTint * 0.22);

  mesh.style.setProperty('--sym-face', faceColor);
  mesh.style.setProperty('--sym-bevel-color', bevelColor);
  mesh.style.setProperty('--sym-bevel-x', `${bevelXPx.toFixed(2)}px`);
  mesh.style.setProperty('--sym-bevel-y', `${bevelYPx.toFixed(2)}px`);
  mesh.style.setProperty('--sym-rim-strength', rimStrength.toFixed(3));
  mesh.style.setProperty('--sym-depth-opacity', depthOpacity.toFixed(3));
}
