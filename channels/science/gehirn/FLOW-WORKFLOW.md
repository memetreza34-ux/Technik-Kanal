# Google Flow – verbindlicher Bild-Workflow

Dieser Workflow gilt für jedes neue Video.

## Grundsatz

Google Flow erzeugt **ausschließlich statische Bilder**. Keine KI-Videoclips, kein Image-to-Video, keine bewegten Szenen.

Remotion montiert die Bilder mit Voice-over, optionalen SFX und harten Schnitten. **Keine eingebrannten Untertitel/Captions.**

## Eine Masterdatei pro Video

Pflicht:
- `02-bilder/GOOGLE-FLOW-MASTER-PROMPT.txt`
- `06-projektdateien/flow-plan.json`
- Einzelprompts unter `02-bilder/prompts/`

## Phase 1 – Thumbnail zuerst

1. genau 3 unterschiedliche Thumbnail-Kandidaten erzeugen
2. STOPPEN
3. noch keine Szenenbilder erzeugen
4. auf Nutzerauswahl warten
5. gewähltes Thumbnail nur als Referenz für **Qualitätsniveau und Illustrationssprache** verwenden

Wichtig: Das Thumbnail ist **keine** Vorlage für die Farbpalette, den Hintergrund, die Perspektive, Split-Screen-Anordnung oder Textpositionen aller Szenen.

## Phase 2 – genau 5 Bildschritte

Nach der Cover-Auswahl wird die Bildproduktion immer in genau fünf Schritte aufgeteilt. Die Beats werden möglichst gleichmäßig und in Reihenfolge verteilt.

Beispiel bei 15 Bildern:
- Bildschritt 1: 01–03
- Bildschritt 2: 04–06
- Bildschritt 3: 07–09
- Bildschritt 4: 10–12
- Bildschritt 5: 13–15

Beispiel bei 18 Bildern:
- Bildschritt 1: 01–04
- Bildschritt 2: 05–08
- Bildschritt 3: 09–12
- Bildschritt 4: 13–15
- Bildschritt 5: 16–18

### Innerhalb eines Bildschritts

- Bilder streng einzeln nacheinander erzeugen
- jedes Bild prüfen und bestes Ergebnis auswählen
- sauber speichern
- erst dann das nächste Bild erzeugen
- niemals mehrere Beats gleichzeitig erzeugen

Nach jedem vollständigen Bildschritt:
- STOPPEN
- fertige Bilder melden
- auf ausdrückliche Freigabe warten

## Verbindlicher Diversity-Check vor jedem Bild

Vor dem Generieren eines Beats immer das vorherige und nächste geplante Bild prüfen.

Fragen:
1. Ist die Hauptkomposition deutlich anders als beim vorherigen Bild?
2. Ist der primäre Bildanker anders oder wenigstens klar anders inszeniert?
3. Verwenden wir schon wieder dieselbe Hand-/Material-/Pfeil-Szene?
4. Wiederholen wir dieselbe Türkis-/Weiß-Palette oder denselben Split-Screen?
5. Öffnet dieser Beat eine neue sinnvolle visuelle Perspektive?

Wenn die Antwort auf 1 oder 5 Nein ist: Prompt bzw. Beat-Plan ändern, bevor das Bild erzeugt wird.

Ziel:
- mindestens 5 unterschiedliche Darstellungsformen im Video
- keine identische Hauptkomposition direkt hintereinander
- derselbe dominante Bildanker höchstens 3-mal
- „Hand auf Gegenstand + Pfeile“ höchstens 3-mal als Hauptmotiv
- pro Bildschritt möglichst 3 unterschiedliche Darstellungsformen

## Menschen und Gesichter

Wenn Menschen vorkommen:
- sichtbarer Kopf = vollständige natürliche stilisierte Gesichtszüge
- keine leeren/gesichtslosen Köpfe
- wenn Gesicht unnötig ist, Kopf komplett außerhalb des Frames lassen
- Hände/Füße/Körperausschnitte nur bei fachlichem Nutzen

## Text in Szenenbildern

- große Überschriften gehören primär ins Thumbnail
- normale Szenen bevorzugt ohne große Headline
- bevorzugt 0–2 kurze Labels
- sichtbarer Text nur Deutsch
- nicht dieselbe Überschrift über mehrere Bilder wiederholen

## Erlaubte Ausgabe

Pro Beat genau ein finales statisches 16:9-Bild.

Nicht erlaubt:
- KI-Videoclips
- Image-to-Video
- animierte Prozesse
- Zoom/Pan/Ken-Burns
- generierte Kamerafahrten

## Benennung

Beispiele:
- `01-hook-final.png`
- `02-context-final.png`
- `03-mechanism-final.png`

## Bildwelt

Alle Bilder folgen `BILDWELT.md`.

> Nicht einfach ein Bild vom Thema erzeugen. Eine visuelle Szene bauen, die genau die Aussage des Beats erklärt — und die sich sinnvoll vom vorherigen Bild unterscheidet.

## Remotion-Grenze

Remotion darf:
- statische Bilder anzeigen
- harte Schnitte setzen
- Voice-over abspielen
- optionale SFX platzieren
- rendern

Remotion darf nicht:
- Untertitel/Captions ins finale Video rendern
- Bewegung aus Standbildern erzeugen
- zoomen/schwenken
- wissenschaftliche Prozesse animieren
- Videoclips erwarten

## Pflicht vor Produktion

Vor Bilderzeugung müssen fertig sein:
1. Recherche/Quellen
2. Story
3. finales Skript
4. Visual-Diversity-Prüfung des Skripts
5. visuelle Beats
6. Einzelprompts
7. `flow-plan.json` mit 5 Schritten und Visual-Typ/Primärmotiv pro Beat
8. `GOOGLE-FLOW-MASTER-PROMPT.txt`

Fehlt etwas davon, ist die Bildproduktion nicht freigegeben.
