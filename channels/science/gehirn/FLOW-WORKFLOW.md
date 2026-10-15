## Phase 1 abgeschlossen – obligatorische GitHub-Kopiermappe

Nach fertiger Recherche, finalem Sprechertext, finalen Visual-Beats, Coverprompt, allen Einzelprompts und Google-Flow-Masterprompt ist folgender Abschluss **verbindlich**:

1. `npm run science:flow-master -- "VIDEO_ORDNER"` – finalen Bild-Masterprompt erzeugen/aktualisieren.
2. `npm run science:phase1 -- "VIDEO_ORDNER"` – bestehende Skript-, Quellen-, Kreativ- und Stil-Gates ausführen. Nur bei erfolgreichem Preflight wird `PHASE-1-START-HIER.md` erzeugt.
3. `PHASE-1-START-HIER.md`, finalen Szenenplan, den fertigen Sprechertext, den Masterprompt und alle Bildprompts nach GitHub committen/pushen.
4. **Sofort danach genau einen Direktlink auf die fertige `PHASE-1-START-HIER.md` im richtigen Branch schicken.** Nutzer soll am Laptop Skript/Prompts mit minimalen Klicks öffnen und kopieren können.
5. Erst dann Phase 1 als vollständig übergeben bezeichnen und Google Flow Phase 2 starten.

Die Kopiermappe enthält den kompletten Sprechtext aus `scene-plan.json`, den vollständigen Google-Flow-Masterprompt, die drei Cover-Kandidaten als Prompt und alle individuellen Bildprompt-Links; beides zusätzlich als kopierbare Textblöcke. Die Datei ersetzt weder die originalen Quellen noch die Sicherheitsregeln. Gibt es fehlende Prompts, Platzhalter oder einen veralteten Masterprompt, wird **nicht** so getan, als wäre Phase 1 fertig. **Kein GitHub-Link ohne tatsächlichen GitHub-Commit/Push.**

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
4. Informationsbudget festlegen
5. Text nur einsetzen, wenn er das Verständnis wirklich spart

Ein schönes Bild, das den gesprochenen Satz nicht klar erklärt, wird verworfen.

**Nur die Perspektive zu ändern zählt nicht als echte visuelle Vielfalt.** Wenn zwei benachbarte Beats praktisch dasselbe Bild brauchen, muss zuerst Skript/Beat-Plan verbessert werden.

## Verbindlicher Density-Lock

Normale Szenen:
- genau eine dominante Erkläridee
- bevorzugt ein Hauptobjekt
- höchstens 3 wichtige visuelle Elemente
- bevorzugt 0–1 kurzes deutsches Label
- absolut höchstens 2 Labels
- höchstens 2 Pfeile
- höchstens 2 Panels
- keine große Szenenüberschrift
- keine ganzen Textsätze
- keine schwebenden Infoboxen
- keine sekundären Mini-Diagramme
- nicht gleichzeitig viele Labels + Pfeile + Boxen + Zusatzgrafik

Vergleich/Diagramm/Zusammenfassung:
- höchstens 4 wichtige visuelle Elemente
- höchstens 3 kurze Labels
- höchstens 2 Panels
- weiterhin genau eine zentrale Aussage

Wenn diese Grenzen nicht reichen: **nicht quetschen**. Beat vereinfachen oder in zwei visuelle Aussagen teilen.

## Eine Masterdatei pro Video

Pflicht:
- `02-bilder/GOOGLE-FLOW-MASTER-PROMPT.txt`
- `06-projektdateien/flow-plan.json`
- Einzelprompts unter `02-bilder/prompts/`

Jeder Beat in `flow-plan.json` braucht zusätzlich ein `informationBudget` mit:
- `densityClass`
- `oneDominantIdea`
- `maxLabels`
- `maxPrimaryObjects`
- `maxPanels`
- `maxArrows`
- `largeHeadlineAllowed=false`
- `fullSentenceTextAllowed=false`

