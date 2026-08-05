# Reel-Standard – Elektrotechnik

## Grundsatz

Nicht Bildmenge oder Animationstyp entscheiden über die Qualität, sondern ob jede Szene den gesprochenen technischen Zusammenhang sofort verständlich macht.

## Aufbau

- 60 bis 75 Sekunden
- 9 bis 12 visuelle Beats
- ein Mechanismus pro Reel
- Hook in den ersten 2 Sekunden
- neue fachliche Information oder sichtbarer Zustandswechsel spätestens nach 3 bis 5 Sekunden
- CTA als eigener Abschluss

## Visuals

- Remotion-Animation, geprüfte Illustration oder Kombination sind gleichwertig
- Ursache und Wirkung müssen sichtbar werden
- keine langen Standbilder mit reinem Kamerazoom
- keine KI-Bilder mit fehlerhaften Bauteilen, Anschlüssen, Formeln oder Texten
- technische Labels und Werte kontrolliert in Remotion setzen
- höchstens zwei Informationsebenen gleichzeitig

## Animationsablauf

1. Voice-over-Aussage und benötigten sichtbaren Mechanismus bestimmen.
2. `src/animation-library/CATALOG.md` nach einer fachlich passenden Animation prüfen.
3. Vorhandene Animation über Props passend konfigurieren.
4. Fehlt die Animation, eine neue passende Komponente erstellen – nicht durch eine fachlich schwächere Ersatzanimation ausweichen.
5. Neue Komponente unter der richtigen Kategorie speichern, exportieren und katalogisieren.
6. Start-, Mittel- und Endzustand kontrollieren.
7. Erst danach in die Reel-Komposition einbauen und zum Voice-over synchronisieren.

## Anforderungen an neue Bibliotheksanimationen

- eindeutiger englischer PascalCase-Datei- und Komponentenname
- typisierte Props für Fortschritt, Text, Werte, Farben, Größen und relevante Zustände
- keine fest eingebauten Reel-Timings oder Voice-over-Sätze
- keine Abhängigkeit von einem bestimmten Reel-Ordner
- fachlich eindeutige Darstellung
- Smartphone-lesbare Dimensionen und Safe-Zones
- dokumentierter Eintrag im Katalog
- Export über Kategorie- und Root-`index.ts`

## Fachlichkeit

- Primärquellen dokumentieren
- Analogien ausdrücklich als Modelle kennzeichnen
- LSS, FI/RCD, Sicherung, Messgerät und andere Schutzgeräte nicht vermischen
- keine Anleitung zu gefährlichen Arbeiten

## Abnahme

- TypeScript fehlerfrei
- Kontrollframe aus jedem Beat
- Captions in der Safe-Zone
- Audio verständlich und synchron
- vollständiger Export angesehen
- Nachanalyse dokumentiert
- neue Animationen korrekt kategorisiert, exportiert und katalogisiert
