# Produktion – Warum fliegt die Sicherung raus?

## Fertig vorbereitet

- Thema, Kernaussage und fachliche Quellen
- finaler Sprechtext mit zehn Zeitfenstern
- SRT-Untertitel
- alle zehn Bildprompts plus Cover-Prompt in einer Datei
- vollständiger Animationsplan
- fertige Caption und Veröffentlichungstexte
- SFX-Plan mit Zeitpunkten und Dateinamen
- Lernzettel-Inhalt und PDF-Generator
- Remotion-Composition und Animationsbibliothek
- GitHub-Workflow für TypeScript, Kontrollframes und PDF

## Zielstruktur der Medien

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

## Pflicht und optional

| Asset | Pflicht | Hinweis |
|---|---|---|
| `iro-sicherung-final.wav` | ja | ohne finales Voice-over keine Veröffentlichung |
| SFX-Dateien | ja, sofern im Code aktiviert | funktional, leise, keine Musik |
| Bilder 01–10 | nein | Reel funktioniert vollständig über Remotion |
| Cover | empfohlen | Thumbnail und Feed-Cover |
| `captions.srt` | ja | Worttiming nach echter Aufnahme nachziehen |

## Medienformate

- Bilder: 1080 × 1920, PNG, sRGB, keine eingebauten Texte oder Formeln
- Voice-over: WAV, 48 kHz, bevorzugt Mono
- SFX: WAV, 48 kHz
- finaler Voice-over-Zielwert ungefähr `-16 bis -17 LUFS`
- keine Musik

## Vorbereitung

1. Repository lokal öffnen.
2. `npm install` ausführen.
3. Sprachdatei unter `public/sicherung/audio/iro-sicherung-final.wav` ablegen.
4. SFX unter `public/sicherung/sfx/` ablegen.
5. Bilder nur verwenden, wenn sie fachlich korrekt und besser als die reine Remotion-Darstellung sind.

## Befehle

```bash
npm install
npm run check
npm run studio
python -m pip install reportlab
python scripts/create_lernzettel.py
npm run render
```

## Kontrollframes

Im Remotion Studio die Composition `SicherungsReel` öffnen und mindestens prüfen:

- Frame 90 – Hook und Schalterauslösung
- Frame 300 – Leitungsschutz
- Frame 540 – Überlast
- Frame 760 – Bimetall
- Frame 990 – Kurzschluss
- Frame 1140 – Magnetauslösung
- Frame 1410 – Vergleich
- Frame 1620 – einmaliges Zurücksetzen
- Frame 1790 – erneute Auslösung
- Frame 1980 – LSS/FI und CTA

## Ausgaben

```text
outputs/sicherungs-reel.mp4
outputs/lernzettel-sicherung.pdf
```

## Empfohlene finale Video-Werte

- 1080 × 1920
- 30 FPS
- H.264
- AAC-Audio, 48 kHz
- keine Musik
- keine SFX-Spitze lauter als das Voice-over

## QA-Checkliste

### Fachlichkeit

- [ ] Überlast und Kurzschluss werden nicht vermischt.
- [ ] Thermische Auslösung wird als zeitverzögert gezeigt.
- [ ] Magnetische Auslösung wird als sehr schnell gezeigt.
- [ ] LSS wird nicht mit FI/RCD gleichgesetzt.
- [ ] Keine Anleitung zu Arbeiten an offenen oder spannungsführenden Anlagen.
- [ ] Quellen stimmen mit den Aussagen überein.

### Sprechtext und Audio

- [ ] finale Datei heißt `iro-sicherung-final.wav`
- [ ] Aufnahme dauert ungefähr 69 Sekunden
- [ ] alle zehn Zeitfenster passen zum Szenenwechsel
- [ ] `Überlast`, `Kurzschluss`, `einmal`, `nicht` und `SICHERUNG` sind klar betont
- [ ] Voice-over bleibt gegenüber allen SFX dominant
- [ ] keine Musik vorhanden
- [ ] finaler Mix ungefähr `-16 bis -17 LUFS`

### Bilder

- [ ] jedes verwendete Bild ist technisch plausibel
- [ ] keine falschen Anschlüsse oder frei schwebenden Leiter
- [ ] keine KI-Schrift oder Markenlogos
- [ ] keine Personen oder Hände an Netzspannungsanlagen
- [ ] Titel-, Caption- und rechte UI-Safe-Zone frei
- [ ] nur Bilder verwenden, die besser erklären als die reine Animation

### Animationen

- [ ] Bibliothekskatalog vor jeder neuen Animation geprüft
- [ ] `BreakerTripAnimation` visuell geprüft
- [ ] `CurrentLevelBar` visuell geprüft
- [ ] `ThermalBimetalTripAnimation` visuell geprüft
- [ ] `ShortCircuitContactAnimation` visuell geprüft
- [ ] `MagneticInstantTripAnimation` visuell geprüft
- [ ] Start-, Mittel- und Endzustand kontrolliert
- [ ] Bewegungen beginnen erst beim gesprochenen Begriff
- [ ] keine dekorativen Dauerzooms
- [ ] höchstens zwei Informationsebenen gleichzeitig

### Layout und Technik

- [ ] 1080 × 1920
- [ ] 30 FPS
- [ ] 2070 Frames / 69 Sekunden
- [ ] Captions mindestens 260 px über der Unterkante
- [ ] wichtige Inhalte mindestens 150 px vom rechten Rand entfernt
- [ ] CTA mindestens zwei Sekunden vollständig sichtbar
- [ ] GitHub-Workflow erfolgreich
- [ ] `npm run check` erfolgreich
- [ ] alle zehn Kontrollframes geprüft
- [ ] vollständiges MP4 ohne Renderfehler erstellt
- [ ] Video mit Kopfhörern und Smartphone-Lautsprecher geprüft
- [ ] PDF-Lernzettel erzeugt und geprüft
- [ ] Nachanalyse erstellt

## Noch offen vor Veröffentlichung

1. `iro-sicherung-final.wav` aufnehmen.
2. echte SFX-Dateien beschaffen oder erzeugen.
3. Audio und SFX in Remotion einfügen.
4. TypeScript und Kontrollframes prüfen.
5. vollständigen MP4-Export mit Ton ansehen.
6. SRT-Worttimings an die echte Aufnahme anpassen.
7. fachliche und visuelle Schlusskontrolle dokumentieren.

## Abnahmegrenze

Ohne finale Sprachdatei, echte SFX und vollständige Video-/Tonkontrolle ist der Reel noch nicht veröffentlichungsfertig.
