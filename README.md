# Technik-Kanal

**Videos vorbereiten:** Öffne [START-HIER](START-HIER). Pro Video brauchst du genau zwei kopierbare Textdateien und einen Ordner für fertige Medien:

- `01-SKRIPT.txt` – kompletter deutscher Sprechertext als Fließtext.
- `02-GOOGLE-FLOW-PROMPT.txt` – **ein einziger Google-Flow-Prompt für Cover und alle 45 Szenenbilder**. Einmal vollständig kopieren, nicht fünf Dateien einzeln.
- `DATEIEN-HIER-REIN/` – hier alle 45 fertigen Szenenbilder, ein gewähltes Cover und die Sprachaufnahme ablegen.

**Aktuelles Video:** [Warum sinkt ein riesiges Stahlschiff nicht?](START-HIER/warum-sinkt-ein-riesiges-stahlschiff-nicht)

Nach dem Einfügen übernimmt `npm run technik:import -- "START-HIER/warum-sinkt-ein-riesiges-stahlschiff-nicht"` die Dateien ohne Überschreiben. Die bestehende technische Produktionspipeline bleibt erhalten; sie wird weiterhin über `npm run science:finish -- "channels/science/reels/2026-10-12_bis_2026-10-18/01_Warum-sinkt-ein-riesiges-Stahlschiff-nicht"` gestartet.

## Interner Bereich für Agenten und Renderer

`channels/`, `core/`, `scripts/` und `.github/` sind **interne Produktionsdateien**. Bitte nicht löschen; sie sichern Skript, Bildqualität, Asset-Zuordnung, Rendering und kontinuierliche Verbesserung.

**Verbindlich für jede neue Phase 1:** Nach dem erfolgreichen Preflight genau **eine** Skriptdatei und genau **eine** vollständige Flow-Promptdatei im jeweiligen START-HIER-Ordner erzeugen und den GitHub-Link schicken. Keine zusätzlichen Flow-Promptdateien oder getrennten Coverprompts für den Nutzer.

Das GitHub-Repository heißt bereits `Technik-Kanal`. Der lokale Mac-Ordner kann separat umbenannt werden.
