# Visual Quality Gate – Version 5

## Ziel

Die Bildserie muss wie eine hochwertige technische Dokumentation wirken, nicht wie eine Sammlung zufälliger KI-Produktbilder.

## Verbindliche Produktionsmethode

1. Zwei Serienreferenzen erzeugen: `MOTOR-A` und `CABINET-B`.
2. Verwandte Szenen immer mit derselben Referenz erzeugen.
3. AI-Basisbilder bleiben vollständig textfrei.
4. Deutsche Beschriftungen werden anschließend kontrolliert in das finale PNG eingebrannt:

```bash
npm run electrical:label-images -- "<reel-ordner>"
```

Damit befindet sich die Beschriftung im finalen Bild, ohne Rechtschreibfehler, englische Wörter oder wechselnde KI-Schriften.

## Bildsprache

- cinematic industrial editorial photography
- reale europäische Bauteile und reale Proportionen
- gleicher Motor in zusammenhängenden Motorszenen
- gleicher Schaltschrank in zusammenhängenden Schaltschrank-Szenen
- konsistentes Teal-Schatten/Warmlicht-Grading
- sichtbare Werkstatt- oder Anlagenumgebung statt leerer Produktfläche
- mindestens vier unterschiedliche Kameratypen
- drei bis vier kontrollierte Set-Familien

## Verboten

- isolierte Katalog- oder Amazon-Produktfotos
- schwebende Bauteile
- jedes Mal ein anderer Motor oder Schaltschrank
- neun verschiedene Bildstile
- zufällige Werkzeuge ohne Erklärfunktion
- KI-generierte Schrift
- weiße Balken, Titelkarten oder Letterboxing
- pure weiße Hintergründe
- Cartoon-, Spielzeug-, Pixar-, Miniatur- oder Fantasyoptik

## Qualitätsprüfung

Der Preflight blockiert künftig:

- fehlende `referenceGroup`
- fehlenden `shotType`
- weniger als vier Kameratypen
- weniger als drei oder mehr als vier Set-Familien
- Prompts mit sichtbarer KI-Schrift
- Prompts ohne Serienfarbgrading
- Prompts ohne Full-bleed-Regeln
- Katalog-, Floating- oder Stockfoto-Sprache

Die Bild-QA prüft weiterhin weiße Flächen, Balken und zu ähnliche Hintergrundfarben. Die finale visuelle Prüfung kontrolliert zusätzlich Motivqualität, Kontinuität und fachliche Plausibilität.
