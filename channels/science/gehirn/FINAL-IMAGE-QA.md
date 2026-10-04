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

## 4. Abnahme

Ein Bild darf nur `final` werden, wenn alle Punkte erfüllt sind. Bei Fehlern nicht nachträglich im Schnitt kaschieren, sondern das Bild in Flow neu erzeugen.
