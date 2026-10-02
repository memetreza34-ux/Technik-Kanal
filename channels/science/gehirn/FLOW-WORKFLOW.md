# Google Flow – verbindlicher Medien-Workflow

Dieser Workflow gilt für jedes neue Video des Kanals.

## Grundsatz

Google Flow erzeugt die visuellen Medien. Remotion montiert nur bereits erzeugte Medien mit Voice-over, Untertiteln, optionalen SFX und harten Schnitten.

**KI-Video ist ausdrücklich erlaubt und Teil der Pipeline.** Das Verbot von Zoom, Pan, Ken Burns, Parallax oder künstlich erzeugten wissenschaftlichen Animationen bezieht sich auf Remotion. Ein in Google Flow erzeugter Image-to-Video-Clip darf einen wissenschaftlichen Vorgang sichtbar animieren, wenn der Vorgang fachlich korrekt und im Flow-Plan ausdrücklich vorgesehen ist.

## Eine Masterdatei pro Video

Jedes aktive Video benötigt:

- `02-bilder/GOOGLE-FLOW-MASTER-PROMPT.txt`
- `06-projektdateien/flow-plan.json`
- die Einzelprompts unter `02-bilder/prompts/`

Der Masterprompt wird aus Thumbnail-Prompt, allen Szenenprompts und dem Flow-Plan gebaut. Er ist die eine Datei, die für die Medienproduktion in Google Flow verwendet wird.

## Phase 1 – Cover/Thumbnail zuerst

1. Zuerst genau **3 unterschiedliche Thumbnail-/Cover-Kandidaten** erzeugen.
2. Danach **STOPPEN**.
3. Keine Szenenbilder und keine Clips erzeugen, bevor der Nutzer einen Kandidaten ausgewählt hat.
4. Der gewählte Kandidat dient danach als **visuelle Referenz** für Qualitätsniveau, Illustrationssprache und Grundcharakter.
5. Die Szenen dürfen trotzdem individuell aufgebaut sein. Das Referenzbild darf nicht zu identischen Layouts oder immer gleichen Hintergründen führen.

## Phase 2 – Szenen streng nacheinander

Niemals alle Assets gleichzeitig erzeugen.

Für Beat 01:

1. Bildprompt ausführen.
2. Ergebnis prüfen.
3. bestes Bild auswählen und eindeutig benennen.
4. Nur wenn der Flow-Plan für diesen Beat `image-to-video` verlangt: das ausgewählte Bild als Ausgangsbild verwenden und daraus den KI-Clip erzeugen.
5. Erst danach mit Beat 02 fortfahren.

Dann Beat 02, Beat 03 usw. bis zum letzten Beat.

## Zwei erlaubte Ausgaben pro Beat

### `image`
Nur das finale 16:9-Bild wird im Video verwendet.

### `image-to-video`
Zuerst wird immer ein finales 16:9-Ausgangsbild erzeugt. Danach wird **genau dieses ausgewählte Bild** in Google Flow animiert.

Regeln für KI-Clips:

- maximal 10 Sekunden
- 16:9
- kein gesprochenes Dialog-Audio, keine Sprecher im Clip
- keine Lippen-Synchronisation
- keine neu erfundenen Texte oder Labels während der Animation
- sichtbarer Text bleibt ausschließlich Deutsch
- wissenschaftlicher Vorgang muss der Aussage des Beats entsprechen
- keine unnötige Kamerafahrt nur um Bewegung zu erzeugen
- lieber klare Prozessbewegung als dekorative Bewegung
- Ausgangsbild bleibt als Fallback und Referenz erhalten

## Mischungsverhältnis

Für normale Videos ist ein **gemischter Bild-/Video-Rhythmus** gewünscht. Richtwert:

- ungefähr 40–60 % statische Bilder
- ungefähr 40–60 % Google-Flow-KI-Clips
- Zielwert ungefähr 50/50

Das ist kein starres Quotenziel. Wenn eine Aussage als Bild klarer ist, bleibt sie ein Bild. Wenn eine zeitliche Veränderung, Bewegung oder ein Prozess das Verständnis deutlich verbessert, ist `image-to-video` sinnvoll.

## Benennung

Beispiele:

- `01-hook-final.png`
- `02-context-final.png`
- `03-context-final.png`
- `03-context-final.mp4`

Bild und zugehöriger Clip verwenden dieselbe Beat-ID.

## Bildwelt

Alle Ausgangsbilder folgen `BILDWELT.md`:

> Nicht einfach ein Bild vom Thema erzeugen. Eine visuelle Szene bauen, die genau die Aussage des Beats erklärt.

Die ganze 16:9-Fläche darf genutzt werden. Umgebung, technische Illustration, Cutaway, Vergleich, Detailansicht oder stilisierte Menschen werden nach Erklärnutzen gewählt. Sichtbarer Bildtext ist ausschließlich Deutsch.

## Remotion-Grenze

Remotion darf:

- finale Bilder anzeigen
- fertige Google-Flow-Clips abspielen
- harte Schnitte setzen
- Voice-over abspielen
- Untertitel anzeigen
- optionale SFX platzieren
- rendern

Remotion darf **nicht**:

- aus Standbildern selbst Ken-Burns-Bewegung erzeugen
- zoomen oder schwenken
- wissenschaftliche Prozesse selbst erfinden oder animieren
- Flow-Clips durch zusätzliche Effektanimationen verfälschen

## Pflicht vor Produktion

Vor dem Erzeugen der Medien müssen fertig sein:

1. Recherche und Quellen
2. Story-Struktur
3. finales Skript
4. visuelle Beats
5. Einzelprompts
6. `flow-plan.json`
7. `GOOGLE-FLOW-MASTER-PROMPT.txt`

Fehlt eines davon, ist die Medienproduktion noch nicht freigegeben.
