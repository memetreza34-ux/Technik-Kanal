# Alltagswissenschaft & Technik

Produktionssystem für einen deutschsprachigen Faceless-Wissenskanal über **greifbare Alltagswissenschaft und Technik** für Jugendliche und junge Erwachsene.

Der Kanal ist bewusst kein allgemeines Wissenschaftslexikon. Bevorzugt werden konkrete, visuell erklärbare Themen aus Alltagsphysik, Elektrotechnik, Energie, Maschinen, Verkehr, Infrastruktur, Materialien, einfacher Alltagschemie, Wetter und greifbarer Astronomie.

Biologie, Medizin, Anatomie, Krankheiten, Zellbiologie, DNA/Genetik und Biochemie gehören nicht zur regulären Kanalrichtung. Stark abstrakte Wissenschaftsthemen mit hohem Vorwissen-Bedarf sind ebenfalls nicht vorgesehen.

## Aktives Produktionsprofil

**`youtube-2min-v1`**

- normales YouTube-Video, kein Reel
- 1920×1080 / 16:9 / 30 fps
- 90–150 Sekunden, 120 Sekunden ideal
- 230–370 Wörter, 300 ideal
- 12–28 visuelle Beats, 20 ideal
- separates 1280×720-Thumbnail mit drei Kandidaten
- Google-Flow-Mix aus statischen Bildern und Image-to-Video-Clips
- Remotion: harte Schnitte, Voice, Captions, SFX, Export

Der spätere Ausbau auf etwa 8–12 Minuten bekommt ein eigenes Profil. Das aktuelle 2-Minuten-System wird zuerst vollständig getestet.

## Produktionsfluss

```text
Thema gegen Kanalrahmen prüfen
→ zentrale Frage
→ Titel-/Thumbnail-Versprechen
→ Recherche + Quellen
→ Story-Struktur
→ vollständiges deutsches Skript
→ visuelle Aussagen/Beats
→ Scientific Scene Explainer
→ Einzelprompts
→ flow-plan.json: jeden Beat als Bild oder Image-to-Video festlegen
→ GOOGLE-FLOW-MASTER-PROMPT.txt bauen
→ Preflight
→ in Google Flow zuerst 3 Thumbnail-Kandidaten
→ STOPP + Nutzerauswahl
→ danach Beat 01, 02, 03 ... streng einzeln nacheinander
→ für jeden Beat zuerst finales Ausgangsbild
→ geplante Beats zusätzlich als Image-to-Video-Clip, maximal 10 s
→ Voice-over
→ Asset-Readiness
→ lokale Wort-Zeitstempel
→ Skript-/Voice-Ausrichtung
→ 16:9-Montage aus Bildern + fertigen Flow-Clips
→ Untertitel + optionale SFX
→ Render
→ QA
```

## Story-System

Detailregeln: `channels/science/gehirn/LONGFORM.md`.

Verbindliche Dramaturgie:

**Hook → Kontext → Grundlage → Mechanismus → Vertiefung → Payoff**

Nicht automatisch ein Satz pro Bild. **Eine verständliche visuelle Aussage = ein Beat.**

## Aktive Bildwelt

Die verbindliche Bildwelt ist **Scientific Scene Explainer v1** (`scientific-scene-explainer-v1`). Detailregeln: `channels/science/gehirn/BILDWELT.md`.

Kernprinzip:

> Nicht einfach ein Bild vom Thema erzeugen. Eine visuelle Szene bauen, die die konkrete Aussage des Beats erklärt.

Wichtige Regeln:
- eine Hauptaussage pro Bild
- ganze Orte/Umgebungen nutzen, wenn sie das Verständnis verbessern
- wissenschaftliche Erklärung direkt in die Szene integrieren, wenn sinnvoll
- Illustration, Cutaway, Detailansicht, Vergleich oder stilisierte erwachsene Menschen nur nach inhaltlichem Bedarf einsetzen
- Hintergründe und Farben passend zum Thema wählen
- Titel, Labels, Merksatz, Zahlen, Pfeile und Infotext sind optional
- sichtbarer Bildtext ausschließlich auf Deutsch
- so wenig Information wie möglich, so viel wie nötig
- keine generische KI-Kunst, Sci-Fi-HUDs, Neon-Überladung, Logos oder Wasserzeichen

