# Elektrotechnik-Kanal

Eigenständiges Repository für den deutschsprachigen Elektrotechnik-Faceless-Kanal.

Der Kanal liegt unter:

```text
channels/elektrotechnik/
```

## Aktiver Reel

```text
channels/elektrotechnik/reels/2026-08-03_bis_2026-08-09/02_Warum-fliegt-die-Sicherung-raus/
```

## Dein Produktionsablauf

Vorab werden Skript, Bildprompts, Szenenplan, Remotion-Code und fehlende Animationen vorbereitet. Danach erzeugst du nur noch die Rohaufnahme und die Szenenbilder und legst sie in die vorgesehenen Ordner.

Codex startet anschließend die vollständige Produktion mit einem Befehl:

```bash
npm run elektro:finish -- "channels/elektrotechnik/reels/2026-08-03_bis_2026-08-09/02_Warum-fliegt-die-Sicherung-raus"
```

Der Befehl erledigt lokal:

- Stimme auf 1,10× beschleunigen, ohne die Tonhöhe zu verändern
- echtes Worttranskript mit `whisper.cpp`
- semantische Szenensynchronisierung
- Prüfung und Zuordnung aller Szenenbilder
- Synchronisierung der Remotion-Animationen
- weiße Untertitel ohne Box
- Einbau vorhandener SFX
- TypeScript-Prüfung
- MP4-Render
- technische QA
- Szenen-Stills und Kontaktbogen für die visuelle Codex-Prüfung

Das Audio bleibt lokal. Es wird kein externer Transkriptionsdienst und kein API-Key benötigt.

## Grundbefehle

```bash
npm install
npm run studio
npm run check
npm run elektro:setup-local
npm run elektro:finish -- "<reel-ordner>"
```

Das Repository enthält ausschließlich Elektrotechnik. Inhalte von `Dinge erklärt` gehören nicht hierher.
