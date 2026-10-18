## Fehlervermeidung und verpflichtender Verbesserungszyklus – verbindlich ab der nächsten Videoproduktion

**Keine Korrektur des bereits exportierten Schiffs-Videos.** Seine Fehler sind ein Negativbeispiel für die nächste Produktion.

1. **Vor Phase 1:** `npm run science:learn -- start "<video-ordner>"` führt aktuelle Kanal-Lektionen, echte Messwerte und freigegebene qualitative Beobachtungen zusammen. In `06-projektdateien/learning-brief.json` müssen `thisVideoHypothesis`, `oneControlledChange`, `primarySuccessMetric` konkret ausgefüllt und `editorApproved` nach Prüfung auf `true` gesetzt sein. `science:preflight` stoppt sonst. Keine falschen Kausalversprechen.
2. **Flow-Bilder:** Weiterhin nur **eine** Nutzer-Promptdatei plus Fließtext-Skript im `START-HIER`-Ordner. Alle Flow-Szenen dürfen technische deutsche Beschriftungen enthalten, aber **niemals** Szenen-/Beatnummern, Dateinamen, englische Produktionsphasen oder unsinnige Fake-Werte (Beispiel `35 | DEEPENING`). Remotion darf **keine eigenen Szenen-Headlines oder Kickers mehr einblenden**. Cover bleibt getrennt.
3. **Nach Google Flow und vor Rendering:** `npm run science:asset-review -- init "<video-ordner>"` erstellt **intern** `06-projektdateien/asset-review.json`; alle Bilder tatsächlich ansehen, mit Sprechertext, Plausibilität, deutscher Beschriftung, Smartphone-Lesbarkeit, fehlenden Produktionsmetadaten und Bildvielfalt abgleichen. Für jedes geprüfte Bild die sechs Qualitätsfelder `true`, `status="approved"`, `reviewer` und `reviewedAt` nur **nach echter Sichtprüfung** setzen. Nicht blind freigeben. Datei-Hashes machen alte Freigaben nach Medienänderung ungültig. `science:ready`, `science:prepare` und `science:render` verweigern ungeprüfte Bilder. **Keine OCR- oder KI-Erkennung als garantiert behaupten:** die fachliche Text- und Bildprüfung benötigt eine echte Sichtung.
4. **Nach dem fertig gerenderten Video:** Szenen und Ton vollständig überprüfen. `npm run science:learn -- review "<video-ordner>"` erstellt eine interne Retrospektive `editorial-decisions.json`. Nur mit belegter Beobachtung, konkreter Maßnahme, Messziel und expliziter Freigabe wird sie ins nächste Video übernommen.
5. **Nach Veröffentlichung:** `06-projektdateien/youtube-analytics.json` mit echten YouTube-Studio-Zahlen bei 24h/72h/7d/28d füllen und `npm run science:learn -- report "<video-ordner>"` ausführen. Retention, CTR, Zuschauer und Abos vergleichbar beurteilen. Automatische Empfehlungen sind **Hypothesen**, keine nachgewiesenen Erfolge.
6. **Nächste Phase 1:** Alle aktiven Kanal-Lektionen, den letzten freigegebenen Qualitätsbefund und ggf. datengestützte Testhypothesen einlesen. Ein geplantes Experiment konsequent dokumentieren. Keine doppelte Prompt- oder Ordnerflut für den Nutzer.

> **Einmalige lokale Ordnerbereinigung:** Nach Branch-Synchronisation `npm run technik:cleanup -- --check` und danach `npm run technik:cleanup` ausführen, damit alte ungetrackte MP4s/Flow-Bilder aus `reels` erhalten bleiben und `05-export` nur Video, Cover und Caption zeigt. Bei Hashkonflikten nicht überschreiben; gezielt nachfragen.

## Verbindliche Ordnernamen und sauberer Export

Das GitHub-Repository heißt **Technik-Kanal**. Unter `channels/science/` gibt es künftig **`YouTube/`** statt `reels/`; der alte Ordner `channels/elektrotechnik` ist im aktuellen Branch bereits entfernt. Ein lokaler Mac-Ordner mit dem Namen `Elektrotechnik-Kanal` muss am Mac selbst umbenannt und mit Git synchronisiert werden – GitHub ändert keinen Finder-Ordnernamen.

