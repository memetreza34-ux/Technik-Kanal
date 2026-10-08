import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '../..');
const configFile = path.join(root, 'channels/science/engine/config/science-v1.json');

export const loadElectricalConfig = (profile = 'youtube-2min-v1') => {
  if (!fs.existsSync(configFile)) throw new Error(`Science-Konfiguration fehlt: ${configFile}`);
  const config = JSON.parse(fs.readFileSync(configFile, 'utf8'));
  if (config.version !== 'science-v1') throw new Error(`Nicht unterstützte Konfigurationsversion: ${config.version}`);
  if (profile === 'youtube-6to7min-v1') {
    const profileFile = path.join(root, 'channels/science/engine/config/youtube-6to7min-v1.json');
    const long = JSON.parse(fs.readFileSync(profileFile, 'utf8'));
    return {
      ...config,
      productionProfile: long.profile,
      format: {...config.format, durationSeconds: long.durationSeconds},
      script: {...config.script, words: long.scriptWords},
      visuals: {
        ...config.visuals,
        beats: long.visualBeats,
        diversity: {...config.visuals.diversity, minimumDistinctVisualTypesPerVideo: long.visualSystem.minimumDistinctVisualTypesPerVideo},
      },
    };
  }
  if (profile !== 'youtube-2min-v1') throw new Error(`Unbekanntes Science-Profil: ${profile}`);
  return config;
};

export const electricalConfigFile = configFile;
