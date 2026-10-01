# Wissenschafts-Reels — Produktionsvertrag

## Ordnerstruktur

Jeder Reel bleibt in der bestehenden Wochenstruktur:

```text
reels/YYYY-MM-DD_bis_YYYY-MM-DD/NN_Thema/
├── 01-script-audio/
├── 02-bilder/
│   ├── prompts/
│   └── images/
├── 03-caption/
├── 04-pdf/
├── 05-export/
│   └── video/
├── 06-projektdateien/
│   └── render/
└── README.md
```

## Themenrahmen

Der Kanal behandelt **greifbare Alltagswissenschaft und Technik für Jugendliche und junge Erwachsene**.

Bevorzugt werden Themen aus:

- Alltagsphysik
- Elektrotechnik und Elektronik
- Energie
- Maschinen und technische Systeme
- Verkehr, Bahn, Autos und Mobilität
- Gebäude, Infrastruktur und Versorgung
- Materialien und Werkstoffe
- einfacher Chemie mit sichtbarem Alltagsbezug
- Wetter und verständlichen Naturphänomenen
- greifbarer Astronomie mit klarer visueller Erklärung

Ein Thema ist besonders geeignet, wenn es sich ohne großes Vorwissen in kurzer Zeit konkret, anschaulich und visuell erklären lässt.

Nicht als reguläre Kanalthemen verwenden:

- Biologie
- Medizin
- Anatomie
- Krankheiten
- Zellen und Zellbiologie
- DNA und Genetik
- Biochemie
- stark abstrakte Quantenphysik
- abstrakte Teilchenphysik
- komplizierte Relativitätstheorie
- hochtheoretische Astrophysik

Leitfrage vor jedem Reel:

> Kann ein Jugendlicher ohne großes Vorwissen nach diesem Reel etwas verstehen, das er sehen, benutzen, erleben oder sich konkret vorstellen kann?

Wenn dafür erst viele abstrakte Grundlagen erklärt werden müssten, Thema verwerfen oder auf eine einfachere, greifbare Frage zuschneiden.

## Hook

- eine zentrale Frage
- sofort verständlich
- möglichst kurz
- erster gesprochener Satz stellt dieselbe Kernfrage
- keine künstliche Metapher
- Bild 01 ist gleichzeitig Coverquelle und erster visueller Shot

## Inhaltlicher Aufbau

- eine zentrale Frage pro Reel
- jede Szene erklärt genau eine neue Aussage
- adaptive Anzahl visueller Beats
- keine Szene nur zur Dekoration
- komplexere Aussagen dürfen auf mehrere Bilder aufgeteilt werden
- letzter Beat liefert Erkenntnis, Merksatz oder sauberen Abschluss
- Fachbegriffe nur verwenden, wenn sie direkt erklärt werden
- konkrete Ursache-Wirkung, Alltagssituationen und sichtbare Beispiele bevorzugen

## Bildplanung

Die verbindliche Bildwelt steht in `BILDWELT.md`.

Jeder Bildbeat wird aus dem konkreten Skriptsatz entwickelt. Nicht einfach ein Bild vom Thema erzeugen, sondern die passende visuelle Szene für genau diese Aussage bauen.

Dabei gilt:

- eine Hauptaussage pro Bild
- volle Umgebung/Ort nutzen, wenn das Verständnis dadurch besser wird
- wissenschaftliche Erklärung direkt in eine Szene integrieren, wenn sinnvoll
- technische Illustration, Cutaway, Mikroansicht, Vergleich oder reine Illustration verwenden, wenn diese Form besser erklärt
- stilisierte erwachsene Menschen sind erlaubt, wenn Alltag, Experiment, Größenvergleich oder Handlung relevant sind
- Hintergrund und Farben passend zum Inhalt wählen; kein fixer Hintergrund für alle Bilder
- Titel, Labels, Merksatz, Zahl, Fakt, Vergleich, Pfeile oder kurze Definition nur einsetzen, wenn sie wirklich helfen
- sichtbarer Bildtext ausschließlich auf Deutsch
- Text kurz halten; keine Informationswand
- bei KI-generiertem Text Rechtschreibung und fachliche Richtigkeit prüfen
- keine zufällige KI-Schrift, Logos oder Wasserzeichen
- Bild 01 ist zugleich erster Shot und Coverquelle
- keine Remotion-Kamerabewegung

Leitregel: **so wenig Information wie möglich, so viel wie nötig**.

## Remotion-Vertrag

Remotion erzeugt keine kreative Bildbewegung. Verboten sind Zoom, Pan, Ken Burns, Parallax, Rotation, Partikel, animierte Diagramme, animierte technische Prozesse und automatische Übergangseffekte.

Zulässig sind statische Szenenbilder, harte Schnitte, Voice-over, Untertitel ohne Bewegungsanimation, statische kontrollierte Overlays, optionale SFX und Export.

## Produktionsreihenfolge

1. Thema gegen den Kanalrahmen prüfen
2. zentrale Frage festlegen
3. fachliche Recherche und Quellen-IDs
4. fertiges deutsches Skript
5. Szenenplanung pro Skriptsatz
6. passende Darstellungsform nach `BILDWELT.md` wählen
7. Bildprompts erstellen
8. Preflight
9. Bilder erzeugen und Gewinner auswählen
10. Bildtext/Labels auf Deutsch prüfen
11. Voice-over
12. lokale Wortzeiten und Synchronisation
13. statische Montage
14. Untertitel und optionale SFX
15. Render-QA
16. visuelle und fachliche Endkontrolle

## Verbindliche Projektdateien

`06-projektdateien/` enthält mindestens `scene-plan.json`, `production-status.json`, `asset-manifest.json`, `content-package-report.json`, `ready-report.json`, `qa-report.json`, `sources.md` und `storyboard.md`.

## Abbruchregeln

Nicht rendern bei fehlender Voice, fehlendem Pflichtbild, unzureichender Wortübereinstimmung, unbelegten sicherheitsrelevanten Behauptungen, gefährlichen Anleitungen, falschem Bildformat, doppeltem Bild, falschem/englischem sichtbarem Bildtext, sichtbarer fehlerhafter KI-Schrift oder unzulässiger Remotion-Animation.
