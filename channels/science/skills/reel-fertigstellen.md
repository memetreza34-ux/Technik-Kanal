# Skill: Science-Reel vollständig fertigstellen

## Phase 1 – Konzept und Preflight

Vor Bildern und Audio:

1. direkte Frage als Hook festlegen
2. fachlich recherchieren und Quellen-IDs dokumentieren
3. Szenen nach Aussagen planen; Bildanzahl adaptiv wählen
4. jede Szene als `image-only` und `motionLevel: none` definieren
5. textfreie Scientific-3D-Prompts erstellen
6. Bild 01 als Coverquelle planen und drei Kandidaten vorsehen
7. ausführen:

```bash
npm run science:preflight -- "<reel-ordner>"
```

Bei Fehlern keine Medien erzeugen. Erst korrigieren und erneut prüfen.

## Phase 2 – Nutzerassets

Nach bestandenem Preflight:

- Rohaufnahme nach `01-script-audio/audio/`
- genau ein finales 9:16-Bild je Szene
- für Bild 01 aus drei Kandidaten einen Gewinner auswählen
- optionale SFX nach `01-script-audio/sfx/`

Alle Bilder bleiben statisch. Es werden keine späteren Remotion-Animationen eingeplant.

## Phase 3 – Ein-Befehl-Produktion

```bash
npm run science:finish -- "<reel-ordner>"
```

Die Pipeline:

1. führt den Preflight erneut aus
2. verarbeitet Audio auf 1,10×
3. erstellt lokale Wort-Zeitstempel
4. gleicht Transkript und Szenenplan robust ab
5. synchronisiert statische Bilder, Untertitel und optionale SFX
6. setzt ausschließlich harte Schnitte
7. rendert das MP4
8. prüft Auflösung, FPS, Ton und Dauer
9. erzeugt Szenen-Stills und Kontaktbogen

## Harte Remotion-Grenze

Remotion darf keine visuelle Kreativarbeit leisten.

Verboten:

- Zoom
- Pan
- Ken Burns
- Parallax
- Rotation
- animierte Diagramme
- animierte Moleküle
- animierte Feldlinien
- animierte Strompfade
- Partikel
- Mechanismus-Animationen
- Crossfades als Standard

Zulässig:

- statisches Bild
- harter Schnitt
- Voice-over
- statischer Titel/Overlay
- Untertitel ohne Animation
- optionale SFX
- Export

## Visuelle Endkontrolle

Prüfen:

- versteht man jede Szene beim ersten Blick?
- ist genau eine Aussage dominant?
- ist die Scientific-3D-Bildwelt konsistent?
- enthält kein Bild KI-Schrift?
- bleiben alle Bilder vollständig statisch?
- sind Untertitel lesbar und vollständig?
- ist Bild 01 zugleich starker erster Shot und geeigneter Cover-Hintergrund?
- sind fachliche Aussagen durch die dokumentierten Quellen gedeckt?

Bei einem Fehler Prompt, Bild, Mapping oder Timing korrigieren und erneut rendern.
