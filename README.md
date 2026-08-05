# Elektrotechnik-Kanal

Eigenständiges Repository für den deutschsprachigen Elektrotechnik-Faceless-Kanal.

**Dieses Repository enthält ausschließlich Elektrotechnik. `Dinge erklärt` gehört nicht hierher.**

## Aktiver Reel

**Warum fliegt die Sicherung raus?**

Öffne zuerst:

```text
wochen/03.08.2026--09.08.2026/02-Dienstag/warum-fliegt-die-sicherung-raus/00-START-HIER.md
```

## Verbindliche Produktionsstruktur

```text
wochen/
└── 03.08.2026--09.08.2026/
    └── 02-Dienstag/
        └── warum-fliegt-die-sicherung-raus/
            ├── 00-START-HIER.md
            ├── 01-SKRIPT-UND-AUDIO/
            ├── 02-BILDPROMPTS-UND-BILDER/
            ├── 03-ANIMATIONEN/
            ├── 04-CAPTION/
            ├── 05-PDF-UND-QUELLEN/
            └── 06-EXPORT/
```

Jeder neue Reel wird künftig nach demselben Prinzip gespeichert:

```text
wochen/<montag--sonntag>/<wochentag>/<thema>/
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

Der alte lokale Ordner `faceless-erklärkanal-clone/channels/elektrotechnik` ist nicht mehr das aktive Projekt.

```bash
cd ~/Documents
git clone https://github.com/memetreza34-ux/Elektrotechnik-Kanal.git
cd Elektrotechnik-Kanal
git switch main
git pull origin main
```

Danach in Codex ausschließlich den Ordner `Elektrotechnik-Kanal` öffnen.

## Repository-Struktur

- `wochen/` – Woche → Wochentag → Thema → Produktionsordner
- `src/` – Remotion-Code
- `src/animation-library/` – wiederverwendbare Animationen
- `scripts/` – Hilfsskripte
- `outputs/` – lokale Render und Kontrollbilder
- `public/` – globale technische Medien, sofern benötigt

## Sicherheitsgrenze

Keine Anleitung zum Arbeiten an Netzspannung und keine Manipulation von Schutzeinrichtungen.
