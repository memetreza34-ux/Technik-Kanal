# Video-Automatik – Script und Bildprompts selbstständig erstellen

**Auslöser:** Der Nutzer sagt z. B. „Mach ein Video über X“, „Neues Video: Warum …?“ oder „Phase 1 für …“.
**Ergebnis:** fertiges Phase-1-Paket: Script, Szenenplan, Flow-Plan, ein Bildprompt pro Szene, Thumbnail-Prompt, START-HIER-Ordner und GitHub-Link. Alle Prüfungen sind grün.
**Gilt für:** Claude (Skill `wissonaut-video`), Codex, Antigravity und ChatGPT. Diese Datei ist die einzige Quelle; andere Dateien verweisen nur hierher.

Der Agent arbeitet die Schritte **der Reihe nach** ab und fragt den Nutzer nur an den zwei markierten Stellen (🟡). Alles andere entscheidet er selbst nach diesen Regeln. Prüfungen werden nie umgangen oder abgeschwächt: Ein Fehler wird im Inhalt behoben, nicht in der Prüfung.

---

## Schritt 0 – Vorbereitung (immer)

1. Lesen: `VERBESSERUNGSSYSTEM.md`, `../learning/active-lessons.json`, `ANALYSE-2026-10-18.md`, `LONGFORM.md` (Abschnitte **Spannung** und **Titel**), `BILDWELT.md` (Abschnitt **Bild passt zur Szene**).
2. Letztes fertiges Video finden (`channels/science/YouTube/<woche>/<video>/05-export/video.mp4`). Wurde es noch nicht ausgewertet: `npm run science:learn -- review "<letztes-video>"` ausführen und `06-projektdateien/editorial-decisions.json` aus `POST-VIDEO-REVIEW.md` bzw. der Analyse füllen (Beobachtung, Änderung fürs nächste Video, Testmetrik, `evidenceType`).
3. Arbeitsbranch verwenden, nie `main`.

## Schritt 1 – Thema prüfen

- Passt es zu `KANAL.md` (Alltagswissenschaft & Technik, keine Biologie/Medizin, nicht zu abstrakt)?
- Gibt es einen **sichtbaren Mechanismus** und mindestens **eine Geschichte, ein Ereignis oder eine überraschende Zahl**? Ohne beides ist das Thema schwach: dem Nutzer ein besseres Nachbarthema vorschlagen.

## Schritt 2 – Titel gegen die Konkurrenz

1. Drei Titel-Kandidaten formulieren: einer mit **Zahl + Widerspruch**, einer mit **konkretem Ereignis**, einer als **Irrtum**. Keine reine Lexikonfrage („Wie funktioniert …?“).
2. Videoordner anlegen (vorläufiger Titel = bester Kandidat):
   ```bash
   npm run science:new -- --week=YYYY-MM-DD_bis_YYYY-MM-DD --slot=01 --title="<Titel>" --hook="<Hook-Frage>?"
   ```
3. Für jeden Kandidaten: `npm run science:title-check -- "<video-ordner>" --titel="<Kandidat>"`.
4. Den Kandidaten mit Ergebnis `offen` (sonst den mit den wenigsten starken Konkurrenten) wählen und als `title` im Szenenplan eintragen. Den Check für den finalen Titel noch einmal ohne `--titel` laufen lassen.

## Schritt 3 – Recherche und Quellen

- 3–6 belastbare Quellen (Behörden, Hersteller, Hochschulen, Fachverbände, Lehrbücher) in `06-projektdateien/sources.md` mit stabilen IDs (`SRC-…`).
- Sammeln: **mindestens 4 konkrete Zahlen** (Masse, Größe, Rekord, Jahreszahl, Strom, Spannung …) mit Quelle, **1 echte Geschichte oder 1 Ereignis**, **1 verbreiteten Irrtum**.
- Nichts erfinden. Was nicht belegt ist, kommt nicht ins Script.

## Schritt 4 – Hook-Anker festlegen

Im Szenenplan:

```json
"hookAnchor": {
  "type": "zahl",
  "text": "200.000 Tonnen",
  "firstImage": "steel block sinking next to a floating container ship"
}
```

