# Skill: Science-YouTube-Video vollständig fertigstellen

Aktives Profil: **`youtube-6to7min-v1`** (6–7 Minuten). Das 2-Minuten-Profil ist archiviert.

## Phase 1 – Thema, Recherche und Story

Vor Bildern und Audio:

1. Thema gegen `gehirn/KANAL.md` prüfen
2. direkte zentrale Frage festlegen
3. grobes Titel-/Thumbnail-Versprechen definieren
4. fachlich recherchieren und Quellen-IDs dokumentieren
5. Story nach `gehirn/LONGFORM.md` aufbauen: Hook → Kontext → Grundlage → Mechanismus → Vertiefung → Payoff
6. vollständiges deutsches Skript mit ungefähr 230–370 Wörtern fertigstellen
7. Skript in ungefähr 12–28 visuelle Aussagen/Beats zerlegen

Wichtig: **nicht automatisch ein Satz = ein Bild**. Ein komplizierter Satz darf mehrere Beats benötigen; mehrere Sätze dürfen einen Beat teilen.

## Phase 2 – Bildplanung

Aktive Bildwelt: **Technical Editorial Explainer 2.5D** (siehe `gehirn/BILDWELT.md`).

Kernregel: Nicht einfach ein Bild vom Thema erzeugen. Eine visuelle Szene bauen, die genau die aktuelle visuelle Aussage erklärt.

Dabei je Beat neu entscheiden:
- volle Umgebung/Ort oder reine Illustration?
- technische Cutaway-/Detail-/Vergleichsansicht sinnvoll?
- hilft eine stilisierte erwachsene Person?
- braucht das Bild überhaupt Text?
- wenn Text: nur Deutsch, kurz und fachlich relevant
- Hintergrund/Farben passend zum Inhalt statt immer gleich
- so wenig Information wie möglich, so viel wie nötig

Alle Szenenbilder sind 16:9 und für 1920×1080 geplant.

## Phase 3 – Thumbnail

Thumbnail ist **separat von Bild 01**.

- `02-bilder/prompts/00-thumbnail.txt`
- 1280×720 / 16:9
- drei Kandidaten planen
- ein Gewinner manuell auswählen
- Titel, Thumbnail und Hook müssen dasselbe Versprechen geben
- keine irreführende oder fachlich falsche Zuspitzung

## Phase 4 – Bildprompts und Preflight

Für jeden visuellen Beat einen eigenen Bildprompt entwickeln.

- visuelle Hauptidee festlegen
- passende Umgebung oder Darstellungsform wählen
- 16:9 ausdrücklich planen
- nur notwendige Labels, Titel, Merksätze, Zahlen oder Pfeile vorsehen
- sichtbaren Bildtext ausschließlich auf Deutsch anfordern
- unnötige Dekoration, Sci-Fi-HUDs, Neon-Überladung, generische KI-Kunst und Informationsüberladung ausschließen

Anschließend:

```bash
npm run science:preflight -- "<video-ordner>"
```

Bei Fehlern keine Medien erzeugen. Erst korrigieren und erneut prüfen.

## Phase 5 – Assets

Nach bestandenem Preflight:

- Rohaufnahme nach `01-script-audio/audio/`
- genau ein finales statisches 16:9-Bild je Beat
- drei Thumbnail-Kandidaten und eine finale Freigabe
- optional sichtbarer deutscher Bildtext gemäß Bildwelt
- optionale SFX nach `01-script-audio/sfx/`

Alle Szenenbilder bleiben statisch. Es werden keine späteren Remotion-Animationen eingeplant.

## Phase 6 – Ein-Befehl-Produktion

```bash
npm run science:finish -- "<video-ordner>"
```

Die Pipeline verarbeitet Audio auf 1,10×, erstellt lokale Wort-Zeitstempel, gleicht Transkript und Szenenplan ab, synchronisiert Bilder, SFX und optionale Musik, legt die dezente virtuelle Kamera über jedes Bild, setzt harte Schnitte, rendert 1920×1080 und erzeugt Render-QA sowie Kontrollbilder.

## Harte Remotion-Grenze

Remotion darf keine visuelle Kreativarbeit leisten. Verboten sind starker Zoom, Ken Burns über 4 %, Parallax, Rotation, animierte Diagramme, Moleküle, Feldlinien, Strompfade, Partikel, Mechanismus-Animationen, Crossfades als Standard sowie eigene Szenenüberschriften oder Kicker.

Zulässig sind statische Bilder mit der dezenten virtuellen Kamera (≤4 % Zoom, 1,5 % Schwenk, pro Szene abschaltbar mit `cameraMove: none`, siehe `gehirn/KANAL.md`), harte Schnitte, Voice-over, optionaler Musikteppich mit Quellenangabe, optionale SFX und Export. Keine eingebrannten Untertitel.

## Endkontrolle

Prüfen:
- beantwortet das Video wirklich seine Ausgangsfrage?
- beginnt die Erklärung innerhalb der ersten 30 Sekunden?
- hat das Skript einen roten Faden statt einer Faktenliste?
- erklärt jeder Beat eine klare visuelle Aussage?
- nutzt er bei Bedarf den ganzen 16:9-Bildraum sinnvoll?
- ist die Darstellungsform fachlich passend?
- sind sichtbare Bildtexte ausschließlich Deutsch und korrekt geschrieben?
- sind Labels/Infos wirklich notwendig und nicht überladen?
- gibt es keine Logos/Wasserzeichen oder fehlerhafte KI-Schrift?
- bleiben alle Bilder statisch?
- ist die Kamerabewegung dezent und zeigt nie einen leeren Bildrand?
- sind Titel, Thumbnail und Hook inhaltlich konsistent?
- sind fachliche Aussagen durch Quellen gedeckt?
