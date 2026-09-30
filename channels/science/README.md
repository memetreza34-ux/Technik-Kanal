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

Elektrotechnik ist ein Themenbereich unter mehreren.

## Verbindlicher Produktionsstandard

- `science-static-v1`
- direkte deutsche Frage als Hook
- adaptive 6–16 visuelle Beats
- ein statisches 9:16-Bild pro Szene
- Bild 01 = Coverquelle + erster Shot
- keine zufällige KI-Schrift, Logos oder Wasserzeichen
- keine Remotion-Animationen, Zooms, Pans, Ken Burns, Parallax oder Mechanismusbewegungen
- harte Schnitte
- deutsche Untertitel ohne Animation
- Voice auf 1,10× mit Loudness-Normalisierung
- lokale Wortzeiten und robuste Skript-/Voice-Ausrichtung
- Quellen-IDs für fachliche Aussagen

## Bildwelt

Aktuell ist keine feste Bildwelt definiert. Frühere Scientific-3D-/Cutaway-Stilregeln wurden entfernt. Bis eine neue Bildwelt ausdrücklich beschlossen wird, darf kein fester visueller Markenstil angenommen oder rekonstruiert werden.

## Remotion-Rolle

Remotion darf nur Bilder zeitlich anordnen, harte Schnitte setzen, Voice/Captions/SFX abspielen und exportieren. Wissenschaftliche Visualisierungen werden nicht in Remotion erzeugt.

## Befehle

```bash
npm run science:new -- --week=YYYY-MM-DD_bis_YYYY-MM-DD --slot=01 --title="Warum ist der Himmel blau?" --hook="Warum ist der Himmel blau?" --scenes=10
npm run science:preflight -- "<reel-ordner>"
npm run science:ready -- "<reel-ordner>"
npm run science:finish -- "<reel-ordner>"
```

Es gibt keine `electrical:*`- oder `elektro:*`-Produktionsaliase mehr.