## Google Flow

Verbindliche Workflow-Regeln: `channels/science/gehirn/FLOW-WORKFLOW.md`.

Jedes aktive Video benötigt vor der Medienproduktion:

- `06-projektdateien/flow-plan.json`
- `02-bilder/GOOGLE-FLOW-MASTER-PROMPT.txt`
- einen Thumbnail-Prompt
- einen finalen Einzelprompt für jeden Beat

Der Richtwert ist ein ausgewogener Mix von ungefähr 50/50 aus Bildern und Flow-KI-Clips. Die Erklärung hat Vorrang vor einer starren Quote.

KI-Clip-Regeln:
- Image-to-Video aus dem bereits freigegebenen Ausgangsbild
- maximal 10 Sekunden
- kein gesprochenes Dialog-Audio
- keine Lippen-Synchronisation
- keine neu erfundenen Texte während der Animation
- sichtbarer Text ausschließlich Deutsch

## Thumbnail

Bild 01 ist **nicht** das Thumbnail.

Für jedes Video werden drei separate 1280×720-Kandidaten erzeugt. Danach wird gestoppt und auf die Nutzerauswahl gewartet. Erst danach beginnt die Szenenproduktion. Titel, Thumbnail und Hook müssen dasselbe inhaltliche Versprechen geben.

## Neues Video

```bash
npm run science:new -- \
  --week=2026-10-01_bis_2026-10-07 \
  --slot=01 \
  --title="Wie funktioniert ein Induktionsherd?" \
  --hook="Wie funktioniert ein Induktionsherd?" \
  --scenes=20
```

Danach `flow-plan.json` finalisieren und die Masterdatei bauen:

```bash
npm run science:flow-master -- "<video-ordner>"
```

Der Ordnername `reels/` und die Composition `ScienceReel` bleiben vorerst nur aus Rückwärtskompatibilität bestehen.

## Preflight

```bash
npm run science:preflight -- "<video-ordner>"
```

Der Preflight prüft Story-/Skriptstruktur, Quellen, Szenenplanung, Einzelprompts, Thumbnail-Prompt, Flow-Plan, Google-Flow-Masterprompt und Produktionsdateien.

## Asset-Readiness

```bash
npm run science:ready -- "<video-ordner>"
```

Danach müssen Voice, genau ein freigegebenes 16:9-Ausgangsbild pro Beat, alle im Flow-Plan vorgesehenen KI-Clips sowie mindestens drei Thumbnail-Kandidaten mit genau einem finalen Gewinner vorhanden sein.

## Fertigstellen

```bash
npm run science:finish -- "<video-ordner>"
```

Die Pipeline verarbeitet die Voice auf exakt 1,10×, normalisiert die Lautheit, erstellt lokale Wortzeiten mit `whisper.cpp`, synchronisiert Bilder/Flow-Clips und Untertitel, rendert 1920×1080 und führt Render-QA aus.

## Remotion-Grenze

Remotion darf fertige Bilder und fertige Google-Flow-Clips abspielen. Remotion erzeugt selbst keinen Zoom, Pan, Ken Burns, Parallax oder wissenschaftliche Animation.

Ein Google-Flow-Image-to-Video-Clip ist ausdrücklich erlaubt: Die wissenschaftliche Bewegung wird vorher in Flow erzeugt; Remotion spielt den fertigen Clip nur ab.

## Altes Referenzprojekt

`channels/science/reels/2026-09-28_bis_2026-10-04/01_Warum-ist-der-Himmel-blau/`

Dieses Projekt bleibt nur als **Legacy-Referenz für Recherche/Quellen** erhalten und darf nicht als aktuelle Medienworkflow-Vorlage behandelt werden.

## Aktive Architektur

- Kanal: `channels/science/`
- Zielgruppe: Jugendliche und junge Erwachsene
- Themenprofil: Alltagswissenschaft & Technik
- Produktionsprofil: `youtube-2min-v1`
- Medienmodus: `flow-mixed-assets`
- Renderer: intern weiterhin `ScienceReel`
- Runtime: `science-runtime.json`
- technische Remotion-Grenze: `science-static-v1`
- Bildwelt: `scientific-scene-explainer-v1`
- Flow-Regeln: `gehirn/FLOW-WORKFLOW.md`
- Befehle: ausschließlich `science:*`
