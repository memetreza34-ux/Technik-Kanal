# Elektrotechnik – Arbeitsregeln

Vor Änderungen zuerst lesen:

1. `gehirn/KANAL.md`
2. `gehirn/REELS.md`
3. `gehirn/BILDSTIL.md`
4. `gehirn/MASTER-STYLE-PROMPT.md`
5. `engine/STATUS.md`
6. `engine/config/electrical-v1.json`
7. `engine/config/voice-v1.json`
8. `src/animation-library/CATALOG.md`
9. `skills/reel-fertigstellen.md`
10. den aktuellen Reel-Ordner unter `reels/`

## Struktur wie FinanzNeo

Die Gleichheit mit FinanzNeo ist funktional, nicht nur optisch:

- `core/` enthält echte gemeinsame Brand-, Caption-, Sound- und Datenbausteine.
- `src/engine/` enthält wiederverwendbare Reel-, Header-, Produktions- und Galeriekomponenten.
- `scripts/lib/` enthält Datenverträge, Projektstruktur und Konfigurationsloader.
- `scripts/` enthält Scaffolding, Asset-Ingest, Inhalts-QA, Sicherheits-QA, Readiness, Render, Export und Systemtests.
- jeder Reel verwendet die sechs Produktionsordner und die verbindlichen Dateien aus `gehirn/REELS.md`.

Keine neue Einmalstruktur erfinden, wenn ein vorhandener Core-, Engine-, Script- oder Animationsbaustein erweitert werden kann.

## Verbindlich

- Fachliche Aussagen prüfen und Quellen mit stabilen IDs dokumentieren.
- Normen, Grenzwerte, Prüffristen und aktuelle Regeln nie ohne Quelle behaupten.
- Keine Anleitung zum Arbeiten an Netzspannung.
- Kein Überbrücken, Manipulieren oder wiederholtes blindes Rücksetzen von Schutzgeräten.
- Vor neuen Animationen die Bibliothek prüfen.
- Fehlt eine passende Animation, neu bauen, kategorisieren, exportieren und katalogisieren.
- Ein Reel vollständig abschließen, bevor der nächste produziert wird.
- Standardmäßig 8 bis 12 klare Bild-/Animationsbeats verwenden.
- Letzte Szene ist standardmäßig fachlicher Payoff; CTA nur bei echtem versprochenem Ergebnis.

## Sprache – ausnahmslos Deutsch

- Der Kanal ist vollständig deutschsprachig.
- Voice-over, Szenentexte, Untertitel, Headlines, Covertexte, CTAs, Labels, Warnungen und sichtbare Gerätebeschriftungen müssen korrektes Deutsch sein.
- Bildprompts dürfen Englisch geschrieben sein. Ihr dargestellter Inhalt und jeder sichtbare Text müssen trotzdem Deutsch sein.
- Keine englischen Nutzertexte wie `ON`, `OFF`, `WARNING`, `CURRENT`, `RETURN`, `TRIPPED` oder englische Erklärlabels verwenden.
- Zulässige technische Kürzel wie `FI`, `RCD`, `LS`, `PE`, `L`, `N`, `IΔn` und Einheiten bleiben erhalten.
- Coverbilder erhalten immer einen kurzen deutschen Satz, der die zentrale Frage oder Erkenntnis des Reels erklärt.
- Der Cover-Satz wird zuverlässig als Remotion-Overlay hinzugefügt und nicht von der Bild-KI geschrieben.

## Bildstil

- Hauptmotiv groß, nah und sofort verständlich.
- obere 15 % für Headline frei halten.
- untere 25 % für Untertitel frei halten.
- keine weißen oder grauen Ränder, keine geteilten Hintergründe, keine sichtbaren Nähte.
- keine schwebenden Sockel, Gehäuse oder Plattformen mit Spalt darunter.
- keine falsche Verdrahtung oder unmögliche Klemmen.
- generierte Bilder erklären eine Aussage; Remotion erklärt Bewegung und Mechanismus.

## Stimme und Synchronisation

- Voice-over immer exakt auf `1.10x` beschleunigen.
- Tonhöhe natürlich erhalten; Standardverarbeitung: FFmpeg `atempo=1.10`.
- Rohaufnahme unverändert behalten.
- Erst die beschleunigte Finaldatei ist die verbindliche Zeitquelle.
- Transkription ausschließlich lokal mit `whisper.cpp`; kein API-Key und kein Audio-Upload.
- Nach jeder Audioänderung echte Wort-Zeitstempel neu erzeugen und Szenen semantisch ausrichten.
- Bildwechsel, Remotion-Animationen, Untertitel, SFX und Gesamtdauer müssen dieselbe finale Audio-Zeitbasis verwenden.
- Untertitel nur weiß, keine gelbe Hervorhebung, keine Hintergrundbox, maximal zwei Zeilen.

## Pflichtprüfungen

Vor dem Render:

```bash
npm run electrical:qa -- "<reel-ordner>"
npm run electrical:ready -- "<reel-ordner>"
```

Komplette Produktion:

```bash
npm run electrical:finish -- "<reel-ordner>"
```

Neuen Reel nur über das sichere Scaffolding anlegen:

```bash
npm run electrical:new -- --week=YYYY-MM-DD_bis_YYYY-MM-DD --slot=NN --title="Thema" --scenes=8
```

## Ein-Befehl-Produktion

Der Ablauf muss selbstständig:

1. Projektstruktur und Datenverträge prüfen,
2. Inhalts-, Quellen-, Sicherheits- und Kreativ-QA ausführen,
3. Pflichtmedien und Bildformate prüfen,
4. Asset-Manifest und Bildanalyse erzeugen,
5. `whisper.cpp` bei Bedarf lokal einrichten,
6. Roh-Audio auf 1,10× verarbeiten,
7. echte Wort-Zeitstempel erzeugen,
8. Voice-over und Szenenplan mit mindestens 82 % Worttreffern abgleichen,
9. Szenen, Bilder, Animationen, Untertitel und SFX synchronisieren,
10. TypeScript prüfen,
11. MP4 rendern,
12. technische Render-QA und Kontrollbilder erzeugen,
13. erst nach bestandener QA das Exportpaket erstellen.

Codex darf fehlende Dateien, falsche Formate, doppelte Bilder, unsichere Aussagen oder ein unpassendes Transkript nicht stillschweigend ignorieren. Es muss stoppen, den konkreten Fehler beheben oder benennen und danach denselben Ablauf erneut ausführen.
