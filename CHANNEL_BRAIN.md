# Kanal-Gehirn: Elektrotechnik erklärt

## Positionierung

Deutschsprachiger Faceless-Lernkanal für verständliche Elektrotechnik, Elektronik, Messtechnik, Physik, Mathematik und technische Informatik.

## Eigenständiges Repository

Der Kanal wird seit dem 04.08.2026 als eigenes Repository geführt. `Dinge erklärt` gehört nicht in dieses Repository.

## Aktiver Reel

- Thema: `Warum fliegt die Sicherung raus?`
- Composition: `SicherungsReel`
- Pfad: `wochen/03.08.2026--09.08.2026/02-Dienstag/warum-fliegt-die-sicherung-raus/`

## Verbindliche Produktionsablage

```text
wochen/<montag--sonntag>/<wochentag>/<thema>/
```

In jedem Themenordner liegen getrennte Bereiche für Skript und Audio, Bildprompts und Bilder, Animationen, Caption, PDF und Quellen sowie Export und QA.

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

Vor jeder neuen Animation wird zuerst der Katalog geprüft. Existiert keine fachlich passende Komponente, wird die benötigte Animation passend neu erstellt, parametrisiert, kategorisiert, benannt, exportiert, katalogisiert und geprüft.

## Qualitätsgate

Keine finale Freigabe ohne fachlich geprüfte Quellen, finales Voice-over, TypeScript-Prüfung, Kontrollframes, vollständige Video- und Tonkontrolle sowie dokumentierte Nachanalyse.

## Sound

- keine Musik
- nur kurze funktionale SFX
- Voice-over bleibt dominant

## Sicherheit

- keine Anleitung zu Arbeiten unter Spannung
- keine Überbrückung oder Manipulation von Schutzeinrichtungen
- praktische Demonstrationen nur mit sicherer Kleinspannung
- bei Netzspannungsfehlern klare Grenze zur Elektrofachkraft
