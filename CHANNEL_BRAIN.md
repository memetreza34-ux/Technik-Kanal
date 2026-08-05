# Kanal-Gehirn: Elektrotechnik erklärt

## Positionierung

Deutschsprachiger Faceless-Lernkanal für verständliche Elektrotechnik, Elektronik, Messtechnik, Physik, Mathematik und technische Informatik.

## Aktiver Neustart

Der Kanal wird seit dem 04.08.2026 als eigenständiges Repository geführt. Frühere, als nicht veröffentlichungsfähig bewertete Reel-Wochen wurden nicht übernommen.

Aktiv ist genau ein Reel:

- `Warum fliegt die Sicherung raus?`
- Composition: `SicherungsReel`
- Pfad: `reels/2026-08-04-sicherung/`

## Produktionsstandard

- immer nur ein Reel gleichzeitig vollständig produzieren
- ein zentraler Mechanismus pro Reel
- 60 bis 75 Sekunden
- 9 bis 12 echte visuelle Beats
- sichtbare inhaltliche Veränderung spätestens nach 3 bis 5 Sekunden
- Visualisierung erklärt die Voice-over-Aussage
- keine dekorativen Dauerzooms
- technische Labels, Formeln, Werte und Markierungen kontrolliert in Remotion setzen
- externe Bilder nur nach fachlicher und visueller Einzelprüfung
- höchstens zwei Informationsebenen gleichzeitig
- Captions mindestens 260 px über der Unterkante und 150 px vom rechten Rand entfernt
- CTA als eigener Abschluss

## Verbindliche Animationsbibliothek

Die wiederverwendbare Bibliothek liegt unter `src/animation-library/`.

Vor jeder neuen Animation wird zuerst der Katalog geprüft. Existiert keine fachlich passende Komponente, wird die benötigte Animation passend zum aktuellen Erklärschritt neu erstellt. Danach wird sie:

- allgemein wiederverwendbar parametrisiert
- in der fachlich richtigen Kategorie gespeichert
- eindeutig benannt
- über die Index-Dateien exportiert
- im Bibliothekskatalog mit Zweck, Props und Status dokumentiert
- vor der Reel-Verwendung technisch und visuell geprüft

Neue Animationen dürfen nicht nur deshalb vereinfacht oder durch ein unpassendes vorhandenes Element ersetzt werden, weil sie noch nicht in der Bibliothek existieren. Fehlt eine benötigte Darstellung, wird die richtige Darstellung neu gebaut.

## Qualitätsgate

Keine finale Freigabe ohne fachlich geprüfte Quellen, finales Voice-over, TypeScript-Prüfung, Kontrollframes, vollständige Video- und Tonkontrolle sowie dokumentierte Nachanalyse.

Bei neuen Bibliotheksanimationen kommen zusätzlich hinzu:

- Start-, Mittel- und Endzustand geprüft
- Props und Kategorie dokumentiert
- Katalog und Exporte aktualisiert

## Sound

- keine Musik
- nur kurze funktionale SFX
- Voice-over bleibt dominant

## Sicherheit

- keine Anleitung zu Arbeiten unter Spannung
- keine Überbrückung oder Manipulation von Schutzeinrichtungen
- praktische Demonstrationen nur mit sicherer Kleinspannung
- bei Netzspannungsfehlern klare Grenze zur Elektrofachkraft
