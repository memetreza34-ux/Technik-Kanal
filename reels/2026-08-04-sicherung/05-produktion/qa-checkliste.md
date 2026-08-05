# QA-Checkliste – Sicherungs-Reel

## Fachlichkeit

- [ ] Überlast und Kurzschluss werden nicht vermischt.
- [ ] Thermische Auslösung wird als zeitverzögert gezeigt.
- [ ] Magnetische Auslösung wird als sehr schnell gezeigt.
- [ ] LSS wird nicht mit FI/RCD gleichgesetzt.
- [ ] Keine Anleitung zu Arbeiten an offenen oder spannungsführenden Anlagen.
- [ ] Quellen in `04-quellen/quellen.md` stimmen mit den Aussagen überein.

## Sprechtext und Audio

- [ ] finale Datei heißt `iro-sicherung-final.wav`
- [ ] Aufnahme dauert ungefähr 69 Sekunden
- [ ] alle zehn Zeitfenster passen zum Szenenwechsel
- [ ] Wörter `Überlast`, `Kurzschluss`, `einmal`, `nicht` und `SICHERUNG` sind klar betont
- [ ] Voice-over bleibt gegenüber allen SFX dominant
- [ ] keine Musik vorhanden
- [ ] finaler Mix ungefähr `-16 bis -17 LUFS`

## Bilder

- [ ] jedes verwendete Bild ist technisch plausibel
- [ ] keine falschen Anschlüsse oder frei schwebenden Leiter
- [ ] keine ungewollte KI-Schrift oder Markenlogos
- [ ] keine Personen oder Hände an Netzspannungsanlagen
- [ ] Titel-, Caption- und rechte UI-Safe-Zone frei
- [ ] nur Bilder verwenden, die die Szene besser erklären als die reine Remotion-Animation

## Animationen

- [ ] Bibliothekskatalog vor jeder neuen Animation geprüft
- [ ] `BreakerTripAnimation` visuell geprüft
- [ ] `CurrentLevelBar` visuell geprüft
- [ ] `ThermalBimetalTripAnimation` visuell geprüft
- [ ] `ShortCircuitContactAnimation` visuell geprüft
- [ ] `MagneticInstantTripAnimation` visuell geprüft
- [ ] Start-, Mittel- und Endzustand aller neuen Komponenten kontrolliert
- [ ] Bewegungen beginnen erst beim gesprochenen Begriff
- [ ] keine dekorativen Dauerzooms
- [ ] höchstens zwei Informationsebenen gleichzeitig

## Layout

- [ ] 1080 × 1920
- [ ] 30 FPS
- [ ] 2070 Frames / 69 Sekunden
- [ ] Captions mindestens 260 px über der Unterkante
- [ ] wichtige Inhalte mindestens 150 px vom rechten Rand entfernt
- [ ] Überschriften auf Smartphone klar lesbar
- [ ] CTA mindestens zwei Sekunden vollständig sichtbar

## Technische Abnahme

- [ ] GitHub-Workflow erfolgreich
- [ ] `npm run check` erfolgreich
- [ ] Kontrollframe Hook geprüft
- [ ] Kontrollframe Mechanismen geprüft
- [ ] Kontrollframe CTA geprüft
- [ ] vollständiges MP4 ohne Renderfehler erstellt
- [ ] vollständiges Video mit Kopfhörern angesehen
- [ ] vollständiges Video auf Smartphone-Lautsprecher angehört
- [ ] PDF-Lernzettel erzeugt und beide Seiten geprüft
- [ ] `nachanalyse.md` erstellt

## Veröffentlichungsfreigabe

Der Reel darf erst veröffentlicht werden, wenn alle Pflichtpunkte erfüllt sind. Nicht erfüllte Punkte werden nicht durch eine allgemeine Bewertung ersetzt.
