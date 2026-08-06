# Visual Quality Gate

## Grundsatz

Hook, Skript, Bildstrategie, Realismus, Beschriftung und Animationsbudget müssen vor der Bild- und Audioerzeugung bestehen.

## Verbindliche Reihenfolge

1. direkte zentrale Frage formulieren
2. Skript mit 115–165 Wörtern erstellen
3. jede Szene als `image-only`, `mechanism-only`, `image-with-overlay` oder `static-overlay` klassifizieren
4. normalerweise ein bis drei, höchstens vier Vollanimationen planen
5. alle Szenenprompts inklusive Cover vollständig schreiben
6. jeden sichtbaren Bildprompt als semi-fotorealistische technische CGI mit realen Bauteilen formulieren
7. ausführen:

```bash
npm run electrical:preflight -- "<reel-ordner>"
```

8. erst bei `passed: true` Bilder und Audio erzeugen
9. Medien einfügen, rendern und visuell prüfen

## Realismus – harte Regel

Verboten sind:

- spielzeugartige oder kindliche 3D-Optik
- `stylized 3D editorial`
- Pixar-, Cartoon- oder Miniaturstil
- vereinfachte Fantasiebauteile
- futuristische Geräte ohne reales Vorbild
- zufällige Haushaltsgegenstände, die den Mechanismus nicht erklären
- übergroße Klemmen oder unrealistische Leiterquerschnitte
- Neonleitungen als Ersatz für reale Kabel

Gefordert sind:

- semi-fotorealistische technische CGI
- reale Proportionen
- plausible Metall-, Kupfer- und Isoliermaterialien
- erkennbare europäische Elektrobauteile
- ein reales Hauptobjekt pro Szene
- konsistente Kamera, Beleuchtung und Materialqualität

## Beschriftung

- KI-Bilder bleiben vollständig textfrei.
- Deutsche Beschriftungen kommen ausschließlich kontrolliert aus Remotion.
- Fachkürzel und Leiterbezeichnungen werden korrekt gesetzt, zum Beispiel `Neutralleiter (N)` und `Schutzleiter (PE)`.
- Der fertige Cover-Still enthält immer exakt den deutschen Hook.
- Das rohe KI-Coverbild darf niemals ohne den Hook veröffentlicht werden.

## Vollständigkeit der Prompts

`ALLE-BILDPROMPTS-MIT-COVER.txt` muss enthalten:

- den vollständigen Coverprompt
- jeden einzelnen Szenenprompt
- auch Referenzbriefings für `mechanism-only`-Szenen
- die klare Kennzeichnung, welche Szenen kein Nutzerbild benötigen

Der Preflight vergleicht die Einzeldateien mit der Gesamtdatei und blockiert fehlende Einträge.

## Weitere harte Blocker

- Hook ohne direkte Frage
- Hook länger als acht Wörter
- künstliche Hook-Metapher
- mehr als 165 Skriptwörter
- mehr als vier Vollanimationen
- Vollanimation im Hook
- zwei Vollanimationen direkt hintereinander
- Bild-plus-Mechanismus ohne Begründung
- Prompt ohne klares Hauptmotiv
- Prompt ohne obere oder untere Sicherheitszone
- sichtbarer KI-Text
- fehlender deutscher Cover-Hook
- unvollständige Gesamt-Promptdatei

## Visueller Standard

- starke realistische Bilder sind der Normalfall
- Mechanismus-Animation nur für echte zeitliche Abläufe
- `mechanism-only` verwendet eine ruhige Remotion-Fläche ohne zweites KI-Bild
- alle deutschen Texte und Labels werden in Remotion fehlerfrei gesetzt
