# Wissonaut – Bildwelt und technische Erklärqualität

## Verbindliche Grundidee

Ein Bild soll **etwas vermitteln, das der Zuschauer durch Zuhören allein schlechter verstehen würde**. Fachlich richtige, klare, abwechslungsreiche Bilder haben Vorrang vor hübscher, aber austauschbarer Dekoration. Feedback vom Video »Warum sinkt ein riesiges Stahlschiff nicht?«: das visuelle Niveau ist konsistent, aber beschriftete technische Infografiken, Maßangaben, Kraftpfeile und klare Querschnitte fehlen teilweise. Auch mehrere Außenansichten ähnlicher Frachter sind redundant.

## Ein konsistenter Stil, viele Darstellungsformen

- **Technical Editorial Explainer 2.5D**: hochwertige ruhige redaktionelle Technikillustrationen, exakte Formen, matte Oberflächen, kontrollierte weiche Schatten und dezente Tiefe.
- Interner Kompatibilitäts-Identifier: `scientific-scene-explainer-v1` (Scientific Scene Explainer). Inhaltlich gilt ausschließlich Technical Editorial Explainer 2.5D.
- Farben je nach Thema: warmes Off-White, Graphit, neutrale Metalle; Blau für Wasser/Kälte, Kupfer/Orange für elektrische/thermische Vorgänge, weitere Signalfarben sparsam und semantisch.
- Geeignete Formen: 2D-Schema, Infografik, Schaltplan, Querschnitt, Explosionszeichnung, technische Prozesskette, Druck-/Kraftdiagramm, Vergleich gleicher Maßstäbe, Laboraufbau, Makro, reale Umgebung und 2.5D-Schnittmodell.
- Kein fester Hintergrund, kein dauernd wiederholtes Schiff/Objekt aus anderen Blickwinkeln. Kein identischer Bildaufbau für benachbarte Szenen. Keine leeren gesichtslosen Köpfe, Photoshop-Stock-Ästhetik, unnötige Stickmen oder wahllose Elemente.
- Menschen nur bei fachlichem Nutzen; keine gesichtslosen sichtbaren Köpfe – ein sichtbarer Kopf hat vollständige natürliche Gesichtszüge.
- **Das Cover ist nie Szene 01.** Video beginnt mit einer eigenen, normalen Illustration zum Sprechertext.
- Mindestens **7 deutlich unterschiedliche Darstellungsformen** pro 6–7-Minuten-Video.

## Wie viel technische Erklärung?

Leitsatz bleibt: **so wenig Information wie möglich, so viel wie nötig.** Bei technischen Erklärbildern ist „nötig“ oft mehr als ein Label – aber nie Dekoration.

Bei langen Videos als redaktionelle Planung ca. **35–50 % sinnvolle technische Schaubilder, beschriftete Cutaways, Diagramme, Vergleiche oder Infografiken** anstreben. Es gibt keine harte starre Quote: Manche Sätze brauchen eine reale Situation; andere einen klaren Querschnitt oder einen präzisen 2D-Plan. Niemals rein dekorative Diagramme einbauen, nur um eine Quote zu erfüllen.

Bevor Bilder erstellt werden, pro Beat notieren: **Was genau soll der Zuschauer im Bild erkennen?** Erst dann die geeignete Form, erforderliche Beschriftungen und Perspektive wählen. Wenn eine komplizierte Aussage mehr als ein klares Bild benötigt, Beat teilen statt unlesbare Minischrift hineinzupressen.

## Sichtbarer Text – ausdrücklich erlaubt und erwünscht, wenn er hilft

- Normale Szenen: meist 0–2, bei echtem Erklärbedarf **bis zu 3 klare deutsche Labels**.
- Technische Diagramme, Schaltpläne, Vergleiche, Querschnitte oder Infografiken: **bis zu 5 sinnvolle deutsche Labels**; dazu nötige Formeln, Einheiten, Dimensionslinien und Legenden. Bis zu 3 Panels und 4 fachlich korrekte Pfeile sind möglich, wenn sie zum Verständnisschritt gehören.
- Lesbarkeit auf dem Handy: große, kontrastreiche Beschriftungen, eindeutige Ankerlinien und genügend Abstand. Schreibweise und Physik prüfen, insbesondere Pfeilrichtung, Proportionen, Wasserstand, Schaltverbindungen und Werte. **Nie Zahlen erfinden.**
- Große Überschriften sind nur für echte erklärende Infografiken sinnvoll; keine künstlichen Titel auf allen Bildern. Sichtbare Sprache ausschließlich Deutsch, Produktionsmetadaten wie »Scene 14« oder Dateinamen niemals ins Bild.
- Vor dem Rendern liest das **OCR-Text-Gate** (`npm run science:image-text-qa`) jedes Szenenbild und blockiert Szenen-IDs, Abschnittsnamen und nicht verlangte große Schrift (siehe `FINAL-IMAGE-QA.md`).

