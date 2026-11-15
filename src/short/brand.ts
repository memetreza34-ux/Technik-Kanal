import {loadFont as loadArchivo} from '@remotion/google-fonts/ArchivoBlack';
import {loadFont as loadInter} from '@remotion/google-fonts/InterTight';
import {loadFont as loadMono} from '@remotion/google-fonts/ShareTechMono';

// Markenauftritt „Technik verstehen“: Messgeräte-Look, Signalgelb, Beschriftungsband.
export const BRAND = {
  name: 'TECHNIK VERSTEHEN',
  yellow: '#FFD23F',
  good: '#2DE1C2',
  bad: '#FF5C7A',
  ink: '#0B0F14',
  panel: 'rgba(11,15,20,0.86)',
  line: 'rgba(255,255,255,0.12)',
  text: '#EEF3F7',
  muted: '#9FB0BF',
};

export const FONT = {
  display: loadArchivo('normal', {weights: ['400'], subsets: ['latin', 'latin-ext']}).fontFamily,
  ui: loadInter('normal', {weights: ['600', '700', '800'], subsets: ['latin', 'latin-ext']}).fontFamily,
  mono: loadMono('normal', {weights: ['400'], subsets: ['latin']}).fontFamily,
};

/** Deutsche Zahl mit fester Nachkommazahl. */
export const de = (v: number, decimals: number) => v.toLocaleString('de-DE', {minimumFractionDigits: decimals, maximumFractionDigits: decimals});
