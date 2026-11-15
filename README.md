# Technik-Kanal – YouTube-Videos

Dieses Repository enthält **YouTube-Videos im 16:9-Querformat** und **Shorts im 9:16-Hochformat** (Remotion-Composition `TechnikShort`).

## Produktionsformat
- Full HD: **1920 × 1080**, **30 FPS**
- Deutschsprachige Technik-Erklärvideos (nicht nur Elektrotechnik)
- Als Einstieg meist **6–12 Minuten**, abhängig von Thema und Informationsdichte
- Erstes Videobild: echter Inhalt statt Cover oder Intro
- Fachlich präzise Schaubilder, Infografiken, Geräte, Schnittdarstellungen und punktuelle Prozessanimationen
- Skript, Bildaussage und Sprache müssen exakt zusammenpassen

## Struktur
- `src/`: wiederverwendbare Remotion-Engine für 16:9
- `videos/_vorlage/`: Vorlage für neue Video-Projekte
- `videos/YYYY-MM-DD_thema/`: Recherche, Skript, Bildplanung, Audio und fertiger Export pro YouTube-Video
- `channel/audio/reference/`: kalibrierte Master-Referenzstimme (`stickman-user-clone`, 0,95× Tempo, max. 0,30 s Pausen)
- `config/voice-policy.json`: zentrale Voice-Policy (`qwen-mlx` / `Qwen3-TTS-12Hz-1.7B-Base-bf16`)
- `scripts/`: neues Projekt, automatisches Voice-Cloning (`voice:youtube`), Vorabprüfung, Render und technische Exportprüfung
- `PRODUKTION.md`: fachliche und visuelle Qualitätsstandards

## Schnellstart
```bash
npm install
npm run check
npm test
npm run studio
npm run smoke
```

`npm run smoke` rendert **nur ein Testbild der Layout-Vorschau**, keinen fertigen Film.

Neues Video anlegen:
```bash
npm run youtube:new -- 2026-11-01_elektromotor "Warum dreht sich ein Elektromotor?"
```

`video.json` mit Sprechertext, Szenen und Visuals ausfüllen; Quellen prüfen; vollständigen deutschen Sprechertext in `script-fliesstext.txt` pflegen und die geklonte Kanalstimme (`stickman-user-clone`, 0,95× Tempo, max. 0,30 s Pausen) unter `audio/voiceover.wav` erzeugen:
```bash
npm run voice:youtube -- --dir videos/2026-11-01_elektromotor --force
```
Dann erst nach fachlicher Freigabe `status` auf `ready` setzen:
```bash
npm run youtube:check -- videos/2026-11-01_elektromotor
npm run youtube:render -- videos/2026-11-01_elektromotor
```

Die Renderprüfung kontrolliert Bildformat, Bildrate, Laufzeit und Audiospur. Vor Veröffentlichung muss der **gesamte Film mit Ton** fachlich und visuell kontrolliert werden. Das neue System ist eine Grundlage; es ersetzt noch keine vollständige professionelle Videoredaktion.

Die früheren Dateien bleiben über den Git-Verlauf vor der YouTube-Umstellung wiederherstellbar.

## Shorts (9:16, 30–60 s)
Pro Short ein Ordner `shorts/YYYY-MM-DD_thema/` mit `short.json` (Szenen, eine Zeile Sprechtext pro Szene), `script-fliesstext.txt` (dieselben Zeilen) und `quellen.md`.

```bash
npm run voice:youtube -- --dir shorts/2026-11-12_kabellos-laden --force   # Kanalstimme
npm run short:captions -- shorts/2026-11-12_kabellos-laden                # Wortgenaue Untertitel (Whisper.cpp, lokal)
npm run short:stage -- shorts/2026-11-12_kabellos-laden && npm run studio -- --gl=angle # Vorschau
npm run short:render -- shorts/2026-11-12_kabellos-laden                  # export/short.mp4 (1080×1920)
```

