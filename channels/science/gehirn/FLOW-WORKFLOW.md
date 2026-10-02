# Google Flow – verbindlicher Bild-Workflow

Dieser Workflow gilt für jedes neue Video des Kanals.

## Grundsatz

Google Flow erzeugt **ausschließlich statische Bilder**. Es werden keine KI-Videoclips, keine Image-to-Video-Animationen und keine bewegten Szenen erzeugt.

Remotion montiert die fertigen Bilder mit Voice-over, Untertiteln, optionalen SFX und harten Schnitten. Remotion erzeugt ebenfalls keine Kamerabewegung oder Animation.

## Eine Masterdatei pro Video

Jedes aktive Video benötigt:

- `02-bilder/GOOGLE-FLOW-MASTER-PROMPT.txt`
- `06-projektdateien/flow-plan.json`
- die Einzelprompts unter `02-bilder/prompts/`

Der Masterprompt enthält den Thumbnail-Prompt und alle Szenenprompts in Produktionsreihenfolge. Er ist die eine Datei, die für die Bildproduktion in Google Flow verwendet wird.

## Phase 1 – Thumbnail zuerst

1. Zuerst genau **3 unterschiedliche Thumbnail-Kandidaten** erzeugen.
2. Danach **STOPPEN**.
3. Noch keine Szenenbilder erzeugen.
4. Auf die ausdrückliche Auswahl des Nutzers warten.
5. Der gewählte Kandidat dient anschließend als **lockere visuelle Referenz** für Qualitätsniveau und Illustrationssprache.
6. Die Szenen bleiben individuell: andere Orte, Farben und Kompositionen sind ausdrücklich erlaubt.

## Phase 2 – Bilder streng nacheinander

Nach der Thumbnail-Auswahl werden die Bilder **streng einzeln nacheinander** erzeugt.

Für Beat 01:

1. genau den Prompt für Beat 01 ausführen,
2. Kandidaten prüfen,
3. das beste Bild auswählen,
4. eindeutig als `01-...-final.png` speichern,
5. erst danach Beat 02 beginnen.

Dann Beat 02, Beat 03 usw. bis zum letzten Beat.

**Niemals mehrere Beats gleichzeitig erzeugen.**

## Erlaubte Ausgabe pro Beat

Es gibt genau eine erlaubte Ausgabe:

### `image`

Ein finales statisches 16:9-Bild.

Nicht erlaubt:

- KI-Videoclips
- Image-to-Video
- animierte Prozesse
- generierte Kamerafahrten
- Zoom/Pan/Ken-Burns
- zusätzliche bewegte Varianten

Wenn eine Aussage in einem Standbild nicht verständlich genug ist, wird der Beat besser gestaltet oder in zwei statische Beats aufgeteilt. Bewegung ist **kein Ersatz für gute Bildplanung**.

## Benennung

Beispiele:

- `01-hook-final.png`
- `02-context-final.png`
- `03-mechanism-final.png`

Jeder Beat erhält genau ein freigegebenes finales Bild.

## Bildwelt

Alle Bilder folgen `BILDWELT.md`:

> Nicht einfach ein Bild vom Thema erzeugen. Eine visuelle Szene bauen, die genau die Aussage des Beats erklärt.

Die gesamte 16:9-Fläche darf genutzt werden. Umgebung, technische Illustration, Cutaway, Vergleich, Detailansicht oder stilisierte Menschen werden nach Erklärnutzen gewählt. Sichtbarer Bildtext ist ausschließlich Deutsch.

## Remotion-Grenze

Remotion darf:

- finale statische Bilder anzeigen
- harte Schnitte setzen
- Voice-over abspielen
- Untertitel anzeigen
- optionale SFX platzieren
- rendern

Remotion darf nicht:

- Videos oder KI-Clips als Szenenquelle erwarten
- aus Standbildern Bewegung erzeugen
- zoomen oder schwenken
- wissenschaftliche Prozesse animieren
- neue visuelle Aussagen erfinden

## Pflicht vor Produktion

Vor dem Erzeugen der Bilder müssen fertig sein:

1. Recherche und Quellen
2. Story-Struktur
3. finales Skript
4. visuelle Beats
5. Einzelprompts
6. `flow-plan.json` mit `output: image` für jeden Beat
7. `GOOGLE-FLOW-MASTER-PROMPT.txt`

Fehlt eines davon, ist die Bildproduktion noch nicht freigegeben.
