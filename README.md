# Wissenschaftskanal

Produktionssystem für einen deutschsprachigen Faceless-Wissens- und Bildungskanal.

Der Kanal deckt Physik, Chemie, Elektrotechnik, Astronomie, Energie, Materialwissenschaft und weitere wissenschaftlich erklärbare Themen ab. Die frühere reine Elektrotechnik-Ausrichtung bleibt nur noch als Legacy-Bestand im Repository erhalten.

## Neuer Produktionsstandard

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
→ robuste Skript-/Voice-Ausrichtung
→ statische Bildmontage
→ Untertitel + optionale SFX
→ Render
→ QA
```

## Visuelle Grundregel

Die Bilder tragen die Erklärung.

- ein Hauptmotiv pro Bild
- eine Aussage pro Bild
- keine sichtbare KI-Schrift
- 9:16
- adaptive Anzahl visueller Beats
- Bild 01 ist Cover-Hintergrund und erste Szene
- drei Kandidaten für Bild 01, danach ein Gewinner

## Remotion

Remotion ist ausschließlich Montage- und Export-Schicht.

Nicht erlaubt:

- Zoom
- Pan
- Ken Burns
- Parallax
- Rotation
- Partikel
- Mechanismus-Animationen
- animierte Diagramme
- animierte Strompfade
- animierte Moleküle
- automatische Crossfades

Erlaubt:

- statische Bilder
- harte Schnitte
- Voice-over
- Untertitel ohne Animation
- statische kontrollierte Overlays
- optionale SFX
- Export

## Neuer Reel

```bash
npm run science:new -- \
  --week=2026-10-01_bis_2026-10-07 \
  --slot=01 \
  --title="Warum ist der Himmel blau?" \
  --hook="Warum ist der Himmel blau?" \
  --scenes=10
```

Die Szenenzahl ist ein Startwert und darf je nach Inhalt zwischen 6 und 16 visuellen Beats liegen.

## Preflight – vor Bildern und Voice

```bash
npm run science:preflight -- "<reel-ordner>"
```

Der Preflight prüft und blockiert unter anderem:

- Platzhalter im Skript oder in Prompts
- fehlende oder nicht zugeordnete Quellen
- widersprüchliche Bildplanung
- sichtbaren KI-Text als geplante Bildanforderung
- unzulässige Animations-/Mechanismusregeln
- Motion-Level ungleich `none`
- unvollständiges Inhaltspaket

**Finale Szenenbilder und Voice sind beim Preflight noch nicht erforderlich.** Sie werden erst nach bestandenem Preflight produziert.

## Asset-Readiness – nach Bildern und Voice

```bash
npm run science:ready -- "<reel-ordner>"
```

Readiness verlangt:

- Roh- oder Final-Voice
- genau ein freigegebenes Szenenbild pro Beat
- Bild 01 als Coverquelle
- passende Auflösung und 9:16-Format
- keine doppelten Bilder
- bestandene Bilddarstellungs-QA
- alle zuvor bestandenen Preflight-Berichte

Öffentliche Medien werden nicht automatisch als Ersatz für fehlende Szenenbilder geladen.

## Fertigstellen

```bash
npm run science:finish -- "<reel-ordner>"
```

Die Pipeline verarbeitet die Voice auf exakt 1,10× und normalisiert die Lautheit, erstellt lokale Wortzeiten, synchronisiert die statischen Bilder, erzeugt Untertitel, rendert das MP4 und führt technische Render-QA inklusive Lautheit, Randstille, Schwarzbildprüfung und Szenen-Kontrollbildern aus.

## Referenzprojekt

Das erste Science-Static-Referenzprojekt liegt unter:

`channels/elektrotechnik/reels/2026-09-28_bis_2026-10-04/01_Warum-ist-der-Himmel-blau/`

Es zeigt den verbindlichen Aufbau für Recherche, Quellen-IDs, Script, 9 statische Bildbeats, Prompts, Scene-Plan und Prompt-Manifest.

## Migration / Legacy

Siehe `channels/elektrotechnik/LEGACY.md`.

Die bisherigen Elektrotechnik-Reels und spezialisierten Remotion-Animationen bleiben vorerst nur zur Reproduzierbarkeit alter Produktionen erhalten. Neue Produktionen verwenden ausschließlich `ScienceReel`, `science-static-v1` und die `science:*`-Befehle.