Shorts sind **3D-Szenen** (Three.js über `@remotion/three`) in `src/short/scenes/` – ein Thema = eine Szene, gewählt über `"scene"` in `short.json`. Die Beats (Szenen-IDs) steuern Kamera und Animation; ihre Startzeit ergibt sich automatisch aus dem ersten gesprochenen Wort. Untertitel: 1–2 Wörter, Schlüsselwörter aus `"highlight"` gelb. Kein Fortschrittsbalken, keine Labels, kein Raster. Whisper wird einmalig nach `~/.cache/remotion-whisper` geladen.

## Technik-Welt (wiederkehrende 3D-Welt)
Alle Shorts spielen im **Technik-Haus** – einem Querschnitt-Diorama mit Wohnzimmer, Küche, Keller (Sicherungskasten, Pufferspeicher, Heizungsrohre), Dachboden mit Solarmodulen und Wärmepumpe im Garten. Vorschau als Rundflug: Composition `TechnikWelt`.

Einmalig nach dem Klonen die freien 3D-Assets laden (CC0 von Poly Haven, ca. 42 MB, landen in `public/3d/`, nicht im Git):
```bash
npm run assets:fetch
```

| Datei | Inhalt |
|---|---|
| `src/world/TechnikHaus.tsx` | Haus, Räume, Möbel; `HAUS_SPOTS` (Kamerapunkte) und `HAUS_ANCHORS` (Andockpunkte für Detail-Szenen) |
| `src/world/devices.tsx` | Selbst gebaute Geräte, z. B. `Sicherungskasten` (FI, LS einzeln schaltbar) |
| `src/world/parts.tsx` | Bausteine: `Coil`, `FieldLines`, `HeatShimmer`, `Tube` (Kabel/Rohr), `Flow` (Strom/Wasser fließt) |
| `src/world/Look.tsx` | Einheitlicher Look: Lichtumgebung (HDRI), Sonne mit Schatten, Leuchteffekt |
| `src/world/kit.ts` | Zeitsteuerung (`ramp`), Kamerafahrten (`cameraAt`, `placeShot`) |
| `assets/3d-manifest.json` | Liste der geladenen Modelle/HDRIs – neue Assets hier eintragen |

Neues Thema: Detail-Szene in `src/short/scenes/` bauen, mit `placeShot(shot, HAUS_ANCHORS.<ort>, 0.01)` an einen Ort im Haus andocken (lokale Maße in cm) und in `SCENES` (`src/short/ShortVideo.tsx`) registrieren. Credit in der Videobeschreibung: „3D-Modelle & HDRIs: Poly Haven (CC0)“.

## Zahlen-Ebene („Technik verstehen“-Look)
Mit `"overlays": true` in `short.json` bekommt ein Short Kanalname, Kapitel-Etiketten und Messgeräte-Karten. Alles wird pro Szene im JSON beschrieben – kein Code nötig:

| `overlay.type` | Wirkung |
|---|---|
| `title` | Eröffnungsfrage: weiße Zeile + gelb markierte Frage + Kandidaten |
| `meter` | Messgeräte-Karte, Werte zählen hoch (`format: "mmss"` für Zeiten) |
| `bars` | Balkenvergleich + optionales Highlight (z. B. „+16 € im Jahr“) + Quellenzeile |
| `chip` | Hinweis (`warn`, `info`, `plus`) |
| `end` | Abspann mit Logo und „Folgen“ |

`chapter` erzeugt das gelbe Beschriftungsband („1 · Wasserkocher“). Farben/Schriften: `src/short/brand.ts`. Jede Zahl braucht einen Eintrag in `quellen.md` (der Repo-Check prüft, dass die Datei existiert).

### Zeitraffer-Rennen
`"race"` in `short.json` zeigt Thermometer-Bahnen mit gemeinsamer Uhr (z. B. 1 Liter auf 100 °C). `keys` koppeln die Uhr an Stellen im Sprechtext: `{"scene": "kettle", "word": "Minuten", "seconds": 198}` heißt „wenn das Wort *Minuten* gesprochen ist, steht die Uhr auf 3:18“. Die Anzeige startet groß (Hook), wandert ab `dockAfter` nach oben und verschwindet bei `until`. Zielzeitpunkte stehen der 3D-Szene als Beats `done:<Bahn>` zur Verfügung (z. B. Dampf, „Ding“ der Mikrowelle).
