## NORMALER ARBEITSABLAUF – NUR START-HIER (WISSONAUT)

Das Repo heißt `Technik-Kanal`. Die Nutzerschnittstelle ist NUR `START-HIER/<video-slug>/`: `01-SKRIPT.txt` (ein vollständiger deutscher Fließtext), `02-FLOW-COVER.txt` (drei Coveroptionen), `03-FLOW-BILDER-1.txt` bis `07-FLOW-BILDER-5.txt` und `DATEIEN-HIER-REIN/` (alle finalen Bilder, Cover und Stimme). Keine alternativen Skriptvarianten, keine riesige Markdown-Masterkopie und keine 45 Einzeldateien dem Nutzer als primären Einstieg zumuten. Nach Phase 1 diese wenigen Dateien automatisch erzeugen und die echte GitHub-Ordner-URL übermitteln. Renderer-Interna bleiben unverändert unter `channels/science` und dürfen nicht ins tägliche Nutzermenü.

Bei Phase 3 zunächst `npm run technik:import -- "START-HIER/<video-slug>"` oder den automatischen Import in `science:finish` verwenden; niemals Medien selbst erfinden, Bild-IDs ignorieren oder bestehende unterschiedliche Dateien überschreiben. Fehlende/duplizierte Dateien sind zu melden.

> **PHASE-1-LINK IST PFLICHT:** Sobald Recherche, Sprechertext, Bildkonzept und alle Google-Flow-Prompts fertig und Phase-1-Preflight grün sind, `npm run science:phase1 -- "VIDEO_ORDNER"` ausführen. Die generierte `PHASE-1-START-HIER.md` mit dem Video auf GitHub committen/pushen und dem Nutzer **direkt den Link zu dieser Datei** schicken. Darin sind das ganze Skript, der Masterprompt, der Coverprompt und jeder Einzelprompt kopierbereit. Nicht nur sagen, wo es liegt, sondern den Link geben. Vor dem GitHub-Commit nicht von einer funktionierenden URL sprechen.

> **OBERSTE PRIORITÄT – WISSONAUT KONTINUIERLICH VERBESSERN:** Vor jedem Skript `gehirn/VERBESSERUNGSSYSTEM.md`, den letzten Lernbericht und `learning/active-lessons.json` auswerten. Jeder neue Videoordner besitzt einen Lernbrief mit konkreter Hypothese, Änderung und Zielmetrik. Nach jedem Rendern die vollständige Retrospektive ausfüllen, nach Veröffentlichung echte YouTube-Studio-Daten erfassen und Verbesserungen beim nächsten Video nachweisbar anwenden. Keine erfundenen Kennzahlen oder Viralitätsgarantien.

# Wissenschaftskanal – Arbeitsregeln

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

`youtube-2min-v1`:

- 1920×1080 / 16:9 / 30 fps
- 90–150 Sekunden, 120 ideal
- 230–370 Wörter, 300 ideal
- 12–28 visuelle Beats
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
- mindestens 5 unterschiedliche Darstellungsformen pro 2-Minuten-Video
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
- Unterordner `05-export/video/` ist nur für die gerenderten Videodateien

## Remotion

Remotion darf finale statische Bilder anordnen, harte Schnitte setzen, Voice-over abspielen, optionale SFX platzieren und rendern.

Remotion darf keine Untertitel/Captions ins finale Video rendern, nicht zoomen, schwenken, rotieren, parallaxen oder Ken Burns erzeugen, keine wissenschaftlichen Prozesse animieren und keine Videoclips als Szenenquelle erwarten.

Remotion/Phase 3 darf ausschließlich bereits vorhandene Phase-2-Bilder verwenden und keine Bildgenerierung oder Ersatzsuche auslösen.

## Audio

- Voice exakt 1,10×, Tonhöhe erhalten
- finale Voice ist Zeitquelle
- lokale Wortzeiten mit `whisper.cpp`
- Wortzeiten dienen Bildwechseln/Timing, nicht eingebrannten Untertiteln
- erzeugte Wortzeit-/Caption-Dateien werden direkt in `05-export/` geschrieben

## Produktionsregel

Erst Thema → Recherche → Story → Skript → **Visual-Diversity-Check** → Beats → **englische Prompts mit konstantem Technical-Editorial-Style-Lock** → Flow-Plan → 3 Cover-Kandidaten → Cover-Auswahl → **2 verworfene Cover entfernen** → fünf Bildschritte ohne Zwischenstopps komplett abarbeiten → finale Assets korrekt benennen → **Phase 2: Nutzer legt alle akzeptierten finalen Dateien in die vorgesehenen Projektordner** → **Phase 3: Antigravity/KI-Agent verwendet ausschließlich diese vorhandenen Dateien, erzeugt niemals Ersatz** → Voice → Timing → Remotion → QA → Caption-/Timing-/Social-Dateien direkt nach `05-export/`.
