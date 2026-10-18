import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '../..');
const configFile = path.join(root, 'channels/science/engine/config/science-v1.json');

export const ACTIVE_SCIENCE_PROFILE = 'youtube-6to7min-v1';
export const ARCHIVED_SCIENCE_PROFILE = 'youtube-2min-v1';

// Ohne Argument wird das aktive Profil geladen (youtube-6to7min-v1).
// Das 2-Minuten-Profil bleibt für die Testphasen-Videos ladbar, ist aber archiviert.
export const loadElectricalConfig = (profile) => {
  if (!fs.existsSync(configFile)) throw new Error(`Science-Konfiguration fehlt: ${configFile}`);
  const config = JSON.parse(fs.readFileSync(configFile, 'utf8'));
  if (config.version !== 'science-v1') throw new Error(`Nicht unterstützte Konfigurationsversion: ${config.version}`);
  const selected = profile ?? config.productionProfile ?? ACTIVE_SCIENCE_PROFILE;
  if (selected === 'youtube-6to7min-v1') {
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
  if (selected !== 'youtube-2min-v1') throw new Error(`Unbekanntes Science-Profil: ${selected}`);
  return {...config, productionProfile: 'youtube-2min-v1'};
};

export const electricalConfigFile = configFile;
