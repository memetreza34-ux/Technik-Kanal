# Wissenschafts-Reels — Produktionsvertrag

## Ordnerstruktur

Jeder Reel bleibt in der bestehenden Wochenstruktur:

```text
reels/YYYY-MM-DD_bis_YYYY-MM-DD/NN_Thema/
├── 01-script-audio/
│   ├── audio/
│   ├── sfx/
│   ├── script.md
│   ├── script-fliesstext.txt
│   └── voiceover.txt
├── 02-bilder/
│   ├── bildprompts.md
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

Erlaubt sind allgemeine Wissenschafts- und Bildungsthemen, insbesondere:

- Physik
- Chemie
- Elektrotechnik
- Astronomie
- Energie
- Technik
- Materialwissenschaft
- wissenschaftlich erklärbare Alltagsphänomene

## Hook

- eine zentrale Frage
- sofort verständlich
- möglichst kurz
- erster gesprochener Satz stellt dieselbe Kernfrage
- keine künstlichen Metaphern
- Bild 01 ist gleichzeitig Cover-Hintergrund und erster visueller Shot

## Inhaltlicher Aufbau

- eine zentrale Frage pro Reel
- jede Szene erklärt genau eine neue Aussage
- adaptive Anzahl visueller Beats
- keine Szene nur zur Dekoration
- komplexere Aussagen dürfen auf mehrere Bilder aufgeteilt werden
- lieber ein zusätzliches klares Bild als ein überladenes Bild
- letzter Beat liefert Erkenntnis, Merksatz oder sauberen Abschluss

## Bildplanung

Die Bilder tragen die komplette visuelle Erklärung.

Verbindlich:

- `Cinematic Scientific 3D Editorial`
- 9:16
- ein Hauptmotiv pro Bild
- keine sichtbare KI-Schrift
- keine Logos oder Wasserzeichen
- fachlich plausible Darstellung
- obere und untere Text-Safe-Zone berücksichtigen
- Bildanzahl nicht künstlich auf 8, 9 oder 10 begrenzen

Bild 01 wird in drei Varianten geplant. Eine Gewinner-Version wird als erste Szene und Cover-Hintergrund verwendet.

## Remotion-Vertrag

Es gibt kein Animationsbudget mehr, weil Remotion keine kreativen Animationen erzeugt.

Verboten:

- Full-Animationen
- Mechanismus-Animationen
- Zoom
- Pan
- Ken Burns
- Parallax
- Rotation
- Partikel
- animierte Diagramme
- animierte Strompfade
- animierte Moleküle
- animierte Feldlinien
- automatische Übergangseffekte

Zulässig:

- statisches Szenenbild
- harter Schnitt
- Voice-over
- Untertitel ohne Bewegungsanimation
- statische kontrollierte Text-/Formel-Overlays
- optionale SFX

## Produktionsreihenfolge

1. Thema und zentrale Frage
2. fachliche Recherche und Quellen-IDs
3. fertiges deutsches Skript
4. Szenen- und Bildplanung
5. Bildprompts
6. Preflight
7. Bilder erzeugen und Gewinner auswählen
8. Nutzer erstellt Voice-over
9. Voice auf finale Fassung verarbeiten
10. lokale Wortzeiten erzeugen
11. Szenen anhand des finalen Audios synchronisieren
12. statische Bilder mit harten Schnitten montieren
13. Untertitel und optionale SFX ergänzen
14. Render-QA
15. visuelle und fachliche Endkontrolle

## Verbindliche Projektdateien

`06-projektdateien/` enthält mindestens:

- `scene-plan.json`
- `production-status.json`
- `prompt-manifest.json`
- `asset-manifest.json`
- `content-package-report.json`
- `ready-report.json`
- `qa-report.json`
- `sources.md`
- `storyboard.md`

## Abbruchregeln

Nicht rendern bei:

- fehlender Voice
- fehlendem Pflichtbild
- unzureichender Wortübereinstimmung zwischen Skript und Voice
- unbelegter sicherheits- oder normrelevanter Behauptung
- gefährlicher Anleitung
- falschem Bildformat
- doppeltem Bild
- sichtbarer KI-Schrift
- unzulässiger Remotion-Animation
- Readiness- oder QA-Fehler
