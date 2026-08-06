# Was macht der Schutzleiter?

## Aktueller Bildstandard

Die bisherigen Bildgenerationen werden nicht verwendet. Der Reel nutzt jetzt Visual-v5:

- zusammenhängende cinematic technical photography statt zufälliger Produktbilder
- MOTOR-A als wiederkehrende Referenz für Motor-Szenen
- CABINET-B als wiederkehrende Referenz für Schaltschrank-Szenen
- vier kontrollierte Set-Familien
- mindestens vier Kameratypen
- keine KI-generierte Schrift
- deutsche Beschriftung wird fehlerfrei in die finalen PNG-Dateien eingebrannt

## Reihenfolge

```bash
npm run electrical:preflight -- "channels/elektrotechnik/reels/2026-08-03_bis_2026-08-09/04_Was-macht-der-Schutzleiter"
```

Danach Cover und sieben sichtbare Basisbilder erzeugen. Szene 03 und 05 benötigen kein Bild.

```bash
npm run electrical:image-qa -- "channels/elektrotechnik/reels/2026-08-03_bis_2026-08-09/04_Was-macht-der-Schutzleiter"
npm run electrical:label-images -- "channels/elektrotechnik/reels/2026-08-03_bis_2026-08-09/04_Was-macht-der-Schutzleiter"
```

Die beschrifteten Bilder liegen anschließend unter `02-bilder/final-labeled/`. Der Text ist dort tatsächlich im PNG enthalten.
