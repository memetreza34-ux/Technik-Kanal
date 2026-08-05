# Elektrotechnik-Kanal

Eigenständiges Repository für den deutschsprachigen Elektrotechnik-Faceless-Kanal.

**Dieses Repository enthält ausschließlich Elektrotechnik. `Dinge erklärt` gehört nicht hierher.**

## Aktiver Reel

# Warum fliegt die Sicherung raus?

Öffne zuerst:

```text
reels/warum-fliegt-die-sicherung-raus/00-START-HIER.md
```

Direkte Hauptdateien:

```text
01-SPRECHTEXT.md
02-ALLE-BILDPROMPTS.md
03-ANIMATIONEN.md
04-CAPTION.md
05-SFX.md
06-LERNZETTEL-UND-QUELLEN.md
07-PRODUKTION.md
captions.srt
```

## Technische Daten

- Composition: `SicherungsReel`
- Format: 1080 × 1920
- Bildrate: 30 FPS
- Dauer: 69 Sekunden
- Code: `src/SicherungsReel.tsx`
- Animationsbibliothek: `src/animation-library/`

## Start

```bash
npm install
npm run studio
```

## Prüfen und rendern

```bash
npm run check
npm run render
```

Ausgabe:

```text
outputs/sicherungs-reel.mp4
```

## Richtiger lokaler Klon

Der alte lokale Ordner `faceless-erklärkanal-clone/channels/elektrotechnik` ist nicht mehr das aktive Projekt. Für eine saubere lokale Struktur dieses Repository separat klonen:

```bash
cd ~/Documents

git clone https://github.com/memetreza34-ux/Elektrotechnik-Kanal.git

cd Elektrotechnik-Kanal
```

Danach in Codex ausschließlich den Ordner `Elektrotechnik-Kanal` öffnen.

## Repository-Struktur

- `reels/` – einfache Produktionspakete pro Reel
- `src/` – Remotion-Code
- `src/animation-library/` – wiederverwendbare Animationen
- `scripts/` – Hilfsskripte wie PDF-Erzeugung
- `outputs/` – lokale Render und Kontrollbilder
- `public/` – Voice-over und SFX

## Sicherheitsgrenze

Keine Anleitung zum Arbeiten an Netzspannung und keine Manipulation von Schutzeinrichtungen.
