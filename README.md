# Wissenschaftskanal

Produktionssystem für einen deutschsprachigen Faceless-Wissens- und Bildungskanal über Physik, Chemie, Elektrotechnik, Astronomie, Energie, Materialwissenschaft und weitere wissenschaftliche Themen.

Das Repository ist **Science-only**. Frühere Elektro-Testreels, Remotion-Animationen, Mechanismus-Canvases, Layout-Gallery und sonstige Legacy-Bestände sind aus dem aktiven Branch entfernt.

## Produktionsfluss

```text
Thema
→ Recherche + Quellen
→ deutsches Skript
→ Szenen-/Bildplanung
→ Preflight
→ Cinematic Scientific 3D Editorial Bilder
→ Voice-over
→ Asset-Readiness
→ lokale Wort-Zeitstempel
→ Skript-/Voice-Ausrichtung
→ statische Bildmontage
→ Untertitel + optionale SFX
→ Render
→ QA
```

## Bild- und Remotion-Regeln

- 9:16, ein Hauptmotiv und eine Aussage pro Bild
- generierte Bilder ohne sichtbare Schrift
- Bild 01 ist erste Szene und Coverquelle
- adaptive 6–16 visuelle Beats
- Remotion erzeugt keine Animationen, Zooms, Pans, Ken Burns, Parallax, Partikel oder Prozessvisualisierungen
- zwischen Bildern werden harte Schnitte verwendet
- Remotion übernimmt nur Bildmontage, Voice, Captions, optionale SFX und Export

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

Preflight läuft **vor** Bilder und Voice produziert werden und prüft Skript, Quellen, Bildplanung, Prompts und `science-static-v1`.

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

Dieses Projekt ist die aktuelle Referenz für Recherche, Quellen-IDs, Skript, statische Bildbeats, Prompts, Scene-Plan und Prompt-Manifest.

## Aktive Architektur

- Kanal: `channels/science/`
- Renderer: `ScienceReel`
- Runtime: `science-runtime.json`
- Visual Policy: `science-static-v1`
- Bildwelt: `Cinematic Scientific 3D Editorial`
- Befehle: ausschließlich `science:*`
