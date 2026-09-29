# Wissenschaftskanal

Produktionssystem für einen deutschsprachigen Faceless-Wissens- und Bildungskanal.

Der Kanal deckt Physik, Chemie, Elektrotechnik, Astronomie, Energie, Materialwissenschaft und weitere wissenschaftlich erklärbare Themen ab. Die frühere reine Elektrotechnik-Ausrichtung bleibt nur noch als Legacy-Bestand im Repository erhalten.

## Neuer Produktionsstandard

```text
Thema
→ Recherche + Quellen
→ deutsches Skript
→ Szenen-/Bildplanung
→ Cinematic Scientific 3D Editorial Bilder
→ Voice-over
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

## Preflight

```bash
npm run science:preflight -- "<reel-ordner>"
```

Der Preflight blockiert unter anderem:

- Platzhalter im Skript oder in Prompts
- fehlende Quellen
- sichtbaren KI-Text
- fehlende Szenenbilder
- unzulässige Animationen
- Mechanismus-Szenen
- Motion-Level ungleich `none`

## Fertigstellen

```bash
npm run science:finish -- "<reel-ordner>"
```

Die Pipeline verarbeitet die Voice auf 1,10×, erstellt lokale Wortzeiten, synchronisiert die statischen Bilder, erzeugt Untertitel, rendert das MP4 und erstellt technische Kontrollbilder.

## Migration

Die bisherigen Elektrotechnik-Reels und spezialisierten Remotion-Animationen bleiben vorerst als Legacy-Referenz im Repository. Neue Produktionen verwenden `ScienceReel` und `science-static-v1`.
