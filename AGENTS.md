## Fehlervermeidung und verpflichtender Verbesserungszyklus – verbindlich ab der nächsten Videoproduktion

**Keine Korrektur des bereits exportierten Schiffs-Videos.** Seine Fehler sind ein Negativbeispiel für die nächste Produktion.

1. **Vor Phase 1:** `npm run science:learn -- start "<video-ordner>"` führt aktuelle Kanal-Lektionen, echte Messwerte und freigegebene qualitative Beobachtungen zusammen. In `06-projektdateien/learning-brief.json` müssen `thisVideoHypothesis`, `oneControlledChange`, `primarySuccessMetric` konkret ausgefüllt und `editorApproved` nach Prüfung auf `true` gesetzt sein. `science:preflight` stoppt sonst. Keine falschen Kausalversprechen.
2. **Flow-Bilder:** Weiterhin nur **eine** Nutzer-Promptdatei plus Fließtext-Skript im `START-HIER`-Ordner. Alle Flow-Szenen dürfen technische deutsche Beschriftungen enthalten, aber **niemals** Szenen-/Beatnummern, Dateinamen, englische Produktionsphasen oder unsinnige Fake-Werte (Beispiel `35 | DEEPENING`). Remotion darf **keine eigenen Szenen-Headlines oder Kickers mehr einblenden**. Cover bleibt getrennt.
3. **Nach Google Flow und vor Rendering:** `npm run science:asset-review -- init "<video-ordner>"` erstellt **intern** `06-projektdateien/asset-review.json`; alle Bilder tatsächlich ansehen, mit Sprechertext, Plausibilität, deutscher Beschriftung, Smartphone-Lesbarkeit, fehlenden Produktionsmetadaten und Bildvielfalt abgleichen. Für jedes geprüfte Bild die sechs Qualitätsfelder `true`, `status="approved"`, `reviewer` und `reviewedAt` nur **nach echter Sichtprüfung** setzen. Nicht blind freigeben. Datei-Hashes machen alte Freigaben nach Medienänderung ungültig. `science:ready`, `science:prepare` und `science:render` verweigern ungeprüfte Bilder. **Keine OCR- oder KI-Erkennung als garantiert behaupten:** die fachliche Text- und Bildprüfung benötigt eine echte Sichtung.
4. **Nach dem fertig gerenderten Video:** Szenen und Ton vollständig überprüfen. `npm run science:learn -- review "<video-ordner>"` erstellt eine interne Retrospektive `editorial-decisions.json`. Nur mit belegter Beobachtung, konkreter Maßnahme, Messziel und expliziter Freigabe wird sie ins nächste Video übernommen.
5. **Nach Veröffentlichung:** `06-projektdateien/youtube-analytics.json` mit echten YouTube-Studio-Zahlen bei 24h/72h/7d/28d füllen und `npm run science:learn -- report "<video-ordner>"` ausführen. Retention, CTR, Zuschauer und Abos vergleichbar beurteilen. Automatische Empfehlungen sind **Hypothesen**, keine nachgewiesenen Erfolge.
6. **Nächste Phase 1:** Alle aktiven Kanal-Lektionen, den letzten freigegebenen Qualitätsbefund und ggf. datengestützte Testhypothesen einlesen. Ein geplantes Experiment konsequent dokumentieren. Keine doppelte Prompt- oder Ordnerflut für den Nutzer.

> **Lokale einmalige Aufräumarbeit nach Wechsel auf den Science-Branch:** Erst prüfen, dass `channels/science/YouTube` aus dem neuen Branch existiert. Dann `npm run technik:cleanup -- --check`, danach `npm run technik:cleanup`. Bewahrt alte Medien aus dem vorherigen `reels`-Ordner, überführt sie sicher nach `YouTube` und legt fertige Video-/Cover-Dateien direkt unter `05-export` ab; keine Konflikte überschreiben. Niemals blind `git clean -fd` oder `rm -rf` auf Medienordner anwenden.

## Verbindliche Ordnernamen und sauberer Export

Das GitHub-Repository heißt **Technik-Kanal**. Unter `channels/science/` gibt es künftig **`YouTube/`** statt `reels/`; der alte Ordner `channels/elektrotechnik` ist im aktuellen Branch bereits entfernt. Ein lokaler Mac-Ordner mit dem Namen `Elektrotechnik-Kanal` muss am Mac selbst umbenannt und mit Git synchronisiert werden – GitHub ändert keinen Finder-Ordnernamen.

**`05-export/` enthält sichtbar ausschließlich:** `video.mp4`, `cover.png` (oder Bilddatei im Originalformat) und `caption.txt`. Keine Unterordner, Metadaten, SRT, Analytics oder Kontaktbögen an dieser Stelle. Alle technischen Hilfsdateien gehören nach `06-projektdateien/`.

**Nur zwei Kopierdateien:** `START-HIER/<slug>/01-SKRIPT.txt` und `02-GOOGLE-FLOW-PROMPT.txt`. Das Masterprompt enthält Cover und alle Bilder; alle fertigen Bilder und die Stimme werden unter `DATEIEN-HIER-REIN/` gesammelt.

## Bildwelt – Verbesserung aus dem Schiffs-Video

