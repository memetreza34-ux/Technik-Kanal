# Wissenschaftskanal

Produktionssystem für einen deutschsprachigen Faceless-Wissens- und Bildungskanal über Physik, Chemie, Elektrotechnik, Astronomie, Energie, Materialwissenschaft und weitere wissenschaftliche Themen.

Das Repository ist **Science-only**. Frühere Elektro-Testreels, Remotion-Animationen, Mechanismus-Canvases, Layout-Gallery und sonstige Legacy-Bestände sind aus dem aktiven Branch entfernt.

## Produktionsfluss

```text
Thema
→ Recherche + Quellen
→ deutsches Skript
→ Szenenplanung pro Aussage
→ Scientific Scene Explainer anwenden
→ Bildprompts erstellen
→ Preflight
→ Bilder
→ Voice-over
→ Asset-Readiness
→ lokale Wort-Zeitstempel
→ Skript-/Voice-Ausrichtung
→ statische Bildmontage
→ Untertitel + optionale SFX
→ Render
→ QA
```

## Aktive Bildwelt

Die verbindliche Bildwelt ist **Scientific Scene Explainer v1** (`scientific-scene-explainer-v1`). Die Detailregeln stehen in `channels/science/gehirn/BILDWELT.md`.

Kernprinzip:

> Nicht einfach ein Bild vom Thema erzeugen. Eine visuelle Szene bauen, die genau den gesprochenen Satz erklärt.

Wichtige Regeln:

- eine Hauptaussage pro Bild
- ganze Orte/Umgebungen nutzen, wenn sie das Verständnis verbessern
- wissenschaftliche Erklärung direkt in die Szene integrieren, wenn sinnvoll
- Illustration, Cutaway, Mikroansicht, Vergleich oder stilisierte erwachsene Menschen nur nach inhaltlichem Bedarf einsetzen
- Hintergründe und Farben passend zum Thema wählen; kein fixer Navy-Hintergrund
- Titel, Labels, Merksatz, Zahlen, Pfeile und Infotext sind optional
- sichtbarer Bildtext ausschließlich auf Deutsch
- so wenig Information wie möglich, so viel wie nötig
- keine generische KI-Kunst, Sci-Fi-HUDs, Neon-Überladung, Logos oder Wasserzeichen

Die technischen Bildregeln bleiben: 9:16, ein statisches Bild pro Beat, Bild 01 als erster Shot und Coverquelle und keine Remotion-Kamerabewegung.

## Neuer Reel

```bash
npm run science:new -- \
  --week=2026-10-01_bis_2026-10-07 \
  --slot=01 \
  --title="Warum ist der Himmel blau?" \
  --hook="Warum ist der Himmel blau?" \
  --scenes=10
```

Neue Reels werden bereits mit `scientific-scene-explainer-v1` angelegt.

## Preflight

```bash
npm run science:preflight -- "<reel-ordner>"
```

Der Preflight prüft Skript, Quellen, Szenenplanung, Bildprompt-Dateien und die benötigten Produktionsdateien. Sichtbarer Bildtext muss der aktiven Deutsch-only-Regel entsprechen.

## Asset-Readiness

```bash
npm run science:ready -- "<reel-ordner>"
```

Danach müssen Voice und genau ein freigegebenes statisches Bild pro Beat vorhanden sein. Bei mehreren Bildkandidaten muss exakt eines als `final`, `approved` oder `freigabe` markiert sein.

## Fertigstellen

```bash
npm run science:finish -- "<reel-ordner>"
```

Die Pipeline verarbeitet die Voice auf exakt 1,10×, normalisiert die Lautheit, erstellt lokale Wortzeiten mit `whisper.cpp`, synchronisiert Bilder und Untertitel, rendert `ScienceReel` und führt Render-QA aus.

## Referenzprojekt

`channels/science/reels/2026-09-28_bis_2026-10-04/01_Warum-ist-der-Himmel-blau/`

Das Projekt bleibt Referenz für Recherche, Quellen, Skript und Szenenplan. Die frühere Bildwelt und ihre alten Bildprompts bleiben entfernt. Neue Visuals für dieses Referenzprojekt müssen künftig nach `Scientific Scene Explainer v1` neu geplant werden.

## Aktive Architektur

- Kanal: `channels/science/`
- Renderer: `ScienceReel`
- Runtime: `science-runtime.json`
- technische Visual Policy: `science-static-v1`
- Bildwelt: `scientific-scene-explainer-v1`
- Befehle: ausschließlich `science:*`
