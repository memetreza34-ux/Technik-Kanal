> **NEUE VERBINDLICHE BILDREGEL FÜR 6–7-MINUTEN-VIDEOS:** Bei normalen Szenen bis zu 3 klare deutsche Beschriftungen, bei fachlich begründeten technischen Diagrammen/Schemata/Infografiken bis zu 5 Labels plus nötige Einheiten, Formeln und Pfeile. Ca. 35–50 % der Bilder als tatsächlich erklärende technische Darstellungen anstreben; Kontextbilder je nach Skript. Ältere strengere Hinweise (0–1/2/3 Labels) werden für das Longform-Profil durch diese Regel ersetzt. Quelle: [BILDWELT](BILDWELT.md).

> **Vor jedem Skript:** Letzte Retrospektive, neue Zuschauerkennzahlen und `VERBESSERUNGSSYSTEM.md` lesen. Ziel ist ein konkret besseres Video, nicht bloß ein weiteres Video. Titel/Thumbnail/Hook und Bildwechsel anhand der tatsächlich entdeckten Schwächen verbessern.

# Longform — YouTube-Erklärvideo

## Aktives Profil

Aktiv ist **`youtube-6to7min-v1`**.

Ziel:
- normales YouTube-Video, kein Reel
- 16:9 / 1920×1080 / 30 fps
- 360–420 Sekunden (6–7 Minuten), 390 Sekunden ideal
- ungefähr 850–1075 Wörter, 975 ideal
- 44–64 visuelle Beats, 56 ideal
- Bildwechsel meist nach 4–7 Sekunden; über 8 Sekunden prüfen, ob ein weiteres Bild nötig ist (Konkurrenz mit Standbildern: Median 5,4–5,7 s, siehe `gehirn/KONKURRENZ-ANALYSE-2026-10-23.md`)

Das 2-Minuten-Profil `youtube-2min-v1` (90–150 s, 230–370 Wörter, 12–28 Beats) ist **archiviert**. Es bleibt nur für die Testphasen-Videos vom 28.09.–04.10.2026 ladbar und wird für neue Videos nicht mehr verwendet.

## Erzählstruktur

Jedes Video beantwortet eine zentrale Frage:

1. **Hook** — direkte Frage oder konkretes Problem
2. **Kontext** — warum die Frage interessant ist
3. **Grundlage** — nur das nötige Vorwissen
4. **Mechanismus** — Ursache → Vorgang → Ergebnis
5. **Vertiefung** — reales Beispiel, überraschender Effekt oder sinnvoller Sonderfall
6. **Payoff** — Ausgangsfrage klar beantworten

Keine Begrüßung und kein Vorgeplänkel. Die Erklärung beginnt innerhalb der ersten 30 Sekunden.

## Schreibregeln

- verständliches Deutsch für Jugendliche und junge Erwachsene
- kurze bis mittlere Sätze
- Fachbegriffe sofort erklären
- konkrete Ursache-Wirkung vor abstrakter Theorie
- keine Faktenliste
- keine Füllsätze
- keine Wiederholung derselben Aussage nur zur Verlängerung
- jeder Abschnitt bringt die zentrale Frage voran

## Spannung – Pflicht für neue Videos (`qualitaet-v2`)

Gemessen an den ersten Langvideos: Das Stahlschiff-Skript hatte **0 konkrete Zahlen** in 932 Wörtern, und 80 % der Szenen hatten genau 2 Sätze (Bildwechsel wie ein Metronom alle ~8 s). Das Steckdosen-Skript hatte 9 Absicherungswörter und **~5 Minuten ohne eine einzige Frage**. In der YouTube-Suche lagen reine Physik-Erklärvideos zur selben Frage bei 66–803 Aufrufen, Videos mit Geschichte, Zahl oder Drama bei 10.000–40.000 (`ANALYSE-2026-10-18.md`).

`science:script-qa` prüft automatisch (Fehler bei `qualityRulesVersion: qualitaet-v2`, sonst Hinweis):

| Regel | Grenze |
|---|---|
| **Hook-Anker**: konkrete Zahl, Ereignis, Ort, Person oder sichtbares Paradox in `hookAnchor.text` | muss in den ersten 80 Wörtern (~30 s) vorkommen |
| **Konkrete Zahlen** (Masse, Größe, Rekord, Jahreszahl – mit Quelle) | mindestens 6 pro 1000 Wörter (Konkurrenz: 8–29) |
| **Keine Zahlenliste** | höchstens 3 Zahlen in 120 Wörtern, außerhalb des Hooks |
| **Zahlenstapel im Hook** | höchstens 6 Zahlen in den ersten 80 Wörtern |
| **Absicherungswörter** (häufig, normalerweise, beispielsweise, typischerweise, gewöhnlich, in der Regel …) | höchstens 0,8 pro 100 Wörter |
| **Rhythmus**: Szenen mit genau 2 Sätzen | höchstens 60 %; kurze Schlagsätze, Szenen mit 1 oder 3 Sätzen mischen |
| **Offene Fragen**: Frage, Ankündigung („Gleich sehen wir, warum …“) oder Vorausdeutung („Zu diesem Zeitpunkt ahnte niemand …“, „Doch dann …“) | spätestens alle 240 Wörter (~96 s) |

