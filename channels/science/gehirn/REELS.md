# Wissenschafts-Reels — Produktionsvertrag

## Ordnerstruktur

Jeder Reel bleibt in der bestehenden Wochenstruktur:

```text
reels/YYYY-MM-DD_bis_YYYY-MM-DD/NN_Thema/
├── 01-script-audio/
├── 02-bilder/
│   ├── prompts/
│   └── images/
├── 03-caption/
├── 04-pdf/
├── 05-export/
│   └── video/
├── 06-projektdateien/
│   └── render/
└── README.md
```

## Themenrahmen

Erlaubt sind allgemeine Wissenschafts- und Bildungsthemen, insbesondere Physik, Chemie, Elektrotechnik, Astronomie, Energie, Technik, Materialwissenschaft und wissenschaftlich erklärbare Alltagsphänomene.

## Hook

- eine zentrale Frage
- sofort verständlich
- möglichst kurz
- erster gesprochener Satz stellt dieselbe Kernfrage
- keine künstlichen Metaphern
- Bild 01 ist gleichzeitig Coverquelle und erster visueller Shot

## Inhaltlicher Aufbau

- eine zentrale Frage pro Reel
- jede Szene erklärt genau eine neue Aussage
- adaptive Anzahl visueller Beats
- keine Szene nur zur Dekoration
- komplexere Aussagen dürfen auf mehrere Bilder aufgeteilt werden
- letzter Beat liefert Erkenntnis, Merksatz oder sauberen Abschluss

## Bildplanung

Aktuell ist keine feste Bildwelt definiert. Deshalb gibt es keinen verbindlichen Markenstil, keine feste Farbwelt und keine feste Prompt-Sprache.

Bis eine neue Bildwelt beschlossen ist, gelten nur neutrale technische Anforderungen:

- 9:16
- ein statisches Bild pro Beat
- keine zufällige KI-Schrift, Logos oder Wasserzeichen
- fachlich plausible Darstellung
- Bild 01 ist zugleich erster Shot und Coverquelle
- keine Remotion-Kamerabewegung

Bildprompts werden erst finalisiert, nachdem die neue Bildwelt festgelegt wurde.

## Remotion-Vertrag

Remotion erzeugt keine kreative Bildbewegung. Verboten sind Zoom, Pan, Ken Burns, Parallax, Rotation, Partikel, animierte Diagramme, animierte technische Prozesse und automatische Übergangseffekte.

Zulässig sind statische Szenenbilder, harte Schnitte, Voice-over, Untertitel ohne Bewegungsanimation, statische kontrollierte Overlays, optionale SFX und Export.

## Produktionsreihenfolge

1. Thema und zentrale Frage
2. fachliche Recherche und Quellen-IDs
3. fertiges deutsches Skript
4. Szenenplanung
5. neue Bildwelt festlegen
6. Bildprompts erstellen
7. Preflight
8. Bilder erzeugen und Gewinner auswählen
9. Voice-over
10. lokale Wortzeiten und Synchronisation
11. statische Montage
12. Untertitel und optionale SFX
13. Render-QA
14. visuelle und fachliche Endkontrolle

## Verbindliche Projektdateien

`06-projektdateien/` enthält mindestens `scene-plan.json`, `production-status.json`, `asset-manifest.json`, `content-package-report.json`, `ready-report.json`, `qa-report.json`, `sources.md` und `storyboard.md`. Prompt- und Visual-Policy-Dateien werden erst wieder verbindlich, wenn die neue Bildwelt definiert ist.

## Abbruchregeln

Nicht rendern bei fehlender Voice, fehlendem Pflichtbild, unzureichender Wortübereinstimmung, unbelegten sicherheitsrelevanten Behauptungen, gefährlichen Anleitungen, falschem Bildformat, doppeltem Bild, sichtbarer KI-Schrift oder unzulässiger Remotion-Animation.
