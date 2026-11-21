# Technik verstehen – Anleitung für KI-Agenten (Codex, Antigravity, Claude)

YouTube-Kanal „Technik verstehen“: Technik einfach erklärt, auf **Deutsch**. Gebaut mit **Remotion** (React-Videos) und **Three.js** (3D). Diese Datei reicht, um ohne Vorwissen **Shorts und Langvideos komplett** zu bauen: Skript → Stimme → Untertitel → Bilder/Animation → Render → Prüfen.

| Format | Größe | Art | Regeln |
|---|---|---|---|
| **Short** | 9:16, 1080×1920, 30 fps | animierte Szene (oft 3D), Untertitel | [CLAUDE.md](CLAUDE.md), [docs/RAHMEN.md](docs/RAHMEN.md) |
| **Langvideo** | 16:9, 1920×1080, 30 fps | beschriftete KI-Standbilder im Takt der Stimme | [docs/BILDWELT-LANGVIDEO.md](docs/BILDWELT-LANGVIDEO.md) |

Mit dem Nutzer (Arman) immer **Deutsch**, kurz und einfach. Fachlich korrekt, Quellen pro Video in `quellen.md`.

---

## 0. Voraussetzungen (vor jeder Aufgabe prüfen)

- **Alles liegt auf der externen SSD, nie auf dem Mac-Speicher.** Die SSD `T7` und das Disk-Image `Mac-Projekte` müssen eingehängt sein:
  ```bash
  ls /Volumes/T7 /Volumes/Mac-Projekte/Home/Technik >/dev/null && echo ok
  ```
  Fehlt `/Volumes/Mac-Projekte`: `hdiutil attach /Volumes/T7/Mac-Projekte.sparsebundle`. Fehlt die T7 ganz: aufhören und den Nutzer fragen – **nicht** auf den Mac ausweichen.
- Projekt: `/Volumes/Mac-Projekte/Home/Technik` (`~/Technik` ist nur ein Link darauf). Neue Dateien, Renders, Downloads, temporäre Dateien immer dort oder unter `/Volumes/T7/…`.
- Werkzeuge: Node ≥ 20, `ffmpeg`/`ffprobe`. Einmalig `npm install`.
- Ansehen aller Kompositionen: `npm run studio` (Remotion Studio).
- Nach Änderungen am Code: `npm run check` (TypeScript + Repo-Prüfung) muss grün sein.

## 1. Stimme (für beide Formate gleich)

Sprechtext steht in `<ordner>/script-fliesstext.txt` (ein Satz pro Zeile ist gut). Stimme = Armans geklonte Kanalstimme (Qwen3-TTS, lokal, kostenlos):
```bash
npm run voice:youtube -- --dir <ordner>          # schreibt <ordner>/audio/voiceover.wav
npm run voice:youtube -- --dir <ordner> --dry-run  # nur Satzaufteilung + Längenschätzung
```
Benötigt die Python-Umgebung `~/finanzneo-tts/.venv` (liegt auf der SSD) und die Referenz `channel/audio/reference/user_voice_reference.wav`. Danach wortgenaue Zeitmarken:
```bash
npm run short:captions -- <ordner>               # schreibt <ordner>/audio/captions.json (Whisper, Text 1:1 aus dem Skript)
```
Funktioniert für `shorts/…` und `videos/…`. `.wav`/`.mp4` kommen nicht ins Git.

## 2. Short bauen

Vorlagen: `shorts/2026-11-15_waermepumpe/` (3D, Nacht-Welt – **der Maßstab**), weitere in `shorts/`.

```
shorts/<YYYY-MM-DD>_<thema>/
  script-fliesstext.txt   Sprechtext
  short.json              Titel, Szene, Theme, Kapitel (s. u.)
  quellen.md              Quellen
  audio/voiceover.wav     Stimme (nicht im Git)
  audio/captions.json     Wort-Zeitmarken
  export/short.mp4        fertiger Short (nicht im Git)
```

`short.json`:
```json
{"format":"short-9x16","title":"…?","status":"draft","scene":"<szenen-id>","style":"frame","theme":"dark","overlays":true,
 "scenes":[{"id":"frage","text":"erster Satz …"},{"id":"…","text":"…"}]}
```
Die `scenes[].text` müssen zusammen genau dem Sprechtext entsprechen; die `id`s sind die Kapitel/Beats, an denen die Animation umschaltet.

