# Arbeitsregeln – Elektrotechnik-Kanal

## Pflichtlektüre

Vor Änderungen lesen:

1. `CHANNEL_BRAIN.md`
2. `OPENCODE_STATUS.md`
3. `REEL_STANDARD.md`
4. `src/animation-library/CATALOG.md`
5. `wochen/<aktuelle-woche>/<wochentag>/<thema>/00-START-HIER.md`

## Fachliche Regeln

- Formeln, Einheiten, Schaltungen, Schutzgeräte und Messverfahren vor Ausgabe prüfen.
- Primärquellen dokumentieren.
- Analogien ausdrücklich als Modelle kennzeichnen.
- Keine erfundenen technischen Angaben oder Quellen.
- Keine Anleitung zu Arbeiten an Netzspannung oder zum Manipulieren von Schutzeinrichtungen.

## Produktionsregeln

- Immer nur ein Reel gleichzeitig vollständig abschließen.
- Voice-over, Visualisierung, Captions und Timing gemeinsam planen.
- Jede Bewegung muss die aktuelle Aussage erklären.
- Maximal zwei Informationsebenen gleichzeitig.
- Kein neuer Reel vor TypeScript-Check, Kontrollframes, vollständigem Export und Nachanalyse.

## Verbindliche Wochenstruktur

Jeder Reel wird so abgelegt:

```text
wochen/<montag--sonntag>/<wochentag>/<thema>/
```

Innerhalb jedes Themenordners müssen mindestens diese Bereiche existieren:

```text
00-START-HIER.md
01-SKRIPT-UND-AUDIO/
02-BILDPROMPTS-UND-BILDER/
03-ANIMATIONEN/
04-CAPTION/
05-PDF-UND-QUELLEN/
06-EXPORT/
```

Sprachaufnahmen, SFX, generierte Bilder, PDFs und Exporte werden direkt im jeweiligen Themenordner abgelegt. Sie dürfen nicht lose im Root oder in einem anderen Kanalordner landen.

## Animationsbibliothek – verbindlich

Vor dem Bau einer Animation immer zuerst `src/animation-library/CATALOG.md` und die passende Kategorie prüfen.

### Wenn eine passende Animation vorhanden ist

- vorhandene Komponente über Props anpassen
- keine nahezu identische Kopie im Reel anlegen
- fachliche Bedeutung der Animation nicht zweckentfremden

### Wenn keine passende Animation vorhanden ist

1. Den technischen Mechanismus allgemein bauen.
2. Unter `src/animation-library/<kategorie>/` speichern.
3. Eindeutigen englischen PascalCase-Namen verwenden.
4. Texte, Farben, Werte, Größen, Zustände und Fortschritt über typisierte Props steuerbar machen.
5. Keine reel-spezifischen absoluten Timings oder fest eingebauten Sprechtexte verwenden.
6. In den Index-Dateien exportieren.
7. In `src/animation-library/CATALOG.md` dokumentieren.
8. TypeScript sowie Start-, Mittel- und Endzustand prüfen.
9. Erst danach im Reel verwenden.

### Kategorien

- `protection`
- `circuits`
- `components`
- `measurement`
- `fields-signals`
- `data-logic`
- `explanation-ui`

## Zentrale Ablage

- Wochenproduktionen: `wochen/`
- Remotion-Code: `src/`
- Animationsbibliothek: `src/animation-library/`
- technische Hilfsskripte: `scripts/`
- temporäre globale Render: `outputs/`
