# Skill: Reel vollständig fertigstellen

## Ziel

Aus einem vorbereiteten Reel-Ordner mit Roh-Audio und Szenenbildern selbstständig ein synchronisiertes, geprüftes MP4 erzeugen.

## Voraussetzung

Im Reel-Ordner müssen vorhanden sein:

- `01-script-audio/audio/` mit genau einer erkennbaren Rohaufnahme
- `02-bilder/images/<szene>/` mit mindestens einem vertikalen Bild je Szene
- `06-projektdateien/scene-plan.json` mit `voiceText` und `imageDir` je Szene
- der vorher vorbereitete Remotion-Code und alle benötigten Bibliotheksanimationen

SFX sind optional. Vorhandene SFX werden über `06-projektdateien/sfx-events.json` an Wörter oder Szenenpositionen gekoppelt.

## Verbindlicher Befehl

```bash
npm run elektro:finish -- "<reel-ordner>"
```

## Automatischer Ablauf

1. `ffmpeg`, `ffprobe`, `git` und `cmake` prüfen.
2. `whisper.cpp` lokal unter `.tools/` einrichten, falls es noch fehlt.
3. Rohaufnahme unverändert behalten und eine Finaldatei mit `atempo=1.10` erzeugen.
4. Finaldatei lokal in 16-kHz-Mono-WAV umwandeln.
5. Mit `whisper.cpp` echte Wort-Zeitstempel erzeugen.
6. Wörter des Transkripts gegen alle `voiceText`-Abschnitte abgleichen.
7. Bei weniger als 80 % sicheren Worttreffern abbrechen.
8. Exakte Szenengrenzen aus dem Worttranskript berechnen.
9. Pro Szene genau ein finales Bild auswählen; doppelte, zu kleine oder falsche Formate ablehnen.
10. Bilder, Voice-over und vorhandene SFX in die lokale Remotion-Runtime übernehmen.
11. SRT, VTT und Caption-JSON aus derselben Wort-Zeitbasis erzeugen.
12. Remotion-Timing, Animationen und Gesamtdauer an die berechneten Szenengrenzen anpassen.
13. TypeScript-Prüfung ausführen.
14. MP4 rendern.
15. Auflösung, FPS, Audiospur und Dauer technisch prüfen.
16. Für jede Szene ein Kontrollbild sowie einen Kontaktbogen erzeugen.

## Visuelle Codex-Prüfung

Nach erfolgreicher technischer QA muss Codex:

- den Kontaktbogen öffnen,
- alle Szenen-Stills einzeln prüfen,
- das vollständige MP4 mit Ton prüfen,
- Bildaussage, Lesbarkeit, Übergänge, Animationsstart, SFX-Lautstärke und fachliche Richtigkeit bewerten,
- sichtbare Fehler im Remotion-Code oder Asset-Mapping beheben,
- `elektro:finish` erneut ausführen.

Ein technisches `passed: true` ersetzt nicht die visuelle Endkontrolle.

## Abbruchregeln

Nicht raten und nicht mit Platzhaltern rendern, wenn:

- Audio oder ein Szenenbild fehlt,
- Skript und Transkript nicht sicher zusammenpassen,
- ein Bild doppelt verwendet wurde,
- ein Bild kleiner als 720 × 1280 ist,
- das Bildseitenverhältnis nicht reel-tauglich ist,
- TypeScript oder Render-QA fehlschlägt.