**`05-export/` enthält sichtbar ausschließlich:** `video.mp4`, `cover.png` (oder Bilddatei im Originalformat) und `caption.txt`. Keine Unterordner, Metadaten, SRT, Analytics oder Kontaktbögen an dieser Stelle. Alle technischen Hilfsdateien gehören nach `06-projektdateien/`.

**Nur zwei Kopierdateien:** `START-HIER/<slug>/01-SKRIPT.txt` und `02-GOOGLE-FLOW-PROMPT.txt`. Das Masterprompt enthält Cover und alle Bilder; alle fertigen Bilder und die Stimme werden unter `DATEIEN-HIER-REIN/` gesammelt.

## Bildwelt – Verbesserung aus dem Schiffs-Video

Premium **Technical Editorial Explainer 2.5D** mit technisch korrekten Querschnitten, Schnittmodellen, Funktionsschemas, Diagrammen, Vergleichstabellen und verständlichen Infografiken. Bei langen YouTube-Videos ungefähr **ein Drittel bis die Hälfte** der Bilder gezielt als technische Erklärung statt dekorative Außenansicht planen. **Beschriftungen sind ausdrücklich erwünscht**, wo sie echte Fragen beantworten: normale Szenen bis zu drei, komplexe technische Infografiken bis zu fünf kurze deutsche Labels sowie nötige Zahlen, Einheiten, Formeln, Legenden und Pfeile. Alles muss am Smartphone lesbar sein; niemals erfundene Werte, Fehler, englische Bildwörter oder winzige unlesbare Schriften. Kein starrer Pflichtmix: Illustration passend zum Sprechertext wählen. Die Kritik am letzten Video ist eine redaktionelle Beobachtung, noch kein Beweis für höhere Views.

## ABSOLUT VERBINDLICH: eine einzige Google-Flow-Promptdatei für den Nutzer

**Nutzeroberfläche pro Video ausschließlich `START-HIER/<video-slug>/` mit zwei Textdateien:** `01-SKRIPT.txt` (ein Fließtext ohne Kapitelüberschriften) und `02-GOOGLE-FLOW-PROMPT.txt` (**ein Prompt zum einmaligen Einfügen in Google Flow**, inklusive 3 Thumbnail-Kandidaten, STOPP bis Nutzer Cover wählt, alle Szenen mit Style-/Qualitätsregeln, korrekte Benennung und abschließende Prüfung). Daneben nur `DATEIEN-HIER-REIN/` für fertige Bilder/Voice.

**Niemals** `02-FLOW-COVER.txt`, `03-FLOW-BILDER-1.txt` bis `07-FLOW-BILDER-5.txt` oder andere zusätzliche Flow-Pakete im Nutzerordner erzeugen. Interne Master-, QA- und Szenenprompts bleiben für die Pipeline unter `channels/science` erhalten. `npm run science:phase1 -- "VIDEO_ORDNER"` erstellt die beiden Nutzerdateien nach bestandenem Preflight und löscht ausschließlich bekannte veraltete Nutzer-Promptpakete; danach beide Dateien nach GitHub committen/pushen und **den direkten GitHub-Link zum START-HIER-Ordner** schicken.

Beim Finish Bilder/Voice aus `DATEIEN-HIER-REIN` sicher importieren. Keine fehlenden Assets generieren oder überspringen, keine bestehenden abweichenden Medien überschreiben. Qualität und kontinuierliche Verbesserung bleiben Priorität 1.

> **PHASE-1-LINK IST PFLICHT:** Nach bestandenem Preflight genau `01-SKRIPT.txt` und `02-GOOGLE-FLOW-PROMPT.txt` samt Medienablageordner erstellen, auf GitHub committen und den direkten `START-HIER/<slug>`-Link schicken. Keine weiteren Nutzer-Promptdateien.

> **OBERSTE PRIORITÄT – WISSONAUT KONTINUIERLICH VERBESSERN:** Vor jedem Skript `gehirn/VERBESSERUNGSSYSTEM.md`, den letzten Lernbericht und `learning/active-lessons.json` auswerten. Jeder neue Videoordner besitzt einen Lernbrief mit konkreter Hypothese, Änderung und Zielmetrik. Nach jedem Rendern die vollständige Retrospektive ausfüllen, nach Veröffentlichung echte YouTube-Studio-Daten erfassen und Verbesserungen beim nächsten Video nachweisbar anwenden. Keine erfundenen Kennzahlen oder Viralitätsgarantien.

