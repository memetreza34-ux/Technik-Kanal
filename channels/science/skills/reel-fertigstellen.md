# Skill: Science-Reel vollständig fertigstellen

## Phase 1 – Konzept

Vor Bildern und Audio:

1. direkte Frage als Hook festlegen
2. fachlich recherchieren und Quellen-IDs dokumentieren
3. Szenen nach Aussagen planen; Bildanzahl adaptiv wählen
4. jede Szene als `image-only` und `motionLevel: none` definieren
5. Bildwelt nur verwenden, wenn sie ausdrücklich im Repo definiert ist
6. Bild 01 als Coverquelle planen

Aktuell ist keine feste Bildwelt definiert. Deshalb dürfen keine früheren Scientific-3D-/Cutaway-Regeln oder alten Referenzprompts wiederverwendet werden.

## Phase 2 – Bildwelt und Preflight

Erst nachdem eine neue Bildwelt beschlossen wurde:

- passende Bildprompts erstellen
- Bild 01 als Coverquelle planen
- alle visuellen Regeln dokumentieren
- anschließend ausführen:

```bash
npm run science:preflight -- "<reel-ordner>"
```

Bei Fehlern keine Medien erzeugen. Erst korrigieren und erneut prüfen.

## Phase 3 – Nutzerassets

Nach bestandenem Preflight:

- Rohaufnahme nach `01-script-audio/audio/`
- genau ein finales 9:16-Bild je Szene
- optionale SFX nach `01-script-audio/sfx/`

Alle Bilder bleiben statisch. Es werden keine späteren Remotion-Animationen eingeplant.

## Phase 4 – Ein-Befehl-Produktion

```bash
npm run science:finish -- "<reel-ordner>"
```

Die Pipeline verarbeitet Audio auf 1,10×, erstellt lokale Wort-Zeitstempel, gleicht Transkript und Szenenplan ab, synchronisiert Bilder/Untertitel/SFX, setzt harte Schnitte, rendert das MP4 und erzeugt Render-QA sowie Kontrollbilder.

## Harte Remotion-Grenze

Remotion darf keine visuelle Kreativarbeit leisten. Verboten sind Zoom, Pan, Ken Burns, Parallax, Rotation, animierte Diagramme, Moleküle, Feldlinien, Strompfade, Partikel, Mechanismus-Animationen und Crossfades als Standard.

Zulässig sind statische Bilder, harte Schnitte, Voice-over, statische Titel/Overlays, Untertitel ohne Animation, optionale SFX und Export.

## Endkontrolle

Prüfen: ist jede Szene sofort verständlich, enthält kein Bild zufällige KI-Schrift/Logos/Wasserzeichen, bleiben alle Bilder statisch, sind Untertitel vollständig, ist Bild 01 als erster Shot und Coverquelle geeignet und sind fachliche Aussagen durch Quellen gedeckt.
