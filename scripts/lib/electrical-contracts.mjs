import {z} from 'zod';

const nonEmpty = z.string().trim().min(1);
const normalizedCoordinate = z.number().min(0).max(1);
const calloutText = z.string().trim().min(1).max(42);

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
  words: z.array(WordTimestamp.pick({text:true,startMs:true,endMs:true})).optional(),
}).refine((value) => value.endMs > value.startMs, 'caption end must follow start');
export const Captions = z.array(Caption);

export const ImageAnnotation = z.object({
  text: calloutText,
  labelX: normalizedCoordinate,
  labelY: normalizedCoordinate,
  targetX: normalizedCoordinate,
  targetY: normalizedCoordinate,
  accent: z.enum(['neutral','warning','danger','energy','science','focus','explanation']).optional(),
  width: z.number().int().min(220).max(520).optional(),
});

export const VisualRecipe = z.object({
  stage: nonEmpty,
  camera: nonEmpty,
  subject: nonEmpty,
  focus: nonEmpty,
  motion: z.literal('none'),
  callouts: z.array(calloutText).max(2).default([]),
});

export const ScienceScene = z.object({
  id: nonEmpty,
  title: nonEmpty,
  voiceText: nonEmpty,
  imageDir: nonEmpty,
  imageAnnotations: z.array(ImageAnnotation).max(2).optional(),
  backgroundFamily: z.string().optional(),
  shotType: z.string().optional(),
  referenceGroup: z.string().optional(),
  visualRecipe: VisualRecipe,
  fromMs: z.number().nonnegative().optional(),
  toMs: z.number().positive().optional(),
  fromFrame: z.number().int().nonnegative().optional(),
  toFrame: z.number().int().positive().optional(),
  durationSeconds: z.number().positive().optional(),
  imagePath: z.string().optional(),
  layout: z.enum(['image-full','comparison','warning','payoff','science-image']).optional(),
  renderMode: z.literal('image-only'),
  motionLevel: z.literal('none'),
  imageRole: z.enum(['hero','comparison','payoff','concept','experiment','molecule','space','diagram','material','real-context']).optional(),
  overlayJustification: z.string().optional(),
  kicker: z.string().optional(),
  headline: z.string().optional(),
  factClaim: z.string().optional(),
  sourceIds: z.array(nonEmpty).optional(),
});

export const ScenePlan = z.object({
  version: z.literal('science-v1'),
  slug: nonEmpty,
  title: z.string().optional(),
  compositionId: z.literal('ScienceReel'),
  runtimeFile: z.literal('science-runtime.json'),
  visualPolicyVersion: z.literal('science-static-v1'),
  generatedImageTextPolicy: z.literal('none'),
  coverText: z.string().optional(),
  language: z.string().optional(),
  fps: z.literal(30),
  width: z.literal(1080),
  height: z.literal(1920),
  minimumWordMatchRatio: z.number().min(0.5).max(1).default(0.82),
  scenes: z.array(ScienceScene).min(2).max(16),
  totalFrames: z.number().int().positive().optional(),
  plannedFrames: z.number().int().positive().optional(),
  durationSeconds: z.number().positive().optional(),
  alignment: z.object({method:nonEmpty,matchRatio:z.number().min(0).max(1),generatedAt:nonEmpty}).optional(),
});

export const Asset = z.object({
  id: nonEmpty,
  kind: z.enum(['image','audio','captions','data','other']),
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
  imageAnalysis: z.record(z.string(),z.unknown()).optional(),
});
export const AssetManifest = z.object({version:z.union([z.string(),z.number()]),slug:nonEmpty,root:z.string().optional(),generatedAt:nonEmpty,assets:z.array(Asset)});
export const ProductionStatus = z.object({status:nonEmpty,slug:z.string().optional(),completed:z.array(nonEmpty).default([]),open:z.array(nonEmpty).default([]),userMustProvide:z.array(nonEmpty).optional(),nextCommand:z.string().optional()}).passthrough();

export const normalizeWords = (value) => String(value)
  .toLocaleLowerCase('de-DE')
  .normalize('NFKD')
  .replace(/[\u0300-\u036f]/g,'')
  .replace(/ß/g,'ss')
  .split(/\s+/)
  .map((word) => word.replace(/[^a-z0-9äöü]+/gi,''))
  .filter(Boolean);
