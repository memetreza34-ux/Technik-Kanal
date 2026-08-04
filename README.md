# Elektrotechnik-Kanal

Eigenständiger deutschsprachiger Faceless-Lernkanal für Elektrotechnik, Elektronik, Messtechnik und technische Grundlagen.

## Aktiver Reel

**Warum fliegt die Sicherung raus?**

- Remotion-Composition: `SicherungsReel`
- Format: 1080 × 1920, 30 FPS
- Dauer: 69 Sekunden
- zehn visuelle Erklärabschnitte
- ohne Abhängigkeit vom früheren Faceless-Studio

## Start

```bash
npm install
npm run studio
```

## Prüfungen und Render

```bash
npm run check
npm run render
```

Der Render wird unter `outputs/sicherungs-reel.mp4` erzeugt.

## Struktur

- `src/` – eigenständiger Remotion-Code
- `reels/` – Skript, Szenenplan, Caption, Quellen und Produktionsstatus
- `public/` – späteres Voice-over und Soundeffekte
- `CHANNEL_BRAIN.md` – verbindliche Kanalregeln
- `REEL_STANDARD.md` – Qualitätsstandard

## Sicherheitsgrenze

Das Projekt erklärt elektrotechnische Zusammenhänge. Es enthält keine Anleitung zum Arbeiten an Netzspannung oder zum Manipulieren von Schutzeinrichtungen.
