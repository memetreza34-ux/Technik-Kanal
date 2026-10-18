# Bildwelt — Technical Editorial Explainer 2.5D

> Die frühere visuelle Ausführung von „Scientific Scene Explainer“ ist ersetzt. Der alte interne Stil-Identifier `scientific-scene-explainer-v1` bleibt nur aus technischer Rückwärtskompatibilität bestehen. Inhaltlich gilt ausschließlich diese Bildwelt.

## Oberste Regel: erst erklären, dann gestalten

Jedes Szenenbild muss den gerade gesprochenen Inhalt **so einfach und direkt wie möglich** sichtbar machen.

Nicht fragen: „Was wäre ein schönes Bild zu diesem Thema?“

Sondern:

> „Was muss der Zuschauer in genau diesem Moment sehen, damit der gesprochene Satz sofort verständlich wird?“

Wenn ein Bild zwar gut aussieht, aber den Voice-over-Satz nicht klar erklärt, ist es falsch.

### Direkte Text-zu-Bild-Regel

Für jeden Beat vor dem Prompt festlegen:
1. **Kernaussage des Voice-over in einem kurzen Satz**
2. **ein Hauptmotiv**, das diese Aussage sichtbar macht
3. **eine Erklärform**: Umgebung, Querschnitt, Makro, Vergleich, Diagramm usw.
4. optional **0–1 kurzes deutsches Label**; zwei nur wenn zwingend nötig

Das Bild darf keine zweite große Aussage gleichzeitig erklären.

## Harte Informationsbudget-Regel

Leitsatz: **so wenig Information wie möglich, so viel wie nötig**.

Normale Szenen müssen visuell ruhig bleiben. Das ist kein Wunsch, sondern ein Produktionslimit.

### Normale Szene
- genau **eine dominante Erkläridee**
- bevorzugt **ein Hauptobjekt**
- insgesamt höchstens **3 wichtige visuelle Elemente/Objekte**
- bevorzugt **0–1 Label**, absolut höchstens **2 kurze Labels**
- höchstens **2 Pfeile**
- höchstens **2 Teilflächen/Panels**
- keine große Überschrift
- keine Textsätze im Bild
- keine schwebenden Infoboxen als Standard
- nicht gleichzeitig Labels + viele Pfeile + Infoboxen + Zusatzdiagramm verwenden

### Vergleich, Diagramm oder finale Zusammenfassung
Nur wenn die Aussage ohne diese Form schlechter verständlich wäre:
- höchstens **4 wichtige visuelle Elemente**
- höchstens **3 kurze Labels**
- höchstens **2 Panels**
- weiterhin nur **eine zentrale Aussage**
- jedes Element muss sofort erkennbar sein; keine Mini-Diagramme in den Ecken

### Wenn das Budget nicht reicht
Dann **nicht alles in ein Bild quetschen**.

Stattdessen:
1. Beat/Skript in zwei verständliche visuelle Aussagen teilen, oder
2. unwichtige Information weglassen, oder
3. eine einfachere Erklärform wählen.

**Ein überfülltes Bild wird nicht akzeptiert, auch wenn es fachlich korrekt ist.**

## Szene 01 ist unabhängig vom Cover

**Für alle neuen Videos:** Das Cover ist ausschließlich ein separates YouTube-Veröffentlichungsbild unter `05-export/cover/00-thumbnail-final.*`. Es gehört niemals als erstes Bild, Zwischenszene, Platzhalter oder Outro ins MP4. **Szene 01 ist ein normales, eigenständiges Erklärbild**, das allein auf dem gesprochenen Hook basiert. Niemals Cover-Komposition, großes Motiv oder Thumbnail-Schrift übernehmen.

## Bildwechsel nach Aussage, nicht nach starrer Zeit

Für 6–7 Minuten ca. 46 statische Erklärbeats anstreben; Anzahl flexibel, wenn die Story anderes verlangt. Bei neuer Ursache, neuem Prozessschritt oder wechselndem Voice-over-Thema neues Bild planen. 5–9 Sekunden pro Bild sind häufig passend; bei mehr als etwa 10 Sekunden prüfen, ob eine zusätzliche, fachlich sinnvolle Illustration nötig ist. Wiederholte Landschaften und gleiche Bilder mit neuer Überschrift sind zu verwerfen. Große automatische Szenenüberschriften sind verboten; kurze deutsche Labels nur wenn nötig.

