/**
 * Iluminación por símbolo del hero (independiente de los glows de fondo).
 *
 * Modelo Fase 2 — alineado a MeshPhysical #444 + DirectionalLight [-2,-2,6]:
 * - Key sup-izq-frente (sin rim blanco ni stroke)
 * - Fill suave inf-der
 * - Bisel gris (#4a–#62), no acento verde
 *
 * Contrato CSS (--sym-*):
 * - --sym-face, --sym-bevel-color, --sym-bevel-x/y
 * - --sym-rim-strength, --sym-depth-opacity, --sym-blur
 */

export type Corner = 'tl' | 'tr' | 'bl' | 'br';

export type SymbolLightState = {
  corner: Corner;
  progress: number;
  tx: number;
  ty: number;
  rotX: number;
  rotZ: number;
  /** Mouse normalizado (-1…1), opcional */
  mouseX?: number;
  mouseY?: number;
};

const CORNER_BASE: Record<Corner, { x: number; y: number }> = {
  tl: { x: 0.09, y: 0.44 },
  tr: { x: 0.91, y: 0.38 },
  bl: { x: 0.34, y: 0.8 },
  br: { x: 0.84, y: 0.7 },
};

/** Proyección pantalla de DirectionalLight [-2,-2,6] → sup-izq */
const KEY_LIGHT = { x: 0.18, y: 0.22 };
const FILL_LIGHT = { x: 0.82, y: 0.84 };

const FACE_BASE = '#444444';
const FACE_DARK = '#2a2a2a';
const BEVEL_SHADOW = '#3a3a3a';
const BEVEL_LIT = '#626262';

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
  return 1 / (dx * dx + dy * dy + 0.035);
}

function cornerKeyBias(corner: Corner): number {
  if (corner === 'tl' || corner === 'tr') return 1.12;
  if (corner === 'bl') return 0.92;
  return 0.88;
}

export function updateSymbolLights(symbolScrollEl: HTMLElement, state: SymbolLightState): void {
  const mesh = symbolScrollEl.querySelector<HTMLElement>('.hero-symbol-3d');
  if (!mesh) return;

  const base = CORNER_BASE[state.corner];
  const mouseX = state.mouseX ?? 0;
  const mouseY = state.mouseY ?? 0;

  const symX = clamp(base.x + (state.tx / 100) * 0.28 + mouseX * 0.04, 0.05, 0.95);
  const symY = clamp(base.y + (state.ty / 100) * 0.24 + mouseY * 0.04, 0.05, 0.95);
  const progress = clamp(state.progress, 0, 1);

  let wKey = lightWeight(symX, symY, KEY_LIGHT.x, KEY_LIGHT.y) * cornerKeyBias(state.corner);
  let wFill = lightWeight(symX, symY, FILL_LIGHT.x, FILL_LIGHT.y);

  wKey *= 1 - progress * 0.55;
  wFill *= 1 + progress * 0.35;

  const sum = wKey + wFill || 1;
  const keyRatio = wKey / sum;

  const toKeyX = KEY_LIGHT.x - symX;
  const toKeyY = KEY_LIGHT.y - symY;
  const len = Math.hypot(toKeyX, toKeyY) || 1;

  const bevelXPx = clamp((-toKeyX / len) * 2.8, -2.5, 0.5);
  const bevelYPx = clamp((-toKeyY / len) * 2.8, -2.5, 0.5);

  const rimStrength = clamp(0.55 + keyRatio * 0.35 - progress * 0.4, 0.2, 0.9);
  const depthOpacity = clamp(1 - progress * 0.45, 0.45, 1);
  const blurPx = progress * 4;

  const faceColor = mixRgb(FACE_BASE, FACE_DARK, progress * 0.65);
  const bevelColor = mixRgb(BEVEL_SHADOW, BEVEL_LIT, keyRatio);
  const bevelWithAccent = mixRgb(bevelColor, '#4ade80', keyRatio * 0.06 * (1 - progress * 0.8));

  mesh.style.setProperty('--sym-face', faceColor);
  mesh.style.setProperty('--sym-bevel-color', bevelWithAccent);
  mesh.style.setProperty('--sym-bevel-x', `${bevelXPx.toFixed(2)}px`);
  mesh.style.setProperty('--sym-bevel-y', `${bevelYPx.toFixed(2)}px`);
  mesh.style.setProperty('--sym-rim-strength', rimStrength.toFixed(3));
  mesh.style.setProperty('--sym-depth-opacity', depthOpacity.toFixed(3));
  mesh.style.setProperty('--sym-blur', `${blurPx.toFixed(2)}px`);

  symbolScrollEl.style.setProperty('--sym-blur', `${blurPx.toFixed(2)}px`);
}
