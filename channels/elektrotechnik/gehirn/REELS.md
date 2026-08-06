# Elektrotechnik Reels — Produktionsvertrag

## Wochenstruktur

Jeder Reel wird exakt so abgelegt:

```text
reels/YYYY-MM-DD_bis_YYYY-MM-DD/NN_Thema/
├── 01-script-audio/
│   ├── audio/
│   ├── sfx/
│   ├── script.md
│   ├── script-fliesstext.txt
│   └── voiceover.txt
├── 02-bilder/
│   ├── bildprompts.md
│   ├── COVER-TEXT.txt
│   ├── prompts/
│   └── images/
├── 03-caption/
├── 04-pdf/
├── 05-export/
│   └── video/
├── 06-projektdateien/
│   └── render/
└── README.md
```

Die Nummer `NN` ist der Produktionsslot innerhalb der Woche. Es gibt keinen zusätzlichen Wochentagsordner.

## Sprache

- Jeder Reel ist vollständig deutschsprachig.
- Gesprochener Text, Untertitel, Headlines, Covertexte, CTAs, Erklärlabels und sichtbare Warnungen sind korrektes Deutsch.
- Bildprompts dürfen Englisch sein; jeder darin verlangte sichtbare Text muss Deutsch sein.
- Englische Interfacewörter und Erklärlabels sind verboten, sofern sie nicht ein international übliches technisches Kürzel sind.
- Jeder Coverordner erhält `COVER-TEXT.txt` mit einem kurzen deutschen Erklärungssatz.
- Der Cover-Satz wird später sauber in Remotion gesetzt; die Bild-KI soll ihn nicht erzeugen.

## Inhaltlicher Aufbau

- eine zentrale technische Frage
- ein klarer Hook mit sofort sichtbarem Hauptmotiv
- normalerweise 8 bis 12 inhaltliche Bild-/Animationsbeats
- jeder Beat erklärt eine neue Aussage oder einen neuen Mechanismusschritt
- keine Szene nur zur Dekoration
- letzte Szene standardmäßig als fachlicher Payoff oder Merksatz
- CTA nur, wenn ein echtes versprochenes Ergebnis vorhanden ist

## Produktionsreihenfolge

1. Fachliche Recherche und Quellen-IDs
2. Szenenplan mit `voiceText`, `imageDir`, Layout und Mechanismus
3. fertiger deutscher Sprechtext
4. Bildprompts und Remotion-Animationen
5. deutscher Cover-Satz in `02-bilder/COVER-TEXT.txt`
6. Nutzer erzeugt Audio und Bilder
7. `electrical:finish` verarbeitet und synchronisiert alles
8. Inhalts-, Sicherheits-, Asset-, Readiness- und Render-QA
9. Codex prüft Kontaktbogen, Einzelbilder und das vollständige MP4
10. Nutzer gibt den finalen Reel frei

## Verbindliche Projektdateien

`06-projektdateien/` enthält mindestens:

- `scene-plan.json`
- `production-status.json`
- `prompt-manifest.json`
- `asset-manifest.json`
- `content-package-report.json`
- `ready-report.json`
- `qa-report.json`
- `motion-design.md`
- `sources.md`
- `storyboard.md`

Generierte Dateien dürfen vorhandene Planungsdateien ergänzen, aber nicht durch unstrukturierte Einmaldateien ersetzen.

## Abbruchregeln

Nicht rendern bei:

- fehlendem Audio oder Szenenbild
- nicht deutschem Voice-over, Untertitel, Covertext oder sichtbarem Erklärtext
- unzureichender Wortübereinstimmung
- nicht belegter Norm-, Grenzwert- oder Sicherheitsbehauptung
- unsicherer Handlungsanweisung
- falschem Bildformat, zu kleiner Auflösung oder doppeltem Bild
- TypeScript-, Readiness- oder QA-Fehler
