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
4. optional **0–3 kurze deutsche Labels**, nur wenn sie Verständnis sparen

Das Bild darf keine zweite große Aussage gleichzeitig erklären.

## Erste Szene = Cover-Motiv

Nach der manuellen Cover-Auswahl soll Szene 01 **bevorzugt das gewählte Cover-Motiv übernehmen**.

Verbindlich:
- gleiche zentrale Bildidee / gleiches Hauptmotiv wie das gewählte Cover
- gleiche Illustrationssprache
- große Thumbnail-Schlagzeile entfernen oder stark reduzieren
- Szene 01 muss wie die natürliche Fortsetzung des Covers wirken
- nicht blind exakt dieselbe Datei verwenden, wenn die Thumbnail-Typografie die Videoszene stört

Ausnahme nur, wenn das Cover bewusst eine symbolische Idee zeigt, die den ersten gesprochenen Satz nicht verständlich darstellen kann.

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

## Erklärformen bewusst wechseln

Erlaubt und erwünscht:
1. vereinfachte Umgebungsszene
2. technischer Cutaway / Querschnitt
3. Explosionsdarstellung
4. Material-/Makroansicht
5. Objektvergleich
6. Prozessdarstellung
7. Draufsicht
8. Bauteil mit Callouts
9. vereinfachtes Diagramm
10. Schaltplan / Funktionsschema
11. Mess-/Instrumentansicht
12. Vorher/Nachher
13. reduzierte Prozesskette / Zusammenfassung

Mindestens **5 deutlich unterschiedliche Darstellungsformen** pro 2-Minuten-Video.

### Wiederholungsregel

Wenn mehrere aufeinanderfolgende Voice-over-Beats praktisch dasselbe Bild benötigen würden, ist das **zuerst ein Skript-/Beat-Problem**.

Dann gilt:
- Skript oder Beat-Aufteilung ändern
- nicht nur Perspektive oder Farbe ändern
- keine künstliche Variation derselben Szene erzeugen

Keine identische Hauptkomposition direkt hintereinander. Derselbe dominante Bildanker höchstens 3-mal pro Video. „Hand auf Gegenstand + Pfeile“ höchstens 3-mal als Hauptmotiv.

## Text, Beschriftungen und Callouts

Text im Bild ist **erlaubt und erwünscht, wenn er das Verständnis wirklich verbessert**.

Drei Modi:
- **0 Labels**: Bild erklärt sich vollständig selbst
- **1–3 Labels**: Standard bei technischen Erklärbildern
- **4–5 Labels**: nur bei komplexen Diagrammen/Schaltplänen

Regeln:
- sichtbarer Text ausschließlich **Deutsch**
- Google-Flow-Prompt selbst auf **Englisch**
- kurze Begriffe statt Sätze
- keine eingebrannten Untertitel
- keine große Szenenüberschrift als Standard
- dünne Leader-Lines
- kleine ruhige Label-Flächen
- Text direkt am relevanten Objekt statt verstreute Infoboxen

Beispiele guter Labels:
- „Kupferspule“
- „Magnetfeld“
- „Topfboden“
- „Wirbelströme“
- „Wärme“

## Schaltpläne und Diagramme

Schaltpläne und Funktionsgrafiken sind erlaubt, wenn sie die Aussage einfacher erklären als eine Umgebungsszene.

- fachliche Richtigkeit vor Design
- klare technische Linien
- saubere Symbole
- warm-neutraler Hintergrund statt klinischem Reinweiß
- deutsche Bezeichnungen
- vereinfachte 2.5D-Bauteile dürfen mit 2D-Schema kombiniert werden
- kein dekorativer Ballast

Wenn ein exakter Schaltplan nicht sicher darstellbar ist, lieber eine einfache korrekte Funktionsdarstellung als falsche Verdrahtung.

## Menschen

Menschen nur bei fachlichem Nutzen.

- sichtbarer Kopf = vollständige natürliche stilisierte Gesichtszüge
- keine gesichtslosen sichtbaren Köpfe
- wenn ein Gesicht nicht gebraucht wird: Kopf komplett außerhalb des Frames
- keine Person als Dekoration

## Prompt-Sprache

Alle Google-Flow-Prompts werden **auf Englisch** geschrieben. Sichtbarer Bildtext bleibt **Deutsch**.

### Verbindlicher Style-Lock

```text
STYLE LOCK — Technical Editorial Explainer 2.5D
Keep the exact same visual language across the entire video: clean modern 2D/2.5D vector-like technical editorial illustration, simplified but believable proportions, matte materials, clean edges, subtle gradients, soft controlled shadows, consistent line weight, moderate depth, adult professional educational design. Do not use photorealism, real-photo aesthetics, generic AI art, white textbook infographic layouts, Pixar/cartoon styling, sci-fi HUDs or neon-heavy effects. Scene type, perspective and environment may change, but rendering language, material simplification, line quality, typography and callout design must remain consistent. The image must explain the current voice-over statement as directly and simply as possible. Visible text only in German and only when it improves understanding.
```

## Informationsdichte

Standard: **so wenig Information wie möglich, so viel wie nötig**.

Vermeiden:
- Titel + viele Labels + Infobox + Formel gleichzeitig
- dekorative Pfeile
- dieselbe Aussage mehrfach im Bild
- unnötige Objekte
- technische Details, die der Voice-over an dieser Stelle noch gar nicht erklärt

## Qualitätsprüfung vor Freigabe

Ein Bild ist nur gut, wenn:
1. der aktuelle Voice-over-Satz dadurch sofort verständlicher wird
2. ein Zuschauer die Hauptaussage in ungefähr 1–2 Sekunden erfassen kann
3. genau eine dominante Erkläridee vorhanden ist
4. die Technical-Editorial-2.5D-Bildwelt erhalten bleibt
5. es nicht fotorealistisch wirkt
6. es nicht wie eine generische Schulbuchseite wirkt
7. es sich sinnvoll vom vorherigen Beat unterscheidet
8. Labels kurz, korrekt und deutsch sind
9. keine gesichtslosen sichtbaren Köpfe vorkommen
10. der 16:9-Raum sinnvoll genutzt wird

Wenn nicht: **Prompt oder bei strukturellem Problem das Skript/den Beat-Plan überarbeiten, bevor das Bild übernommen wird.**
