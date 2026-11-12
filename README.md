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
npm run short:stage -- shorts/2026-11-12_kabellos-laden && npm run studio # Vorschau in Remotion Studio
npm run short:render -- shorts/2026-11-12_kabellos-laden                  # export/short.mp4 (1080×1920)
```

Shorts sind **3D-Szenen** (Three.js über `@remotion/three`) in `src/short/scenes/` – ein Thema = eine Szene, gewählt über `"scene"` in `short.json`. Die Beats (Szenen-IDs) steuern Kamera und Animation; ihre Startzeit ergibt sich automatisch aus dem ersten gesprochenen Wort. Untertitel: 1–2 Wörter, Schlüsselwörter aus `"highlight"` gelb. Kein Fortschrittsbalken, keine Labels, kein Raster. Whisper wird einmalig nach `~/.cache/remotion-whisper` geladen.
