# Visual Quality Gate – Science Static v1

## Grundregel

Der Wissenskanal wird standardmäßig mit **statischen wissenschaftlichen Szenenbildern** gebaut. Remotion montiert diese Bilder nur zeitlich und darf keine eigene Animation erzeugen.

## Ziel

Jeder Reel soll wie eine konsistente hochwertige wissenschaftliche Editorial-Serie wirken:

- fachlich plausible Darstellung
- ein klares Hauptmotiv pro Bild
- eine Aussage pro visueller Einheit
- Cinematic Scientific 3D Editorial
- keine sichtbare KI-Schrift
- hohe mobile Lesbarkeit
- keine unnötige visuelle Überladung

## Standard

- adaptive Bildanzahl, normalerweise 6–16 visuelle Beats
- jede Szene ist `image-only`
- jede Szene hat `motionLevel: none`
- jede Szene benötigt ein freigegebenes 9:16-Bild
- Bild 01 ist gleichzeitig erste Szene und Cover-Hintergrund
- für Bild 01 werden drei Kandidaten geplant, danach genau ein Gewinner ausgewählt
- keine separate Thumbnail-Bildwelt
- keine Mechanismus-Animationen
- keine Remotion-generierten wissenschaftlichen Grafiken
- keine Zooms, Pans, Parallaxen, Partikel oder Crossfades
- Szenenwechsel als harter Schnitt

## Text

Generierte Bilder enthalten keinen Text. Notwendige deutsche Begriffe, Formeln oder Werte dürfen nur als kontrollierte statische Overlay-Ebene ergänzt werden.

## Öffentliche Bilder

Öffentliche Fotos sind Ausnahmefälle und nur zulässig, wenn ein reales dokumentarisches Motiv einen klaren Mehrwert gegenüber der Scientific-3D-Bildwelt besitzt. Quelle, Lizenz und Rechteprüfung bleiben verpflichtend.

## Qualitätsprüfung

Die Produktion wird blockiert, wenn:

- eine Science-Static-Szene kein Bild besitzt,
- `renderMode` nicht `image-only` ist,
- `motionLevel` nicht `none` ist,
- ein Mechanismus-/Animations-Identifier gesetzt ist,
- ein Prompt sichtbaren KI-Text erlaubt,
- Bild 01 nicht Coverquelle ist,
- ein separates Pflicht-Coverbild verlangt wird,
- ein Bild mehrfach verwendet wird,
- Bildformat oder Auflösung nicht reel-tauglich sind,
- eine Szene mehr als eine konkurrierende Hauptaussage enthält.
