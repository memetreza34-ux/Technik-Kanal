## Verbindliche Ordnernamen und sauberer Export

Das GitHub-Repository heißt **Technik-Kanal**. Unter `channels/science/` gibt es künftig **`YouTube/`** statt `reels/`; der alte Ordner `channels/elektrotechnik` ist im aktuellen Branch bereits entfernt. Ein lokaler Mac-Ordner mit dem Namen `Elektrotechnik-Kanal` muss am Mac selbst umbenannt und mit Git synchronisiert werden – GitHub ändert keinen Finder-Ordnernamen.

**`05-export/` enthält sichtbar ausschließlich:** `video.mp4`, `cover.png` (oder Bilddatei im Originalformat) und `caption.txt`. Keine Unterordner, Metadaten, SRT, Analytics oder Kontaktbögen an dieser Stelle. Alle technischen Hilfsdateien gehören nach `06-projektdateien/`.

**Nur zwei Kopierdateien:** `START-HIER/<slug>/01-SKRIPT.txt` und `02-GOOGLE-FLOW-PROMPT.txt`. Das Masterprompt enthält Cover und alle Bilder; alle fertigen Bilder und die Stimme werden unter `DATEIEN-HIER-REIN/` gesammelt.

## Bildwelt – Verbesserung aus dem Schiffs-Video

Premium **Technical Editorial Explainer 2.5D** mit technisch korrekten Querschnitten, Schnittmodellen, Funktionsschemas, Diagrammen, Vergleichstabellen und verständlichen Infografiken. Bei langen YouTube-Videos ungefähr **ein Drittel bis die Hälfte** der Bilder gezielt als technische Erklärung statt dekorative Außenansicht planen. **Beschriftungen sind ausdrücklich erwünscht**, wo sie echte Fragen beantworten: normale Szenen bis zu drei, komplexe technische Infografiken bis zu fünf kurze deutsche Labels sowie nötige Zahlen, Einheiten, Formeln, Legenden und Pfeile. Alles muss am Smartphone lesbar sein; niemals erfundene Werte, Fehler, englische Bildwörter oder winzige unlesbare Schriften. Kein starrer Pflichtmix: Illustration passend zum Sprechertext wählen. Die Kritik am letzten Video ist eine redaktionelle Beobachtung, noch kein Beweis für höhere Views.

## EIN Flow-Prompt – verbindliche Phase-1-Nutzerübergabe

Jede Phase 1 erzeugt im `START-HIER/<video-slug>/` **exakt zwei Nutzer-Textdateien**: `01-SKRIPT.txt` (Fließtext) und `02-GOOGLE-FLOW-PROMPT.txt` (eine einzige vollständig kopierbare Flow-Anweisung mit 3 Coverkandidaten und *allen* Szenen). Plus `DATEIEN-HIER-REIN/` für fertige Medien. **Keine fünf Flow-Pakete, kein separater Coverprompt, kein zweiter Flow-Master für den Nutzer.** Interne technische Einzelprompts dürfen bestehen bleiben.

Generator: `npm run science:phase1 -- "VIDEO_ORDNER"`. Der Master muss aktuell sein und Cover sowie alle Einzelprompts vollständig enthalten, sonst kein Erfolg. Nur nachdem beide neuen Dateien committet/gepusht sind, den direkten GitHub-Ordnerlink an den Nutzer senden. Bei Google Flow nach den Coverkandidaten einmal stoppen, dann alle Szenen ohne weitere Zwischenstopps.

## Phase 1 abgeschlossen – obligatorische GitHub-Kopiermappe

Nach fertiger Recherche, finalem Sprechertext, finalen Visual-Beats, Coverprompt, allen Einzelprompts und Google-Flow-Masterprompt ist folgender Abschluss **verbindlich**:

1. `npm run science:phase1 -- "VIDEO_ORDNER"` – dieser **eine Befehl** aktualisiert die Google-Flow-Einzelprompt-Locks und den Masterprompt, prüft Skript, Quellen, Kreativität und Stil. Nur bei erfolgreichem Preflight wird `PHASE-1-START-HIER.md` erzeugt.
2. Die zwei Nutzerdateien unter `START-HIER/<video-slug>` öffnen, besonders den einen Flow-Prompt auf Cover und sämtliche Szenen prüfen.
3. Die beiden Nutzerdateien `01-SKRIPT.txt` und `02-GOOGLE-FLOW-PROMPT.txt` nach GitHub committen/pushen; interne Quellen weiterhin speichern.
4. **Sofort danach den Direktlink auf den richtigen `START-HIER/<video-slug>`-Ordner im GitHub-Branch schicken.** Nutzer soll am Laptop Skript/Prompts mit minimalen Klicks öffnen und kopieren können.
5. Erst dann Phase 1 als vollständig übergeben bezeichnen und Google Flow Phase 2 starten.

