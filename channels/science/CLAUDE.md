# Wissenschaftskanal – Arbeitsregeln

Vor Änderungen zuerst lesen:

1. `gehirn/KANAL.md`
2. `gehirn/LONGFORM.md`
3. `gehirn/REELS.md`
4. `gehirn/BILDWELT.md`
5. `gehirn/FLOW-WORKFLOW.md`
6. `engine/config/science-v1.json`
7. den aktuellen Video-Ordner

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
- volle Umgebung
- Mess-/Objektszene
- Cutaway
- Material-/Makroansicht
- Vergleich
- Alltagssituation
- Instrument-/Messansicht
- wissenschaftliche Konzeptdarstellung
- Zusammenfassung/Montage

Verbindliche Limits:
- mindestens 5 unterschiedliche Darstellungsformen pro 2-Minuten-Video
- keine identische Hauptkomposition in zwei direkt aufeinanderfolgenden Beats
- derselbe dominante Bildanker höchstens 3-mal pro Video
- „Hand auf Gegenstand + Pfeile“ höchstens 3-mal als Hauptkomposition

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

Jeder Bildschritt soll möglichst mindestens drei unterschiedliche Darstellungsformen enthalten.

## Bildwelt

`gehirn/BILDWELT.md` ist verbindlich.

Kernregeln:
- eine Hauptaussage pro Bild
- Szenen visuell deutlich variieren
- keine wiederkehrende Türkis-/Weiß-Schablone
- keine große Überschrift in normalen Szenen; große Titel primär im Thumbnail
- normale Szenen bevorzugt 0–2 kurze Labels
- sichtbarer Text nur Deutsch
- keine gesichtslosen sichtbaren Köpfe
- wenn ein Gesicht sichtbar ist: vollständige natürliche stilisierte Gesichtszüge
- wenn kein Gesicht gebraucht wird: Kopf vollständig aus dem Frame lassen statt leeren Kopf zu zeichnen
- Menschen nur bei fachlichem Nutzen

## Sprache und Untertitel

- Voice-over Deutsch
- sichtbarer Bildtext Deutsch
- **keine eingebrannten Untertitel im finalen Video**
- Wortzeiten dürfen intern für Synchronisation genutzt werden
- kurze wissenschaftliche Labels innerhalb der Bilder bleiben erlaubt

## Remotion

Remotion darf finale statische Bilder anordnen, harte Schnitte setzen, Voice-over abspielen, optionale SFX platzieren und rendern.

Remotion darf keine Untertitel/Captions ins finale Video rendern, nicht zoomen, schwenken, rotieren, parallaxen oder Ken Burns erzeugen, keine wissenschaftlichen Prozesse animieren und keine Videoclips als Szenenquelle erwarten.

## Audio

- Voice exakt 1,10×, Tonhöhe erhalten
- finale Voice ist Zeitquelle
- lokale Wortzeiten mit `whisper.cpp`
- Wortzeiten dienen Bildwechseln/Timing, nicht eingebrannten Untertiteln

## Produktionsregel

Erst Thema → Recherche → Story → Skript → **Visual-Diversity-Check** → Beats → Prompts/Flow-Plan → 3 Cover-Kandidaten → Cover-Auswahl → **2 verworfene Cover entfernen** → fünf Bildschritte ohne Zwischenstopps komplett abarbeiten → **finale Assets korrekt benennen und in eine einzige saubere Flow-Sammlung bündeln** → Voice → Timing → Remotion → QA.
