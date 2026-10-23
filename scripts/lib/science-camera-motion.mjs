// Dezente virtuelle Kamera über den Standbildern (Ken-Burns-Prinzip).
//
// Hintergrund: 6 Minuten Standbilder mit harten Schnitten und ohne Bewegung waren laut
// gehirn/ANALYSE-2026-10-18.md das größte Risiko für die Zuschauerbindung. Die Bilder
// bleiben unverändert statisch; nur der Bildausschnitt bewegt sich ganz leicht.
// Harte Schnitte zwischen den Szenen bleiben. Pro Szene abschaltbar mit cameraMove: "none".

export const CAMERA_MOVE_TYPES = ['zoom-in', 'pan-right', 'zoom-out', 'pan-left'];
export const DEFAULT_CAMERA_MOTION = {enabled: true, maxScale: 1.04, panPercent: 1.5, pattern: CAMERA_MOVE_TYPES};

const round = (value) => Number(value.toFixed(4));

// Liefert Start- und Endwerte. x/y sind Prozent der Bildgröße (CSS translate), scale ist der Faktor.
// Bei Skalierung s bleibt pro Seite (s - 1) / 2 Rand; der Schwenk bleibt immer innerhalb dieses Rands,
// damit nie ein leerer Bildrand sichtbar wird.
export const cameraMoveFor = (type, {maxScale = DEFAULT_CAMERA_MOTION.maxScale, panPercent = DEFAULT_CAMERA_MOTION.panPercent} = {}) => {
  const scale = Math.min(Math.max(maxScale, 1), 1.08);
  const margin = ((scale - 1) / 2) * 100;
  const pan = Math.min(Math.abs(panPercent), margin * 0.9);
  switch (type) {
    case 'zoom-in': return {type, fromScale: 1, toScale: round(scale), fromX: 0, toX: 0, fromY: 0, toY: 0};
    case 'zoom-out': return {type, fromScale: round(scale), toScale: 1, fromX: 0, toX: 0, fromY: 0, toY: 0};
    case 'pan-right': return {type, fromScale: round(scale), toScale: round(scale), fromX: round(pan), toX: round(-pan), fromY: 0, toY: 0};
    case 'pan-left': return {type, fromScale: round(scale), toScale: round(scale), fromX: round(-pan), toX: round(pan), fromY: 0, toY: 0};
    case 'none': return {type, fromScale: 1, toScale: 1, fromX: 0, toX: 0, fromY: 0, toY: 0};
    default: throw new Error(`Unbekannte Kamerabewegung: ${type}`);
  }
};

// Ordnet jeder Szene eine Bewegung zu: Muster im Wechsel, außer die Szene legt cameraMove selbst fest.
export const assignCameraMoves = (scenes, motion = DEFAULT_CAMERA_MOTION) => {
  const settings = {...DEFAULT_CAMERA_MOTION, ...(motion ?? {})};
  const pattern = settings.pattern?.length ? settings.pattern : CAMERA_MOVE_TYPES;
  return scenes.map((scene, index) => {
    const type = !settings.enabled ? 'none' : scene.cameraMove ?? pattern[index % pattern.length];
    return {...scene, cameraMove: cameraMoveFor(type, settings)};
  });
};

// Sicherheitsprüfung: kein Zustand darf einen leeren Bildrand zeigen.
export const cameraMoveIsSafe = (move) => [[move.fromScale, move.fromX, move.fromY], [move.toScale, move.toX, move.toY]]
  .every(([scale, x, y]) => scale >= 1 && Math.abs(x) <= ((scale - 1) / 2) * 100 + 1e-9 && Math.abs(y) <= ((scale - 1) / 2) * 100 + 1e-9);