Ablauf:
1. Ordner + `script-fliesstext.txt` + `short.json` + `quellen.md` anlegen.
2. Stimme + Untertitel (Abschnitt 1).
3. **Szene bauen:** neue Datei `src/short/scenes/<Name>.tsx` (Vorlage `Waermepumpe.tsx` für 3D, `Wechselrichter.tsx`/`WendeschuetzScene.tsx` für 2D/Schaltplan) und in `src/short/ShortVideo.tsx` in `SCENES` unter der `scene`-ID aus `short.json` eintragen. Optional Geräusche in `SFX`.
4. Vorschau: `npm run short:stage -- shorts/<ordner>` und dann `npm run studio` → Komposition `TechnikShort`.
5. Render: `npm run short:render -- shorts/<ordner>` → `export/short.mp4`.
6. Prüfen (Abschnitt 5).

**Feste Regeln Shorts** (Details [docs/RAHMEN.md](docs/RAHMEN.md), Bausteine `src/frame/Frame.tsx`: `Z`, `CaptionSlot`, `Mark`, `Shade`, `Heading`, `Marker`):
- Jeder Short ist **individuell**: Welt, Farben, Bühne passen zum Thema; das echte Gerät im Alltag statt abstrakter Kästen.
- Bei 3D: **Nacht-Welt ist der Maßstab** – Welt drumherum (z. B. aufgeschnittenes Haus), Kamerafahrt ins Gerät, aufschneiden, Ströme als leuchtende Teilchen, am Ende zurück in die Totale.
- Text: **Untertitel ist der Haupttext**, genau **eine Zeile**, max. 860 px breit, bei **y 1420**, Schlüsselwort farbig. Erlaubt zusätzlich: kleine Zwischenüberschrift oben (`Heading`) und kurze Markierungen am Bauteil (`Marker`). **Keine** Karten, Merksätze, Fortschrittsbalken, Kanal-Marke.
- **Unten ab y 1530 frei** (App-Bedienung). Seitenrand rechts 120 px zwischen y 900–1700 frei.

## 3. Langvideo bauen

Vorlage (abgenommen): `videos/2026-11-15_test-studio-look/` – genauso aufbauen.

```
videos/<YYYY-MM-DD>_<thema>/
  script-fliesstext.txt   Sprechtext
  quellen.md              Quellen
  audio/voiceover.wav     Stimme (nicht im Git)
  audio/captions.json     Wort-Zeitmarken
  bildplan.md             pro Satz: Zeit, Bildtyp, Licht, was zu sehen ist, Labels, Prompt
  bilder/B01.jpeg …       KI-Bilder OHNE Text
  beschriftung/B01.json   Labels/Pfeile pro Bild (Props der Komposition „Illustration“)
  beschriftung/B01.png    gerendertes beschriftetes Standbild
  video.json              Props der Komposition „Bildfolge“
  export/video.mp4        fertiges Video (nicht im Git)
```

1. Ordner, Skript, Quellen; Stimme + Untertitel (Abschnitt 1).
2. **Bildplan** aus Skript + `captions.json` (Zeiten der Sätze). Bildtypen und Wechsel nach Handbuch Abschnitt 3.
3. **Bilder erzeugen** (Abschnitt 4) mit der Prompt-Vorlage aus dem Handbuch Abschnitt 5 – Look **Render-Stufe 2+ „animiert“** (3D-Animationsfilm-Look, Technik korrekt), **nie Text im Bild**, wiederkehrende Orte mit Referenzbild. Jedes Bild gegen die Checkliste (Handbuch Abschnitt 6) prüfen; ungenaue Bilder neu erzeugen.
4. Bilder nach `public/illustration/<thema>/` kopieren (Remotion lädt aus `public/`).
5. **Beschriften** (`beschriftung/B0x.json`, max. 4 Labels, nicht an den Rand, helle Bilder `"theme":"light"`):
   ```bash
   npx remotion still src/index.ts Illustration videos/<ordner>/beschriftung/B01.png --props=videos/<ordner>/beschriftung/B01.json
   ```
