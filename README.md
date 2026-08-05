# Elektrotechnik-Kanal

Eigenständiges Produktionssystem für den deutschsprachigen Elektrotechnik-Faceless-Kanal.

Die Struktur folgt dem aktuellen FinanzNeo-System, ist aber fachlich und visuell auf Elektrotechnik angepasst.

## Root-Struktur

```text
.claude/
.github/
channels/
core/
scripts/
package.json
package-lock.json
tsconfig.base.json
vitest.config.ts
```

## Kanal-Struktur

```text
channels/elektrotechnik/
├── brand/
├── engine/
├── gehirn/
├── public/
├── reels/
├── skills/
├── src/
├── CLAUDE.md
├── README.md
├── package.json
├── remotion.config.ts
└── tsconfig.json
```

`core/` enthält gemeinsame Brand-, Caption-, Sound-, Theme- und Datenbausteine. `scripts/` enthält Projektverträge, Scaffolding, Asset-Analyse, Inhalts-QA, Readiness-Gates, Transkription, Render, Export und Systemtests.

## Aktiver Reel

```text
channels/elektrotechnik/reels/2026-08-03_bis_2026-08-09/02_Warum-fliegt-die-Sicherung-raus/
```

## Produktionsablauf

Vorab werden Recherche, Quellen, Skript, Bildprompts, Szenenplan, Remotion-Code und fehlende Bibliotheksanimationen vorbereitet. Danach erzeugst du nur noch die Rohaufnahme und die Szenenbilder.

Codex startet anschließend:

```bash
npm run electrical:finish -- "channels/elektrotechnik/reels/2026-08-03_bis_2026-08-09/02_Warum-fliegt-die-Sicherung-raus"
```

Die Pipeline erledigt lokal:

- Voice-over exakt auf 1,10× verarbeiten
- echtes Worttranskript mit `whisper.cpp`
- Skript und Transkript semantisch abgleichen
- Szenen, Bilder, Remotion-Animationen, Untertitel und SFX synchronisieren
- Medienformat und Bildduplikate prüfen
- TypeScript und Projektverträge prüfen
- MP4 rendern
- technische Render-QA durchführen
- Szenen-Stills und Kontaktbogen erzeugen
- erst nach bestandener QA das finale Exportpaket erstellen

Das Audio bleibt lokal. Kein Transkriptions-API-Key ist erforderlich.

## Wichtige Befehle

```bash
npm install
npm test
npm run studio
npm run gallery
npm run electrical:new -- --week=2026-08-10_bis_2026-08-16 --slot=01 --title="Was macht ein FI?" --scenes=8
npm run electrical:qa -- "<reel-ordner>"
npm run electrical:ready -- "<reel-ordner>"
npm run electrical:finish -- "<reel-ordner>"
npm run electrical:system-test
```

Die alten `elektro:*`-Befehle bleiben als kurze Aliasnamen erhalten.

## Verbindliche Qualitätsregeln

- ein klares technisches Thema pro Reel
- normalerweise 8 bis 12 Bild-/Animationsbeats
- sichere und belegte Elektrotechnik-Aussagen
- keine Anleitung zu Arbeiten unter Spannung oder Schutzgeräte-Manipulation
- weiße Untertitel ohne Box oder gelbe Wortmarkierung
- CTA nur, wenn ein echtes Ergebnis vorhanden ist
- kein finaler Export ohne bestandene Readiness- und Render-QA

Das Repository enthält ausschließlich Elektrotechnik. Inhalte von `Dinge erklärt` gehören nicht hierher.
