# Abschluss der 2-Minuten-Testphase

Status: **abgeschlossen**.

Die Videos 01–05 dienten dazu, Story, Bildwelt, Google-Flow-Ablauf, Asset-Handoff, Remotion-Montage und QA praktisch zu testen. Die dabei gefundenen Fehler sind nicht nur bei einzelnen Videos korrigiert, sondern als dauerhafte Regeln und Regressionstests in der Pipeline verankert.

## Fehler, die nicht wieder auftreten dürfen

### 1. Szenen-/Produktionsmetadaten im Bild
Verboten sind sichtbare Inhalte wie:
- `Szene 10`
- `Scene 10`
- `Beat 10`
- `10-MECHANISM`
- `Bildschritt 3`
- Dateinamen wie `01-hook-final`

Produktionsmetadaten gehören nur in Plan/Prompt, niemals in das erzeugte Bild.

### 2. Thumbnail-Text in normalen Szenen
Eine Thumbnail-Schlagzeile darf nicht automatisch in Szene 01 oder spätere Szenen übernommen werden. Szene 01 darf das Hauptmotiv des gewählten Covers weiterführen, aber ohne große Thumbnail-Schrift und ohne unnötige Cover-Deko.

### 3. Falscher, leerer oder abgeschnittener Bildtext
Sichtbarer Text ist nur erlaubt, wenn der jeweilige Szenenprompt ihn ausdrücklich verlangt. Er muss:
- exakt dem angeforderten deutschen Wortlaut entsprechen,
- klein und unterstützend bleiben,
- vollständig im sicheren Bildbereich liegen,
- lesbar und unbeschädigt sein.

Falscher, leerer, abgeschnittener, erfundener oder korrumpierter Text = Bild verwerfen und neu erzeugen.

### 4. Zu volle Bilder
Eine normale Szene hat:
- eine dominante Aussage,
- bevorzugt ein Hauptobjekt,
- höchstens 3 wichtige visuelle Elemente,
- bevorzugt 0–1, maximal 2 kurze Labels,
- maximal 2 Pfeile,
- keine große Szenenüberschrift,
- keine Textsätze,
- keine unnötigen Infoboxen oder Mini-Diagramme.

Passt eine Aussage nicht in dieses Budget, wird der Beat vereinfacht oder geteilt.

### 5. Zu ähnliche Bilder
Nicht erlaubt:
- gleiche Hauptkomposition direkt hintereinander,
- nur einen Kamerawinkel ändern und dies als neue Bildidee zählen,
- Hook und Payoff praktisch identisch bauen,
- mehrere benachbarte Beats mit demselben Bildanker erzwingen.

Wenn das Skript zu ähnlichen Bildern führt, wird das Skript bzw. der Beat-Plan geändert, nicht nur der Prompt umformuliert.

### 6. Falsche Bildwelt
Aktiv bleibt **Technical Editorial Explainer 2.5D**:
- saubere 2D/2.5D-Erklärillustration,
- matte Materialien,
- klare Kanten,
- dezente Tiefe,
- erwachsene technische Gestaltung,
- kein Fotorealismus,
- kein Pixar-/Kinderstil,
- kein Sci-Fi-HUD,
- keine generische KI-Kunst.

Die Bildart darf je nach Aussage wechseln: Umgebung, Cutaway, Makro, Vergleich, Prozess, Draufsicht, Diagramm, Funktionsschema usw.

### 7. Falscher Google-Flow-Ablauf
Verbindlich:
1. drei Cover-Kandidaten,
2. STOPP und Nutzerauswahl,
3. zwei verworfene Cover entfernen,
4. gewähltes Cover als `00-thumbnail-final`,
5. danach fünf Bildschritte ohne weitere Zwischenfreigaben,
6. jedes Bild einzeln prüfen und final benennen,
7. Fehlversuche/Zwischenstände entfernen,
8. genau eine finale Flow-Sammlung mit finalen Assets.

Google Flow erzeugt nur statische Bilder, keine KI-Clips.

### 8. Phase 3 erzeugt keine Assets
Antigravity, Codex oder ein anderer Montage-Agent verwendet ausschließlich die vom Nutzer abgelegten Phase-2-Dateien. Er darf keine Bilder erzeugen, regenerieren, im Web suchen, ersetzen oder fehlende Szenen überspringen. Fehlendes/mehrdeutiges Asset = STOPP und konkret melden.

### 9. Keine eingebrannten Untertitel
Das finale Video hat keine eingebrannten Captions. Timing-, SRT-/VTT- und Caption-Dateien liegen direkt in `05-export/`; ein separater `03-caption`-Ordner ist verboten.

## Technischer Schutz

`npm test` enthält ab jetzt zusätzlich `validate:testphase-regressions`. Dieser Test blockiert Änderungen, die zentrale Testphasen-Fixes wieder entfernen würden, insbesondere:
- unsicheren Flow-Master-Builder,
- sichtbare Szenen-/Beat-Metadaten,
- Thumbnail-Headline-Leaks,
- gelockerten Density-Lock,
- direkt wiederholte Kompositionen,
- Wiedereinführung von `03-caption`.

## Nächste Produktionsphase

Nach Abschluss dieser Testphase wird nicht direkt auf 10 Minuten gesprungen. Der nächste sinnvolle Schritt ist **6–7 Minuten** mit dem vorbereiteten Profil `youtube-6to7min-v1`.

Zielwerte:
- 360–420 Sekunden, ideal ca. 390 Sekunden,
- ca. 850–1075 Wörter, ideal ca. 975,
- ca. 34–50 visuelle Beats, ideal ca. 42,
- gleiche Bildwelt und dieselben QA-/Flow-/Handoff-Regeln wie in der Testphase,
- mehr Laufzeit durch echte Erklärungstiefe und zusätzliche sinnvolle Mechanismus-/Beispiel-Beats, nicht durch Wiederholung oder Fülltext.

Erst wenn auch 6–7-Minuten-Videos stabil funktionieren, wird ein späteres 8–12-Minuten-Profil sinnvoll.
