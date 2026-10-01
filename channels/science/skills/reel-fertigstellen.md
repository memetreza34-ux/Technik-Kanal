# Skill: Science-Reel vollständig fertigstellen

## Phase 1 – Konzept

Vor Bildern und Audio:

1. direkte Frage als Hook festlegen
2. fachlich recherchieren und Quellen-IDs dokumentieren
3. Szenen nach Aussagen planen; Bildanzahl adaptiv wählen
4. jede Szene als `image-only` und `motionLevel: none` definieren
5. pro Beat `gehirn/BILDWELT.md` anwenden
6. Bild 01 als Coverquelle planen

Aktive Bildwelt: **Scientific Scene Explainer v1**.

Kernregel: Nicht einfach ein Bild vom Thema erzeugen. Eine visuelle Szene bauen, die genau den gesprochenen Satz erklärt.

Dabei je Szene neu entscheiden:
- volle Umgebung/Ort oder reine Illustration?
- technische Cutaway-/Mikro-/Vergleichsansicht sinnvoll?
- hilft eine stilisierte erwachsene Person?
- braucht das Bild überhaupt Text?
- wenn Text: nur Deutsch, kurz und fachlich relevant
- Hintergrund/Farben passend zum Inhalt statt immer gleich
- so wenig Information wie möglich, so viel wie nötig

## Phase 2 – Bildprompts und Preflight

Für jeden Beat einen eigenen Bildprompt aus dem konkreten Skriptsatz entwickeln.

- visuelle Hauptidee festlegen
- passende Umgebung oder Darstellungsform wählen
- nur notwendige Labels, Titel, Merksätze, Zahlen oder Pfeile vorsehen
- sichtbaren Bildtext ausschließlich auf Deutsch anfordern
- unnötige Dekoration, Sci-Fi-HUDs, Neon-Überladung, generische KI-Kunst und Informationsüberladung ausschließen
- Bild 01 als Coverquelle planen
- anschließend ausführen:

```bash
npm run science:preflight -- "<reel-ordner>"
```

Bei Fehlern keine Medien erzeugen. Erst korrigieren und erneut prüfen.

## Phase 3 – Nutzerassets

Nach bestandenem Preflight:

- Rohaufnahme nach `01-script-audio/audio/`
- genau ein finales statisches Bild je Szene
- optional sichtbarer deutscher Bildtext gemäß Bildwelt
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

Prüfen:
- erklärt jede Szene genau ihren Skriptsatz?
- nutzt sie bei Bedarf den ganzen Bildraum sinnvoll?
- ist die Darstellungsform fachlich passend?
- sind sichtbare Bildtexte ausschließlich Deutsch und korrekt geschrieben?
- sind Labels/Infos wirklich notwendig und nicht überladen?
- gibt es keine Logos/Wasserzeichen oder fehlerhafte KI-Schrift?
- bleiben alle Bilder statisch?
- sind Untertitel vollständig?
- ist Bild 01 als erster Shot und Coverquelle geeignet?
- sind fachliche Aussagen durch Quellen gedeckt?
