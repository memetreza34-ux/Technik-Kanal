# Wissenschafts-Videos — Produktionsvertrag

> Der Ordnername `reels/` und interne Namen wie `ScienceReel` bleiben vorerst nur aus Rückwärtskompatibilität bestehen. Das aktive Produkt ist ein normales 16:9-YouTube-Video.

## Ordnerstruktur

Jedes Video bleibt vorerst in der bestehenden Wochenstruktur:

```text
reels/YYYY-MM-DD_bis_YYYY-MM-DD/NN_Thema/
├── 01-script-audio/
├── 02-bilder/
│   ├── prompts/
│   ├── images/
│   └── thumbnail/
├── 03-caption/
├── 04-pdf/
├── 05-export/
│   └── video/
├── 06-projektdateien/
│   └── render/
└── README.md
```

## Aktives Produktionsprofil

`youtube-6to7min-v1`

- normales YouTube-Video, kein Reel
- 16:9 / 1920×1080 / 30 fps
- 360–420 Sekunden (6–7 Minuten), 390 Sekunden ideal
- ungefähr 850–1075 Wörter, 975 ideal
- **Bildzahl individuell pro Video:** so viele Bilder, wie das Script sichtbare Aussagen hat, auch über 100 oder deutlich weniger. Keine feste Zahl. Festlegen mit `npm run science:scenes -- "<video-ordner>" --anzahl=<N>`
- Bildwechsel meist nach 4–7 Sekunden; über 8 Sekunden prüfen, ob ein weiteres Bild nötig ist (Konkurrenz mit Standbildern: Median 5,4–5,7 s, siehe `gehirn/KONKURRENZ-ANALYSE-2026-10-23.md`)
- statische Bildszenen
- separates 1280×720-Thumbnail
- drei Thumbnail-Kandidaten

Das 2-Minuten-Profil `youtube-2min-v1` (90–150 s, 230–370 Wörter, 12–28 Beats) ist **archiviert**. Es bleibt nur für die Testphasen-Videos vom 28.09.–04.10.2026 ladbar und wird für neue Videos nicht mehr verwendet. Das spätere 8–12-Minuten-Format wird als eigenes Profil gebaut. Es darf nicht einfach durch Erhöhen der Wortzahl entstehen.

## Themenrahmen

Der Kanal behandelt **greifbare Alltagswissenschaft und Technik für Jugendliche und junge Erwachsene**.

Bevorzugt werden Alltagsphysik, Elektrotechnik/Elektronik, Energie, Maschinen, Verkehr/Mobilität, Gebäude/Infrastruktur, Materialien, einfache Alltagschemie, Wetter/Naturphänomene und greifbare Astronomie.

Nicht als reguläre Kanalthemen verwenden: Biologie, Medizin, Anatomie, Krankheiten, Zellbiologie, DNA/Genetik, Biochemie sowie stark abstrakte Quanten-/Teilchen-/Relativitäts- oder Astrophysik ohne klaren greifbaren Zugang.

Leitfrage:

> Kann ein Jugendlicher ohne großes Vorwissen nach diesem Video etwas verstehen, das er sehen, benutzen, erleben oder sich konkret vorstellen kann?

## Story-Struktur

Verbindlich nach `LONGFORM.md`:

1. Hook
2. Kontext
3. Grundlage
4. Mechanismus
5. Vertiefung
6. Payoff

Regeln:
- eine zentrale Frage pro Video
- Hook sofort verständlich, keine Begrüßung
- Titel/Thumbnail/Hook müssen dasselbe Versprechen geben
- spätestens in den ersten 30 Sekunden beginnt die eigentliche Erklärung
- Hauptteil als Ursache → Vorgang → Ergebnis aufbauen
- Vertiefung nur, wenn sie die Hauptfrage besser verständlich macht
- Schluss beantwortet die Ausgangsfrage klar
- Fachbegriffe direkt erklären
- keine Faktenliste ohne roten Faden

## Visuelle Beat-Planung

**Nicht:** ein Satz = ein Bild.

**Sondern:** eine verständliche visuelle Aussage = ein Beat.