# Wissenschaftskanal – Arbeitsregeln

> **Neues Video:** Bei „Mach ein Video über …“ den Skill `wissonaut-video` nutzen bzw. `gehirn/VIDEO-AUTOMATIK.md` Schritt für Schritt abarbeiten.

Vor Änderungen zuerst lesen:

1. `gehirn/VERBESSERUNGSSYSTEM.md` (Priorität 1)
2. `gehirn/KANAL.md`
2. `gehirn/LONGFORM.md`
3. `gehirn/REELS.md`
4. `gehirn/BILDWELT.md`
5. `gehirn/FLOW-WORKFLOW.md`
6. `gehirn/AGENT-HANDOFF.md`
7. `engine/config/science-v1.json`
8. den aktuellen Video-Ordner

## Kanalrichtung

Deutschsprachiger Kanal für **Alltagswissenschaft und Technik** für Jugendliche und junge Erwachsene. Themen müssen greifbar, visuell erklärbar und ohne viel Vorwissen verständlich sein.

Nicht regulär verwenden: Biologie, Medizin, Anatomie, Krankheiten, Zellbiologie, DNA/Genetik, Biochemie sowie stark abstrakte Quanten-, Teilchen-, Relativitäts- oder Astrophysik ohne greifbaren Zugang.

Leitfrage:

> Kann ein Jugendlicher nach dem Video etwas verstehen, das er sehen, benutzen, erleben oder sich konkret vorstellen kann?

## Aktives Profil

`youtube-6to7min-v1`:

- normales YouTube-Video, kein Reel
- 16:9 / 1920×1080 / 30 fps
- 360–420 Sekunden (6–7 Minuten), 390 Sekunden ideal
- ungefähr 850–1075 Wörter, 975 ideal
- 34–50 visuelle Beats, 46 ideal
- Bildwechsel meist nach 5–9 Sekunden; über 10 Sekunden prüfen, ob ein weiteres Bild nötig ist
- separates 1280×720-Thumbnail mit 3 Kandidaten
- Google Flow erzeugt ausschließlich statische Bilder
- keine KI-Videoclips, kein Image-to-Video
- finale Videos haben **keine eingebrannten Untertitel/Captions**

Interne Namen wie `ScienceReel` bleiben nur aus Rückwärtskompatibilität bestehen.

## Story

**Hook → Kontext → Grundlage → Mechanismus → Vertiefung → Payoff**

- keine Begrüßung
- Kernfrage sofort öffnen
- Erklärung innerhalb der ersten 30 Sekunden beginnen
- Ursache → Vorgang → Ergebnis bevorzugen
- keine lose Faktenliste
- Payoff beantwortet die Ausgangsfrage

## Skript muss visuell abwechslungsreich sein

Vor Freigabe des Skripts prüfen, welche Bilder daraus entstehen würden.

Wenn drei benachbarte Abschnitte fast dieselbe Szene benötigen würden, muss **das Skript bzw. der Beat-Plan umgeschrieben werden**. Nicht versuchen, dieselbe Bildidee nur mit leicht verändertem Prompt zu retten.

Bevorzugt abwechseln:
- vereinfachte Umgebungsszene
- Mess-/Objektszene
- technische Cutaway-/Querschnittsansicht
- Explosionsdarstellung
- Material-/Makroansicht
- Vergleich
- Prozessdarstellung
- Draufsicht
- Bauteil mit Callouts
- vereinfachtes Diagramm
- Schaltplan / Funktionsschema
- Zusammenfassung/Montage

Verbindliche Limits:
- mindestens 7 unterschiedliche Darstellungsformen pro 6–7-Minuten-Video
- keine identische Hauptkomposition in zwei direkt aufeinanderfolgenden Beats
- derselbe dominante Bildanker höchstens 3-mal pro Video
- „Hand auf Gegenstand + Pfeile“ höchstens 3-mal als Hauptkomposition

## Aktive Bildwelt

`gehirn/BILDWELT.md` ist verbindlich.

