# Was macht der Schutzleiter?

## Produktionsmethode

Dieser Reel ist vollständig auf **Remotion-first v2** umgestellt.

- 9 Szenen
- 9 Remotion-Grafiken
- 0 benötigte KI-Bilder
- 0 benötigte Nutzerbilder
- 0 benötigte Coverbilder
- deutsche technische Beschriftungen direkt in Remotion
- 3 echte Prozessanimationen, die übrigen Szenen mit kontrollierter subtiler Bewegung
- öffentliche Bilder nur optional, wenn ein reales Motiv die Erklärung nachweisbar verbessert

## Du musst nur noch liefern

```text
01-script-audio/audio/voiceover-raw.wav
```

Danach:

```bash
npm run electrical:finish -- "channels/elektrotechnik/reels/2026-08-03_bis_2026-08-09/04_Was-macht-der-Schutzleiter"
```

## Optional: reales Bild einsetzen

Nur bei echtem Mehrwert:

```bash
npm run electrical:media-search -- "<reel-ordner>" --scene=06-abschaltung --query="European electrical switchgear cabinet"
```

Codex prüft danach den Kandidaten auf der Original-Source-Page und visuell. Erst dann:

```bash
npm run electrical:media-approve -- "<reel-ordner>" --scene=06-abschaltung --candidate=<ID> --source-verified --visual-reviewed --no-people --no-logos --no-artwork
```

Die Remotion-Erklärung bleibt dabei erhalten; das reale Foto dient nur als Hintergrund oder Kontext.
