import {z} from 'zod';

export const WordTimestampSchema = z.object({
  text: z.string().min(1),
  normalized: z.string().optional(),
  startMs: z.number().nonnegative(),
  endMs: z.number().positive(),
  confidence: z.number().min(0).max(1).optional(),
}).refine((value) => value.endMs > value.startMs, 'endMs must be greater than startMs');

export const CaptionSchema = z.object({
  text: z.string().min(1),
  startMs: z.number().nonnegative(),
  endMs: z.number().positive(),
  fromFrame: z.number().int().nonnegative().optional(),
  toFrame: z.number().int().positive().optional(),
});

export const ElectricalSceneSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  voiceText: z.string().min(1),
  imageDir: z.string().min(1),
  baseFrom: z.number().int().nonnegative().optional(),
  baseTo: z.number().int().positive().optional(),
  fromMs: z.number().nonnegative().optional(),
  toMs: z.number().positive().optional(),
  fromFrame: z.number().int().nonnegative().optional(),
  toFrame: z.number().int().positive().optional(),
  imagePath: z.string().optional(),
  layout: z.string().optional(),
  mechanism: z.string().optional(),
});

export const ElectricalScenePlanSchema = z.object({
  version: z.union([z.string(), z.number()]).default('electrical-v1'),
  slug: z.string().min(1),
  compositionId: z.string().min(1),
  fps: z.number().int().positive(),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  minimumWordMatchRatio: z.number().min(0.5).max(1).default(0.82),
  scenes: z.array(ElectricalSceneSchema).min(2),
  totalFrames: z.number().int().positive().optional(),
  durationSeconds: z.number().positive().optional(),
  alignment: z.record(z.string(), z.unknown()).optional(),
});

export const AssetSchema = z.object({
  id: z.string().min(1),
  kind: z.enum(['image', 'audio', 'video', 'captions', 'data', 'other']),
  role: z.string().min(1),
  source: z.string().optional(),
  file: z.string().optional(),
  runtimePath: z.string().optional(),
  width: z.number().positive().optional(),
  height: z.number().positive().optional(),
  durationSeconds: z.number().positive().optional(),
  bytes: z.number().int().nonnegative().optional(),
  sha256: z.string().optional(),
  imageAnalysis: z.record(z.string(), z.unknown()).optional(),
});

export const AssetManifestSchema = z.object({
  version: z.union([z.string(), z.number()]),
  slug: z.string().min(1),
  generatedAt: z.string(),
  assets: z.array(AssetSchema),
});

export type ElectricalScenePlan = z.infer<typeof ElectricalScenePlanSchema>;
export type ElectricalAssetManifest = z.infer<typeof AssetManifestSchema>;
