# Was macht ein FI-Schalter?

Vollständiges Produktionspaket nach der neuen FinanzNeo-kompatiblen Elektrotechnik-Struktur.

## Sprache

- Voice-over vollständig Deutsch
- Untertitel, Headlines, Labels und Warnungen vollständig Deutsch
- Bildprompts dürfen Englisch sein; jeder sichtbare Bildtext muss Deutsch sein
- Cover-Satz: **So erkennt der FI gefährlichen Fehlerstrom.**
- Cover-Satz wird als sauberes Remotion-Overlay gesetzt, nicht von der Bild-KI erzeugt

## Technische Daten

- Composition: `FiSchalterReel`
- Runtime-Datei: `src/generated/fi-schalter-runtime.json`
- Format: 1080 × 1920, 30 FPS
- Planlänge: wird nach der echten 1,10×-Voice-Datei exakt berechnet
- Voice-Verarbeitung: exakt 1,10× mit natürlicher Tonhöhe
- Beats: 10
- Musik: keine
- SFX: optional und sparsam

## Inhalt

Der Reel erklärt:

1. warum ein FI/RCD anders als ein Leitungsschutzschalter arbeitet,
2. den Vergleich von hin- und zurückfließendem Strom,
3. den Summenstromwandler,
4. den Fehlerstrom und die Auslösung,
5. die Bedeutung von 30 mA für zusätzlichen Personenschutz,
6. FI/RCD versus LS,
7. sicheres Verhalten nach wiederholtem Auslösen.

## Ordner

- `01-script-audio/` – fertiger deutscher Sprechtext, Audio- und SFX-Vorgaben
- `02-bilder/` – Covertext, 10 Szenenprompts, Coverprompt und Bildplätze
- `03-caption/` – deutsche Social Caption und generierte Wort-Captions
- `04-pdf/` – vollständiger Lernzettel-Inhalt
- `05-export/` – spätere Veröffentlichungspakete und finales Video
- `06-projektdateien/` – Szenenvertrag, Storyboard, Quellen, Manifeste und QA

## Noch extern erforderlich

1. deutschen Voice-over-Text aufnehmen und in `01-script-audio/audio/` ablegen.
2. pro Szene ein finales 9:16-Bild in den passenden Szenenordner legen.
3. optional SFX in `01-script-audio/sfx/` ablegen.
4. danach ausführen:

```bash
npm run electrical:finish -- "channels/elektrotechnik/reels/2026-08-03_bis_2026-08-09/03_Was-macht-ein-FI-Schalter"
```

Die Pipeline darf bei fehlenden Medien, falscher Zuordnung, unsicherem Transkript, nicht deutschem sichtbarem Inhalt oder nicht bestandener QA nicht raten.
