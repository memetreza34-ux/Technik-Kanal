# Reel: Warum fliegt die Sicherung raus?

## Ziel

Einsteiger verstehen den Unterschied zwischen **Überlast** und **Kurzschluss** sowie die beiden Auslösemechanismen eines Leitungsschutzschalters.

## Kernaussage

Der Leitungsschutzschalter schützt Leitungen vor zu hohem Strom:

- Überlast → thermische, zeitverzögerte Auslösung
- Kurzschluss → magnetische, sehr schnelle Auslösung

## Technische Daten

- Composition: `SicherungsReel`
- Format: 1080 × 1920
- Framerate: 30 FPS
- Dauer: 69 Sekunden
- visuelle Beats: 10
- Code: `src/SicherungsReel.tsx`
- Animationsbibliothek: `src/animation-library/`
- Audio: finale Iro-Aufnahme muss vor Veröffentlichung ergänzt werden

## Vollständiges Produktionspaket

### Sprechtext und Audio

- `01-script-audio/voiceover.md` – finaler Text mit Zeitfenstern und Betonung
- `01-script-audio/voiceover.txt` – sauberer Kopiertext
- `01-script-audio/captions.srt` – Untertitel für alle zehn Szenen
- `01-script-audio/sfx-plan.md` – genaue Effekte, Zeitpunkte und Dateinamen

### Konzept und Visuals

- `02-konzept/szenenplan.md` – grober Szenenablauf
- `02-konzept/animationsplan.md` – framegenaue Bewegungen und Bibliothekskomponenten
- `02-konzept/bildprompts.md` – zehn kopierfertige Bildprompts plus Cover-Prompt
- `02-konzept/asset-manifest.md` – vollständige Zielstruktur und Dateinamen

### Veröffentlichung

- `03-caption/caption.txt` – Haupt-Caption
- `03-caption/platform-posting.md` – Titel, angepinnter Kommentar, Keyword-Antwort, Cover-Text und Alt-Text

### Lernzettel und Quellen

- `04-quellen/quellen.md` – offizielle Quellen und abgeleitete Aussagen
- `04-quellen/lernzettel-inhalt.md` – vollständiger Inhalt des versprochenen Lernzettels
- `scripts/create_lernzettel.py` – erzeugt `outputs/lernzettel-sicherung.pdf`

### Produktion und Abnahme

- `05-produktion/status.md` – aktueller Stand
- `05-produktion/qa-checkliste.md` – vollständiges Qualitätsgate
- `05-produktion/export-anleitung.md` – Kontrollframes, PDF- und MP4-Export
- `.github/workflows/validate-reel.yml` – TypeScript, drei Kontrollframes und PDF als Workflow-Artefakt

## Sicherheitsgrenze

Keine Anleitung zum Arbeiten an Netzspannung. Bei wiederholtem Auslösen wird eine fachgerechte Prüfung empfohlen. Die Verteilung wird nicht geöffnet, und Schutzeinrichtungen werden nicht manipuliert.
