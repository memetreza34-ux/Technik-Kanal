# Wissenschafts- und Bildungskanal

Deutschsprachiger Faceless-Kanal für verständlich erklärte Wissenschaft und Technik.

## Themen

- Physik
- Chemie
- Elektrotechnik und Elektronik
- Astronomie
- Energie
- Materialwissenschaft
- technische Alltagsphänomene
- weitere naturwissenschaftliche Bildungsthemen

Elektrotechnik ist nur noch ein Themenbereich innerhalb des Kanals.

## Aktiver Produktionsstandard

- `science-static-v1`
- Bildwelt: `Cinematic Scientific 3D Editorial`
- direkte deutsche Frage als Hook
- adaptive Anzahl visueller Beats
- ein statisches 9:16-Bild pro Szene
- Bild 01 ist zugleich Cover-Hintergrund und erster Shot
- Bild 01 erhält drei Kandidaten, danach einen Gewinner
- keine sichtbare KI-Schrift
- keine Remotion-Animationen
- keine Zooms, Pans, Ken-Burns-, Parallax- oder Mechanismusbewegungen
- harte Schnitte zwischen den Bildern
- deutsche Untertitel ohne Einblendanimation
- Voice-over automatisch auf 1,10×
- lokales Worttranskript und robuste Skript-/Voice-Ausrichtung
- Quellen-IDs für fachliche Aussagen

## Remotion-Rolle

Remotion ist nur Montage- und Export-Schicht:

- Bilder zeitlich anordnen
- harte Schnitte
- Voice-over
- Untertitel
- statische kontrollierte Overlays
- optionale SFX
- Render

Es erzeugt keine eigene wissenschaftliche Visualisierung.

## Neue Befehle

```bash
npm run science:new -- --week=YYYY-MM-DD_bis_YYYY-MM-DD --slot=01 --title="Warum ist der Himmel blau?" --hook="Warum ist der Himmel blau?" --scenes=10
npm run science:preflight -- "<reel-ordner>"
npm run science:ready -- "<reel-ordner>"
npm run science:finish -- "<reel-ordner>"
```

Die bisherigen `electrical:*`-Befehle bleiben während der Migration als Legacy-Aliase vorhanden.