- ein komplizierter Satz darf mehrere Bilder benötigen
- mehrere Sätze dürfen auf demselben Bild bleiben
- Bildwechsel dienen Verständnis, Rhythmus und Story
- keine Szene nur zur Dekoration
- komplexe Mechanismen dürfen in mehrere statische Schritte zerlegt werden

## Bildplanung

Die verbindliche Bildwelt steht in `BILDWELT.md`.

Jeder Beat wird aus der konkreten visuellen Aussage entwickelt. Nicht einfach ein Bild vom Thema erzeugen, sondern die verständlichste Szene für genau diesen Moment bauen.

Dabei gilt:
- volle Umgebung/Ort nutzen, wenn das Verständnis dadurch besser wird
- wissenschaftliche Erklärung direkt in die Szene integrieren, wenn sinnvoll
- technische Illustration, Cutaway, Detailansicht, Vergleich oder reine Illustration verwenden, wenn diese Form besser erklärt
- stilisierte erwachsene Menschen nur bei echtem Erklärnutzen
- Hintergrund und Farben passend zum Inhalt wählen
- Titel, Labels, Merksatz, Zahl, Fakt, Vergleich, Pfeile oder kurze Definition nur einsetzen, wenn sie wirklich helfen
- sichtbarer Bildtext ausschließlich auf Deutsch
- Text kurz halten; keine Informationswand
- bei KI-generiertem Text Rechtschreibung und fachliche Richtigkeit prüfen
- keine zufällige KI-Schrift, Logos oder Wasserzeichen
- keine Remotion-Kamerabewegung

Leitregel: **so wenig Information wie möglich, so viel wie nötig**.

## Thumbnail

Das Thumbnail ist **separat vom ersten Szenenbild**.

- 1280×720 / 16:9
- drei Kandidaten erstellen
- ein Gewinner manuell auswählen
- darf visuell zugespitzter sein als ein normaler Beat
- muss fachlich korrekt bleiben
- soll das Titelversprechen unterstützen, nicht wiederholen oder irreführen

## Remotion-Vertrag

Remotion legt nur eine dezente virtuelle Kamera über jedes Standbild (höchstens 4 % Zoom, 1,5 % Schwenk, im Wechsel). Verboten bleiben Parallax, Rotation, Partikel, animierte Diagramme, animierte technische Prozesse und automatische Übergangseffekte.

Zulässig sind statische Bilder mit dieser Kamera, harte Schnitte, Voice-over, ein leiser Musikteppich mit Quellenangabe, Untertitel ohne Bewegungsanimation, statische kontrollierte Overlays, optionale SFX und Export.

## Produktionsreihenfolge

1. Thema gegen den Kanalrahmen prüfen
2. zentrale Frage festlegen
3. Titel-/Thumbnail-Versprechen grob definieren
4. fachliche Recherche und Quellen-IDs
5. Story-Struktur aufbauen
6. vollständiges deutsches Skript
7. Skript in visuelle Aussagen/Beats zerlegen
8. Darstellungsform nach `BILDWELT.md` wählen
9. Bild- und Thumbnail-Prompts erstellen
10. Preflight
11. Bilder und drei Thumbnail-Kandidaten erzeugen
12. Gewinner auswählen und Bildtexte prüfen
13. Voice-over
14. lokale Wortzeiten und Synchronisation
15. statische 16:9-Montage
16. Untertitel und optionale SFX
17. Render-QA
18. visuelle und fachliche Endkontrolle

## Verbindliche Projektdateien

`06-projektdateien/` enthält mindestens `scene-plan.json`, `production-status.json`, `asset-manifest.json`, `content-package-report.json`, `ready-report.json`, `qa-report.json`, `sources.md` und `storyboard.md`.

## Abbruchregeln

Nicht rendern bei fehlender Voice, fehlendem Pflichtbild, unzureichender Wortübereinstimmung, unbelegten sicherheitsrelevanten Behauptungen, gefährlichen Anleitungen, falschem 16:9-Bildformat, doppeltem Bild, falschem/englischem sichtbarem Bildtext, sichtbarer fehlerhafter KI-Schrift, fehlendem Thumbnail-Plan oder unzulässiger Remotion-Animation.
