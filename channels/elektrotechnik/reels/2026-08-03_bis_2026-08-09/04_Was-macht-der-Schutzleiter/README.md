# Was macht der Schutzleiter?

## Direkter Hook

> Was macht der Schutzleiter?

## Überarbeiteter Produktionsstandard

- 9 Szenen
- 7 sichtbare Szenenbilder
- 1 separates textfreies Cover-Hintergrundbild
- 2 reine Remotion-Mechanismus-Szenen ohne Nutzerbild
- deutsches Voice-over mit 135 Wörtern
- geplante Länge ungefähr 55 Sekunden bei 1,10×
- semi-fotorealistische technische CGI statt spielzeugartiger 3D-Optik
- reale europäische Elektrobauteile und reale Proportionen
- deutsche Beschriftungen ausschließlich kontrolliert in Remotion

## Finales Cover

Das Bild unter `02-bilder/images/00-cover/` ist nur der textfreie Hintergrund. Das veröffentlichte Cover ist der erste Frame des Reels und muss sichtbar enthalten:

> Was macht der Schutzleiter?

Das rohe KI-Cover darf nicht ohne diesen deutschen Hook veröffentlicht werden.

## Remotion-Szenen ohne Bild

- `03-normalbetrieb` – Außenleiter und Neutralleiter führen Betriebsstrom, PE bleibt ohne Betriebsstrom
- `05-fehlerstromweg` – Fehlerstrom wird über den Schutzleiter zurückgeführt

Die Gesamtdatei `02-bilder/ALLE-BILDPROMPTS-MIT-COVER.txt` enthält trotzdem alle Szenen vollständig, einschließlich der beiden Referenzbriefings.

## Verbindlicher Ablauf

```bash
npm run electrical:preflight -- "channels/elektrotechnik/reels/2026-08-03_bis_2026-08-09/04_Was-macht-der-Schutzleiter"
```

Erst nach bestandenem Preflight:

1. Coverhintergrund und sieben sichtbare Szenenbilder mit den neuen realistischen Prompts erzeugen.
2. Die bisher erzeugten spielzeugartigen Bilder nicht wiederverwenden.
3. deutsche Rohaufnahme als `01-script-audio/audio/voiceover-raw.wav` ablegen.
4. Reel fertigstellen:

```bash
npm run electrical:finish -- "channels/elektrotechnik/reels/2026-08-03_bis_2026-08-09/04_Was-macht-der-Schutzleiter"
```
