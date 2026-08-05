# Voice-over hier ablegen

## Verbindliche Dateien

1. Rohaufnahme: `iro-sicherung-raw.wav`
2. Beschleunigte Finaldatei: `iro-sicherung-final.wav`

## Geschwindigkeit

- exakt `1.10x`
- Tonhöhe bleibt natürlich
- Verarbeitung mit FFmpeg `atempo=1.10`
- 48 kHz WAV

## Befehl vom Repository-Root

```bash
npm run voice:1.10 -- \
  channels/elektrotechnik/reels/2026-08-03_bis_2026-08-09/02_Warum-fliegt-die-Sicherung-raus/01-script-audio/audio/iro-sicherung-raw.wav \
  channels/elektrotechnik/reels/2026-08-03_bis_2026-08-09/02_Warum-fliegt-die-Sicherung-raus/01-script-audio/audio/iro-sicherung-final.wav
```

Bei einer Rohdauer von 69 Sekunden beträgt die rechnerische Zieldauer ungefähr `62,73 Sekunden`.

Die Finaldatei ist danach die einzige verbindliche Zeitquelle. Untertitel, Bildwechsel, Animationen, SFX und Reel-Gesamtdauer müssen auf diese Datei synchronisiert werden.
