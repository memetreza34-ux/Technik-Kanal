# Technik-Kanal

**Alles für neue Videos beginnt in [START-HIER](START-HIER).** Du brauchst sonst nichts zu öffnen.

Pro Video gibt es genau:
- `01-SKRIPT.txt` – ein durchgehender deutscher Sprechtext, fertig zum Kopieren.
- `02-FLOW-COVER.txt` – drei Thumbnail-Ideen.
- `03-FLOW-BILDER-1.txt` bis `07-FLOW-BILDER-5.txt` – fünf geordnete Bildprompt-Pakete.
- `DATEIEN-HIER-REIN/` – **ein** Ordner zum Einfügen aller finalen Bilder, des Covers und der Sprachaufnahme.

**Aktuelles Wissonaut-Video:** [Warum sinkt ein riesiges Stahlschiff nicht?](START-HIER/warum-sinkt-ein-riesiges-stahlschiff-nicht)

**Danach:** `npm run technik:import -- "START-HIER/warum-sinkt-ein-riesiges-stahlschiff-nicht"`. Wenn alle Bilder und der Ton vorliegen, kann die Montage `npm run science:finish -- "channels/science/reels/2026-10-12_bis_2026-10-18/01_Warum-sinkt-ein-riesiges-Stahlschiff-nicht"` ausführen.

## Nur für Codex und die Pipeline

`channels/`, `core/`, `scripts/`, `.github/` enthalten weiterhin interne Produktions-, Prüf- und Lerndateien. **Nicht löschen oder verschieben.** Der Renderer erwartet diese Struktur. Vor jeder neuen Produktion gilt die kontinuierliche Qualitätsverbesserung in `channels/science/gehirn/VERBESSERUNGSSYSTEM.md`.

Ein Phase-1-Agent erstellt die einfachen Kopierdateien über `npm run science:phase1 -- "VIDEO_ORDNER"`, prüft sie und stellt anschließend den GitHub-Link zum `START-HIER`-Videoordner bereit.

Das GitHub-Repository heißt bereits `Technik-Kanal`. Der Ordnername auf einem lokalen Mac ist davon unabhängig.
