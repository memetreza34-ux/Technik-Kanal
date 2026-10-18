## Fehlervermeidung und verpflichtender Verbesserungszyklus – verbindlich ab der nächsten Videoproduktion

**Keine Korrektur des bereits exportierten Schiffs-Videos.** Seine Fehler sind ein Negativbeispiel für die nächste Produktion.

1. **Vor Phase 1:** `npm run science:learn -- start "<video-ordner>"` führt aktuelle Kanal-Lektionen, echte Messwerte und freigegebene qualitative Beobachtungen zusammen. In `06-projektdateien/learning-brief.json` müssen `thisVideoHypothesis`, `oneControlledChange`, `primarySuccessMetric` konkret ausgefüllt und `editorApproved` nach Prüfung auf `true` gesetzt sein. `science:preflight` stoppt sonst. Keine falschen Kausalversprechen.
2. **Flow-Bilder:** Weiterhin nur **eine** Nutzer-Promptdatei plus Fließtext-Skript im `START-HIER`-Ordner. Alle Flow-Szenen dürfen technische deutsche Beschriftungen enthalten, aber **niemals** Szenen-/Beatnummern, Dateinamen, englische Produktionsphasen oder unsinnige Fake-Werte (Beispiel `35 | DEEPENING`). Remotion darf **keine eigenen Szenen-Headlines oder Kickers mehr einblenden**. Cover bleibt getrennt.
3. **Nach Google Flow und vor Rendering:** `npm run science:asset-review -- init "<video-ordner>"` erstellt **intern** `06-projektdateien/asset-review.json`; alle Bilder tatsächlich ansehen, mit Sprechertext, Plausibilität, deutscher Beschriftung, Smartphone-Lesbarkeit, fehlenden Produktionsmetadaten und Bildvielfalt abgleichen. Für jedes geprüfte Bild die sechs Qualitätsfelder `true`, `status="approved"`, `reviewer` und `reviewedAt` nur **nach echter Sichtprüfung** setzen. Nicht blind freigeben. Datei-Hashes machen alte Freigaben nach Medienänderung ungültig. `science:ready`, `science:prepare` und `science:render` verweigern ungeprüfte Bilder. **Keine OCR- oder KI-Erkennung als garantiert behaupten:** die fachliche Text- und Bildprüfung benötigt eine echte Sichtung.
4. **Nach dem fertig gerenderten Video:** Szenen und Ton vollständig überprüfen. `npm run science:learn -- review "<video-ordner>"` erstellt eine interne Retrospektive `editorial-decisions.json`. Nur mit belegter Beobachtung, konkreter Maßnahme, Messziel und expliziter Freigabe wird sie ins nächste Video übernommen.
5. **Nach Veröffentlichung:** `06-projektdateien/youtube-analytics.json` mit echten YouTube-Studio-Zahlen bei 24h/72h/7d/28d füllen und `npm run science:learn -- report "<video-ordner>"` ausführen. Retention, CTR, Zuschauer und Abos vergleichbar beurteilen. Automatische Empfehlungen sind **Hypothesen**, keine nachgewiesenen Erfolge.
6. **Nächste Phase 1:** Alle aktiven Kanal-Lektionen, den letzten freigegebenen Qualitätsbefund und ggf. datengestützte Testhypothesen einlesen. Ein geplantes Experiment konsequent dokumentieren. Keine doppelte Prompt- oder Ordnerflut für den Nutzer.

# Finale Bild-QA

Diese Prüfung gilt **nach jeder einzelnen Google-Flow-Bilderzeugung** und vor der Übernahme eines Bildes als final.

## 1. Sichtbarer Text

Für normale Szenen gilt ein harter Allowlist-Ansatz:

- Szenen-/Beat-Nummern dürfen **niemals** sichtbar im Bild stehen.
- Ebenfalls verboten: Szenen-IDs, Abschnittsnamen, Dateinamen, Bildschritt-Nummern, Asset-Namen und Produktionshinweise.
- Beispiele, die niemals im Bild auftauchen dürfen: `SZENE 10`, `SCENE 10`, `BEAT 10`, `10-MECHANISM`, `BILDSCHRITT 3`, `01-hook-final`.
- Nur Text, der im Einzelprompt ausdrücklich als sichtbarer Text verlangt wird, darf erscheinen.
- Thumbnail-Schrift darf nicht in normale Szenen übernommen werden.
- Wenn ein Szenenprompt keinen sichtbaren Text verlangt, muss das Bild komplett textfrei sein.