## Format

- 1920×1080 / 16:9
- statische Szenenbilder
- Thumbnail separat in 1280×720
- gesamte Bildfläche sinnvoll nutzen

## Fester Style-Lock

Alle Bilder gehören zur gleichen visuellen Familie:

- moderne technische Editorial-Illustration
- sauberer **2D/2.5D vector-like Look**
- vereinfachte, glaubwürdige Proportionen
- matte Materialien statt Fotorealismus
- klare Formen und saubere Konturen
- dezente Gradients
- weiche kontrollierte Schatten
- moderate räumliche Tiefe
- konsistente Linienstärke
- erwachsen, professionell, ruhig
- technisch erklärend statt dekorativ

### Farbe

Grundfamilie:
- warmes Off-White / helles Beige für neutrale Flächen
- Graphit / Anthrazit für Technik und Linien
- gedeckte Industrietöne

Akzentfarben nur mit Bedeutung:
- Kupfer = Leiter/Spule
- Blau = Feld, Kälte, Luft, Wasser oder neutraler Energiepfad
- Orange/Rot = Wärme
- Grün = aktiv / korrekt / erkannt
- Gelb = Warnung / gezielter Fokus

**Kein fester Hintergrund für alle Bilder.** Die Umgebung und Grundfläche dürfen wechseln. Konstant bleiben Rendering, Materialvereinfachung, Linien, Schatten und Label-Stil.

## Was ausdrücklich nicht gewünscht ist

- Fotorealismus / echte Fotooptik
- hyperrealistische Küchen, Werkstätten oder Fahrzeuge
- generische KI-Kunst
- immer derselbe Herd / Topf / Gegenstand aus leicht anderer Perspektive
- immer dieselbe Türkis-/Weiß-Komposition
- weißes Schulbuch-/PowerPoint-Infografik-Template als Dauerlook
- Pixar-/Kinder-Cartoon
- Sci-Fi-HUD
- Neon-Glow als Hauptstil
- Fantasy-Partikel
- dekorative Effekte ohne Erklärfunktion
- überfüllte Erklärbilder mit mehreren gleich wichtigen Zentren
- Titel + mehrere Labels + Infoboxen + Pfeile gleichzeitig
- kleine Zusatzdiagramme, wenn das Hauptbild bereits genügt

## Erklärformen bewusst wechseln

Erlaubt und erwünscht:
1. vereinfachte Umgebungsszene
2. technischer Cutaway / Querschnitt
3. Explosionsdarstellung
4. Material-/Makroansicht
5. Objektvergleich
6. Prozessdarstellung
7. Draufsicht
8. Bauteil mit Callout
9. vereinfachtes Diagramm
10. Schaltplan / Funktionsschema
11. Mess-/Instrumentansicht
12. Vorher/Nachher
13. reduzierte Prozesskette / Zusammenfassung

Mindestens **7 deutlich unterschiedliche Darstellungsformen** pro 6–7-Minuten-Video.

### Wiederholungsregel

Wenn mehrere aufeinanderfolgende Voice-over-Beats praktisch dasselbe Bild benötigen würden, ist das **zuerst ein Skript-/Beat-Problem**.

Dann gilt:
- Skript oder Beat-Aufteilung ändern
- nicht nur Perspektive oder Farbe ändern
- keine künstliche Variation derselben Szene erzeugen

Keine identische Hauptkomposition direkt hintereinander. Derselbe dominante Bildanker höchstens 3-mal pro Video. „Hand auf Gegenstand + Pfeile“ höchstens 3-mal als Hauptmotiv.

## Text, Beschriftungen und Callouts

Text im Bild ist erlaubt, aber **sparsam**.

Drei Modi:
- **0 Labels**: bevorzugt, wenn das Bild sich selbst erklärt
- **1 Label**: Standard, wenn ein Begriff Orientierung spart
- **2 Labels**: nur wenn beide für den aktuellen Satz nötig sind
- **3 Labels**: ausschließlich bei echtem Vergleich, Diagramm oder Zusammenfassung

