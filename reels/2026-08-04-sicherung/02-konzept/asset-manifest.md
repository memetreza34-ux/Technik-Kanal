# Asset-Manifest – Sicherungs-Reel

## Zielstruktur

```text
public/sicherung/
├── audio/
│   └── iro-sicherung-final.wav
├── images/
│   ├── 01-hook-breaker-trip.png
│   ├── 02-cable-heating-protection.png
│   ├── 03-overload-appliances.png
│   ├── 04-bimetal-cutaway.png
│   ├── 05-short-circuit-contact.png
│   ├── 06-magnetic-instant-trip.png
│   ├── 07-overload-vs-short-circuit.png
│   ├── 08-safe-reset-sequence.png
│   ├── 09-retrip-warning.png
│   ├── 10-lss-vs-rcd.png
│   └── cover-warum-fliegt-die-sicherung.png
└── sfx/
    ├── sfx-breaker-trip-hook.wav
    ├── sfx-protection-reveal.wav
    ├── sfx-load-step.wav
    ├── sfx-bimetal-bend-trip.wav
    ├── sfx-short-circuit-pulse.wav
    ├── sfx-magnetic-trip.wav
    ├── sfx-compare-slow.wav
    ├── sfx-compare-fast.wav
    ├── sfx-unplug.wav
    ├── sfx-breaker-reset.wav
    ├── sfx-breaker-retrip-warning.wav
    ├── sfx-lss-fi-compare.wav
    └── sfx-cta-confirm.wav
```

## Pflicht / optional

| Asset | Pflicht vor finalem Export | Hinweis |
|---|---|---|
| `iro-sicherung-final.wav` | ja | ohne finales Voice-over keine Veröffentlichung |
| SFX-Dateien | ja, sofern im Code aktiviert | funktional und leise, keine Musik |
| Bilder 01–10 | nein | Reel funktioniert vollständig über Remotion; nur verwenden, wenn fachlich korrekt und visuell besser |
| Cover | empfohlen | für Thumbnail, Feed-Cover und Projektübersicht |
| `captions.srt` | ja | bereits im Reel-Ordner vorhanden; Worttiming nach echter Aufnahme nachziehen |

## Benennungsregeln

- keine Leerzeichen
- nur Kleinbuchstaben, Zahlen und Bindestriche
- Bildnummer entspricht der Szenennummer
- finale Sprachdatei nie überschreiben, solange eine Aufnahme noch nicht bestätigt ist; Zwischenstände als `iro-sicherung-v1.wav`, `v2.wav` usw.
- SFX nicht als MP3 speichern, sondern WAV 48 kHz

## Bildformat

- 1080 × 1920 px
- PNG bevorzugt
- sRGB
- keine eingebauten Überschriften oder Formeln
- keine Transparenz erforderlich, außer bei bewusst freigestellten Einzelobjekten

## Audioformat

- WAV, 48 kHz
- Mono oder Stereo akzeptiert; Voice-over bevorzugt Mono
- keine Musikspur
- Voice-over-Ziel nach Mix: ungefähr `-16 bis -17 LUFS`
