# Warum fliegt die Sicherung raus?

## Reel

- Composition: `SicherungsReel`
- Voice-Geschwindigkeit: `1.10x`
- Tonhöhe: natürlich erhalten mit FFmpeg `atempo=1.10`
- Format: 1080 × 1920, 30 FPS
- Thema: Überlast, Kurzschluss, thermische und magnetische Auslösung
- endgültige Dauer: wird aus der echten beschleunigten Voice-Datei berechnet

## Ordner

- `01-script-audio/` – Sprechtext, Rohaufnahme, Final-Voice und optionale SFX
- `02-bilder/` – Gesamtprompts, Einzelprompts und Szenenbilder
- `03-caption/` – lokales Worttranskript und Caption-Daten
- `04-pdf/` – Lernzettel und PDF
- `05-export/` – finales MP4, SRT, VTT und Veröffentlichungsdateien
- `06-projektdateien/` – Szenenplan, SFX-Anker, Runtime, Manifeste und QA

## Was du einfügst

1. Rohaufnahme nach `01-script-audio/audio/`
2. pro Szene ein finales vertikales Bild in den passenden Ordner unter `02-bilder/images/`
3. optional SFX-Dateien nach `01-script-audio/sfx/`

## Danach für Codex

Vom Repository-Root:

```bash
npm run elektro:finish -- "channels/elektrotechnik/reels/2026-08-03_bis_2026-08-09/02_Warum-fliegt-die-Sicherung-raus"
```

Der Befehl richtet `whisper.cpp` bei Bedarf lokal ein, beschleunigt die Stimme, erzeugt echte Wort-Zeitstempel, gleicht Voice und Szenenplan ab, synchronisiert Szenen/Bilder/Animationen/Untertitel/SFX, rendert das MP4 und erzeugt technische QA sowie Kontrollbilder.

Das Audio bleibt vollständig lokal. Kein API-Key und kein externer Transkriptionsdienst werden benötigt.

## Abbruch statt Raten

Die Produktion stoppt bei:

- fehlendem Audio oder Szenenbild
- weniger als 80 % sicheren Worttreffern zwischen Skript und Transkript
- doppelten Bildern
- Bildern unter 720 × 1280
- ungeeignetem Seitenverhältnis
- TypeScript-, Render- oder QA-Fehlern

Nach der technischen QA muss Codex den Kontaktbogen, alle Szenen-Stills und das vollständige MP4 visuell prüfen und bei sichtbaren Fehlern erneut rendern.
