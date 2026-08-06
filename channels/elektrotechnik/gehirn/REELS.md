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

## Hook-Regel

- Der Hook stellt die zentrale Frage direkt und verständlich.
- Keine künstlichen Metaphern wie „verlorener Strom“, wenn eine einfache Frage stärker ist.
- Beispiel: **„Was macht ein FI-Schalter?“**
- Die zentrale Frage muss in den ersten 1,5 Sekunden vollständig lesbar und gesprochen sein.
- Der erste Frame bleibt visuell ruhig: ein starkes Bild, eine Headline, keine zweite große Animation.

## Inhaltlicher Aufbau

- eine zentrale technische Frage
- normalerweise 8 bis 12 klare Bildbeats
- jede Szene erklärt eine neue Aussage
- keine Szene nur zur Dekoration
- letzte Szene standardmäßig als fachlicher Payoff oder Sicherheitshinweis
- CTA nur bei einem echten versprochenen Ergebnis

## Animationsbudget

- pro Reel normalerweise **zwei bis vier vollständige Mechanismus-Animationen**
- übrige Szenen: starkes Bild, dezenter 1,00→1,035-Zoom und sauberer Text
- keine große Remotion-Animation über ein KI-Bild legen, das denselben Mechanismus bereits detailliert zeigt
- Mechanismus-Animation nur für Abläufe wie Stromfluss, Differenzbildung, Magnetwirkung, Kontaktbewegung oder Auslösung
- Zahlen, Gerätevergleiche, Definitionen und Sicherheitshinweise brauchen normalerweise keine technische Vollanimation
- kleine Text- oder Signal-Einblendungen gelten nicht als vollständige Mechanismus-Animation

## Bildvertrag

- generierte Szenenbilder enthalten keinen Text und keine Labels
- alle deutschen Begriffe, Werte und Warnungen werden in Remotion gesetzt
- pro Bild eine Aussage, ein dominantes Motiv, höchstens drei unterstützende Elemente
- keine überfüllten Cutaways, Mini-Beschriftungen, englischen Gerätetexte oder UI-Karten

## Produktionsreihenfolge

1. Fachliche Recherche und Quellen-IDs
2. direkter Hook und Szenenplan
3. fertiger deutscher Sprechtext
4. ruhige Bildprompts
5. gezielte Auswahl der wenigen notwendigen Remotion-Animationen
6. Nutzer erzeugt Audio und Bilder
7. `electrical:finish` verarbeitet und synchronisiert alles
8. Inhalts-, Sicherheits-, Asset-, Readiness- und Render-QA
9. Codex prüft Kontaktbogen, Einzelbilder und vollständiges MP4
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

## Abbruchregeln

Nicht rendern bei fehlendem Audio oder Szenenbild, unzureichender Wortübereinstimmung, unbelegter Sicherheitsbehauptung, unsicherer Handlung, falschem Bildformat, doppeltem Bild, TypeScript-, Readiness- oder QA-Fehler.
