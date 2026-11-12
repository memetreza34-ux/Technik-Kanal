import {loadFont} from '@remotion/google-fonts/Montserrat';

const {fontFamily} = loadFont('normal', {weights: ['600', '800', '900'], subsets: ['latin', 'latin-ext']});
export const FONT = fontFamily;

// Farblogik laut PRODUKTION.md: Cyan = Signal/Strom, Orange = Wärme, Rot = Fehler.
export const C = {
  bg: '#03101d',
  panel: '#0f2a3d',
  line: '#2c5870',
  cyan: '#72e6ff',
  gold: '#ffc857',
  orange: '#ff9f43',
  red: '#ff5a5f',
  copper: '#d9844a',
  white: '#eaf7fa',
  muted: '#a7c4d1',
};
