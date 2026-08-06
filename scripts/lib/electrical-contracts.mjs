import {z} from 'zod';

const nonEmpty = z.string().trim().min(1);

export const WordTimestamp = z.object({
  text: nonEmpty,
  normalized: z.string().optional(),
  startMs: z.number().nonnegative(),
  endMs: z.number().positive(),
  confidence: z.number().min(0).max(1).optional(),
}).refine((value) => value.endMs > value.startMs, 'endMs must be greater than startMs');

export const Caption = z.object({
  text: nonEmpty,
  startMs: z.number().nonnegative(),
  endMs: z.number().positive(),
  fromFrame: z.number().int().nonnegative().optional(),
  toFrame: z.number().int().positive().optional(),
  words: z.array(WordTimestamp.pick({text: true, startMs: true, endMs: true})).optional(),
}).refine((value) => value.endMs > value.startMs, 'caption end must follow start');

export const Captions = z.array(Caption);

export const ElectricalScene = z.object({
  id: nonEmpty,
  title: nonEmpty,
  voiceText: nonEmpty,
  imageDir: nonEmpty,
  baseFrom: z.number().int().nonnegative().optional(),
  baseTo: z.number().int().positive().optional(),
  fromMs: z.number().nonnegative().optional(),
  toMs: z.number().positive().optional(),
  fromFrame: z.number().int().nonnegative().optional(),
  toFrame: z.number().int().positive().optional(),
  durationSeconds: z.number().positive().optional(),
  imagePath: z.string().optional(),
  layout: z.enum(['image-full', 'image-mechanism', 'comparison', 'warning', 'payoff']).optional(),
  renderMode: z.enum(['image-only', 'mechanism-only', 'image-with-overlay', 'static-overlay']).optional(),
  motionLevel: z.enum(['none', 'subtle', 'full']).optional(),
  imageRole: z.enum(['hero', 'mechanism-plate', 'comparison', 'safety', 'payoff']).optional(),
  mechanism: z.string().optional(),
  overlayJustification: z.string().optional(),
  kicker: z.string().optional(),
  headline: z.string().optional(),
  factClaim: z.string().optional(),
  sourceIds: z.array(nonEmpty).optional(),
});

export const ScenePlan = z.object({
  version: z.union([z.string(), z.number()]),
  slug: nonEmpty,
  compositionId: nonEmpty,
  runtimeFile: z.string().optional(),
  visualPolicyVersion: z.string().optional(),
  generatedImageTextPolicy: z.enum(['none']).optional(),
  coverText: z.string().optional(),
  language: z.string().optional(),
  fps: z.number().int().positive(),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  minimumWordMatchRatio: z.number().min(0.5).max(1).default(0.82),
  animationBudget: z.object({
    maximum: z.number().int().nonnegative(),
    fullMechanismScenes: z.array(nonEmpty).default([]),
  }).optional(),
  scenes: z.array(ElectricalScene).min(2),
  totalFrames: z.number().int().positive().optional(),
  plannedFrames: z.number().int().positive().optional(),
  durationSeconds: z.number().positive().optional(),
  alignment: z.object({
    method: nonEmpty,
    matchRatio: z.number().min(0).max(1),
    generatedAt: nonEmpty,
  }).optional(),
});

export const Asset = z.object({
  id: nonEmpty,
  kind: z.enum(['image', 'audio', 'video', 'captions', 'data', 'other']),
  role: nonEmpty,
  file: z.string().optional(),
  source: z.string().optional(),
  runtimePath: z.string().optional(),
  extension: z.string().optional(),
  bytes: z.number().int().nonnegative().optional(),
  sha256: z.string().optional(),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
  durationSeconds: z.number().positive().optional(),
  imageAnalysis: z.record(z.string(), z.unknown()).optional(),
});

export const AssetManifest = z.object({
  version: z.union([z.string(), z.number()]),
  slug: nonEmpty,
  root: z.string().optional(),
  generatedAt: nonEmpty,
  assets: z.array(Asset),
});

export const ProductionStatus = z.object({
  status: nonEmpty,
  slug: z.string().optional(),
  completed: z.array(nonEmpty).default([]),
  open: z.array(nonEmpty).default([]),
  userMustProvide: z.array(nonEmpty).optional(),
  nextCommand: z.string().optional(),
}).passthrough();

export const normalizeWords = (value) => String(value)
  .toLocaleLowerCase('de-DE')
  .normalize('NFKD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/ß/g, 'ss')
  .split(/\s+/)
  .map((word) => word.replace(/[^a-z0-9äöü]+/gi, ''))
  .filter(Boolean);
