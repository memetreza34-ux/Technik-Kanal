# Elektrotechnik – Arbeitsregeln

Vor Änderungen zuerst lesen:

1. `gehirn/KANAL.md`
2. `gehirn/REELS.md`
3. `gehirn/BILDSTIL.md`
4. `engine/STATUS.md`
5. `engine/config/voice-v1.json`
6. `src/animation-library/CATALOG.md`
7. den aktuellen Reel-Ordner unter `reels/`

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
- Nach jeder Audioänderung Untertitel, Wortzeiten, Szenenwechsel, Bildwechsel, Animationen, SFX und Gesamtdauer neu synchronisieren.
- Untertitel: nur weiß, keine gelbe Hervorhebung, keine Hintergrundbox, maximal zwei Zeilen, ungefähr auf 76 % Bildhöhe.
