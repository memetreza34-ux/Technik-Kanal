# Technik-Kanal – YouTube-Videos

Dieses Repository ist ausschließlich für **normale YouTube-Videos im 16:9-Querformat** bestimmt. Die früheren vertikalen Kurzvideo-Projekte und ihre Produktionspipeline sind entfernt.

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
