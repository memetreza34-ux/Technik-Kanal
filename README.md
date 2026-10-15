## Phase 1 – Kopierlink für Google Flow und Voice

Nach dem fertigen Skript und allen Einzelbildprompts genügt **ein Befehl**: `npm run science:phase1 -- "VIDEO_ORDNER"`. Dieser baut den Masterprompt neu, führt die Qualitätsprüfungen aus und erstellt die Kopiermappe. Bei bestandener Prüfung entsteht im Videoordner **`PHASE-1-START-HIER.md`** mit vollständigem Skript, Flow-Masterprompt und Links zu allen Einzelprompts. Diese Datei samt Prompts **committen/pushen**, dann dem Nutzer den ausgegebenen **GitHub-Direktlink** schicken. Kein lokaler Pfad statt Link. Anleitung: `channels/science/gehirn/FLOW-WORKFLOW.md`.

> **OBERSTE PRIORITÄT 1 – WISSONAUT KONTINUIERLICH VERBESSERN:** Vor jedem Video die Erkenntnisse der bisherigen Videos berücksichtigen; nach jedem Rendern eine redaktionelle Qualitätsprüfung und nach der Veröffentlichung eine datenbasierte YouTube-Auswertung durchführen. Pflicht: [VERBESSERUNGSSYSTEM](channels/science/gehirn/VERBESSERUNGSSYSTEM.md). Mehr relevante Aufrufe und Abonnenten sind messbare Ziele, keine Garantie.

# Alltagswissenschaft & Technik

Produktionssystem für einen deutschsprachigen Faceless-Wissenskanal über **greifbare Alltagswissenschaft und Technik** für Jugendliche und junge Erwachsene.

Der Kanal ist bewusst kein allgemeines Wissenschaftslexikon. Bevorzugt werden konkrete, visuell erklärbare Themen aus Alltagsphysik, Elektrotechnik, Energie, Maschinen, Verkehr, Infrastruktur, Materialien, einfacher Alltagschemie, Wetter und greifbarer Astronomie.

## Aktives Produktionsprofil

**`youtube-2min-v1`**

- normales YouTube-Video, kein Reel
- 1920×1080 / 16:9 / 30 fps
- 90–150 Sekunden, 120 Sekunden ideal
- 230–370 Wörter, 300 ideal
- 12–28 visuelle Beats, 20 ideal
- separates 1280×720-Thumbnail mit drei Kandidaten
- Google Flow erzeugt **nur statische Bilder**
- keine KI-Videoclips / kein Image-to-Video
- Remotion montiert Bilder mit harten Schnitten, Voice, Captions und optionalen SFX

Der spätere Ausbau auf etwa 8–12 Minuten bekommt ein eigenes Profil.

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
→ Einzelprompts + flow-plan.json
→ GOOGLE-FLOW-MASTER-PROMPT.txt
→ Preflight
→ 3 Thumbnail-Kandidaten
→ STOPP + Nutzerauswahl
→ Bild 01 → prüfen/speichern
→ Bild 02 → prüfen/speichern
→ ... bis zum letzten Beat
→ Voice-over
→ lokale Wort-Zeitstempel
→ statische 16:9-Montage
→ Untertitel + optionale SFX
→ Render
→ QA
```

## Google Flow

Verbindlich: `channels/science/gehirn/FLOW-WORKFLOW.md`.

Für jedes aktive Video gibt es **eine Masterdatei**: `02-bilder/GOOGLE-FLOW-MASTER-PROMPT.txt`. Sie enthält den Thumbnail-Prompt und alle Szenenprompts in Reihenfolge.

Flow erzeugt zuerst genau drei Thumbnail-Kandidaten und stoppt anschließend bis zur Nutzerauswahl. Danach werden die Szenenbilder **streng einzeln nacheinander** erzeugt. Jeder Beat erhält genau ein finales statisches Bild.

## Story-System

Verbindliche Dramaturgie:

**Hook → Kontext → Grundlage → Mechanismus → Vertiefung → Payoff**

Nicht automatisch ein Satz pro Bild. **Eine verständliche visuelle Aussage = ein Beat.**

## Bildwelt

Aktive Bildwelt: **Scientific Scene Explainer v1**.

> Nicht einfach ein Bild vom Thema erzeugen, sondern eine visuelle Szene bauen, die die konkrete Aussage des Beats erklärt.

Sichtbarer Bildtext ist ausschließlich Deutsch. Leitregel: **so wenig Information wie möglich, so viel wie nötig**.

## Remotion

Remotion ist reine Montage- und Export-Schicht. Erlaubt sind statische Bilder, harte Schnitte, Voice, Untertitel, statische Overlays bei echtem Nutzen, optionale SFX und Export. Nicht erlaubt sind Zoom, Pan, Ken Burns, Parallax, Rotation oder wissenschaftliche Animationen.

## Befehle

```bash
npm run science:new -- --week=YYYY-MM-DD_bis_YYYY-MM-DD --slot=01 --title="Wie funktioniert ein Induktionsherd?" --hook="Wie funktioniert ein Induktionsherd?" --scenes=20
npm run science:flow-master -- "<video-ordner>"
npm run science:preflight -- "<video-ordner>"
npm run science:ready -- "<video-ordner>"
npm run science:finish -- "<video-ordner>"
```

Interne Namen wie `ScienceReel`, `reels/` und einzelne `electrical-*`-Dateinamen bleiben vorerst nur aus Rückwärtskompatibilität bestehen.