Aktiv ist **Technical Editorial Explainer 2.5D**. Die frühere visuelle Ausführung ist ersetzt. Der alte interne Stil-Identifier `scientific-scene-explainer-v1` bleibt nur aus technischer Rückwärtskompatibilität bestehen und darf nicht als Anleitung für den alten Look verstanden werden.

### Fester Style-Lock für jedes Bild

- clean modern 2D/2.5D vector-like technical editorial illustration
- vereinfachte, aber glaubwürdige Proportionen
- matte Materialien
- klare Kanten und saubere Formen
- dezente Gradients
- weiche kontrollierte Schatten
- konsistente Linienstärke
- moderate räumliche Tiefe
- erwachsen, professionell, technisch erklärend
- Grundfamilie: warmes Off-White, Graphit, gedeckte Industrietöne
- Akzentfarben nur mit technischer Bedeutung

Ausdrücklich nicht verwenden:
- Fotorealismus
- echte Fotooptik
- hyperrealistische Umgebungen
- generische KI-Kunst
- weiße Schulbuch-/PowerPoint-Infografik als Standardlook
- Pixar-/Kinder-Cartoon
- Sci-Fi-HUD
- Neon-heavy Effekte

Wichtig: **Darstellungsform, Perspektive und Umgebung dürfen wechseln; Rendering-Sprache, Materialvereinfachung, Linienqualität, Typografie und Callout-Design bleiben konstant.**

### Prompt-Sprache

- alle Google-Flow-Prompts auf **Englisch** schreiben
- sichtbarer Text im Bild ausschließlich **Deutsch**
- jeder Einzelprompt muss den Style-Lock enthalten oder ihn eindeutig vom Masterprompt erben
- wenn ein Prompt alte oder widersprüchliche Stilwörter enthält, hat der aktuelle Technical-Editorial-Style-Lock Vorrang

### Labels und Beschriftungen

- normale Szenen bevorzugt 0–1 kurze Labels, maximal 2
- technische Diagramme dürfen bei echtem Erklärnutzen bis zu 3 kurze Labels verwenden
- keine große Überschrift in normalen Szenen
- dünne Leader-Lines
- kleine ruhige Label-Flächen
- keine schwebenden UI-Karten ohne Nutzen

### Menschen

- keine gesichtslosen sichtbaren Köpfe
- sichtbarer Kopf = vollständige natürliche stilisierte Gesichtszüge
- wenn kein Gesicht gebraucht wird: Kopf vollständig aus dem Frame
- Menschen nur bei fachlichem Nutzen

## Google Flow

Vor Bildproduktion müssen final sein:

- `06-projektdateien/flow-plan.json`
- `02-bilder/GOOGLE-FLOW-MASTER-PROMPT.txt`
- alle Einzelprompts

Ablauf:

1. 3 Thumbnail-Kandidaten erzeugen
2. **STOPP und Nutzerauswahl** — dies ist der einzige Freigabepunkt
3. gewähltes Thumbnail als `00-thumbnail-final` übernehmen
4. die zwei nicht gewählten Cover **löschen oder aus der finalen Flow-Sammlung entfernen**
5. gewähltes Thumbnail nur als Referenz für **Qualitätsniveau und Illustrationssprache** nutzen — nicht Palette, Layout, Hintergrund oder Perspektive kopieren
6. danach genau 5 Bildschritte
7. innerhalb eines Bildschritts Bilder streng einzeln nacheinander erzeugen, prüfen, auswählen und direkt korrekt benennen
8. **zwischen Bildschritt 1–5 nicht stoppen und keine weitere Freigabe erfragen**
9. nach Bildschritt 1 automatisch mit 2, dann 3, 4 und 5 fortfahren
10. nach Bildschritt 5 alle finalen Assets in **genau einer finalen Google-Flow-Sammlung / einem finalen Ordner pro Video** zusammenführen
11. Zwischenstände, Fehlversuche, doppelte Bilder, verworfene Varianten und die zwei nicht gewählten Cover aus der finalen Sammlung entfernen
12. finale Sammlung enthält nur `00-thumbnail-final` plus alle finalen Szenenbilder in richtiger Reihenfolge
13. erst danach den vollständigen Abschluss melden
14. jeder Beat = genau ein finales statisches 16:9-Bild
15. keine KI-Videoclips oder Animationen

