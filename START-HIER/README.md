# Technik-Kanal – hier anfangen

**Nur diesen Ordner für die Produktion öffnen.** `channels/`, `core/`, `scripts/` und andere Dateien enthalten die interne Technik für Rendering, Qualität und Lernsystem. Bitte nicht löschen.

Öffne den Ordner deines aktuellen Videos. Darin findest du:
- `01-SKRIPT.txt` – genau **ein** vollständig kopierbarer deutscher Sprechertext als Fließtext.
- `02-FLOW-COVER.txt` – 3 Thumbnail-Ideen; erst Auswahl treffen.
- `03-FLOW-BILDER-1.txt` bis `07-FLOW-BILDER-5.txt` – fünf Google-Flow-Promptpakete mit allen Bildern.
- `DATEIEN-HIER-REIN/` – **ein einziger Ablageordner** für alle finalen Google-Flow-Bilder, Cover und deutsche Sprachaufnahme.

Die bereits vorhandene technische Projektstruktur unter `channels/science` bleibt für die automatisierte Montage erhalten, wird aber bei der normalen Bedienung nicht gebraucht.

**Ablage:** Szenenbilder eindeutig `01.png`, `02.png`, ... oder `01-hook-final.png` usw. benennen. Gewähltes Cover `00-thumbnail-final.png`. Stimme `voiceover-raw.wav`.

Nach dem Einfügen vom Repo-Hauptordner aus `npm run technik:import -- "START-HIER/warum-sinkt-ein-riesiges-stahlschiff-nicht"` ausführen. Danach nutzt `npm run science:finish -- "channels/science/reels/2026-10-12_bis_2026-10-18/01_Warum-sinkt-ein-riesiges-Stahlschiff-nicht"` die echten vorhandenen Bilder. Keine fehlenden Bilder erzeugen, ersetzen oder überspringen.

Der GitHub-Name ist bereits `Technik-Kanal`. Der **lokale Finder-Ordnername** kann unabhängig davon in `Technik-Kanal` umbenannt werden.
