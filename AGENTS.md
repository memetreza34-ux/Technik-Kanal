# Technik verstehen – Anleitung für KI-Agenten (Antigravity, Claude, …)

YouTube-Kanal „Technik verstehen“: Technik einfach erklärt, auf Deutsch. Gebaut mit **Remotion** (React-Videos) und **Three.js** (3D). Zwei Formate:

- **Shorts** (9:16, 1080×1920) – animiert, oft 3D. Regeln: [docs/RAHMEN.md](docs/RAHMEN.md), feste Regeln in [CLAUDE.md](CLAUDE.md).
- **Langvideos** (16:9, 1920×1080) – beschriftete Standbilder im Takt des Voiceovers. Regeln: [docs/BILDWELT-LANGVIDEO.md](docs/BILDWELT-LANGVIDEO.md).

Sprache in allen Texten, Labels und Untertiteln: **Deutsch**. Fachlich korrekt, Quellen in `quellen.md` pro Video.

## Einrichten
```bash
npm install
npm run studio          # Remotion Studio zum Ansehen aller Kompositionen
```
Benötigt Node ≥ 20 und `ffmpeg`/`ffprobe`.

## Langvideo bauen (Vorlage: `videos/2026-11-15_test-studio-look/`)
Die Vorlage ist abgenommen – neue Videos genauso aufbauen:

```
videos/<datum>_<thema>/
  script-fliesstext.txt   Sprechtext
  audio/voiceover.wav     Stimme (nicht im Git, lokal)
  audio/captions.json     Wort-Zeitmarken (startMs je Wort)
  bildplan.md             pro Satz: Zeit, Bildtyp, Licht, was zu sehen ist, Labels, Prompt
  bilder/B01.jpeg …       KI-Bilder OHNE Text
  beschriftung/B01.json   Labels/Pfeile pro Bild (Props der Composition „Illustration“)
  beschriftung/B01.png    gerendertes beschriftetes Standbild
  video.json              Props der Composition „Bildfolge“
  export/video.mp4        fertiges Video (nicht im Git)
```

1. **Bildplan** aus Skript + `captions.json` schreiben (Vorlage: `bildplan.md` im Testvideo).
2. **Bilder erzeugen** mit dem Prompt-Muster aus `docs/BILDWELT-LANGVIDEO.md` Abschnitt 5 – **nie Text im Bild**. Wiederkehrende Orte/Geräte mit Referenzbild. Jedes Bild gegen die Checkliste (Abschnitt 6) prüfen, ungenaue Bilder neu erzeugen.
3. **Bilder nach** `public/illustration/<thema>/` kopieren (Remotion lädt aus `public/`).
4. **Beschriften:** `beschriftung/B0x.json`, dann
   ```bash
   npx remotion still src/index.ts Illustration videos/<ordner>/beschriftung/B01.png --props=videos/<ordner>/beschriftung/B01.json
   ```
   Max. 4 Labels, Text nicht an den Bildrand. Helle Bilder: `"theme": "light"`.
5. **Video:** `video.json` = `{audio, end, scenes:[{start, image, labels:[{…, in}], arrows:[{…, in}], zoom?}]}`. `in` = Sekunde ab Bildbeginn, wann das Label erscheint (Zeitpunkt des gesprochenen Wortes). Voiceover nach `public/render-input/<name>.wav` kopieren, dann
   ```bash
   npx remotion render src/index.ts Bildfolge videos/<ordner>/export/video.mp4 --props=videos/<ordner>/video.json --codec=h264 --audio-codec=aac --crf=18
   ```

Code: `src/illustration/Illustration.tsx` (Beschriftung), `src/illustration/Bildfolge.tsx` (Video aus Bildern).

## Short bauen
Ablauf und Skripte: `npm run short:captions`, `npm run short:stage`, `npm run short:render` (siehe `scripts/`). Szenen in `src/short/scenes/`, 3D-Maßstab `src/short/scenes/Waermepumpe.tsx`. Jeder Short ist individuell gestaltet.

## Bilder und Clips mit Google Flow erzeugen
Bilder (Nano Banana, 0 Credits) und Videoclips (Veo/Omni, kosten Credits) kommen aus **Google Flow** über den MCP-Server `flow-mcp`:

- Code: `~/flow-mcp` (nicht in diesem Repo), Build `npm run build`.
- Das **Flow-Studio** muss laufen: `cd ~/flow-mcp && npm run studio` (Port 8787). Es steuert ein eigenes Chrome (Profil `~/.flow-mcp/chrome-profile`), in dem Google Flow angemeldet ist.
- MCP-Server im Agenten eintragen: Befehl `node`, Argument `~/flow-mcp/dist/index.js` (als absoluter Pfad). Tools: `flow_status`, `flow_generate` (Typ `image` oder `video`), `flow_agent_images`, `flow_wait`, `flow_download`.
- Immer zuerst `flow_status`. Vor Videoclips die Credit-Kosten nennen und bestätigen lassen.
- Ausgabe landet in `~/flow-mcp-out/<projekt>/`; danach in den Videoordner (`bilder/`) kopieren.
- Fehlerbild „Timeout … waiting for getByRole('button', …)“ = Google hat die Flow-Oberfläche geändert → Knopfnamen in `~/flow-mcp/src/flow.ts` anpassen, neu bauen, **Studio neu starten**.

## Feste Regeln
- **Alle Dateien auf der externen SSD** (`/Volumes/T7`), nie auf dem internen Mac-Speicher – auch Renders, Downloads und Flow-Ausgabe.
- Bildwelt Langvideo: „Technik + Schema“, Geräte in echter Umgebung, Look eines 3D-Animationsfilms (Render-Stufe 2+, Prompt-Vorlage im Handbuch), Technik korrekt. Verworfen: Fotorealismus, Spielzeug-/Knet-3D, 2D-Cartoon, Neon, graue Isometrie.
- Text kommt nie aus der KI – alle Beschriftungen setzt Remotion.
- Eigener Name „Technik verstehen“, Blitz, Gelb – keine fremden Marken.
- Bestehende Videos nur auf ausdrücklichen Wunsch umbauen.