Jeder Bildschritt soll möglichst mindestens drei unterschiedliche Darstellungsformen enthalten, **ohne den Style-Lock zu verlassen**.

## Phase 2 → Phase 3: verbindlicher Asset-Handoff

`gehirn/AGENT-HANDOFF.md` ist verbindlich.

**Phase 2 gehört dem Nutzer / Google Flow.** Der Nutzer legt die akzeptierten finalen Dateien selbst in die Projektordner:

- Szenenbilder: `02-bilder/images/<scene-id>/`
- gewähltes Thumbnail: `02-bilder/thumbnail/`
- Voice-over: `01-script-audio/audio/`

**Phase 3 gehört Antigravity/Codex/dem Montage-Agenten. Dieser Agent darf keine visuellen Assets selbst erzeugen.**

In Phase 3 verboten:
- Bilder generieren oder regenerieren
- Google Flow für neue Bilder starten
- fehlende Bilder durch Platzhalter, Internetfundstücke oder andere Ersatzbilder ersetzen
- Image-to-Video/KI-Clips erzeugen
- fehlende Szenen automatisch überspringen

Phase 3 darf ausschließlich die in Phase 2 vom Nutzer abgelegten Dateien lesen, prüfen, für Runtime/Render kopieren, synchronisieren und montieren.

**Fehlt ein Asset oder ist die Auswahl mehrdeutig: STOPP und fehlende/unklare Datei melden. Niemals selbst Ersatz erzeugen.**

## Sprache, Captions und Export

- Voice-over Deutsch
- sichtbarer Bildtext Deutsch
- Google-Flow-Prompts Englisch
- **keine eingebrannten Untertitel im finalen Video**
- Wortzeiten dürfen intern für Synchronisation genutzt werden
- kurze wissenschaftliche Labels innerhalb der Bilder bleiben erlaubt
- es gibt **keinen separaten `03-caption`-Ordner**
- `social-caption.md`, Wortzeiten, Caption-JSON, Transcript sowie optionale SRT/VTT liegen **direkt in `05-export/`**
- Unterordner `05-export/video.mp4` ist nur für die gerenderten Videodateien

## Remotion

Remotion darf finale statische Bilder anordnen, eine dezente virtuelle Kamera (höchstens 4 % Zoom, 1,5 % Schwenk) über jedes Bild legen, harte Schnitte setzen, Voice-over und einen leisen Musikteppich mit Quellenangabe abspielen, optionale SFX platzieren und rendern. Details: `gehirn/KANAL.md` → Bewegung und Musik.

Remotion darf keine Untertitel/Captions ins finale Video rendern, nicht rotieren oder parallaxen, keine Übergangseffekte erzeugen, keine wissenschaftlichen Prozesse animieren und keine Videoclips als Szenenquelle erwarten.

Remotion/Phase 3 darf ausschließlich bereits vorhandene Phase-2-Bilder verwenden und keine Bildgenerierung oder Ersatzsuche auslösen.

## Audio

- Voice exakt 1,10×, Tonhöhe erhalten
- finale Voice ist Zeitquelle
- lokale Wortzeiten mit `whisper.cpp`
- Wortzeiten dienen Bildwechseln/Timing, nicht eingebrannten Untertiteln
- erzeugte Wortzeit-/Caption-Dateien werden direkt in `05-export/` geschrieben

## Produktionsregel

Erst Thema → Recherche → Story → Skript → **Visual-Diversity-Check** → Beats → **englische Prompts mit konstantem Technical-Editorial-Style-Lock** → Flow-Plan → 3 Cover-Kandidaten → Cover-Auswahl → **2 verworfene Cover entfernen** → fünf Bildschritte ohne Zwischenstopps komplett abarbeiten → finale Assets korrekt benennen → **Phase 2: Nutzer legt alle akzeptierten finalen Dateien in die vorgesehenen Projektordner** → **Phase 3: Antigravity/KI-Agent verwendet ausschließlich diese vorhandenen Dateien, erzeugt niemals Ersatz** → Voice → Timing → Remotion → QA → Caption-/Timing-/Social-Dateien direkt nach `05-export/`.