So füllt man `hookAnchor` im Szenenplan:

```json
"hookAnchor": {
  "type": "zahl",
  "text": "200.000 Tonnen",
  "firstImage": "steel block sinking next to a floating container ship"
}
```

`type`: `zahl`, `ereignis`, `ort`, `person` oder `paradox`. `firstImage` ist der englische Satzteil, der wörtlich im Bildauftrag von Bild 1 stehen muss (siehe `BILDWELT.md`).

Gute Hook-Muster:
- **Zahl + Widerspruch:** „Dieses Schiff trägt über 200.000 Tonnen Ladung – und ein Nagel geht unter. Warum schwimmt es?“ (jede Zahl vorher mit Quelle belegen)
- **Ereignis:** „1912 galt die Titanic als unsinkbar. Drei Stunden später lag sie am Meeresgrund.“
- **Irrtum:** „Fast alle glauben, der Motor hält ein Schiff oben. Er hat damit nichts zu tun.“
- **Szene mit Datum, Uhrzeit, Ort (Cold Open):** mitten in einen echten Moment springen, z. B. „14. April 1912, 23:40 Uhr, Nordatlantik.“ Häufigstes Muster in der Konkurrenzanalyse (5 von 12 Videos).
- **Zahlenstapel + Kontrast:** drei bis vier belegte Zahlen hintereinander, dann der Bruch („… und alles aus Holz.“).
- **Person mit Wendepunkt:** ein echter Mensch, an dem das Thema hängt (Erfinder, Ingenieur, Betroffener).

**Größenvergleich:** Jede große Zahl wird sofort greifbar gemacht, mit einem Alltagsobjekt oder einem bekannten Bauwerk („so schwer wie 200.000 Kleinwagen“, „13-mal so hoch wie die Cheops-Pyramide“). Das passende Bild ist dann ein Vergleichsbild (`visualType: comparison`). Muster aus `KONKURRENZ-ANALYSE-2026-10-23.md`.

## Titel – vor dem Skript prüfen

```bash
npm run science:title-check -- "<video-ordner>"
npm run science:title-check -- "<video-ordner>" --titel="Alternativer Titel"
```

Holt die Top-15 der YouTube-Suche, markiert Videos mit fast derselben Frage und schreibt `06-projektdateien/title-check.json`. Ergebnis `besetzt` (große Kanäle mit derselben Frage) oder `umkämpft` (viele gleiche Videos) heißt: **Titel ändern**, nicht die gleiche Lexikonfrage stellen. Formeln: Zahl + Widerspruch, konkretes Ereignis, Irrtum aufdecken, **bekannter Bezug** (Film, Marke, berühmtes Objekt) und **Listen-Versprechen** („5 Dinge, die …“). Jede Zahl im Titel braucht eine Quelle in `sources.md`.

Belegt durch Vergleiche innerhalb desselben Kanals (`KONKURRENZ-ANALYSE-2026-10-23.md`): „Das echte U-Boot aus «Das Boot» – 5 Dinge, die der Film nicht erzählt“ hatte 16-mal so viele Aufrufe wie „Warum liegt die Bismarck immer noch dort?“, und „… sank in 13 Minuten“ 11-mal so viele wie ein Titel ohne Zahl. Allgemeine Wörter wie „faszinierende Technik“ oder „unglaubliche Ingenieursleistung“ vermeiden.

## Thumbnail

Drei klar verschiedene Kandidaten, danach wählt der Nutzer. Muster der erfolgreichen Thumbnails:

- **1–3 große deutsche Wörter**, höchstens 4. Der Text **ergänzt** den Titel, statt ihn zu wiederholen (Titel „Wie der Auftrieb tonnenschwere Schiffe über Wasser hält“, Thumbnail „Stahl schwimmt“).
- **Ein Hauptobjekt**, groß (mindestens die Hälfte des Bildes), kontrastreich und farbig. Keine dunkle, flaue Optik.
- **Roter Pfeil oder Kreis** auf das überraschende Detail, **oder Vorher/Nachher** nebeneinander mit Pfeil.
- Eine belegte Zahl im Thumbnail ist stark („4.790 METER TIEF“).
- Schwach ist ein einzelnes Wort ohne Spannung („DAS U-BOOT“).