- `text` kommt **wörtlich** in den ersten 80 Wörtern vor.
- `firstImage` (englisch) kommt **wörtlich** in den Bildauftrag von Bild 1: Das erste Bild zeigt den Widerspruch, nicht nur das Thema.

## Schritt 5 – Script schreiben (`voiceText` jeder Szene)

Profil `youtube-6to7min-v1`: 850–1075 Wörter, 34–50 Szenen (ideal 46).
Aufbau: **Hook → Kontext → Grundlage → Mechanismus → Vertiefung → Payoff** (`section` jeder Szene).

**Pflicht (prüft `science:script-qa`):**
- Hook mit Anker in den ersten ~30 s, danach sofort die zentrale Frage.
- ≥ 2 belegte Zahlen pro 1000 Wörter, aber höchstens 3 Zahlen in 120 Wörtern (keine Zahlenliste).
- Spätestens alle ~240 Wörter eine **offene Frage oder Ankündigung**, die später eingelöst wird („Gleich sehen wir, warum die Titanic trotzdem sank.“).
- Höchstens 0,8 Absicherungswörter pro 100 Wörter (häufig, normalerweise, beispielsweise …).
- Rhythmus: höchstens 60 % der Szenen mit genau 2 Sätzen. Kurze Schlagsätze (≤ 6 Wörter) einstreuen, Szenen mit 1 oder 3 Sätzen mischen.

**Handwerk (prüft kein Programm, ist aber Pflicht):**
- **Ein Beat = eine sichtbare Aussage.** Vor jedem Satz fragen: „Welches eine Bild erklärt das?“ Gibt es keins, Satz umschreiben oder teilen.
- Du-Ansprache und Alltag: „Wenn du das nächste Mal …“
- Erst das Rätsel, dann die Erklärung, nicht umgekehrt.
- Fachwort erst nennen, wenn das Bild es zeigt, und sofort erklären.
- Keine zwei Szenen hintereinander, die dasselbe Bild bräuchten.
- Payoff beantwortet die Hook-Frage in einem Satz, den man weitererzählt.

**Beispiel (Qualitätsmaßstab – Zahlen im echten Video immer mit Quelle belegen):**
> 01-hook: „Dieses Schiff trägt über 200.000 Tonnen Ladung. Ein Nagel geht sofort unter. Warum schwimmt das Schiff?“
> 02-context: „Es liegt nicht am Motor. Der Frachter schwimmt auch, wenn er still im Hafen liegt.“
> 03-context: „Gleich sehen wir, warum ausgerechnet die Titanic trotzdem sank.“

Danach `01-script-audio/voiceover.txt` (Fließtext, Szenen mit Leerzeile getrennt), `script.md` und `script-fliesstext.txt` exakt aus den `voiceText`-Feldern erzeugen.

## Schritt 6 – Bildplan (`06-projektdateien/flow-plan.json`, pro Szene)

| Feld | Regel |
|---|---|
| `visualType` | z. B. environment, cutaway, diagram, comparison, macro, process, top-down, before-after, schematic. **Mindestens 7 verschiedene**, nie zweimal derselbe direkt hintereinander |
| `primaryMotif` | kurzer Slug des Hauptmotivs; dasselbe höchstens 3-mal pro Video |
| `setting` | **englisch, wo das Bild spielt**: „inside a home fuse box“, „harbor quay“, „school lab bench“. Geräte immer an ihrem echten Ort. Gleiches Setting höchstens 3-mal hintereinander und in höchstens 30 % der Bilder |
| `informationBudget` | normal: ≤ 3 wichtige Elemente, ≤ 2 Labels; Diagramm/Vergleich: ≤ 4 Elemente, ≤ 3 Labels; immer `largeHeadlineAllowed: false`, `fullSentenceTextAllowed: false` |

Etwa ein Drittel bis die Hälfte der Bilder sollen **technische Erklärbilder** sein (Querschnitt, Kraftdiagramm, Vergleich mit gleichem Maßstab, Schaltplan, Prozesskette).

## Schritt 7 – Bildprompt pro Szene (`02-bilder/prompts/<szenen-id>.txt`)

Immer **genau dieses Format** (englisch; Labels deutsch). Der Satz hinter `EXACT VISUAL BRIEF —` wird 1:1 der Bildauftrag in Google Flow.

