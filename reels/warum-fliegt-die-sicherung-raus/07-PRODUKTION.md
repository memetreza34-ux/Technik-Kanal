# Produktion – Warum fliegt die Sicherung raus?

## Fertig vorbereitet

- Thema, Kernaussage und fachliche Quellen
- finaler Sprechtext mit zehn Zeitfenstern
- SRT-Untertitel
- alle zehn Bildprompts plus Cover-Prompt in einer Datei
- vollständiger Animationsplan
- fertige Caption und Veröffentlichungstexte
- SFX-Plan mit Zeitpunkten und Dateinamen
- Lernzettel-Inhalt und PDF-Generator
- Remotion-Composition und Animationsbibliothek
- GitHub-Workflow für TypeScript, Kontrollframes und PDF

## Technischer Zielstand

- 1080 × 1920
- 30 FPS
- 2070 Frames
- 69 Sekunden
- ohne externe Bilder renderbar
- keine Musik

## Noch offen vor Veröffentlichung

1. `iro-sicherung-final.wav` aufnehmen.
2. SFX-Dateien gemäß `05-SFX.md` beschaffen oder erzeugen.
3. Audio und SFX in Remotion einfügen.
4. `npm run check` erfolgreich ausführen.
5. Kontrollframes bei Frame 90, 1140 und 1980 prüfen.
6. vollständigen MP4-Export mit Ton ansehen.
7. SRT-Worttimings an die echte Aufnahme anpassen.
8. fachliche und visuelle Schlusskontrolle dokumentieren.

## Befehle

```bash
npm install
npm run check
npm run studio
npm run render
python scripts/create_lernzettel.py
```

## Ausgabe

```text
outputs/sicherungs-reel.mp4
outputs/lernzettel-sicherung.pdf
```

## Abnahmegrenze

Ohne finale Sprachdatei, echte SFX und vollständige Video-/Tonkontrolle ist der Reel noch nicht veröffentlichungsfertig.
