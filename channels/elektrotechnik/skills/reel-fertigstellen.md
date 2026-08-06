# Skill: Reel vollständig fertigstellen

## Phase 1 – Konzept und Preflight

Vor Bildern und Audio:

1. direkte Frage als Hook festlegen
2. 8–10 Szenen mit je einer Aussage planen
3. jede Szene mit `renderMode` und `motionLevel` klassifizieren
4. maximal vier Vollanimationen festlegen
5. textfreie Prompts erstellen
6. ausführen:

```bash
npm run electrical:preflight -- "<reel-ordner>"
```

Bei Fehlern keine Medien erzeugen. Erst korrigieren und erneut prüfen.

## Phase 2 – Nutzerassets

Nach bestandenem Preflight:

- Rohaufnahme nach `01-script-audio/audio/`
- ein finales 9:16-Bild je Bildszene
- einfache overlay-sichere Bilder für Mechanismus-Szenen
- optionale SFX nach `01-script-audio/sfx/`

## Phase 3 – Ein-Befehl-Produktion

```bash
npm run electrical:finish -- "<reel-ordner>"
```

Die Pipeline:

1. führt den Preflight erneut aus
2. verarbeitet Audio auf 1,10×
3. erstellt lokale Wort-Zeitstempel
4. gleicht Transkript und Szenenplan ab
5. synchronisiert Szenen, Bilder, wenige Animationen, Untertitel und SFX
6. rendert das MP4
7. prüft Auflösung, FPS, Ton und Dauer
8. erzeugt Szenen-Stills und Kontaktbogen

## Visuelle Endkontrolle

Codex prüft:

- versteht man jede Szene beim ersten Blick?
- ist das Bild ruhig und phone-tauglich?
- liegt keine große Animation über einer zweiten technischen Darstellung?
- sind nur notwendige Mechanismen animiert?
- sind alle Texte korrektes Deutsch?
- sind Untertitel vollständig und ohne Wortfragmente?
- ist der Reel für die eine Kernfrage kurz genug?

Bei einem Fehler Code, Mapping, Prompt oder Timing korrigieren und erneut rendern.
