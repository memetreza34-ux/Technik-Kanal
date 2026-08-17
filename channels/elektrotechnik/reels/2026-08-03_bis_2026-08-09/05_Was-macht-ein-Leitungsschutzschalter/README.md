# Was macht ein Leitungsschutzschalter?

Erster vollständig Remotion-first-v2 gebauter Reel.

## Produktionsidee

- 9 Szenen
- 128 deutsche Voice-Wörter
- Planlänge: ca. 55 Sekunden / 1650 Frames
- 1080 × 1920, 30 FPS
- 100 % Remotion als Standardvisual
- 0 Pflichtbilder
- 0 KI-Szenenbilder
- 0 öffentliche Bilder im aktuellen Plan
- 3 volle Prozessanimationen
- deutsche Überschriften, Callouts und Untertitel ausschließlich kontrolliert in Remotion

## Was der Nutzer noch macht

Nur die deutsche Rohaufnahme erzeugen und hier ablegen:

```text
01-script-audio/audio/voiceover-raw.wav
```

Danach:

```bash
npm run electrical:finish -- "channels/elektrotechnik/reels/2026-08-03_bis_2026-08-09/05_Was-macht-ein-Leitungsschutzschalter"
```

Die Pipeline verarbeitet die Stimme auf exakt 1,10×, erzeugt lokale Wort-Zeitstempel, synchronisiert die Szenen und rendert anschließend die vorbereiteten Remotion-Visuals.

## Sicherheitsgrenze

Der Reel erklärt die Schutzfunktion. Er enthält keine Anleitung zum Arbeiten an geöffneten oder spannungsführenden Anlagen und keine Empfehlung zur eigenmächtigen Änderung der Absicherung.
