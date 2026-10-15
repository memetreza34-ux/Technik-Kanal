# Technik-Kanal

**Nur hier anfangen:** [START-HIER](START-HIER)

Pro YouTube-Video brauchst du nur `01-SKRIPT.txt` (kompletter Fließtext), `02-GOOGLE-FLOW-PROMPT.txt` (ein einziger Prompt für Cover und sämtliche Szenen) und `DATEIEN-HIER-REIN/` (alle fertigen Bilder und Stimme).

**Aktuelles Video:** [Warum sinkt ein riesiges Stahlschiff nicht?](START-HIER/warum-sinkt-ein-riesiges-stahlschiff-nicht)

Die intern benötigten Szenenpläne liegen unter `channels/science/YouTube/<wochenordner>/<video>`. Für den fertig gerenderten Film liegen im dortigen `05-export/` nur `video.mp4`, `cover.png` und `caption.txt` – keine zusätzlichen Unterordner.

`npm run technik:import -- "START-HIER/warum-sinkt-ein-riesiges-stahlschiff-nicht"` übernimmt die vorhandenen Assets sicher; `npm run science:finish -- "channels/science/YouTube/2026-10-12_bis_2026-10-18/01_Warum-sinkt-ein-riesiges-Stahlschiff-nicht"` rendert nach bestandenem Medien- und Qualitätscheck.

Alle internen Skripte, Quellen, technischen Bildprompts, Prüfberichte und Lernregeln bleiben erhalten. Nicht löschen. `main` ist der bisherige Elektrotechnik-Stand, gearbeitet wird im Branch `science-channel-v1`.

**Lokaler Altbestand:** Nach dem Aktualisieren des Branches `npm run technik:cleanup` ausführen. Der Befehl verschiebt alte, nicht von Git erfasste Medien aus `reels` nach `YouTube` und ordnet Video/Cover/Caption flach in `05-export` ein. Unterschiedliche vorhandene Dateien werden nicht überschrieben. Vor dem Ausführen kann `npm run technik:cleanup -- --check` die Migration prüfen.

**Lokal am Mac:** Den Finder-Ordner `Elektrotechnik-Kanal` bei geschlossenem Codex in `Technik-Kanal` umbenennen; danach Projekt erneut öffnen und den Branch aktualisieren.
