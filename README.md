# Elektrotechnik-Kanal

Eigenständiges Produktionssystem für den deutschsprachigen Elektrotechnik-Faceless-Kanal. Die Struktur folgt FinanzNeo, die Qualitäts-Gates sind auf Elektrotechnik und bildgeführte Reels angepasst.

## Root-Struktur

```text
.claude/
.github/
channels/
core/
scripts/
package.json
package-lock.json
tsconfig.base.json
vitest.config.ts
```

## Verbindlicher Produktionsablauf

### 1. Neuen Reel erzeugen

```bash
npm run electrical:new -- \
  --week=2026-08-10_bis_2026-08-16 \
  --slot=01 \
  --title="FI-Schalter" \
  --hook="Was macht ein FI-Schalter?" \
  --scenes=9
```

Der direkte Frage-Hook ist Pflicht. Neue Reels erhalten automatisch:

- `visual-v2`-Szenenvertrag
- textfreie Prompt-Regel
- maximal vier Vollanimationen
- standardmäßig drei getrennte Mechanismus-Szenen
- eindeutige `renderMode`- und `motionLevel`-Felder

### 2. Preflight vor Bildern und Audio

```bash
npm run electrical:preflight -- "<reel-ordner>"
```

Vor `passed: true` dürfen keine Bilder oder Voice-Aufnahmen erzeugt werden. Das Gate blockiert schwache Hooks, zu lange Skripte, sichtbaren KI-Text, überladene Promptkonzepte, zu viele Animationen, doppelte Mechanismusdarstellungen und fehlende Quellen.

### 3. Medien erstellen und einfügen

- Voice-over deutsch und trocken aufnehmen
- textfreie 9:16-Bilder erzeugen
- optional wenige semantische SFX ergänzen

### 4. Fertigstellen

```bash
npm run electrical:finish -- "<reel-ordner>"
```

Die Pipeline verarbeitet die Stimme auf 1,10×, erstellt lokale Wortzeiten, synchronisiert alle Szenen, rendert, prüft technisch und erzeugt Kontrollbilder.

## Visuelles System

- 8–10 Szenen
- etwa 115–165 Wörter
- Ziel ungefähr 42–62 Sekunden
- ein klares Hauptmotiv pro Bild
- keinerlei Schrift im KI-Bild
- Bildszenen als Standard
- normalerweise ein bis drei, maximal vier Vollanimationen
- keine Vollanimation im Hook
- keine zwei Vollanimationen direkt hintereinander
- `mechanism-only` blendet das KI-Bild aus, damit keine doppelte Mechanismusdarstellung entsteht
- alle deutschen Texte kommen aus Remotion

## Wichtige Befehle

```bash
npm install
npm test
npm run studio
npm run gallery
npm run electrical:preflight -- "<reel-ordner>"
npm run electrical:ready -- "<reel-ordner>"
npm run electrical:finish -- "<reel-ordner>"
npm run electrical:system-test
```

Das Audio bleibt lokal; `whisper.cpp` benötigt keinen Transkriptions-API-Key.
