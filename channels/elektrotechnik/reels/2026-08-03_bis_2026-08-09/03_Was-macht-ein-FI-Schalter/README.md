# Was macht ein FI-Schalter?

## Aktueller Neuaufbau

Der erste Render wurde verworfen. Er war überladen, zu lang, enthielt englische KI-Schrift und zeigte zu viele konkurrierende Animationen.

Die neue Fassung verwendet:

- direkten Hook: **Was macht ein FI-Schalter?**
- ungefähr 55 Sekunden Zielzeit
- zehn ruhige textfreie Bilder
- nur drei Vollanimationen
- `mechanism-only` für Szene 03, 05 und 07, damit kein KI-Mechanismus hinter der Remotion-Animation sichtbar bleibt
- deutsche Texte ausschließlich aus Remotion

## Vor neuen Bildern und neuer Aufnahme

```bash
npm run electrical:preflight -- "channels/elektrotechnik/reels/2026-08-03_bis_2026-08-09/03_Was-macht-ein-FI-Schalter"
```

Erst bei `passed: true` neue Bilder und die neue Voice-Aufnahme erzeugen.

## Danach

```bash
npm run electrical:finish -- "channels/elektrotechnik/reels/2026-08-03_bis_2026-08-09/03_Was-macht-ein-FI-Schalter"
```

Noch offen sind neue Bilder, neue Iro-Aufnahme, optionale SFX, Render-QA und visuelle Freigabe.