Angeforderte Labels:

- klein und unterstützend, niemals als große Überschrift
- vollständig innerhalb sicherer Bildränder
- exakt geschrieben
- nicht abgeschnitten
- keine leeren Label-Flächen
- keine erfundenen Zusatztexte

Ist ein Label falsch, leer, abgeschnitten, verzerrt oder wird daraus eine große Überschrift: **Bild verwerfen und neu erzeugen.**

## 2. Visuelle Wiederholung

Vor der Freigabe eines neuen Bildes immer mit den bereits finalisierten Bildern desselben Videos vergleichen.

Ein Bild wird verworfen, wenn es trotz anderem Prompt praktisch dieselbe Hauptkomposition wiederholt, zum Beispiel:

- gleicher Kühlschrankwinkel + gleicher großer Pfeil
- gleicher Objektaufbau mit nur anderer Beschriftung
- fast identische Vollansicht am Anfang und Ende
- gleiche Pfeilrichtung und gleiche Raumaufteilung ohne neuen visuellen Erklärwert

Ein anderer Kamerawinkel allein reicht nicht. Es muss sich die **Erklärform** sichtbar ändern.

Der Payoff darf die Hook-Idee wieder aufgreifen, aber nicht einfach das Hook-Bild kopieren. Er soll die gelernte Antwort visuell klarer oder reduzierter zeigen.

## 3. Komposition und Lesbarkeit

- Hauptaussage in unter einer Sekunde erkennbar
- keine abgeschnittenen wichtigen Elemente
- keine Texte am oberen/unteren Rand
- keine unnötigen weißen Leerflächen
- keine unlesbaren Mini-Details
- keine zusätzliche Deko ohne Erklärfunktion
- keine große Überschrift in normalen Szenen
- nur die im Informationsbudget erlaubten Labels, Pfeile und Panels

## 4. Automatisches OCR-Text-Gate

`science:ready` und `science:render` führen vor dem Rendern `scripts/science-image-text-qa.mjs` aus. Es liest jedes finale Szenenbild per `tesseract` (doppelte Größe, zwei Lesemodi) und **blockiert das Rendern**, wenn im Bild steht:

- eine Szenen-ID oder ein Abschnittsname (`28-mechanism`, `MECHANISM`, `DEEPENING` …) oder Produktionswörter (`Szene`, `Beat`, `Bildschritt`, `Thumbnail` …)
- große, nicht verlangte Schrift (Überschriften wie „WOHER KOMMT STROM?“)
- eindeutiger Text in einem Bild, das textfrei sein soll

Kleiner, nicht verlangter Text und von der OCR nicht gefundene Labels erscheinen als Hinweis im Report `06-projektdateien/image-text-qa-report.json`.

Getestet an den echten Bildern: Stahlschiff 5 von 45 Bildern blockiert (Szenen 27, 28, 35, 36, 44), Steckdose alle Bilder mit eingebrannten Überschriften blockiert, keine Fehlalarme bei den übrigen Schiff-Bildern.

Fehler werden nicht im Schnitt kaschiert: Bild in Google Flow neu erzeugen. Nur nach eigener Sichtprüfung darf ein Mensch eine Szene freigeben:

```bash
npm run science:image-text-qa -- "<video-ordner>" --accept=<szene-id>
```

Die Freigabe gilt nur für genau diese Bilddatei. Wird das Bild ersetzt, prüft das Gate wieder streng.

Voraussetzung auf dem Mac: `brew install tesseract tesseract-lang` (Deutsch-Paket für Umlaute).

## 5. Abnahme

Ein Bild darf nur `final` werden, wenn alle Punkte erfüllt sind. Bei Fehlern nicht nachträglich im Schnitt kaschieren, sondern das Bild in Flow neu erzeugen.
