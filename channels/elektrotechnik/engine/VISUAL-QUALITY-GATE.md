# Visual Quality Gate – verhindert die Fehler des ersten FI-Renders

## Grundsatz

Künftige Reels werden nicht mehr zuerst produziert und danach visuell repariert. Hook, Skript, Bildstrategie und Animationsbudget müssen **vor** der Bild- und Audioerzeugung bestehen.

## Verbindliche Reihenfolge

1. direkte zentrale Frage formulieren
2. Skript mit 115–165 Wörtern erstellen
3. jede Szene als `image-only`, `mechanism-only`, `image-with-overlay` oder `static-overlay` klassifizieren
4. höchstens vier Vollanimationen planen; normalerweise ein bis drei
5. textfreie Bildprompts schreiben
6. ausführen:

```bash
npm run electrical:preflight -- "<reel-ordner>"
```

7. erst bei `passed: true` Bilder und Audio erzeugen
8. Medien einfügen, Pipeline rendern und visuell prüfen

## Harte Blocker

Der Preflight stoppt bei:

- Hook ohne direkte Frage
- Hook länger als acht Wörter
- künstlicher Hook-Metapher
- mehr als 165 Skriptwörtern
- mehr als vier Vollanimationen
- Vollanimation im Hook
- zwei Vollanimationen direkt hintereinander
- Bild-plus-Mechanismus ohne Begründung
- Mechanismus auf einer `image-only`-Szene
- Prompt ohne klares Hauptmotiv
- Prompt ohne obere oder untere Sicherheitszone
- Prompt, der sichtbaren Text, Labels oder Zahlen anfordert
- nicht dokumentiertem Animationsbudget

## Visueller Standard

- starke Bilder sind der Normalfall
- Mechanismus-Animation nur für echte zeitliche Abläufe
- `mechanism-only` blendet das KI-Bild aus und verwendet eine ruhige Remotion-Fläche
- dadurch kann niemals eine zweite große Mechanismusgrafik über einem bereits komplizierten Bild liegen
- alle sichtbaren Texte kommen aus Remotion und bleiben korrektes Deutsch
