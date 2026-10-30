# Vorlage für reguläre YouTube-Videos (16:9)

Durch `npm run youtube:new -- YYYY-MM-DD_thema "Titel"` einen neuen Projektordner erzeugen.

- `video.json`: kapitelweise echte Sprechertexte, Zeitdauern, Bildaussagen und Visual-Typen eintragen.
- `script-fliesstext.txt`: vollständigen Text in einem Stück, passend zu `video.json`.
- `bildprompts.txt`: nur benötigte Prompts für zusätzliche Bilder, nicht beliebige Füllbilder.
- `quellen.md`: Fakten, Quellen, Normen und Sicherheitsaspekte.
- `audio/voiceover.wav`: vollständige Aufnahme, muss zeitlich zum Kapitelplan passen.
- `export/`: nur `video.mp4`, `thumbnail.png` und `beschreibung.txt` als fertige Dateien.

Erst nach redaktioneller Prüfung `status: ready` setzen. Dann `npm run youtube:check -- videos/ORDNER` und `npm run youtube:render -- videos/ORDNER` ausführen. Technische QA allein ist keine Veröffentlichungsfreigabe.
