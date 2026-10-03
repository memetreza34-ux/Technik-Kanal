# Google Flow – verbindlicher Bild-Workflow

Dieser Workflow gilt für jedes neue Video.

## Grundsatz

Google Flow erzeugt **ausschließlich statische Bilder**. Keine KI-Videoclips, kein Image-to-Video, keine bewegten Szenen.

Remotion montiert die Bilder mit Voice-over, optionalen SFX und harten Schnitten. **Keine eingebrannten Untertitel/Captions.**

## Oberste Bildregel

Jedes Bild muss den aktuellen Voice-over-Inhalt **so einfach und direkt wie möglich** erklären.

Vor jedem Prompt:
1. aktuelle Voice-over-Kernaussage in einem Satz festhalten
2. genau ein Hauptmotiv bestimmen
3. die einfachste passende Erklärform wählen
4. 0–3 kurze deutsche Labels nur dann einsetzen, wenn sie Verständnis sparen

Ein schönes Bild, das den gesprochenen Satz nicht klar erklärt, wird verworfen.

**Nur die Perspektive zu ändern zählt nicht als echte visuelle Vielfalt.** Wenn zwei benachbarte Beats praktisch dasselbe Bild brauchen, muss zuerst Skript/Beat-Plan verbessert werden.

## Eine Masterdatei pro Video

Pflicht:
- `02-bilder/GOOGLE-FLOW-MASTER-PROMPT.txt`
- `06-projektdateien/flow-plan.json`
- Einzelprompts unter `02-bilder/prompts/`

## Phase 1 – Thumbnail zuerst

1. genau 3 unterschiedliche Thumbnail-Kandidaten erzeugen
2. danach **STOPPEN**
3. noch keine Szenenbilder erzeugen
4. auf die ausdrückliche Nutzerauswahl warten
5. gewähltes Thumbnail als `00-thumbnail-final` übernehmen
6. die zwei nicht gewählten Thumbnail-Kandidaten löschen oder aus der finalen Flow-Sammlung entfernen
7. in der finalen Sammlung darf nur das ausgewählte Cover verbleiben

### Szene 01 nach Cover-Auswahl

Szene 01 soll **bevorzugt das Hauptmotiv des ausgewählten Covers fortführen**.

- gleiche zentrale Bildidee / gleiches Hauptmotiv
- große Thumbnail-Schlagzeile aus der Videoszene entfernen
- nur die Elemente behalten, die den ersten gesprochenen Satz erklären
- Szene 01 soll wie die natürliche Fortsetzung des Covers wirken
- Ausnahme nur, wenn das Cover den ersten Voice-over-Satz fachlich nicht klar darstellen kann

Das Cover ist danach weiterhin **keine starre Palette oder Layoutvorlage für alle späteren Szenen**.

## Phase 2 – genau 5 Bildschritte, ohne Zwischenstopps

Nach der Cover-Auswahl wird die Szenenbild-Produktion in genau fünf Schritte aufgeteilt. Die Beats werden möglichst gleichmäßig und in Reihenfolge verteilt.

Beispiel bei 15 Bildern:
- Bildschritt 1: 01–03
- Bildschritt 2: 04–06
- Bildschritt 3: 07–09
- Bildschritt 4: 10–12
- Bildschritt 5: 13–15

Beispiel bei 18 Bildern:
- Bildschritt 1: 01–04
- Bildschritt 2: 05–08
- Bildschritt 3: 09–12
- Bildschritt 4: 13–15
- Bildschritt 5: 16–18

### Innerhalb eines Bildschritts

- Bilder streng einzeln nacheinander erzeugen
- vor jedem Bild den gesprochenen Satz / Beat prüfen
- nur die minimale nötige Bildinformation zeigen
- jedes Bild prüfen und das beste Ergebnis auswählen
- mit dem vorherigen finalen Bild vergleichen
- wenn Hauptkomposition/Hauptidee zu ähnlich ist: andere Erklärform wählen, nicht nur anderen Winkel
- das finale Bild sofort korrekt benennen
- verworfene Varianten nicht in der finalen Sammlung behalten
- niemals mehrere Beats gleichzeitig erzeugen

### Zwischen den fünf Bildschritten

**Nach der Cover-Auswahl gibt es keine weiteren Stopps, Rückfragen oder Freigaben.**

Nach Abschluss von Bildschritt 1 **automatisch mit Bildschritt 2** fortfahren, danach automatisch 3, 4 und 5. Die fünf Schritte werden vollständig ohne Zwischenfreigabe abgearbeitet.

## Flow-Abschluss – finale Google-Flow-Sammlung aufräumen

Nach Bildschritt 5 wird vor dem Abschlussbericht aufgeräumt.

Verbindlich:
- genau eine finale Google-Flow-Sammlung / ein finaler Ordner pro Video
- nur das ausgewählte Cover behalten
- alle zwei verworfenen Cover entfernen
- Fehlversuche, Zwischenstände, doppelte Bilder und verworfene Varianten entfernen
- alle finalen Szenenbilder korrekt in Reihenfolge benennen
- keine Testbilder oder Alternativen in der finalen Sammlung belassen

Pflichtinhalt:
- `00-thumbnail-final`
- alle finalen Szenenbilder `01-...-final` bis zum letzten Beat

