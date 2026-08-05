# Animationsbibliothek

Diese Bibliothek enthält fachlich benannte, wiederverwendbare Remotion-/React-Animationen für den Elektrotechnik-Kanal.

## Verbindlicher Ablauf

1. Vor einer Neuentwicklung `CATALOG.md` prüfen.
2. Vorhandene Komponente über Props anpassen.
3. Fehlt eine fachlich passende Animation, sie passend zum Erklärmechanismus neu bauen.
4. Unter der richtigen Kategorie speichern.
5. Über Kategorie- und Root-`index.ts` exportieren.
6. Im Katalog dokumentieren.
7. TypeScript sowie Start-, Mittel- und Endzustand prüfen.
8. Erst danach im Reel verwenden.

## Kategorien

| Ordner | Inhalt |
|---|---|
| `protection/` | Leitungsschutz, FI/RCD, Sicherungen, Fehler und Abschaltung |
| `circuits/` | Strompfade, Schalter, Reihen-, Parallel- und Netzwerkschaltungen |
| `components/` | Elektrische und elektronische Bauteile |
| `measurement/` | Messgeräte, Messleitungen, Anzeigen und Messabläufe |
| `fields-signals/` | Elektrische/magnetische Felder, Wellen, Impulse und Signalfluss |
| `data-logic/` | Bits, Logik, PWM, digitale Zustände und Datenübertragung |
| `explanation-ui/` | Diagramme, Vergleiche, Lernkarten und Hervorhebungen |

## Namensschema

- Datei und Komponente: englisches PascalCase
- Name beschreibt den Mechanismus, nicht das einzelne Reel
- Endung bevorzugt `Animation`, `Diagram`, `Flow`, `Comparison` oder `Indicator`

Beispiele:

- `BreakerTripAnimation.tsx`
- `ParallelCircuitFlow.tsx`
- `CapacitorChargeDiagram.tsx`
- `MultimeterVoltageMeasurement.tsx`

## Technische Anforderungen

- typisierte Props
- Fortschritt vorzugsweise als Wert von `0` bis `1`
- keine fest eingebauten Reel-Frames
- keine hart kodierten Voice-over-Texte
- keine Abhängigkeit von einem bestimmten Reel- oder Medienordner
- fachlich sinnvolle Start-, Zwischen- und Endzustände
- auf 9:16 und Smartphone-Lesbarkeit ausgelegt