## Kapitelmarken

An der ersten Szene jedes Abschnitts steht im Szenenplan ein kurzer `chapterTitle` (höchstens 60 Zeichen, spricht den Zuschauer an, z. B. „Warum die Titanic trotzdem sank“). Die erste Szene braucht immer einen. `science:finish` schreibt nach dem Render die Kapitel mit echten Zeitstempeln in `05-export/caption.txt` (manuell: `npm run science:chapters -- "<video-ordner>"`). YouTube zeigt Kapitel nur ab 3 Stück, mit Start bei 0:00 und je mindestens 10 s.

## Wichtigste Skriptregel: bildklar und bildleicht schreiben

Jeder wichtige Satz bzw. Beat muss sich **einfach und eindeutig visualisieren lassen** und das Video muss insgesamt **visuell abwechslungsreich** bleiben.

Vor Freigabe jedes Beats fragen:

> „Welches eine Bild würde diesen gesprochenen Inhalt am schnellsten verständlich machen?“

Und zusätzlich:

> „Passt diese Aussage in ein ruhiges Bild mit höchstens drei wichtigen visuellen Elementen und sehr wenig Text?“

Wenn darauf keine klare Antwort möglich ist, muss der Satz einfacher, konkreter oder in mehrere Beats geteilt werden.

Verbindlich:
- Voice-over nicht unnötig abstrakt formulieren
- eine Aussage pro Beat bevorzugen
- sichtbare Ursache → Vorgang → Ergebnis bevorzugen
- Fachdetails erst nennen, wenn ein klares Bild dafür existiert
- Beispiele gezielt nutzen, wenn sie eine neue sinnvolle Bildform öffnen
- nicht mehrere Sätze hintereinander schreiben, die praktisch dasselbe Bild benötigen
- kein Beat darf nur deshalb in ein überfülltes Bild gezwungen werden, weil der Satz zu viel gleichzeitig sagt

**Warnsignal 1:** Drei benachbarte Beats würden dieselbe Hauptkomposition, dasselbe Hauptmotiv oder denselben Hintergrund benötigen.

**Warnsignal 2:** Ein Beat bräuchte mehr als 3 wichtige visuelle Elemente oder mehr als 3 Labels in einer normalen Szene.

Dann gilt: **Skript/Beat-Plan ändern, nicht nur den Prompt umformulieren.**

## Cover getrennt von der Videohandlung

Das Cover stellt dieselbe Frage wie der Hook, darf aber in **keinem einzigen Frame der MP4** vorkommen. Der eine gewählte Cover-Gewinner wird ausschließlich als Datei `05-export/cover/00-thumbnail-final.*` bereitgestellt. **Szene 01 ist eine unabhängige normale technische Illustration** des ersten gesprochenen Satzes. Kein Covermotiv, keine Cover-Grafik, kein Titel im Video.

Bei 6–7 Minuten etwa 56 visuelle Beats anpeilen. Bildwechsel bevorzugt dort, wo der Text eine neue konkrete Aussage macht; bei Bildhaltezeit über 8 Sekunden eine Teilung prüfen. Zusätzliche Bilder vor der Bildgenerierung und vor Phase 3 im Beat-Plan festlegen; Phase 3 darf nichts selbst nachgenerieren.

## Visuelle Beat-Regel

Nicht: ein Satz = ein Bild.

Sondern: **eine verständliche visuelle Aussage = ein Beat.**

Ein komplizierter Satz darf mehrere Bilder benötigen. Mehrere Sätze dürfen auf demselben Bild bleiben, wenn dieselbe visuelle Aussage erklärt wird und das Informationsbudget eingehalten bleibt.

Vor der Bildproduktion wird für jeden Beat ein Mini-Brief definiert:
- Voice-over-Kernaussage
- Hauptmotiv
- Erklärform
- Informationsbudget
- optional nötige Labels

## Informationsbudget pro Beat

### Normale Szene
- eine dominante Aussage
- bevorzugt ein Hauptobjekt
- höchstens 3 wichtige visuelle Elemente
- bevorzugt 0–1, absolut höchstens 2 kurze Labels
- höchstens 2 Pfeile
- keine große Szenenüberschrift
- keine ganzen Erklärungssätze
- keine Zusatzgrafik, wenn das Hauptbild bereits reicht

### Vergleich / Diagramm / Zusammenfassung
Nur wenn die Form fachlich wirklich nötig ist:
- höchstens 4 wichtige visuelle Elemente
- höchstens 3 kurze Labels
- höchstens 2 Panels
- weiterhin nur eine zentrale Aussage

Wenn das nicht reicht: **Beat teilen statt Bild überladen.**

