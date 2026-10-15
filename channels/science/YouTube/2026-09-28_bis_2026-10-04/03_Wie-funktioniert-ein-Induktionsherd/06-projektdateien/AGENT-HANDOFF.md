# Phase 3 – Agent-Handoff für „Wie funktioniert ein Induktionsherd?“

## Phase 2 – Nutzer liefert die Assets

Der Nutzer legt die final akzeptierten Dateien in diese Projektordner:

- Szenenbilder: `02-bilder/images/<scene-id>/`
- finales Thumbnail: `02-bilder/thumbnail/`
- Voice-over: `01-script-audio/audio/`

## Phase 3 – Antigravity / Codex / Montage-Agent

Der Agent darf ausschließlich diese vorhandenen Phase-2-Dateien verwenden.

Verboten:
- Bilder erzeugen oder regenerieren
- Google Flow für neue Bilder starten
- Bilder im Web suchen
- Platzhalter oder Ersatzbilder erstellen
- fehlende Szenen überspringen
- Image-to-Video oder KI-Clips erzeugen

Erlaubt:
- vorhandene Dateien prüfen
- vorhandene finale Dateien in Runtime-/Render-Ordner kopieren
- Voice synchronisieren
- harte Schnitte und optionale SFX setzen
- rendern und QA durchführen

## Stop-Regel

Fehlt ein benötigtes Asset oder ist die Auswahl mehrdeutig, muss der Agent **stoppen und die konkrete fehlende/unklare Datei melden**. Er darf den Fehler niemals selbst durch neue Assets beheben.
