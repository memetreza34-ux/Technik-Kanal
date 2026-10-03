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
2. danach **STOPPEN**
3. noch keine Szenenbilder erzeugen
4. auf die ausdrückliche Nutzerauswahl warten
5. gewähltes Thumbnail nur als Referenz für **Qualitätsniveau und Illustrationssprache** verwenden

Das Thumbnail ist **keine** Vorlage für Farbpalette, Hintergrund, Perspektive, Split-Screen-Anordnung oder Textpositionen aller Szenen.

## Phase 2 – genau 5 Bildschritte, ohne Zwischenstopps

Nach der Cover-Auswahl wird die gesamte Szenenbild-Produktion in genau fünf klar erkennbare Schritte aufgeteilt. Die Beats werden möglichst gleichmäßig und in Reihenfolge verteilt.

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
- jedes Bild prüfen und das beste Ergebnis auswählen
- sauber speichern
- erst danach das nächste Bild erzeugen
- niemals mehrere Beats gleichzeitig erzeugen

### Zwischen den fünf Bildschritten

**Es gibt nach der Cover-Auswahl keine weiteren Stopps, Rückfragen oder Freigaben.**

Nach Abschluss von Bildschritt 1 automatisch mit Bildschritt 2 fortfahren, danach 3, 4 und 5. Die fünf Schritte bleiben als Produktionsstruktur sichtbar, werden aber in einem durchgehenden Lauf abgearbeitet.

Erst nach Bildschritt 5 melden:
- dass alle fünf Bildschritte abgeschlossen sind
- welche finalen Bilder erzeugt wurden
- ob einzelne Bilder wegen Qualitätsproblemen neu erzeugt werden mussten

## Verbindlicher Diversity-Check vor jedem Bild

**Visuelle Vielfalt ist Pflicht.** Die fünf Bildschritte dürfen nicht aus Varianten derselben Komposition bestehen.

Vor jedem Beat vorheriges und nächstes geplantes Bild prüfen:
1. Ist die Hauptkomposition deutlich anders als beim vorherigen Bild?
2. Ist der primäre Bildanker anders oder klar anders inszeniert?
3. Wiederholt sich dieselbe Hand-/Material-/Pfeil-Szene?
4. Wiederholt sich dieselbe Türkis-/Weiß-Palette oder derselbe Split-Screen?
5. Öffnet dieser Beat eine neue sinnvolle visuelle Perspektive?

Wenn 1 oder 5 mit Nein beantwortet wird: Prompt bzw. Beat-Plan vor der Erzeugung verbessern.

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

## Bildwelt

Alle Bilder folgen `BILDWELT.md`:

> Nicht einfach ein Bild vom Thema erzeugen. Eine visuelle Szene bauen, die genau die Aussage des Beats erklärt — und die sich sinnvoll vom vorherigen Bild unterscheidet.

## Remotion-Grenze

Remotion darf statische Bilder anzeigen, harte Schnitte setzen, Voice-over abspielen, optionale SFX platzieren und rendern.

Remotion darf keine Untertitel/Captions ins finale Video rendern, keine Bewegung aus Standbildern erzeugen, nicht zoomen/schwenken, keine wissenschaftlichen Prozesse animieren und keine Videoclips erwarten.

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

**Freigabepunkt ist nur nach den drei Thumbnail-Kandidaten. Nach der Cover-Auswahl werden Bildschritt 1 bis 5 ohne Zwischenstopp vollständig fertiggestellt.**
