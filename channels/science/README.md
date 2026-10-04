# Alltagswissenschaft & Technik

Deutschsprachiger Faceless-Kanal für verständlich erklärte Physik, Technik, Energie, Materialien, Infrastruktur und greifbare Naturphänomene für Jugendliche und junge Erwachsene.

## Aktives Format

Das aktive Profil ist **`youtube-2min-v1`**:

- normales YouTube-Video, kein Reel
- 1920×1080 / 16:9 / 30 fps
- 90–150 Sekunden, 120 Sekunden ideal
- 230–370 Wörter, 300 ideal
- 12–28 visuelle Beats, 20 ideal
- separates 1280×720-Thumbnail mit drei Kandidaten
- **nur statische Szenenbilder** aus Google Flow
- harte Schnitte
- Voice 1,10× mit Loudness-Normalisierung
- finale Videos ohne eingebrannte Untertitel

## Google Flow

Verbindlicher Ablauf: `gehirn/FLOW-WORKFLOW.md`.

Jedes neue Video benötigt `06-projektdateien/flow-plan.json` und `02-bilder/GOOGLE-FLOW-MASTER-PROMPT.txt`.

1. drei Thumbnail-Kandidaten erzeugen
2. STOPP und Nutzerauswahl abwarten
3. ausgewähltes Thumbnail als lockere Stilreferenz nutzen
4. Beat 01 einzeln als Bild erzeugen und finalisieren
5. erst danach Beat 02 usw.
6. **keine KI-Videoclips und kein Image-to-Video**

`npm run science:flow-master` setzt automatisch einen harten **Visible-Text-Lock** in alle Szenenprompts und den Masterprompt.

### Sichtbarer Text in Szenen

- **niemals Szenen-/Beat-Nummern im Bild**
- keine Szenen-IDs, Abschnittsnamen, Dateinamen, Bildschritt-Nummern oder Asset-Namen sichtbar
- keine Produktionsanweisungen wie `SZENE 10`, `10-MECHANISM`, `BILDSCHRITT 3` oder `01-hook-final`
- nur ausdrücklich im Einzelprompt verlangte Labels dürfen sichtbar sein
- Thumbnail-Überschriften dürfen niemals in normale Szenen durchsickern
- angeforderte Labels bleiben klein und innerhalb sicherer Bildränder; sie werden nie zur großen Überschrift
- falscher, leerer, abgeschnittener oder erfundener Text = Bild verwerfen und neu erzeugen

Die vollständige finale Bildprüfung steht in `gehirn/FINAL-IMAGE-QA.md`.

## Story

**Hook → Kontext → Grundlage → Mechanismus → Vertiefung → Payoff**

Nicht automatisch ein Satz pro Bild. Eine verständliche visuelle Aussage entspricht einem Beat.

## Bildwelt

Aktive Bildwelt: **Technical Editorial Explainer 2.5D**.

> Nicht einfach ein Bild vom Thema erzeugen, sondern eine visuelle Szene bauen, die die konkrete Aussage des Beats erklärt.

Je nach Aussage dürfen volle Orte/Umgebungen, technische Illustrationen, Cutaways, Detailansichten, Vergleiche oder stilisierte erwachsene Menschen eingesetzt werden. Sichtbarer Bildtext ist ausschließlich Deutsch. Leitregel: **so wenig Information wie möglich, so viel wie nötig**.

Zusätzlich gilt bei der finalen Auswahl: Ein neues Bild darf nicht praktisch dieselbe Hauptkomposition eines bereits finalisierten Bildes wiederholen. Gleicher Objektwinkel plus gleiche Pfeile oder eine fast identische Vollansicht werden verworfen und mit einer anderen Erklärform neu erzeugt. Der Payoff darf die Hook-Idee aufgreifen, aber nicht einfach das Hook-Bild kopieren.

## Thumbnail

Thumbnail ist separat von Bild 01:
- 1280×720
- drei Kandidaten
- ein Gewinner
- muss dasselbe Versprechen wie Titel und Hook geben

## Export / Captions

Es gibt **keinen separaten `03-caption`-Ordner**. Alles, was zu Caption, Timing oder Veröffentlichung gehört, liegt direkt in `05-export/`:

- `social-caption.md`
- `word-timestamps.json`
- `voiceover-final.captions.json`
- `transcript-final.txt`
- `voiceover-final.srt`
- `voiceover-final.vtt`
- final gerenderte Videos unter `05-export/video/`

Caption-/Timing-Dateien dürfen für Synchronisation oder externe Plattform-Untertitel genutzt werden. Sie werden **nicht in das finale Video eingebrannt**.

## Remotion-Rolle

Remotion darf nur statische Bilder zeitlich anordnen, harte Schnitte setzen, Voice/SFX abspielen und exportieren. Caption-/Wortzeitdaten dürfen intern fürs Timing gelesen werden, aber Remotion rendert keine Untertitel in das finale Video. Wissenschaftliche Visualisierungen und Bewegung werden nicht in Remotion erzeugt.

## Befehle

```bash
npm run science:new -- --week=YYYY-MM-DD_bis_YYYY-MM-DD --slot=01 --title="Wie funktioniert ein Induktionsherd?" --hook="Wie funktioniert ein Induktionsherd?" --scenes=20
npm run science:flow-master -- "<video-ordner>"
npm run science:preflight -- "<video-ordner>"
npm run science:ready -- "<video-ordner>"
npm run science:finish -- "<video-ordner>"
```

Interne Namen wie `ScienceReel` und der Ordner `reels/` bleiben nur aus Rückwärtskompatibilität bestehen.
