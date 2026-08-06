# Was macht ein FI-Schalter?

## Aktueller Neuaufbau

Der erste Render wurde verworfen. Er war überladen, zu lang, enthielt englische KI-Schrift und zeigte zu viele konkurrierende Animationen.

Die neue Fassung verwendet:

- direkten Hook: **Was macht ein FI-Schalter?**
- ungefähr 55 Sekunden Zielzeit
- sieben sichtbare, ruhige und textfreie Szenenbilder
- drei reine Remotion-Mechanismus-Szenen ohne Nutzerbild
- nur drei Vollanimationen
- `mechanism-only` für Szene 03, 05 und 07; dort wird intern eine unsichtbare technische Fläche erzeugt und nach dem Render wieder entfernt
- deutsche Texte ausschließlich aus Remotion

Zusätzlich wird ein eigenes textfreies Coverbild benötigt.

## Vor neuen Bildern und neuer Aufnahme

```bash
npm run electrical:preflight -- "channels/elektrotechnik/reels/2026-08-03_bis_2026-08-09/03_Was-macht-ein-FI-Schalter"
```

Erst bei `passed: true` neue Bilder und die neue Voice-Aufnahme erzeugen.

## Danach

```bash
npm run electrical:finish -- "channels/elektrotechnik/reels/2026-08-03_bis_2026-08-09/03_Was-macht-ein-FI-Schalter"
```

Noch offen sind sieben Szenenbilder, ein Coverbild, die neue Iro-Aufnahme, optionale SFX, Render-QA und visuelle Freigabe.