## Visuelle Vielfalt

Mindestens 7 unterschiedliche Darstellungsformen pro 6–7-Minuten-Video, z. B.:
- Umgebung
- Querschnitt
- Makro
- Vergleich
- Prozessbild
- Draufsicht
- Diagramm
- Schaltplan/Funktionsschema
- Vorher/Nachher

Regeln:
- keine identische Hauptkomposition in zwei direkt aufeinanderfolgenden Beats
- derselbe dominante Bildanker höchstens 3-mal
- „Hand berührt Gegenstand + Pfeile“ höchstens 3-mal als Hauptbild
- echte inhaltliche Variation statt nur anderer Perspektive/Farbe

## Text im Bild

Kurze Beschriftungen sind erlaubt, wenn sie das Bild einfacher verständlich machen.

- normale Szenen: bevorzugt 0–1, maximal 2 kurze deutsche Labels
- Diagramme/Schaltpläne/Vergleiche/Zusammenfassungen: maximal 3 kurze Labels
- keine Textwand
- keine ganzen Erklärungssätze
- keine eingebrannten Untertitel
- keine große Szenenüberschrift

## Keine eingebrannten Untertitel

Die finalen YouTube-Videos haben **keine eingebrannten Untertitel/Captions**.

Wortzeiten dürfen intern weiterhin für Bildwechsel, Timing und Synchronisation erzeugt werden. Sie werden aber nicht als Untertitel ins Video gerendert.

## Produktionsworkflow

1. Thema gegen `KANAL.md` prüfen
2. zentrale Frage formulieren
3. Titel-/Thumbnail-Versprechen festlegen
4. fachlich recherchieren und Quellen dokumentieren
5. Story-Struktur bauen
6. vollständiges deutsches Skript schreiben
7. **jede Aussage auf einfache Visualisierbarkeit prüfen**
8. **Informationsbudget pro Beat prüfen**
9. bei zu dichten oder repetitiven Bildideen Skript/Beat-Plan umschreiben oder teilen
10. Skript in visuelle Aussagen/Beats zerlegen
11. Darstellungsformen bewusst variieren
12. Bildprompts und Thumbnail-Prompts erstellen
13. Preflight
14. drei Cover erzeugen und eines auswählen
15. Szene 01 normal und unabhängig vom Cover planen
16. Bilder in fünf Flow-Schritten erzeugen
17. Voice erzeugen/aufnehmen und auf 1,10× verarbeiten
18. Wortzeiten intern erzeugen und Beats synchronisieren
19. statische 16:9-Montage in Remotion — ohne eingebrannte Untertitel
20. optionale sparsame SFX
21. Render-QA, Bild-QA, Quellen-QA und Endkontrolle

## Qualitätsfragen

Vor Produktion:
- klare zentrale Frage?
- roter Faden statt Faktenliste?
- Erklärung startet früh?
- lässt sich jeder Beat in einem einfachen klaren Bild erklären?
- bleibt jede normale Szene unter 3 wichtigen visuellen Elementen?
- reichen 0–1 Labels normalerweise aus?
- muss ein Beat geteilt werden, statt mehr Information in ein Bild zu quetschen?
- erklärt jedes geplante Bild wirklich den aktuellen Voice-over-Satz?
- Szene 01 eigenständig und das Cover nur im Export?
- können die Beats visuell deutlich unterschiedlich aussehen?
- gibt es keine Kette fast identischer Bilder?
- mindestens 5 Darstellungsformen geplant?
- keine eingebrannten Untertitel vorgesehen?
- klarer Payoff?


## Neues Video anlegen (Profil youtube-6to7min-v1)

`science:new` verwendet `youtube-6to7min-v1` jetzt automatisch; `--profile` ist nur noch für das archivierte 2-Minuten-Profil nötig. 16:9 / 30 fps, 360–420 Sekunden, ca. 850–1075 Wörter, 34–50 Beats (ideal 46). Nur echte Erklär-Tiefe, niemals Zeit mit Wiederholungen füllen. Die bestehenden Flow-Style-, Density-, Visible-Text- und Handoff-Regeln gelten unverändert.

Beispiel:
`npm run science:new -- --week=2026-10-05_bis_2026-10-11 --slot=02 --title="Wie funktioniert ein Windrad?" --hook="Wie funktioniert ein Windrad?"`

Im Export liegen YouTube-Titel + Beschreibung zusammen in `05-export/youtube-caption.txt` und das komplette Skript mit Zeitfenstern in `05-export/skript-mit-zeitstempeln.txt`. Vor der Sprachaufnahme sind nur geschätzte Zeitfenster möglich. Nach finalem Audio muss die Synchronisation anhand der echten Wort-/Szenenzeitdaten erfolgen.
