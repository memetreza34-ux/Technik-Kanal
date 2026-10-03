# Phase-2/Phase-3 Asset-Handoff

Diese Regel ist verbindlich für Antigravity, Codex und jeden anderen KI-Agenten, der nach der Google-Flow-Bildproduktion das Video vorbereitet oder rendert.

## Makro-Phasen

### Phase 1 – Planung

Recherche, Story, Skript, Beats, Flow-Plan, Thumbnail-Plan und Google-Flow-Prompts werden vorbereitet.

### Phase 2 – Nutzer erzeugt und legt finale Assets ab

Die finalen Bilder werden außerhalb des Montage-Agenten erzeugt und vom Nutzer in den Video-Ordner gelegt.

Verbindliche Ablage:
- Szenenbilder: `02-bilder/images/<scene-id>/`
- gewähltes Thumbnail: `02-bilder/thumbnail/`
- Voice-over: `01-script-audio/audio/`

Für jede Szene liegt in ihrem `imageDir` genau ein finales Bild oder bei mehreren Kandidaten genau ein eindeutig mit `final`, `approved` oder `freigabe` markiertes Bild.

**Der Nutzer kontrolliert Phase 2.** Die Phase-3-Agenten warten auf diese Dateien und behandeln sie als verbindliche Quelle.

### Phase 3 – Antigravity / KI-Agent montiert nur vorhandene Assets

Phase 3 darf **keine visuellen Assets selbst erzeugen**.

Verboten in Phase 3:
- Bilder generieren oder regenerieren
- Google Flow selbst zur Bilderzeugung starten
- Image-to-Video oder KI-Videos erzeugen
- fehlende Bilder durch Platzhalter ersetzen
- Bilder aus dem Internet oder aus anderen Quellen suchen/holen
- alternative Bilder erfinden
- fehlende Szenen automatisch überspringen
- ein vorhandenes Bild durch ein neu erzeugtes Bild ersetzen

Erlaubt in Phase 3:
- vorhandene Dateien aus den definierten Phase-2-Ordnern lesen
- Metadaten und Format prüfen
- vorhandene finale Bilder für den Runtime-/Render-Ordner kopieren
- Voice verarbeiten und synchronisieren
- harte Schnitte, SFX und Rendering ausführen
- QA-Berichte erzeugen

## Harte Stop-Regel

Fehlt ein benötigtes Bild, ist die Zuordnung mehrdeutig oder liegt kein eindeutiges finales Asset vor, muss Phase 3 **stoppen und den fehlenden/unklaren Dateinamen melden**.

Phase 3 darf den Fehler niemals durch eigene Generierung oder automatische Ersatzsuche beheben.

## Source-of-Truth

Für Phase 3 sind ausschließlich die vom Nutzer befüllten Projektordner die Quelle der Wahrheit:

- `02-bilder/images/`
- `02-bilder/thumbnail/`
- `01-script-audio/audio/`

Prompts und Flow-Pläne erklären, was erstellt werden sollte; sie sind in Phase 3 **keine Erlaubnis zur erneuten Asset-Erzeugung**.

## Grundsatz

> Phase 2 erstellt und liefert die Assets. Phase 3 verwendet nur diese Assets und montiert daraus das Video.