## Beispiele für bessere Szenen

1. »Auftrieb gleicht Gewicht aus«: Rumpfquerschnitt mit zwei korrekt gerichteten Kraftpfeilen, gut lesbar **»Auftrieb«** / **»Gewicht«**, ruhiger blauer Bereich des verdrängten Wassers.
2. »Voll beladen liegt tiefer«: Zwei identisch skalierte Rumpfquerschnitte **»leer«** / **»beladen«**, deutliche Wasserlinien und sichtbarer Tiefgang.
3. »Ladung oben gefährdet Stabilität«: technische Doppelskizze mit Schwerpunktpunkten und klar markiertem **»Schwerpunkt«** sowie einer nachvollziehbaren Neigung.
4. »Ein Stromkreis schließt sich«: übersichtlicher Schaltplan und passendes 2.5D-Bauteil, markierte Leitungsführung statt beliebiger Kabeldekoration.
5. »Eine Kältemaschine transportiert Wärme«: vierstationiges Prozessschema mit passend gerichteten Pfeilen und verständlichen deutschen Kurzlabels.

## Bild passt zur Szene – Pflicht für neue Videos (`qualitaet-v2`)

Gesehen in den ersten Langvideos: Bei der Steckdose stand dieselbe Hügellandschaft in ~20 von 41 Bildern, und Stromzähler, LS- und FI-Schalter standen auf einer Wiese statt im Zählerschrank. Beim Schiff waren Auftrieb, Gewicht und verdrängtes Wasser graue Würfel und Pfeile ohne ein einziges Label. Bild 1 zeigte einen ruhigen Frachter statt des Widerspruchs aus dem Hook.

`science:creative-qa` prüft automatisch (Fehler bei `qualityRulesVersion: qualitaet-v2`, sonst Hinweis):

1. **Ort planen:** Jede Szene hat im Flow-Plan ein `setting` (englisch, z. B. „inside a home fuse box“, „harbor quay“, „school lab bench“). Geräte stehen an ihrem echten Ort. Der Flow-Prompt übernimmt das als `Setting:`-Zeile.
2. **Umgebung nicht endlos wiederholen:** dieselbe Umgebung höchstens 3-mal hintereinander und in höchstens 30 % der Bilder.
3. **Pfeile, Messungen und Vergleiche beschriften:** Diagramme, Vergleiche, Messungen und jedes Bild mit Kraftpfeilen brauchen mindestens 1 kurzes deutsches Label („Auftrieb“, „Gewicht“, „verdrängtes Wasser“).
4. **Bild 1 zeigt den Hook:** `hookAnchor.firstImage` steht wörtlich im Bildauftrag von Bild 1.

## Verbindlicher Ablauf

1. Erst prüfen, ob Fachinhalt und Hook stimmen, dann expliziten visuellen Erklärzweck pro Beat festhalten.
2. Style Lock bleibt konstant; der **Dichte-Lock hängt vom Visualtyp ab**: technischer Erklärinhalt darf mehr Informationen tragen als eine normale Umgebungsillustration.
3. **Ein einziges Google-Flow-Masterprompt** enthält Cover und alle Szenen. Flow erstellt erst drei Cover-Kandidaten und wartet einmal auf Nutzerauswahl; danach alle Szenen ohne Zwischenstopps.
4. Jedes erzeugte Bild sofort gegen aktuellen Sprechertext prüfen. Falsche oder unlesbare Labels, Physikfehler, doppelte Hauptmotive oder fehlende Szenen werden korrigiert.
5. Nur geprüfte finale Standbilder, keine KI-Videoclips. Nach Rendering komplettes Video bewerten und Erkenntnisse im Verbesserungssystem dokumentieren.

**Priorität 1 bleibt Lernen aus jedem Video:** richtige Hypothesen messen, nicht ungeprüft Erfolg versprechen. Änderungen an der Bildwelt sind auf technische Verständlichkeit gerichtet, nicht auf mehr dekoratives Chaos.
