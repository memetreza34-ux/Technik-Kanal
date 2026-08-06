export const LEGACY_STYLIZED_IMAGE_RULE = 'Premium stylized 3D editorial electrical illustration, one clear technical idea, one dominant subject, simplified credible geometry, calm seamless dark navy environment, no visible text, letters, numbers, labels, units, type plates, UI, logos or watermark, vertical 9:16, top 18 percent and bottom 25 percent clear.';

export const REALISTIC_ELECTRICAL_IMAGE_RULE = 'Semi-photorealistic technical CGI product visualization, one clear technical idea, one dominant real electrical subject, real-world proportions, recognizable European electrical components, physically based metal, copper and PVC materials, natural neutral studio lighting, restrained realistic workshop or technical-laboratory background, no neon fantasy cable, no cartoon, no toy render, no futuristic invented device, no visible text, letters, numbers, labels, units, type plates, UI, logos or watermark, vertical 9:16, top 18 percent and bottom 25 percent clear.';

export const upgradeElectricalPromptText = (text) => {
  let next = String(text).replaceAll(LEGACY_STYLIZED_IMAGE_RULE, REALISTIC_ELECTRICAL_IMAGE_RULE);
  next = next.replaceAll('Premium stylized 3D editorial electrical illustration', 'Semi-photorealistic technical CGI product visualization');
  next = next.replaceAll('simplified credible geometry', 'real-world proportions and physically plausible construction');
  return next;
};
