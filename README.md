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
- statische Bilder + harte Schnitte

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
→ Bild- + Thumbnail-Prompts
→ Preflight
→ Bilder + 3 Thumbnail-Kandidaten
→ Voice-over
→ Asset-Readiness
→ lokale Wort-Zeitstempel
→ Skript-/Voice-Ausrichtung
→ statische 16:9-Montage
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

## Thumbnail

Bild 01 ist **nicht** mehr das Thumbnail.

Für jedes Video werden drei separate 1280×720-Kandidaten geplant und ein Gewinner gewählt. Titel, Thumbnail und Hook müssen dasselbe inhaltliche Versprechen geben.

## Neues Video

```bash
npm run science:new -- \
  --week=2026-10-01_bis_2026-10-07 \
  --slot=01 \
  --title="Wie funktioniert ein Induktionsherd?" \
  --hook="Wie funktioniert ein Induktionsherd?" \
  --scenes=20
```

Der Ordnername `reels/` und die Composition `ScienceReel` bleiben vorerst nur aus Rückwärtskompatibilität bestehen.

## Preflight

```bash
npm run science:preflight -- "<video-ordner>"
```

Der Preflight prüft Story-/Skriptstruktur, Quellen, Szenenplanung, Bildprompts, Thumbnail-Prompt und Produktionsdateien.

## Asset-Readiness

```bash
npm run science:ready -- "<video-ordner>"
```

Danach müssen Voice, genau ein freigegebenes statisches 16:9-Bild pro Beat sowie mindestens drei Thumbnail-Kandidaten mit genau einem finalen Gewinner vorhanden sein.

## Fertigstellen

```bash
npm run science:finish -- "<video-ordner>"
```

Die Pipeline verarbeitet die Voice auf exakt 1,10×, normalisiert die Lautheit, erstellt lokale Wortzeiten mit `whisper.cpp`, synchronisiert Bilder und Untertitel, rendert 1920×1080 und führt Render-QA aus.

## Altes Referenzprojekt

`channels/science/reels/2026-09-28_bis_2026-10-04/01_Warum-ist-der-Himmel-blau/`

Dieses Projekt bleibt nur als **Legacy-Referenz für Recherche/Quellen** erhalten. Es entspricht noch nicht dem neuen `youtube-2min-v1`-Produktionsvertrag und darf nicht als fertige Longform-Vorlage behandelt werden.

## Aktive Architektur

- Kanal: `channels/science/`
- Zielgruppe: Jugendliche und junge Erwachsene
- Themenprofil: Alltagswissenschaft & Technik
- Produktionsprofil: `youtube-2min-v1`
- Renderer: intern weiterhin `ScienceReel`
- Runtime: `science-runtime.json`
- technische Visual Policy: `science-static-v1`
- Bildwelt: `scientific-scene-explainer-v1`
- Befehle: ausschließlich `science:*`
