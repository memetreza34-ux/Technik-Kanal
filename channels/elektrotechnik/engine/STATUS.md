# Status

## Aktiver Reel

- Thema: Warum fliegt die Sicherung raus?
- Composition: `SicherungsReel`
- Voice-Geschwindigkeit: 1,10×
- Zielpfad: `reels/2026-08-03_bis_2026-08-09/02_Warum-fliegt-die-Sicherung-raus/`

## Vorhanden

- Voice-over-Text und Bildprompts
- Caption-, SFX- und Animationsplanung
- Remotion-Code und Bibliothekskomponenten
- Lernzettel-Inhalt und Quellen
- lokale Ein-Befehl-Pipeline
- lokale Worttranskription mit `whisper.cpp`
- semantische Szenenausrichtung am echten Worttranskript
- automatische Bildprüfung und Runtime-Zuordnung
- automatische SRT-/VTT-Erzeugung
- Render-QA mit Szenen-Stills und Kontaktbogen

## Nutzerablauf

1. Roh-Audio in `01-script-audio/audio/` legen.
2. Pro Szene ein Bild in den passenden Ordner unter `02-bilder/images/` legen.
3. Optional SFX in `01-script-audio/sfx/` legen.
4. Codex ausführen lassen:

```bash
npm run elektro:finish -- "channels/elektrotechnik/reels/2026-08-03_bis_2026-08-09/02_Warum-fliegt-die-Sicherung-raus"
```

## Noch offen für den aktiven Reel

- echte Iro-Rohaufnahme
- echte Szenenbilder
- optionale SFX-Dateien
- erster vollständiger lokaler Pipeline-Lauf
- visuelle Schlusskontrolle durch Codex und Nutzer
