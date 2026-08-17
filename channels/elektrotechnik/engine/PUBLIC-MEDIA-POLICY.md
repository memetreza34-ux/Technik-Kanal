# Öffentliche Medien – verbindliche Richtlinie

## Ziel

Remotion bleibt die Hauptdarstellung. Reale Bilder werden nur eingesetzt, wenn Realität einen echten Mehrwert liefert, zum Beispiel bei Kraftwerken, Umspannwerken, Bahnkomponenten, historischen Anlagen oder realen Industrieumgebungen.

## Suchreihenfolge

1. Wikimedia Commons / über Openverse auffindbare freie Medien
2. andere Openverse-Quellen mit eindeutigem Public-Domain-, CC0- oder CC-BY-Nachweis
3. manuell geprüfte Stockquellen nur außerhalb des automatischen Standardwegs

Der automatische Standardweg akzeptiert nur `Public-Domain`, `CC0-1.0`, `CC-BY-4.0` und `CC-BY-3.0`. NC-, ND- und SA-Lizenzen werden nicht automatisch übernommen.

## Warum zwei Prüfschritte?

Openverse eignet sich zur Suche in offen lizenzierten Medien, ist aber ein Suchindex. Wikimedia Commons weist selbst darauf hin, dass die Lizenz jedes einzelnen Werks geprüft werden muss und dass zusätzlich Marken-, Persönlichkeits-, Datenschutz- oder andere Rechte relevant sein können.

Deshalb gilt:

1. `electrical:media-search` findet Kandidaten.
2. Codex öffnet die originale Source-Page und prüft Lizenz, Urheber und sichtbare Rechte.
3. Codex prüft das Bild visuell auf Personen, Logos und geschützte Kunstwerke.
4. Erst danach darf `electrical:media-approve` ausgeführt werden.
5. `electrical:public-media` lädt nur ausdrücklich freigegebene Assets.

## Befehle

```bash
npm run electrical:media-search -- "<reel>" --scene=06-szene --query="electrical substation transformer"

npm run electrical:media-approve -- "<reel>" \
  --scene=06-szene \
  --candidate=<OPENVERSE-ID> \
  --source-verified --visual-reviewed --no-people --no-logos --no-artwork

npm run electrical:public-media -- "<reel>"
```

## Attribution

CC-BY-Medien benötigen mindestens Urheber, Lizenz und Quellenlink. Die Pipeline schreibt den Nachweis automatisch nach `05-export/public-media-attribution.txt`.

## Rechtliche Grenze

Die Pipeline reduziert Risiko und dokumentiert die Prüfung; sie ist keine Rechtsberatung und kann die tatsächliche Rechtekette eines fremden Bildes nicht garantieren. Bei unklaren Personen-, Marken-, Kunstwerk- oder Eigentumsrechten wird das Bild nicht verwendet.

## Offizielle Referenzen

- Wikimedia Commons: https://commons.wikimedia.org/wiki/Commons:Reusing_content_outside_Wikimedia
- Openverse API: https://api.openverse.org/
- Creative Commons BY 4.0: https://creativecommons.org/licenses/by/4.0/
- Unsplash-Lizenz für manuell geprüfte Ausnahmefälle: https://unsplash.com/license
