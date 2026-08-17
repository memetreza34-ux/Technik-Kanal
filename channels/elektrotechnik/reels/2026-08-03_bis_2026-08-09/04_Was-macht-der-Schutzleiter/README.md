# Was macht der Schutzleiter?

## Neue Produktionsmethode

Dieser Reel ist vollständig auf **Remotion-first** umgestellt.

- 9 Szenen
- 9 Remotion-Grafiken
- 0 benötigte KI-Bilder
- 0 benötigte Nutzerbilder
- 0 benötigte Coverbilder
- deutsche technische Beschriftungen direkt in Remotion
- 4 echte Prozessanimationen, die übrigen Szenen mit kontrollierter subtiler Bewegung
- öffentliche Bilder nur optional, wenn ein reales Motiv die Erklärung verbessert

## Du musst nur noch liefern

```text
01-script-audio/audio/voiceover-raw.wav
```

Danach:

```bash
npm run electrical:finish -- "channels/elektrotechnik/reels/2026-08-03_bis_2026-08-09/04_Was-macht-der-Schutzleiter"
```

Die Pipeline verarbeitet die Voice auf 1,10×, transkribiert lokal, richtet die neun Remotion-Szenen an der echten Stimme aus, erzeugt Untertitel, rendert und prüft den Reel.

## Öffentliche Bilder

Der aktuelle Schutzleiter-Reel braucht keine. Für zukünftige Themen gibt es `02-public-media/`: Codex kann dort lizenzierte öffentliche Fotos dokumentieren und automatisch in eine Szene übernehmen.
