import fs from 'node:fs';
import path from 'node:path';

export const ELECTRICAL_REEL_DIRECTORIES = [
  '01-script-audio',
  '01-script-audio/audio',
  '01-script-audio/sfx',
  '02-bilder',
  '02-bilder/images',
  '02-bilder/prompts',
  '03-caption',
  '04-pdf',
  '05-export',
  '05-export/video',
  '06-projektdateien',
  '06-projektdateien/render',
];

export const ELECTRICAL_REQUIRED_CONTENT_FILES = [
  'README.md',
  '01-script-audio/script.md',
  '01-script-audio/script-fliesstext.txt',
  '01-script-audio/voiceover.txt',
  '02-bilder/bildprompts.md',
  '03-caption/social-caption.md',
  '04-pdf/inhalt.md',
  '06-projektdateien/motion-design.md',
  '06-projektdateien/production-status.json',
  '06-projektdateien/prompt-manifest.json',
  '06-projektdateien/scene-plan.json',
  '06-projektdateien/sources.md',
  '06-projektdateien/storyboard.md',
];

export const ELECTRICAL_GENERATED_FILES = [
  '03-caption/word-timestamps.json',
  '03-caption/voiceover-final.captions.json',
  '05-export/voiceover-final.srt',
  '05-export/voiceover-final.vtt',
  '06-projektdateien/asset-manifest.json',
  '06-projektdateien/script-qa-report.json',
  '06-projektdateien/creative-qa-report.json',
  '06-projektdateien/content-package-report.json',
  '06-projektdateien/preproduction-report.json',
  '06-projektdateien/qa-report.json',
  '06-projektdateien/ready-report.json',
  '06-projektdateien/reel-runtime.json',
];

export const electricalProjectPaths = (root) => ({
  root,
  readme: path.join(root, 'README.md'),
  scriptDir: path.join(root, '01-script-audio'),
  audioDir: path.join(root, '01-script-audio/audio'),
  sfxDir: path.join(root, '01-script-audio/sfx'),
  script: path.join(root, '01-script-audio/script.md'),
  scriptPlain: path.join(root, '01-script-audio/script-fliesstext.txt'),
  voiceoverText: path.join(root, '01-script-audio/voiceover.txt'),
  imageDir: path.join(root, '02-bilder/images'),
  promptDir: path.join(root, '02-bilder/prompts'),
  prompts: path.join(root, '02-bilder/bildprompts.md'),
  captionsDir: path.join(root, '03-caption'),
  socialCaption: path.join(root, '03-caption/social-caption.md'),
  captionsFinal: path.join(root, '03-caption/voiceover-final.captions.json'),
  wordTimestamps: path.join(root, '03-caption/word-timestamps.json'),
  pdfDir: path.join(root, '04-pdf'),
  learningSheet: path.join(root, '04-pdf/inhalt.md'),
  exportDir: path.join(root, '05-export'),
  videoDir: path.join(root, '05-export/video'),
  srt: path.join(root, '05-export/voiceover-final.srt'),
  vtt: path.join(root, '05-export/voiceover-final.vtt'),
  projectDir: path.join(root, '06-projektdateien'),
  scenePlan: path.join(root, '06-projektdateien/scene-plan.json'),
  visualPolicy: path.join(root, '06-projektdateien/visual-policy.json'),
  status: path.join(root, '06-projektdateien/production-status.json'),
  manifest: path.join(root, '06-projektdateien/asset-manifest.json'),
  promptManifest: path.join(root, '06-projektdateien/prompt-manifest.json'),
  scriptReport: path.join(root, '06-projektdateien/script-qa-report.json'),
  creativeReport: path.join(root, '06-projektdateien/creative-qa-report.json'),
  contentReport: path.join(root, '06-projektdateien/content-package-report.json'),
  preproductionReport: path.join(root, '06-projektdateien/preproduction-report.json'),
  readyReport: path.join(root, '06-projektdateien/ready-report.json'),
  qaReport: path.join(root, '06-projektdateien/qa-report.json'),
  runtime: path.join(root, '06-projektdateien/reel-runtime.json'),
  sources: path.join(root, '06-projektdateien/sources.md'),
  storyboard: path.join(root, '06-projektdateien/storyboard.md'),
  motionDesign: path.join(root, '06-projektdateien/motion-design.md'),
  sfxEvents: path.join(root, '06-projektdateien/sfx-events.json'),
  renderDir: path.join(root, '06-projektdateien/render'),
  workDir: path.join(root, '06-projektdateien/.work'),
});

export const checkElectricalProjectStructure = (root, {requireContent = true} = {}) => {
  const missingDirectories = ELECTRICAL_REEL_DIRECTORIES.filter((relative) => {
    const full = path.join(root, relative);
    return !fs.existsSync(full) || !fs.statSync(full).isDirectory();
  });
  const missingFiles = requireContent
    ? ELECTRICAL_REQUIRED_CONTENT_FILES.filter((relative) => !fs.existsSync(path.join(root, relative)))
    : [];
  return {ok: missingDirectories.length === 0 && missingFiles.length === 0, missingDirectories, missingFiles};
};

export const assertElectricalProjectStructure = (root, options) => {
  const report = checkElectricalProjectStructure(root, options);
  if (!report.ok) {
    throw new Error([
      'Elektrotechnik-Reel-Struktur entspricht nicht dem FinanzNeo-Vertrag.',
      ...report.missingDirectories.map((entry) => `Fehlender Ordner: ${entry}`),
      ...report.missingFiles.map((entry) => `Fehlende Datei: ${entry}`),
    ].join('\n'));
  }
  return report;
};

export const normalizeProjectPath = (value) => value.split(path.sep).join('/');
