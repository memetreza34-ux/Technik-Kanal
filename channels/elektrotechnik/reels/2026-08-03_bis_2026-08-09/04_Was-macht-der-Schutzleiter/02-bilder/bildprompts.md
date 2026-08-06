# Bildstrategie – Was macht der Schutzleiter?

Die vollständige kopierfertige Sammlung liegt in `ALLE-BILDPROMPTS-MIT-COVER.txt`.

## Neue Methode

- keine unabhängige Bildsammlung mehr
- MOTOR-A als Referenz für Cover, Szene 01, 02, 04 und 09
- CABINET-B als Referenz für Szene 06, 07 und 08
- Szene 03 und 05 ausschließlich Remotion
- AI-Basisbilder vollständig textfrei
- deutsche Beschriftungen anschließend kontrolliert in das finale PNG einbrennen

```bash
npm run electrical:label-images -- "channels/elektrotechnik/reels/2026-08-03_bis_2026-08-09/04_Was-macht-der-Schutzleiter"
```

Der fertige beschriftete Bildsatz entsteht unter `02-bilder/final-labeled/`.
