# Wissenschaftskanal

Produktionssystem für einen deutschsprachigen Faceless-Wissens- und Bildungskanal über Physik, Chemie, Elektrotechnik, Astronomie, Energie, Materialwissenschaft und weitere wissenschaftliche Themen.

Das Repository ist **Science-only**. Frühere Elektro-Testreels, Remotion-Animationen, Mechanismus-Canvases, Layout-Gallery und sonstige Legacy-Bestände sind aus dem aktiven Branch entfernt.

## Produktionsfluss

```text
Thema
→ Recherche + Quellen
→ deutsches Skript
→ Szenenplanung
→ neue Bildwelt festlegen
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

## Aktueller Bildstatus

Im Repo ist aktuell **keine feste Bildwelt definiert**. Frühere Scientific-3D-/Cutaway-Stilregeln und die dazugehörigen Referenzprompts wurden entfernt. Bis eine neue Bildwelt beschlossen ist, darf kein Agent eigenständig einen Markenstil ableiten oder alte Style-Prompts wiederherstellen.

Die neutralen technischen Bildregeln bleiben: 9:16, ein statisches Bild pro Beat, Bild 01 als erster Shot und Coverquelle, keine zufällige KI-Schrift/Logos/Wasserzeichen und keine Remotion-Kamerabewegung.

## Neuer Reel

```bash
npm run science:new -- \
  --week=2026-10-01_bis_2026-10-07 \
  --slot=01 \
  --title="Warum ist der Himmel blau?" \
  --hook="Warum ist der Himmel blau?" \
  --scenes=10
```

## Preflight

```bash
npm run science:preflight -- "<reel-ordner>"
```

Der Preflight prüft Skript, Quellen, Szenenplanung und die benötigten Produktionsdateien. Solange für ein Projekt noch keine neuen Bildprompts angelegt wurden, bleibt die visuelle Produktion absichtlich unvollständig.

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

Das Projekt bleibt Referenz für Recherche, Quellen, Skript und Szenenplan. Die frühere Bildwelt und ihre Bildprompts sind bewusst entfernt.

## Aktive Architektur

- Kanal: `channels/science/`
- Renderer: `ScienceReel`
- Runtime: `science-runtime.json`
- technische Visual Policy: `science-static-v1`
- Bildwelt: aktuell nicht definiert
- Befehle: ausschließlich `science:*`