Regeln:
- sichtbarer Text ausschließlich **Deutsch**
- Google-Flow-Prompt selbst auf **Englisch**
- einzelne Begriffe oder sehr kurze Wortgruppen statt Sätzen
- keine eingebrannten Untertitel
- keine große Szenenüberschrift
- keine Textwand
- dünne Leader-Lines
- Text direkt am relevanten Objekt statt verstreute Infoboxen
- wenn zwei Labels reichen, niemals vier erzeugen

## Schaltpläne und Diagramme

Schaltpläne und Funktionsgrafiken sind erlaubt, wenn sie die Aussage einfacher erklären als eine Umgebungsszene.

- fachliche Richtigkeit vor Design
- klare technische Linien
- saubere Symbole
- warm-neutraler Hintergrund statt klinischem Reinweiß
- deutsche Bezeichnungen
- vereinfachte 2.5D-Bauteile dürfen mit 2D-Schema kombiniert werden
- kein dekorativer Ballast
- maximal zwei klar getrennte Funktionsbereiche/Panels
- maximal drei kurze Labels

Wenn ein exakter Schaltplan nicht sicher darstellbar ist, lieber eine einfache korrekte Funktionsdarstellung als falsche Verdrahtung.

## Menschen

Menschen nur bei fachlichem Nutzen.

- sichtbarer Kopf = vollständige natürliche stilisierte Gesichtszüge
- keine gesichtslosen sichtbaren Köpfe
- wenn ein Gesicht nicht gebraucht wird: Kopf komplett außerhalb des Frames
- keine Person als Dekoration

## Prompt-Sprache

Alle Google-Flow-Prompts werden **auf Englisch** geschrieben. Sichtbarer Bildtext bleibt **Deutsch**.

### Verbindlicher Style- und Density-Lock

```text
STYLE LOCK — Technical Editorial Explainer 2.5D
Keep the exact same visual language across the entire video: clean modern 2D/2.5D vector-like technical editorial illustration, simplified but believable proportions, matte materials, clean edges, subtle gradients, soft controlled shadows, consistent line weight, moderate depth, adult professional educational design. Do not use photorealism, real-photo aesthetics, generic AI art, white textbook infographic layouts, Pixar/cartoon styling, sci-fi HUDs or neon-heavy effects. Scene type, perspective and environment may change, but rendering language, material simplification, line quality, typography and callout design must remain consistent. The image must explain the current voice-over statement as directly and simply as possible. Visible text only in German.

DENSITY LOCK — Keep the scene visually sparse. One dominant explanatory idea. Prefer one main object and no more than three important visual elements in a normal scene. Prefer zero or one short German label; never exceed two in a normal scene. Use no more than two arrows and no more than two panels. No large scene headline, no full-sentence text, no floating info boxes, no secondary mini-diagrams. If the idea needs more information than this budget allows, simplify or split it into another beat instead of crowding the image.
```

## Qualitätsprüfung vor Freigabe

Ein Bild ist nur gut, wenn:
1. der aktuelle Voice-over-Satz dadurch sofort verständlicher wird
2. ein Zuschauer die Hauptaussage in ungefähr 1–2 Sekunden erfassen kann
3. genau eine dominante Erkläridee vorhanden ist
4. normale Szenen höchstens 3 wichtige visuelle Elemente enthalten
5. normale Szenen bevorzugt 0–1 und niemals mehr als 2 Labels enthalten
6. keine große Überschrift, Textwand oder unnötige Infobox vorkommt
7. die Technical-Editorial-2.5D-Bildwelt erhalten bleibt
8. es nicht fotorealistisch wirkt
9. es nicht wie eine generische Schulbuchseite wirkt
10. es sich sinnvoll vom vorherigen Beat unterscheidet
11. Labels kurz, korrekt und deutsch sind
12. keine gesichtslosen sichtbaren Köpfe vorkommen
13. der 16:9-Raum sinnvoll genutzt wird

Wenn nicht: **Prompt vereinfachen oder bei strukturellem Problem Skript/Beat-Plan teilen bzw. umschreiben, bevor das Bild übernommen wird.**
