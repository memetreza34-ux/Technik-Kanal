# Arbeitsregeln – Elektrotechnik-Kanal

## Pflichtlektüre

Vor Änderungen lesen:

1. `CHANNEL_BRAIN.md`
2. `OPENCODE_STATUS.md`
3. `REEL_STANDARD.md`
4. `src/animation-library/CATALOG.md`
5. die aktuelle Reel-Dokumentation unter `reels/`

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

## Animationsbibliothek – verbindlich

Vor dem Bau einer Animation immer zuerst `src/animation-library/CATALOG.md` und die passende Kategorie prüfen.

### Wenn eine passende Animation vorhanden ist

- vorhandene Komponente über Props anpassen
- keine nahezu identische Kopie im Reel anlegen
- fachliche Bedeutung der Animation nicht zweckentfremden

### Wenn keine passende Animation vorhanden ist

Die benötigte Animation sofort neu erstellen und anschließend dauerhaft in der Bibliothek speichern.

Pflichtablauf:

1. Den technischen Mechanismus so allgemein wie sinnvoll bauen.
2. Datei unter `src/animation-library/<kategorie>/` speichern.
3. Eindeutigen englischen PascalCase-Namen verwenden, zum Beispiel `BreakerTripAnimation.tsx`.
4. Texte, Farben, Werte, Größen, Zustände und Fortschritt über typisierte Props steuerbar machen.
5. Keine reel-spezifischen absoluten Timings, Dateipfade oder fest eingebauten Sprechtexte verwenden.
6. Komponente im Kategorie-`index.ts` und im Bibliotheks-`index.ts` exportieren.
7. Eintrag in `src/animation-library/CATALOG.md` ergänzen.
8. TypeScript prüfen und mindestens Start-, Mittel- und Endzustand visuell kontrollieren.
9. Erst danach im Reel verwenden.

Wiederverwendbare Animationen dürfen nicht dauerhaft als lokale Hilfskomponente in einer Reel-Datei verbleiben. Wird während der Reel-Produktion erkannt, dass eine lokale Animation auch für weitere Themen nutzbar ist, muss sie vor der finalen Freigabe in die Bibliothek verschoben werden.

### Kategorien

- `protection` – Schutzgeräte, Auslösung, Fehlerzustände, Abschaltung
- `circuits` – Strompfade, Reihen-/Parallelschaltung, Schalter und Netzwerke
- `components` – Widerstand, Kondensator, Diode, Transistor, Spule und weitere Bauteile
- `measurement` – Messgeräte, Messleitungen, Messabläufe und Anzeigen
- `fields-signals` – elektrische und magnetische Felder, Wellen, Impulse und Signalfluss
- `data-logic` – Bits, Logikgatter, digitale Zustände, PWM und Datenübertragung
- `explanation-ui` – Diagramme, Vergleiche, Lernkarten und technische Hervorhebungen

## Ablage

- Remotion-Reels: `src/`
- Animationsbibliothek: `src/animation-library/`
- Reels: `reels/`
- Medien: `public/`
- Render: `outputs/`