```text
ONE STATIC IMAGE ONLY, 1920x1080, landscape 16:9. One main idea: the viewer instantly sees that buoyancy pushes up as strongly as the weight pulls down.

EXACT VISUAL BRIEF — Flat-bottomed model hull floating in a glass tank on a school lab bench, one blue upward arrow under the hull and one equally long graphite downward arrow from its center.
Request visible German labels: "Auftrieb" and "Gewicht". If no labels are requested, the image contains no text.

Style: Technical Editorial Explainer 2.5D (see STYLE LOCK). Visible text only in German. No large headline, no full-sentence text. No faceless visible heads; if a person appears, show complete natural facial features.
```

**Regeln für den Bildauftrag:**
- Er zeigt genau das, was der gesprochene Satz dieser Szene erklärt: Objekt, Zustand, Ort, sichtbare Veränderung.
- **Keine Szenen-ID, kein Abschnittsname (hook, mechanism, deepening …), kein Dateiname, kein deutscher Sprechtext** im Prompt.
- Pfeile, Messungen und Vergleiche brauchen **mindestens 1 Label** („Auftrieb“, „Gewicht“, „Tiefgang“, „230 V“).
- Keine Landkarten ohne Vorlage. Keine Geräte in Fantasie-Umgebungen.
- Labels nicht direkt an den Bildrand (Remotion zoomt leicht).
- Bild 1 enthält `hookAnchor.firstImage` wörtlich.

**Thumbnail** (`02-bilder/prompts/00-thumbnail.txt`): drei klar verschiedene 1280×720-Kandidaten, je eine kurze deutsche Schlagzeile (≤ 4 Wörter), die das Titelversprechen zeigt, nicht wiederholt. Danach STOPP bis zur Auswahl. Vorlage: `00-thumbnail.txt` des Stahlschiff-Videos.

## Schritt 8 – Prüfen und verbessern, bis alles grün ist

```bash
npm run science:script-qa -- "<video-ordner>"
npm run science:creative-qa -- "<video-ordner>"
```

- **Jeden Fehler beheben** und erneut prüfen. Auch die Hinweise (`⚠`) abarbeiten, außer es gibt einen fachlichen Grund, ihn zu lassen (kurz im Lernbrief notieren).
- Danach Selbstprüfung, die kein Programm kann:
  - [ ] Erklärt jedes Bild genau seinen Satz? (Satz lesen → Bildauftrag lesen → passt es in 2 Sekunden?)
  - [ ] Würde ein 16-Jähriger nach 30 Sekunden weiterschauen?
  - [ ] Kommt jede Ankündigung später wirklich vor?
  - [ ] Ist jede Zahl in `sources.md` belegt?
  - [ ] Wiederholen sich keine Bilder?

## Schritt 9 – Lernbrief und Freigabe 🟡

1. `npm run science:learn -- start "<video-ordner>"` und in `06-projektdateien/learning-brief.json` eintragen: Hypothese, **eine** bewusste Änderung, Zielmetrik.
2. 🟡 **Dem Nutzer kurz zeigen und Freigabe holen:** Titel, Hook (erste 3 Sätze), die 4 wichtigsten Zahlen mit Quelle, Ergebnis des Titel-Checks, Hypothese. Erst nach seinem „Ja“ `editorApproved: true` setzen. Ohne Freigabe nicht weiter.

## Schritt 10 – Phase 1 abschließen 🟡

```bash
npm run science:phase1 -- "<video-ordner>"
```

Baut den Flow-Masterprompt (v2, ohne Szenen-IDs) und den START-HIER-Ordner und führt alle Prüfungen erneut aus. Dann Script und Prompts committen und pushen und dem Nutzer 🟡 **den direkten GitHub-Link zu `START-HIER/<slug>`** schicken (siehe `AGENTS.md`).

## Danach (Nutzer)

Google Flow mit `02-GOOGLE-FLOW-PROMPT.txt` → Bilder, Stimme und optional `musik.mp3` + `musik-quelle.txt` nach `DATEIEN-HIER-REIN` → `npm run science:finish -- "<video-ordner>"`. Das OCR-Text-Gate prüft die Bilder vor dem Rendern.