6. **Video:** `video.json` = `{audio, end, scenes:[{start, image, title?, theme?, labels:[{at,text,sub?,to?,tone?,in}], arrows:[{from,to,tone?,curve?,in}], zoom?}]}`. `start` = Sekunde, ab der das Bild steht; `in` = Sekunde ab Bildbeginn, wann das Label erscheint (Zeitpunkt des Wortes aus `captions.json`). Zoom Standard 3 %, Grafiken `"zoom":[1,1]`. Voiceover nach `public/render-input/<name>.wav` kopieren:
   ```bash
   npx remotion render src/index.ts Bildfolge videos/<ordner>/export/video.mp4 --props=videos/<ordner>/video.json --codec=h264 --audio-codec=aac --crf=18
   ```
7. Prüfen (Abschnitt 5).

Code: `src/illustration/Illustration.tsx` (Beschriftung), `src/illustration/Bildfolge.tsx` (Video aus Bildern). Labels: `tone` = `main` (orange), `signal` (cyan), `danger` (rot), `plain`; `at` = Textanker, `to` = Punkt am Bauteil, Koordinaten in 1920×1080.

## 4. Bilder und Clips mit Google Flow

Bilder (Nano Banana, **0 Credits**) und Videoclips (Veo/Omni, **kosten Credits**) kommen aus **Google Flow** über den MCP-Server `flow` (`node /Users/arman/flow-mcp/dist/index.js`, Ausgabe-Umgebung `FLOW_MCP_OUTPUT=/Volumes/T7/flow-mcp-out`). In Codex (`~/.codex/config.toml`) und Antigravity (`~/.gemini/antigravity/mcp_config.json`) ist er eingetragen.

- Immer zuerst `flow_status`. Meldet es „no project is open“: Nutzer bitten, im Flow-Chrome ein Projekt zu öffnen.
- Bilder: `flow_generate` mit `type:"image"`, `aspect_ratio:"16:9"` (Langvideo) bzw. `"9:16"` (Short), `max_credits:0`. Konsistenz: `reference_previous:true` oder `reference_images`. Dann `flow_wait` wiederholen, bis `finished:true`.
- Videoclips: **vorher Credit-Kosten nennen und Bestätigung holen.**
- Ausgabe: `/Volumes/T7/flow-mcp-out/<projekt>/scene-NN.jpeg` → in den Videoordner (`bilder/`) kopieren.
- Aufträge arbeitet das **Flow-Studio** (Port 8787) bzw. der erste laufende `flow`-Prozess ab. Studio starten: `cd ~/flow-mcp && npm run studio`. Nach Änderungen am Werkzeug-Code: `npm run build` und Studio neu starten.
- Fehler „Timeout … waiting for getByRole('button', …)“ = Google hat die Flow-Oberfläche geändert → Knopfnamen in `~/flow-mcp/src/flow.ts` anpassen (Knöpfe lassen sich über Chrome-Debugport 9333 auslesen).

## 5. Prüfen vor Abgabe

- Einzelbilder an mehreren Zeitpunkten ziehen und ansehen: `ffmpeg -ss <s> -i export/<datei>.mp4 -frames:v 1 frame.png`.
- Nichts abgeschnitten, Text lesbar, Labels erscheinen zum richtigen Wort, Untertitel (Short) eine Zeile, unten frei.
- Technik fachlich korrekt (Teile, Reihenfolge, Zahlen = Quellen).
- `npm run check` grün.
- Dem Nutzer sagen, was geprüft wurde und was nicht (z. B. Ton nicht angehört).

## 6. Git

- Remote: `github.com/memetreza34-ux/Technik-Kanal` (**öffentlich** – keine Schlüssel, Passwörter, privaten Daten committen).
- Auf einem Feature-Branch arbeiten, nicht direkt auf `main`. Commit-Nachrichten auf Deutsch. Nur committen/pushen, wenn der Nutzer es will.

## 7. Feste Regeln (immer)

- **Alle Dateien auf der SSD**, nie auf dem Mac-Speicher.
- **Text kommt nie aus der KI** – alle Beschriftungen und Untertitel setzt Remotion.
- Eigener Name „Technik verstehen“, Blitz, Gelb – keine fremden Marken oder Kanäle kopieren.
- Langvideo-Look: „Technik + Schema“, Geräte in echter Umgebung, Render-Stufe 2+. Verworfen: Fotorealismus, Spielzeug-/Knet-3D, flacher 2D-Cartoon, Neon, graue Isometrie.
- Bestehende Videos nur auf ausdrücklichen Wunsch umbauen.
