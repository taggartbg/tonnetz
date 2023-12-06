import { scaleLinear} from 'd3-scale'
import { SCALE, BASE_SCALE_OFFSET } from './toneLib';

const RAINBOW = [
  '#ffff00',
  '#80ff00',
  '#00ff00',
  '#00ff80',
  '#00ffff',
  '#0080ff',
  '#0000ff',
  '#8000ff',
  '#ff00ff',
  '#ff0080',
  '#ff0000',
  '#ff8000'
]

const SCALE_COLORS = RAINBOW.reduce((obj, color, i) => {
  return {
    ...obj,
    [SCALE[i]]: color,
  };
}, {}) as Record<string,string>;

const setLuminance = (hexcode: string, luminance: number): string => {
  // Remove the hash character, if present
  const hex = hexcode.replace(/^#/, '');

  // Parse hex to RGB
  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  // Normalize RGB values to range [0, 1]
  const normalizedR = r / 255;
  const normalizedG = g / 255;
  const normalizedB = b / 255;

  // Convert RGB to HSL
  const cmax = Math.max(normalizedR, normalizedG, normalizedB);
  const cmin = Math.min(normalizedR, normalizedG, normalizedB);
  const delta = cmax - cmin;

  let hue = 0;

  if (delta !== 0) {
    if (cmax === normalizedR) {
      hue = ((normalizedG - normalizedB) / delta) % 6;
    } else if (cmax === normalizedG) {
      hue = (normalizedB - normalizedR) / delta + 2;
    } else {
      hue = (normalizedR - normalizedG) / delta + 4;
    }
  }

  hue = Math.round(hue * 60);
  if (hue < 0) {
    hue += 360;
  }

  const lightness = (cmax + cmin) / 2;
  const saturation = delta === 0 ? 0 : delta / (1 - Math.abs(2 * lightness - 1));

  // Adjust lightness based on the luminance parameter
  const adjustedLightness = Math.max(0, Math.min(1, lightness + luminance));

  // Round adjusted HSL values and return the result as a CSS-ready string
  const hslString = `hsl(${Math.round(hue)}, ${Math.round(saturation * 100)}%, ${Math.round(adjustedLightness * 100) || 10}%)`;

  return hslString;
};

const getColorForTone = (tone = ''): string => {
  const note = tone.replace(/[0-9]+/g,'')
  const offset = Number(tone.replace(/[^0-9]+/g, ''))

  const lumScale = scaleLinear()
    .domain([BASE_SCALE_OFFSET - 2, BASE_SCALE_OFFSET + 2])
    .range([-.5, .5])

  const luminance = lumScale(offset)
  return setLuminance(SCALE_COLORS[note], luminance)
}

export { getColorForTone }