## Übergabe von Phase 2 an Phase 3

Nach der Flow-Produktion legt **der Nutzer** die final akzeptierten Dateien in die Projektordner:

- Szenenbilder: `02-bilder/images/<scene-id>/`
- gewähltes Thumbnail: `02-bilder/thumbnail/`
- Voice-over: `01-script-audio/audio/`

Diese Ordner sind die einzige verbindliche Quelle für Phase 3.

### Phase 3 – Antigravity / KI-Agent

Antigravity, Codex oder ein anderer Montage-Agent darf **keine Bilder selbst erzeugen, regenerieren, suchen oder ersetzen**.

Verboten:
- neue Bilder generieren
- Google Flow erneut zur Bilderzeugung starten
- Platzhalter erzeugen
- Bilder im Web suchen
- fehlende Bilder ersetzen
- Szenen automatisch überspringen
- KI-Clips erzeugen

Erlaubt:
- vorhandene Phase-2-Dateien prüfen
- vorhandene finale Dateien in Runtime-/Render-Verzeichnisse kopieren
- Voice synchronisieren
- harte Schnitte/SFX anwenden
- rendern und QA durchführen

Fehlt ein benötigtes Asset oder ist die Auswahl nicht eindeutig: **STOPP und konkret melden. Niemals selbst Ersatz erzeugen.**

Details: `AGENT-HANDOFF.md`.

## Verbindlicher Erklär- und Diversity-Check vor jedem Bild

Vor jedem Beat prüfen:
1. Erklärt dieses Bild exakt den aktuellen gesprochenen Inhalt?
2. Kann man die Hauptaussage in etwa 1–2 Sekunden erkennen?
3. Gibt es nur eine dominante Erkläridee?
4. Ist die Hauptkomposition deutlich anders als beim vorherigen Bild?
5. Ist der primäre Bildanker anders oder wirklich anders erklärt?
6. Würde eine kurze deutsche Beschriftung das Verständnis verbessern?
7. Wird unnötiger Text/unnötige Technik vermieden?

Wenn 1–3 nicht erfüllt sind: Prompt vereinfachen.
Wenn 4–5 nicht erfüllt sind: Erklärform wechseln oder Skript/Beat-Plan ändern.

Ziel:
- mindestens 5 unterschiedliche Darstellungsformen im Video
- keine identische Hauptkomposition direkt hintereinander
- derselbe dominante Bildanker höchstens 3-mal
- „Hand auf Gegenstand + Pfeile“ höchstens 3-mal als Hauptmotiv
- pro Bildschritt möglichst unterschiedliche Erklärformen

## Menschen und Gesichter

Wenn Menschen vorkommen:
- sichtbarer Kopf = vollständige natürliche stilisierte Gesichtszüge
- keine leeren/gesichtslosen Köpfe
- wenn Gesicht unnötig ist, Kopf komplett außerhalb des Frames lassen
- Menschen nur bei echtem Erklärnutzen

## Text in Szenenbildern

- sichtbarer Text nur Deutsch
- normale Szenen meist 0–3 kurze Labels
- Diagramme/Schaltpläne ausnahmsweise bis 5
- keine Textwand
- große Überschriften primär im Thumbnail
- keine eingebrannten Untertitel
- Labels direkt am erklärten Objekt platzieren

## Erlaubte Ausgabe

Pro Beat genau ein finales statisches 16:9-Bild.

Nicht erlaubt:
- KI-Videoclips
- Image-to-Video
- animierte Prozesse
- Zoom/Pan/Ken-Burns
- generierte Kamerafahrten

## Bildwelt

Alle Bilder folgen `BILDWELT.md` und `LONGFORM.md`.

Leitregel:

> Nicht einfach ein Bild vom Thema erzeugen. Den aktuellen gesprochenen Satz mit der einfachsten passenden Illustration erklären.

## Remotion-Grenze

Remotion darf statische Bilder anzeigen, harte Schnitte setzen, Voice-over abspielen, optionale SFX platzieren und rendern.

Remotion darf keine Untertitel/Captions ins finale Video rendern, keine Bewegung aus Standbildern erzeugen, nicht zoomen/schwenken, keine wissenschaftlichen Prozesse animieren und keine Videoclips erwarten.

Remotion darf in Phase 3 **nur vorhandene Phase-2-Assets** verwenden.

## Pflicht vor Produktion

Vor Bilderzeugung müssen fertig sein:
1. Recherche/Quellen
2. Story
3. finales Skript
4. Visualisierbarkeitsprüfung des Skripts
5. visuelle Beats
6. Einzelprompts
7. `flow-plan.json` mit 5 Schritten, Visual-Typ/Primärmotiv und Final-Collection-Regeln
8. `GOOGLE-FLOW-MASTER-PROMPT.txt`

**Freigabepunkt ist nur nach den drei Thumbnail-Kandidaten. Nach der Cover-Auswahl beginnt Szene 01 bevorzugt mit dem Cover-Hauptmotiv; danach werden Bildschritt 1 bis 5 ohne Zwischenstopp fertiggestellt. Der Nutzer legt die akzeptierten Assets in Phase 2 ab; Phase 3 montiert ausschließlich diese vorhandenen Dateien.**
