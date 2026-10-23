# Wie funktioniert ein Induktionsherd?

Profil: **youtube-2min-v1** · 1920×1080 · 16:9 · ca. 2 Minuten

Zentrale Frage: **Wie funktioniert ein Induktionsherd?**

Status: Recherche, Story, 291-Wörter-Skript, Quellen, 15 visuelle Beats, Thumbnail-Plan und Google-Flow-Plan sind vorbereitet.

## Kernantwort

Unter der Glaskeramik erzeugt eine mit hochfrequentem Wechselstrom gespeiste Kupferspule ein wechselndes Magnetfeld. Dieses Feld induziert Ströme im geeigneten Topfboden. Durch elektrischen Widerstand wird dort Wärme erzeugt. Deshalb wird bei Induktion vor allem der Topf selbst zum Wärmeerzeuger.

## Dramaturgie

Hook → Kontext → Grundlage → Mechanismus → Vertiefung → Payoff

## Aktive Bildwelt

**Technical Editorial Explainer 2.5D**

Verbindliche Priorität für dieses Video:

> Jedes Bild erklärt den aktuellen gesprochenen Inhalt so einfach und direkt wie möglich.

Nicht „schönes Bild zum Thema“, sondern **klare Illustration des aktuellen Satzes**.

Regeln:
- eine dominante Aussage pro Bild
- minimale nötige Objekte
- Hauptaussage in ungefähr 1–2 Sekunden erfassbar
- 0–3 kurze deutsche Labels, wenn sie wirklich helfen
- keine eingebrannten Untertitel
- kein Fotorealismus / keine echte Fotooptik
- keine weiße Schulbuchseite als Dauerlook
- kein Pixar/Cartoon
- kein Sci-Fi-HUD
- keine generische KI-Kunst
- eine andere Kameraperspektive allein zählt nicht als visuelle Vielfalt

Wenn benachbarte Beats praktisch dasselbe Bild benötigen würden, wird **Skript/Beat-Plan bzw. die Erklärform geändert**, nicht nur der Winkel.

## Erste Szene = Fortsetzung des Covers

Nach der Auswahl des Covers:

- Szene 01 übernimmt bevorzugt dessen **zentrale Bildidee / Hauptmotiv**
- große Thumbnail-Schlagzeile wird entfernt
- nur die Elemente bleiben, die den Hook erklären
- Szene 01 soll wie die natürliche Fortsetzung des Covers wirken

Das Cover ist danach keine starre Farb-/Layoutvorlage für alle weiteren Szenen.

## Visuelle Folge

Die 15 Bilder sind bewusst als unterschiedliche Erklärformen geplant:

1. Cover-Fortsetzung / Hook
2. klassischer Wärmeweg als einfacher Querschnitt
3. zwei vereinfachte Energiepfade im Vergleich
4. isolierte Explosionsdarstellung aus Glas, Spule, Elektronik
5. einzelne Spule + wechselndes Magnetfeld
6. Minimal-Querschnitt aus Topfboden, Glas, Spule
7. Material-Makro mit Wirbelströmen
8. Materialdetail Widerstand → Wärme
9. vereinfachte Thermodarstellung Topfboden/Glas
10. Kochgeschirr-Materialreihe
11. Magnettest-Nahaufnahme
12. Vorher/Nachher: Topf aufgesetzt / Topf weg
13. Top-down Topferkennung
14. einfache Restwärme-Darstellung
15. reduzierte Vier-Schritt-Zusammenfassung

Damit soll verhindert werden, dass 10–15 Bilder wie Varianten desselben Herd-/Topf-Bildes aussehen.

## Google Flow

1. drei Thumbnail-Kandidaten erzeugen
2. danach STOPP und Nutzerauswahl
3. gewähltes Cover als `00-thumbnail-final` übernehmen
4. zwei nicht gewählte Cover entfernen
5. Szene 01 aus dem gewählten Cover-Hauptmotiv ableiten
6. danach genau 5 Bildschritte mit je 3 Bildern
7. jedes Bild einzeln erzeugen, prüfen und korrekt benennen
8. nach jedem Bild mit dem vorherigen finalen Bild vergleichen; bei zu ähnlicher Hauptidee andere Erklärform verwenden
9. keine Zwischenstopps zwischen Bildschritt 1–5
10. nach Bildschritt 5 Fehlversuche, Zwischenstände, doppelte Bilder und verworfene Varianten entfernen
11. `00-thumbnail-final` + 15 finale Szenenbilder in genau einer finalen Flow-Sammlung bündeln
12. finaler Sammlungsname: `induktionsherd-video-assets-final`
13. ausschließlich statische Bilder
14. keine eingebrannten Untertitel

## Phase 2 – Nutzer legt die finalen Dateien ab

- Szenenbilder: `02-bilder/images/<scene-id>/`
- finales Thumbnail: `02-bilder/thumbnail/`
- Voice-over: `01-script-audio/audio/`

Diese Dateien sind die einzige verbindliche Quelle für die Montage.

## Phase 3 – Antigravity / KI-Agent

Phase 3 darf **keine Bilder erzeugen, regenerieren, suchen oder ersetzen**.

Er verwendet ausschließlich die vorhandenen Phase-2-Dateien. Fehlt ein Bild oder ist die Auswahl nicht eindeutig: STOPP und konkret melden. Keine Platzhalter, keine Web-Suche, kein automatisches Überspringen.

## Finale Asset-Struktur

Die finale Flow-Sammlung enthält ausschließlich:

- `00-thumbnail-final`
- `01-hook-final`
- `02-context-final`
- `03-context-final`
- `04-foundation-final`
- `05-foundation-final`
- `06-mechanism-final`
- `07-mechanism-final`
- `08-mechanism-final`
- `09-mechanism-final`
- `10-deepening-final`
- `11-deepening-final`
- `12-deepening-final`
- `13-deepening-final`
- `14-deepening-final`
- `15-payoff-final`

Nicht enthalten: verworfene Cover, Testbilder, Fehlversuche, Zwischenversionen oder doppelte Varianten.
