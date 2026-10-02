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

## Phase 2 – Szenenbilder in genau 5 Produktionsschritten

**Nach der Thumbnail-/Cover-Auswahl wird die gesamte Bildproduktion immer in genau fünf Schritte aufgeteilt.**

Die vorhandenen Beats werden möglichst gleichmäßig und in ihrer ursprünglichen Reihenfolge auf fünf zusammenhängende Gruppen verteilt. Bei 18 Bildern gilt zum Beispiel:

- **Bildschritt 1:** Bilder 01–04
- **Bildschritt 2:** Bilder 05–08
- **Bildschritt 3:** Bilder 09–12
- **Bildschritt 4:** Bilder 13–15
- **Bildschritt 5:** Bilder 16–18

Bei einer anderen Beat-Anzahl werden die fünf Gruppen automatisch möglichst gleich groß verteilt. Kein Bild darf übersprungen oder doppelt einem Schritt zugeordnet werden.

### Innerhalb jedes Bildschritts

Die Bilder werden weiterhin **streng einzeln nacheinander** erzeugt. Beispiel Bildschritt 1:

1. Bild 01 mit seinem eigenen Prompt erzeugen,
2. Kandidaten prüfen,
3. das beste Bild auswählen,
4. eindeutig als `01-...-final.png` speichern,
5. erst danach Bild 02 erzeugen,
6. so fortfahren, bis alle Bilder dieses Bildschritts fertig sind.

**Niemals mehrere Beats gleichzeitig erzeugen.**

### Stopp zwischen den fünf Schritten

Nach jedem vollständig abgeschlossenen Bildschritt gilt:

- **STOPPEN**,
- kurz melden, welche Bilder fertig sind,
- auf die ausdrückliche Freigabe des Nutzers warten,
- erst danach mit dem nächsten Bildschritt beginnen.

Nach Bildschritt 5 ist die Bildproduktion abgeschlossen.

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
6. `flow-plan.json` mit `output: image` für jeden Beat und Zuordnung zu genau einem der fünf Bildschritte
7. `GOOGLE-FLOW-MASTER-PROMPT.txt` mit Thumbnail-Phase und fünf Bildschritten

Fehlt eines davon, ist die Bildproduktion noch nicht freigegeben.
