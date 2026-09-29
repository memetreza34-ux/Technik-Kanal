import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '../..');
const configFile = path.join(root, 'channels/science/engine/config/science-v1.json');

export const loadElectricalConfig = () => {
  if (!fs.existsSync(configFile)) throw new Error(`Science-Konfiguration fehlt: ${configFile}`);
  const config = JSON.parse(fs.readFileSync(configFile, 'utf8'));
  if (config.version !== 'science-v1') throw new Error(`Nicht unterstützte Konfigurationsversion: ${config.version}`);
  return config;
};

export const electricalConfigFile = configFile;
