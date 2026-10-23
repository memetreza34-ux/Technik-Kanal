> **WISSONAUT – PRIORITÄT 1:** Nach jedem Video aus Bild-/Story-Fehlern und echten YouTube-Studio-Daten lernen. Vor jedem neuen Video eine messbare Verbesserung umsetzen. Verbindlich: `VERBESSERUNGSSYSTEM.md` und `../learning/active-lessons.json`.

# Kanal

Deutschsprachiger Faceless-Wissens- und Bildungskanal für **Alltagswissenschaft und Technik**. Zielgruppe sind vor allem Jugendliche und junge Erwachsene, die verständlich lernen sollen, wie Dinge aus ihrer Umgebung, Technik und Natur funktionieren.

## Kanalidentität

Der Kanal ist kein allgemeines Wissenschaftslexikon. Er konzentriert sich auf **greifbare, visuell erklärbare und lebensnahe Themen**.

Leitfrage für jedes neue Thema:

> Kann ein Jugendlicher ohne großes Vorwissen nach dem Video etwas verstehen, das er sehen, benutzen, erleben oder sich konkret vorstellen kann?

Wenn die Antwort nein ist oder erst viele abstrakte Grundlagen nötig wären, ist das Thema für den Kanal normalerweise ungeeignet.

## Bevorzugte Themenfelder

Besonders passend sind:

- Physik im Alltag
- Elektrotechnik und Elektronik
- Energie und Energieumwandlung
- Maschinen und technische Systeme
- Verkehr, Bahn, Autos und Mobilität
- Gebäude, Infrastruktur und Versorgung
- Materialien und Werkstoffe
- einfache, sichtbare Chemie mit Alltagsbezug
- Wetter und verständliche Naturphänomene
- technische Alltagsgegenstände und ihre Funktionsweise
- greifbare Astronomie, wenn das Thema ohne starke Abstraktion verständlich bleibt

Beispiele für passende Fragen:

- Warum fliegt ein Flugzeug?
- Warum schwimmt ein Stahlschiff?
- Wie funktioniert ein Transformator?
- Wie funktioniert ABS?
- Warum rostet Eisen?
- Wie funktioniert eine Wärmepumpe?
- Warum beschlägt eine Scheibe?
- Wie funktioniert ein Aufzug?
- Warum dehnt sich Metall bei Wärme aus?
- Wie entsteht ein Blitz?
- Wie funktioniert ein Akku?
- Warum löst eine Sicherung aus?

## Nicht Teil der Kanalrichtung

Biologie und medizinische Inhalte gehören **nicht** zur regulären Kanalidentität. Dazu zählen insbesondere:

- Anatomie
- Medizin
- Krankheiten
- Zellen und Zellbiologie
- DNA und Genetik
- Biochemie
- detaillierte Körperprozesse

Ebenfalls nicht als Schwerpunkt geeignet sind stark abstrakte Wissenschaftsthemen, die ohne umfangreiche Vorkenntnisse kaum greifbar sind, zum Beispiel:

- mathematisch schwere Quantenphysik
- abstrakte Teilchenphysik
- komplizierte Relativitätstheorie
- hochtheoretische Astrophysik

Astronomie ist erlaubt, wenn die Frage konkret, anschaulich und ohne lange theoretische Vorarbeit erklärbar ist.

## Ziel

Wissenschaft und Technik so erklären, dass Jugendliche und junge Erwachsene nach dem Video einen klaren Erkenntnisgewinn haben. Die Erklärung soll fachlich korrekt, visuell sofort verständlich, ordentlich aufgebaut und nicht unnötig akademisch sein.

## Aktives Videoformat

Aktuell produzieren wir **normale YouTube-Videos**, keine Reels.

Verbindlich ist `youtube-6to7min-v1`:

- normales YouTube-Video, kein Reel
- 16:9 / 1920×1080 / 30 fps
- 360–420 Sekunden (6–7 Minuten), 390 Sekunden ideal
- ungefähr 850–1075 Wörter, 975 ideal
- 44–64 visuelle Beats, 56 ideal
- Bildwechsel meist nach 4–7 Sekunden; über 8 Sekunden prüfen, ob ein weiteres Bild nötig ist (Konkurrenz mit Standbildern: Median 5,4–5,7 s, siehe `gehirn/KONKURRENZ-ANALYSE-2026-10-23.md`)
- separates 1280×720-Thumbnail mit drei Kandidaten
- deutsche Voice
- statische Bildszenen und harte Schnitte

Das 2-Minuten-Profil `youtube-2min-v1` (90–150 s, 230–370 Wörter, 12–28 Beats) ist **archiviert**. Es bleibt nur für die Testphasen-Videos vom 28.09.–04.10.2026 ladbar und wird für neue Videos nicht mehr verwendet. Längere Videos (8–12 Minuten) bekommen später ein eigenes Profil und entstehen nicht durch künstliches Strecken.

## Erzählstruktur

Die verbindliche Story-Logik steht in `LONGFORM.md`:

**Hook → Kontext → Grundlage → Mechanismus → Vertiefung → Payoff**

Der Anfang soll sofort die zentrale Frage öffnen. Spätestens innerhalb der ersten 30 Sekunden muss die eigentliche Erklärung begonnen haben.

## Produktionsprinzip

Die Bildwelt trägt die Erklärung. Remotion ist nur technische Montage- und Render-Schicht.

Ein visueller Beat entspricht **einer verständlichen visuellen Aussage**, nicht automatisch einem Satz. Ein komplizierter Satz darf mehrere Bilder benötigen; mehrere Sätze dürfen auf einem Bild bleiben, wenn dieselbe Sache erklärt wird.

Remotion darf keine eigenständigen visuellen Erklärungen, Prozessanimationen, Partikeleffekte, Parallaxen, Rotationen oder Übergangseffekte erzeugen.

**Bewegung und Musik (seit 18.10.2026):** Remotion legt eine **dezente virtuelle Kamera** über jedes Standbild – im Wechsel Zoom rein, Schwenk, Zoom raus, Schwenk (höchstens 4 % Zoom, 1,5 % Schwenk, nie ein leerer Rand). Die Bilder selbst bleiben statisch, Schnitte bleiben hart. Pro Szene abschaltbar mit `"cameraMove": "none"` im Szenenplan (z. B. bei Labels direkt am Bildrand). Dazu optional ein **leiser Musikteppich**: genau eine Datei in `01-script-audio/musik/` plus `QUELLE.txt` (Titel, Künstler, Quelle, Lizenz – empfohlen YouTube Audio Library). Die Pipeline normalisiert sie auf −30 LUFS (Stimme −16 LUFS), schleift sie auf Videolänge und blendet sie ein und aus. Ohne Quellenangabe wird nicht gerendert (Content-ID-Risiko). Grund: 6 Minuten Standbilder ohne Bewegung und Musik waren laut `ANALYSE-2026-10-18.md` das größte Risiko für die Zuschauerbindung. Wirkung ist eine Hypothese (`hyp-002`) und wird mit YouTube-Studio-Daten geprüft.

Zulässig sind nur:

- statische 16:9-Szenenbilder mit dezenter virtueller Kamera (Zoom/Schwenk)
- harte Schnitte zwischen Bildern
- Voice-over
- leiser Musikteppich mit Quellenangabe
- statische kontrollierte Text-Overlays, wenn fachlich notwendig
- Untertitel ohne Ein-/Ausfluganimation
- optionale semantische SFX
- technischer Export
