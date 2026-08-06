# Was macht der Schutzleiter?

## Direkter Hook

> Was macht der Schutzleiter?

## Produktionskonzept

- 9 Szenen
- 7 sichtbare Szenenbilder
- 1 separates Coverbild
- 2 reine Remotion-Mechanismus-Szenen ohne Nutzerbild
- deutsches Voice-over mit 135 Wörtern
- geplante Länge: ungefähr 55 Sekunden bei 1,10×
- keine Schrift in generierten Bildern

## Remotion-Szenen ohne Bild

- `03-normalbetrieb` – Außenleiter und Neutralleiter führen Betriebsstrom, PE bleibt ohne Betriebsstrom
- `05-fehlerstromweg` – Fehlerstrom wird über den Schutzleiter zurückgeführt

## Verbindlicher Ablauf

```bash
npm run electrical:preflight -- "channels/elektrotechnik/reels/2026-08-03_bis_2026-08-09/04_Was-macht-der-Schutzleiter"
```

Erst nach bestandenem Preflight:

1. Cover und sieben sichtbare Szenenbilder erzeugen.
2. deutsche Rohaufnahme als `01-script-audio/audio/voiceover-raw.wav` ablegen.
3. Reel fertigstellen:

```bash
npm run electrical:finish -- "channels/elektrotechnik/reels/2026-08-03_bis_2026-08-09/04_Was-macht-der-Schutzleiter"
```