Die Nutzerdatei `02-GOOGLE-FLOW-PROMPT.txt` enthält alle Cover- und Einzelbild-Anweisungen als **einen einzigen kopierbaren Prompt**; im Nutzerordner gibt es keine zusätzlichen Promptdateien. Die Datei ersetzt weder die originalen Quellen noch die Sicherheitsregeln. Gibt es fehlende Prompts, Platzhalter oder einen veralteten Masterprompt, wird **nicht** so getan, als wäre Phase 1 fertig. **Kein GitHub-Link ohne tatsächlichen GitHub-Commit/Push.**

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
- bevorzugt 0–2 kurze deutsche Labels
- absolut höchstens 3 Labels (Profil `youtube-6to7min-v1`)
- höchstens 2 Pfeile
- höchstens 2 Panels
- keine große Szenenüberschrift
- keine ganzen Textsätze
- keine schwebenden Infoboxen
- keine sekundären Mini-Diagramme
- nicht gleichzeitig viele Labels + Pfeile + Boxen + Zusatzgrafik

Vergleich/Diagramm/Zusammenfassung:
- höchstens 4 wichtige visuelle Elemente
- höchstens 5 kurze Labels
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

### Aufbau des Masterprompts (flow-master-v2, seit 18.10.2026)

Der Masterprompt wird ausschließlich mit `npm run science:flow-master -- "<video-ordner>"` erzeugt, nie von Hand geschrieben. Grund: Im Stahlschiff-Video standen „27 — MECHANISM“, „28-mechanism“ und „36 • DEEPENING“ in fünf fertigen Bildern. Jede Szene begann im alten Prompt mit ihrer Szenen-ID, und der Stilblock stand 46-mal im Prompt (121.000 Zeichen).

- STYLE LOCK, DENSITY LOCK und VISIBLE TEXT LOCK stehen **genau einmal** oben.
- Pro Szene nur: `BILD n VON N`, `Bildauftrag:` (der Satz hinter `EXACT VISUAL BRIEF —` aus dem Einzelprompt), Darstellungsform, `Setting:` (aus `setting` im Flow-Plan – wo das Bild spielt, Geräte an ihrem echten Ort), die verlangten Labels, das Budget und `Speichern als NN.png`.
- **Nie im Masterprompt:** Szenen-IDs (`27-mechanism`), Abschnittsnamen (hook, context, foundation, mechanism, deepening, payoff), Motiv-Slugs, `OUTPUT=…`-Kopfzeilen und der deutsche Sprechtext.
- Keine Beispielwörter für verbotene Metadaten in den Prompt schreiben – das Bildmodell schreibt sie sonst eher ab.
- Builder, Übergabe und Creative-QA brechen ab, wenn eine dieser Regeln verletzt ist.

## Phase 1 – Cover-Auswahl, danach separater Export

1. Zuerst genau drei Thumbnail-Kandidaten erzeugen.
2. STOPP und auf die ausdrückliche Nutzerauswahl warten – einziger Freigabepunkt.
3. Genau ein Cover auswählen, die zwei verworfenen Cover entfernen.
4. Gewinner als `00-thumbnail-final` ausschließlich nach `05-export/` exportieren. **Cover darf niemals ins MP4-Video**.
5. **Szene 01 ist eine eigene normale Bildszene** zum ersten gesprochenen Hook, keine Fortsetzung oder Kopie des Covermotivs.
6. Danach genau fünf Bildschritte; automatisch mit Bildschritt 2 fortfahren und ohne weitere Stopps alle Bilder erzeugen.
7. Am Ende genau eine finale Google-Flow-Sammlung nur mit finalen Szenenbildern. Das Cover ist separat im Export und nicht Teil der Videoszenen.

### Visueller Rhythmus

6–7 Minuten: ungefähr 56 Bildbeats. Wenn zwei Aussagen in einem Satz unterschiedliche Bilder erfordern, Skript/Beat vorab teilen. Bevorzugt 4–7 Sekunden pro Bild; über 8 Sekunden auf sinnvolle Teilung prüfen. Die fünf Bildschritte bleiben gleichmäßig verteilt, ohne Zwischenfreigabe.

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
- gewähltes Thumbnail nur als Export: `05-export/`
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
- vor dem Rendern prüft das **OCR-Text-Gate** (`npm run science:image-text-qa -- "<video-ordner>"`, automatisch in `science:ready` und `science:render`) jedes finale Szenenbild

## Erlaubte Ausgabe

Pro Beat genau ein finales statisches 16:9-Bild.

Nicht erlaubt:
- KI-Videoclips
- Image-to-Video
- animierte Prozesse
- generierte Kamerafahrten in Flow (die dezente Kamerabewegung macht ausschließlich Remotion)

## Bildwelt

Alle Bilder folgen `BILDWELT.md` und `LONGFORM.md`.

Leitregel:

> Nicht einfach ein Bild vom Thema erzeugen. Den aktuellen gesprochenen Satz mit der einfachsten passenden Illustration erklären — mit möglichst wenig Information im Bild.

## Remotion-Grenze

Remotion darf statische Bilder mit dezenter virtueller Kamera (höchstens 4 % Zoom, 1,5 % Schwenk) anzeigen, harte Schnitte setzen, Voice-over und einen leisen Musikteppich mit Quellenangabe abspielen, optionale SFX platzieren und rendern.

Remotion darf keine Untertitel/Captions ins finale Video rendern, keine wissenschaftlichen Prozesse animieren, keine Übergangseffekte erzeugen und keine Videoclips erwarten. Weil Remotion leicht zoomt, wichtige Labels nicht direkt an den Bildrand setzen (2 % Rand bleiben frei).

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
