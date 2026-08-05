# Export-Anleitung – Sicherungs-Reel

## Vorbereitung

1. Repository lokal öffnen.
2. `npm install` ausführen.
3. Finale Sprachdatei unter `public/sicherung/audio/iro-sicherung-final.wav` ablegen.
4. Benötigte SFX gemäß `01-script-audio/sfx-plan.md` ablegen.
5. Bilder nur nach bestandener Prüfung aus `02-konzept/bildprompts.md` übernehmen.

## Prüfungen

```bash
npm run check
npm run studio
```

Im Studio die Composition `SicherungsReel` öffnen und mindestens diese Frames prüfen:

- Frame 90 – Hook und Schalterauslösung
- Frame 300 – Leitungsschutz
- Frame 540 – Überlast
- Frame 760 – Bimetall
- Frame 990 – Kurzschluss
- Frame 1140 – Magnetauslösung
- Frame 1410 – Vergleich
- Frame 1620 – einmaliges Zurücksetzen
- Frame 1790 – erneute Auslösung
- Frame 1980 – LSS/FI und CTA

## Lernzettel erzeugen

```bash
python -m pip install reportlab
python scripts/create_lernzettel.py
```

Ausgabe:

```text
outputs/lernzettel-sicherung.pdf
```

## Finales Video rendern

```bash
npm run render
```

Ausgabe:

```text
outputs/sicherungs-reel.mp4
```

## Empfohlene finale Medienwerte

- 1080 × 1920
- 30 FPS
- H.264
- AAC-Audio, 48 kHz
- keine Musik
- Voice-over ungefähr `-16 bis -17 LUFS`
- keine SFX-Spitze lauter als das Voice-over

## Vor Veröffentlichung

- gesamtes Video ohne Springen ansehen
- Ton einmal mit Kopfhörern und einmal über Smartphone prüfen
- Cover separat exportieren
- Caption aus `03-caption/caption.txt` übernehmen
- angepinnten Kommentar aus `03-caption/platform-posting.md` verwenden
- PDF-Lernzettel für die Kommentar-Automation bereitstellen
