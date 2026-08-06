# Was macht ein FI-Schalter?

## Neuaufbau nach Analyse des ersten Renders

Der erste Render wurde verworfen. Hauptgründe: überladene KI-Bilder, englische Beschriftungen, konkurrierende Remotion-Overlays, zu viele Vollanimationen und ein unnötig komplizierter Hook.

## Neue Fassung

- Hook und Cover: **„Was macht ein FI-Schalter?“**
- geplante Länge nach 1,10×: ungefähr 52 bis 58 Sekunden
- 10 Bildbeats
- nur 3 vollständige Mechanismus-Animationen
- alle generierten Bilder ohne Text oder Labels
- alle deutschen Texte ausschließlich als Remotion-Overlay
- keine Musik

## Vollständige Animationen

1. Szene 03: ausgeglichener Hin- und Rückstrom
2. Szene 05: Differenz- beziehungsweise Fehlerstrom
3. Szene 07: Kontaktöffnung

Die übrigen Szenen sind bildgeführt und verwenden nur den subtilen Kamera-Zoom der Engine. Szene 08 erhält lediglich einen statischen `30 mA`-Hinweis.

## Neue externe Medien erforderlich

Die Bilder und das Audio des ersten Renders werden nicht wiederverwendet.

1. neuen Sprechtext aufnehmen
2. zehn neue Bilder mit den überarbeiteten minimalistischen Prompts erzeugen
3. neues Coverbild erzeugen
4. optionale drei SFX ablegen
5. anschließend ausführen:

```bash
npm run electrical:finish -- "channels/elektrotechnik/reels/2026-08-03_bis_2026-08-09/03_Was-macht-ein-FI-Schalter"
```
