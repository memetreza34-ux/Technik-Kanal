# Elektrotechnik – Arbeitsregeln

Vor Änderungen zuerst lesen:

1. `gehirn/KANAL.md`
2. `gehirn/REELS.md`
3. `gehirn/BILDSTIL.md`
4. `engine/STATUS.md`
5. `engine/config/voice-v1.json`
6. `src/animation-library/CATALOG.md`
7. `skills/reel-fertigstellen.md`
8. den aktuellen Reel-Ordner unter `reels/`

## Verbindlich

- Fachliche Aussagen prüfen und Quellen dokumentieren.
- Keine Anleitung zum Arbeiten an Netzspannung.
- Vor neuen Animationen die Bibliothek prüfen.
- Fehlt eine passende Animation, neu bauen, kategorisieren, exportieren und katalogisieren.
- Ein Reel vollständig abschließen, bevor der nächste produziert wird.
- Reel-Struktur exakt nach dem FinanzNeo-Muster verwenden.

## Stimme und Synchronisation

- Voice-over immer exakt auf `1.10x` beschleunigen.
- Tonhöhe natürlich erhalten; Standardverarbeitung: FFmpeg `atempo=1.10`.
- Die unbearbeitete Aufnahme bleibt als Rohdatei erhalten.
- Erst die beschleunigte finale Audiodatei ist die verbindliche Zeitquelle.
- Transkription erfolgt ausschließlich lokal mit `whisper.cpp`; kein API-Key und kein Audio-Upload.
- Nach jeder Audioänderung echte Wort-Zeitstempel neu erzeugen und Szenen semantisch am Transkript ausrichten.
- Bildwechsel, Remotion-Animationen, Untertitel, SFX und Gesamtdauer müssen aus derselben finalen Audio-Zeitbasis entstehen.
- Untertitel: nur weiß, keine gelbe Hervorhebung, keine Hintergrundbox, maximal zwei Zeilen, ungefähr auf 76 % Bildhöhe.

## Ein-Befehl-Produktion

Wenn Roh-Audio und alle Szenenbilder im Reel-Ordner liegen, ist der verbindliche Startbefehl:

```bash
npm run elektro:finish -- "<reel-ordner>"
```

Der Ablauf muss selbstständig:

1. lokale Werkzeuge prüfen und `whisper.cpp` bei Bedarf einrichten,
2. Roh-Audio auf 1,10× verarbeiten,
3. lokale Wort-Zeitstempel erzeugen,
4. Voice-over und Szenenplan mit Mindesttrefferquote abgleichen,
5. jede Szene exakt ausrichten,
6. Bilder prüfen und in die Remotion-Runtime übernehmen,
7. Untertitel und vorhandene SFX synchronisieren,
8. TypeScript prüfen,
9. das MP4 rendern,
10. technische QA, Szenen-Stills und Kontaktbogen erzeugen.

Codex darf fehlende Dateien, falsche Bildformate, doppelte Bilder oder ein unpassendes Transkript nicht stillschweigend ignorieren. Es muss stoppen, den konkreten Fehler nennen und nach Behebung denselben Befehl erneut ausführen.
