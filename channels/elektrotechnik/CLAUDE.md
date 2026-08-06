# Elektrotechnik – Arbeitsregeln

Vor Änderungen zuerst lesen:

1. `gehirn/KANAL.md`
2. `gehirn/REELS.md`
3. `gehirn/BILDSTIL.md`
4. `gehirn/MASTER-STYLE-PROMPT.md`
5. `engine/VISUAL-QUALITY-GATE.md`
6. `engine/config/electrical-v1.json`
7. `engine/config/voice-v1.json`
8. `src/animation-library/CATALOG.md`
9. `skills/reel-fertigstellen.md`
10. den aktuellen Reel-Ordner

## Struktur

FinanzNeo-Struktur funktional beibehalten. Vorhandene Core-, Engine-, Script- und Bibliotheksbausteine erweitern statt Einmallösungen zu bauen.

## Inhalt und Sicherheit

- Fachliche Aussagen mit stabilen Quellen-IDs dokumentieren.
- Normen, Grenzwerte und Sicherheitsregeln nie ohne Quelle behaupten.
- Keine Anleitung zum Arbeiten an Netzspannung.
- Kein Überbrücken oder Manipulieren von Schutzgeräten.
- Ein Reel vollständig abschließen, bevor der nächste produziert wird.

## Sprache

- Voice-over, Untertitel, Headlines, Covertexte und CTAs sind Deutsch.
- Bildprompts dürfen Englisch sein.
- Generierte Bilder enthalten keinerlei sichtbaren Text, Labels, Zahlen oder Typenschilder.
- Alle sichtbaren Informationen werden kontrolliert in Remotion gesetzt.

## Hook

- direkte zentrale Frage mit maximal acht Wörtern
- keine künstliche Metapher
- Frage auch im gesprochenen ersten Satz
- erster Frame: starkes Bild und Headline, niemals Vollanimation

## Bilder und Animationen

- Bildqualität vor Animationsmenge.
- Normalerweise ein bis drei, maximal vier Vollanimationen.
- Keine zwei Vollanimationen direkt hintereinander.
- Bildgeführte Szenen verwenden `image-only` und subtile Bewegung.
- Vollanimationen verwenden bevorzugt `mechanism-only`; das KI-Bild wird dabei ausgeblendet.
- `image-with-overlay` ist die Ausnahme und benötigt eine konkrete `overlayJustification`.
- Eine Animation muss einen Ablauf erklären; Dekoration wird entfernt.

## Preproduction – zwingend vor Bildern und Audio

```bash
npm run electrical:preflight -- "<reel-ordner>"
```

Solange `06-projektdateien/preproduction-report.json` nicht `passed: true` enthält, dürfen keine Bilder, Voice-Aufnahmen oder Vollproduktionen erstellt werden.

## Produktion

- Voice-over exakt auf 1,10×, Tonhöhe erhalten.
- Finales Audio ist die verbindliche Zeitquelle.
- lokale Wortzeiten mit `whisper.cpp`.
- Szenen, Bilder, Animationen, Untertitel und SFX verwenden dieselbe Zeitbasis.
- Untertitel weiß, ohne Box, ohne gelbe Markierung, maximal zwei Zeilen.

```bash
npm run electrical:ready -- "<reel-ordner>"
npm run electrical:finish -- "<reel-ordner>"
```

Codex muss bei einem Gate-Fehler stoppen, die Ursache korrigieren und denselben Gate-Befehl erneut ausführen.