Ohne gültiges Informationsbudget darf der Flow-Masterprompt nicht gebaut werden.

## Phase 1 – Cover-Auswahl, danach separater Export

1. Zuerst genau drei Thumbnail-Kandidaten erzeugen.
2. STOPP und auf die ausdrückliche Nutzerauswahl warten – einziger Freigabepunkt.
3. Genau ein Cover auswählen, die zwei verworfenen Cover entfernen.
4. Gewinner als `00-thumbnail-final` ausschließlich nach `05-export/cover/` exportieren. **Cover darf niemals ins MP4-Video**.
5. **Szene 01 ist eine eigene normale Bildszene** zum ersten gesprochenen Hook, keine Fortsetzung oder Kopie des Covermotivs.
6. Danach genau fünf Bildschritte; automatisch mit Bildschritt 2 fortfahren und ohne weitere Stopps alle Bilder erzeugen.
7. Am Ende genau eine finale Google-Flow-Sammlung nur mit finalen Szenenbildern. Das Cover ist separat im Export und nicht Teil der Videoszenen.

### Visueller Rhythmus

6–7 Minuten: ungefähr 46 Bildbeats statt starrer 41. Wenn zwei Aussagen in einem Satz unterschiedliche Bilder erfordern, Skript/Beat vorab teilen. Bevorzugt 5–9 Sekunden pro Bild; über 10 Sekunden auf sinnvolle Teilung prüfen. Die fünf Bildschritte bleiben gleichmäßig verteilt, ohne Zwischenfreigabe.

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
- Informationsbudget des Beats einhalten
- jedes Bild prüfen und das beste Ergebnis auswählen
- Bild verwerfen, wenn es überladen wirkt oder mehrere visuelle Zentren hat
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
- Cover separat im Export behalten und alle abgelehnten Cover entfernen
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
- gewähltes Thumbnail nur als Export: `05-export/cover/`
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

## Verbindlicher Erklär-, Density- und Diversity-Check vor jedem Bild

Vor jedem Beat prüfen:
1. Erklärt dieses Bild exakt den aktuellen gesprochenen Inhalt?
2. Kann man die Hauptaussage in etwa 1–2 Sekunden erkennen?
3. Gibt es nur eine dominante Erkläridee?
4. Bleibt die Szene innerhalb ihres Informationsbudgets?
5. Ist die Hauptkomposition deutlich anders als beim vorherigen Bild?
6. Ist der primäre Bildanker anders oder wirklich anders erklärt?
7. Würde eine kurze deutsche Beschriftung das Verständnis verbessern?
8. Wird unnötiger Text/unnötige Technik vermieden?

Wenn 1–4 nicht erfüllt sind: Prompt vereinfachen oder Beat teilen.
Wenn 5–6 nicht erfüllt sind: Erklärform wechseln oder Skript/Beat-Plan ändern.

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
- normale Szenen bevorzugt 0–1, maximal 2 kurze Labels
- Vergleich/Diagramm/Zusammenfassung maximal 3 kurze Labels
- keine Textwand
- keine ganzen Erklärungssätze
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

> Nicht einfach ein Bild vom Thema erzeugen. Den aktuellen gesprochenen Satz mit der einfachsten passenden Illustration erklären — mit möglichst wenig Information im Bild.

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
6. Informationsbudget pro Beat
7. Einzelprompts
8. `flow-plan.json` mit 5 Schritten, Visual-Typ, Primärmotiv, `informationBudget` und Final-Collection-Regeln
9. `GOOGLE-FLOW-MASTER-PROMPT.txt`

**Freigabepunkt ist nur nach den drei Thumbnail-Kandidaten. Nach der Cover-Auswahl beginnt Szene 01 als eigenständiges Erklärbild; danach werden Bildschritt 1 bis 5 ohne Zwischenstopp fertiggestellt. Der Nutzer legt die akzeptierten Assets in Phase 2 ab; Phase 3 montiert ausschließlich diese vorhandenen Dateien.**