Premium **Technical Editorial Explainer 2.5D** mit technisch korrekten Querschnitten, Schnittmodellen, Funktionsschemas, Diagrammen, Vergleichstabellen und verständlichen Infografiken. Bei langen YouTube-Videos ungefähr **ein Drittel bis die Hälfte** der Bilder gezielt als technische Erklärung statt dekorative Außenansicht planen. **Beschriftungen sind ausdrücklich erwünscht**, wo sie echte Fragen beantworten: normale Szenen bis zu drei, komplexe technische Infografiken bis zu fünf kurze deutsche Labels sowie nötige Zahlen, Einheiten, Formeln, Legenden und Pfeile. Alles muss am Smartphone lesbar sein; niemals erfundene Werte, Fehler, englische Bildwörter oder winzige unlesbare Schriften. Kein starrer Pflichtmix: Illustration passend zum Sprechertext wählen. Die Kritik am letzten Video ist eine redaktionelle Beobachtung, noch kein Beweis für höhere Views.

## ABSOLUT VERBINDLICH: eine einzige Google-Flow-Promptdatei für den Nutzer

**Nutzeroberfläche pro Video ausschließlich `START-HIER/<video-slug>/` mit zwei Textdateien:** `01-SKRIPT.txt` (ein Fließtext ohne Kapitelüberschriften) und `02-GOOGLE-FLOW-PROMPT.txt` (**ein Prompt zum einmaligen Einfügen in Google Flow**, inklusive 3 Thumbnail-Kandidaten, STOPP bis Nutzer Cover wählt, alle Szenen mit Style-/Qualitätsregeln, korrekte Benennung und abschließende Prüfung). Daneben nur `DATEIEN-HIER-REIN/` für fertige Bilder/Voice.

**Niemals** `02-FLOW-COVER.txt`, `03-FLOW-BILDER-1.txt` bis `07-FLOW-BILDER-5.txt` oder andere zusätzliche Flow-Pakete im Nutzerordner erzeugen. Interne Master-, QA- und Szenenprompts bleiben für die Pipeline unter `channels/science` erhalten. `npm run science:phase1 -- "VIDEO_ORDNER"` erstellt die beiden Nutzerdateien nach bestandenem Preflight und löscht ausschließlich bekannte veraltete Nutzer-Promptpakete; danach beide Dateien nach GitHub committen/pushen und **den direkten GitHub-Link zum START-HIER-Ordner** schicken.

Beim Finish Bilder/Voice aus `DATEIEN-HIER-REIN` sicher importieren. Keine fehlenden Assets generieren oder überspringen, keine bestehenden abweichenden Medien überschreiben. Qualität und kontinuierliche Verbesserung bleiben Priorität 1.

# Wissonaut – Agentenregeln

## Priorität 1: Nach jedem Video messbar besser werden

Alle Agenten (ChatGPT, Codex, Claude und Antigravity) müssen vor jeder Wissonaut-Produktion zuerst channels/science/gehirn/VERBESSERUNGSSYSTEM.md und channels/science/learning/active-lessons.json berücksichtigen.

- Jedes neue Video erhält automatisch einen Lernbrief mit den Erkenntnissen aus früheren Videos. Vor dem Skript eine überprüfbare Hypothese, genau eine bewusst veränderte Sache und eine Primärmetrik festlegen.
- Nach dem Rendern wird die vollständige MP4 mit Ton und den Szenenbildern beurteilt; Stärken und konkrete Fehler in POST-VIDEO-REVIEW.md dokumentieren.
- Nach der Veröffentlichung echte Werte aus YouTube Studio nach 24 h, 72 h, 7 d und 28 d erfassen und mit npm run science:learn -- report VIDEO_ORDNER auswerten.
- Nur belastbare Erkenntnisse als dauerhafte Regel übernehmen; das nächste Video muss die relevanten Verbesserungen tatsächlich umsetzen.
- Keine erfundenen Daten, keine Kausalitätsbehauptungen aus einzelnen Kennzahlen, keine Garantie auf Views oder Abonnenten.

Weiterhin verbindlich: Technical Editorial Explainer 2.5D, fachliche Richtigkeit, Cover ist nicht Szene 01, Flow erzeugt nur statische Bilder, Montageagenten dürfen fehlende Bilder niemals selbst erzeugen.

Warnung: Science-Branch nicht ungeprüft in main mergen, da er sonst den ursprünglichen Elektrotechnik-Kanal ersetzt.

## Pflicht nach jeder fertigen Phase 1: EIN GitHub-Kopierlink

Mit `npm run science:phase1 -- "VIDEO_ORDNER"` werden Masterprompt und Qualitätsprüfungen automatisch ausgeführt. Nach erfolgreichem Abschluss entsteht im Videoordner `PHASE-1-START-HIER.md`: das komplette freigegebene Skript, sämtliche Google-Flow-Prompts inklusive Cover, fünf Bildschritte und Einzellinks. **Als Agent diese Datei samt Skript/Prompts auf GitHub committen/pushen und anschließend dem Nutzer sofort den direkten Link auf die konkrete Datei schicken**, nicht nur den Verzeichnisnamen oder eine lokale Datei. Der Link muss am Laptop ohne weitere Suche kopierbar sein. Ein Link auf eine nicht gepushte Datei ist verboten. Nicht als Phase 1 fertig melden, solange der Link nicht funktioniert. Details: `channels/science/gehirn/FLOW-WORKFLOW.md`.

