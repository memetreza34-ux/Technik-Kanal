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

Die Gleichheit mit FinanzNeo ist funktional, nicht nur optisch. Keine neue Einmalstruktur erfinden, wenn ein vorhandener Core-, Engine-, Script- oder Animationsbaustein erweitert werden kann.

## Verbindlich

- Fachliche Aussagen prüfen und Quellen mit stabilen IDs dokumentieren.
- Normen, Grenzwerte und Sicherheitsregeln nie ohne Quelle behaupten.
- Keine Anleitung zum Arbeiten an Netzspannung.
- Kein Überbrücken oder Manipulieren von Schutzgeräten.
- Ein Reel vollständig abschließen, bevor der nächste produziert wird.
- Standardmäßig 8 bis 12 klare Bildbeats verwenden.

## Sprache

- Der Kanal ist vollständig deutschsprachig.
- Voice-over, Untertitel, Headlines, Covertexte, CTAs und sichtbare Texte sind Deutsch.
- Bildprompts dürfen Englisch sein.
- Generierte Bilder enthalten grundsätzlich **keinen Text**. Alle Begriffe, Einheiten und Warnungen werden in Remotion gesetzt.

## Hook

- zentrale Frage direkt und einfach formulieren
- keine künstliche Metapher, wenn die Fachfrage selbst verständlich ist
- erster Frame: starkes Bild plus eine Headline, keine große Mechanismus-Animation

## Bilder und Animationen

- Bildqualität und Verständlichkeit haben Vorrang vor Animationsmenge.
- Pro Reel normalerweise nur zwei bis vier vollständige Mechanismus-Animationen.
- Alle übrigen Szenen bleiben bildgeführt und erhalten nur subtile Kamerabewegung.
- Keine große Remotion-Grafik über ein bereits detailliertes KI-Bild legen.
- Eine Animation muss einen echten Ablauf erklären; reine Dekoration wird entfernt.
- Keine überfüllten Schnittbilder, Mini-Labels, UI-Dashboards oder mehrfachen Erklärungen im selben Frame.

## Stimme und Synchronisation

- Voice-over exakt auf `1.10x` beschleunigen, Tonhöhe erhalten.
- Finales Audio ist die verbindliche Zeitquelle.
- Transkription lokal mit `whisper.cpp`.
- Szenen, Bilder, wenige Animationen, Untertitel und SFX verwenden dieselbe Zeitbasis.
- Untertitel nur weiß, keine gelbe Hervorhebung, keine Hintergrundbox, maximal zwei Zeilen.

## Pflichtprüfungen

```bash
npm run electrical:qa -- "<reel-ordner>"
npm run electrical:ready -- "<reel-ordner>"
npm run electrical:finish -- "<reel-ordner>"
```

Codex darf fehlende Dateien, falsche Formate, überladene Bilder, unnötige Animationen oder ein unpassendes Transkript nicht ignorieren. Es muss stoppen, korrigieren und erneut prüfen.
