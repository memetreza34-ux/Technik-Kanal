# Bildplan – Test: Wärmepumpe (39 s)

Nach [docs/BILDWELT-LANGVIDEO.md](../../docs/BILDWELT-LANGVIDEO.md): „Technik + Schema“, echte Umgebung, Render-Stufe 2. Zeiten aus `audio/captions.json`.
8 Bilder, im Schnitt alle ca. 5 s – kürzer als die Faustregel (8–15 s), weil der Test kurz ist und viel zeigt.

**Durchgehende Referenz:** dasselbe Haus und dasselbe Außengerät in B01, B02 und B08 (B01 als Referenzbild für B02/B08 mitgeben). Gerät: weißes Monoblock-Außengerät, ein großer runder Ventilator vorne, Technikfach rechts.

## Übersicht

| Nr | Zeit (s) | Satz | Bildtyp | Licht / Umgebung | Muss zu sehen sein | Labels (max. 4) |
|---|---|---|---|---|---|---|
| B01 | 0.0–5.6 | Draußen sind minus zehn Grad … mit genau dieser kalten Luft. | Welt-Totale | Blaue Stunde, Schnee, warme Fenster | Deutsches Einfamilienhaus im Schnee, Außengerät an der Hauswand, kalte Luft (Cyan) strömt hinein | „−10 °C“ Außenluft · „21 °C“ innen |
| B02 | 5.6–12.0 | Schauen wir uns das Außengerät … Nehmen wir die Front ab. | Gerät | Gleicher Abend, näher, Licht vom Fenster seitlich | Außengerät halbnah, Raureif an den Kanten, großer Ventilator | „Ventilator“ |
| B03 | 12.0–17.8 | Direkt hinter dem Ventilator sitzt der Verdampfer … Kupferrohren. | Schnitt / Detail | Dunkles neutrales Studio, kühles Licht | Front abgenommen, Ventilator halb transparent, dahinter Lamellen-Block mit Kupferrohren | „Verdampfer“ · „Aluminium-Lamellen“ · „Kupferrohre“ |
| B04 | 17.8–21.6 | Darin fließt ein Kältemittel, das schon bei rund minus vierzig Grad siedet. | Schnitt / Detail (Makro) | Helles Studio, viel Freiraum rechts | Ein Kupferrohr aufgeschnitten, Kältemittel flüssig → beginnt zu sieden (Blasen) | „Kältemittel (R290)“ · „siedet bei ca. −40 °C“ |
| B05 | 21.6–26.5 | Die Außenluft ist also immer noch wärmer. Sie gibt Wärme ab … verdampft. | Erklär-Grafik | Papier/Studio, leere Fläche | Nur Hintergrund – Inhalt setzen wir selbst: Temperatur-Leiter −10 °C (Luft) oben, −40 °C (Kältemittel) unten, Wärmepfeil (Orange) von oben nach unten | „Luft −10 °C“ · „Kältemittel −40 °C“ · „Wärme fließt“ |
| B06 | 26.5–32.4 | Daneben steht der Verdichter … über siebzig Grad. | Gerät / Schnitt | Technikfach, warmes dramatisches Licht | Verdichter (schwarzer Zylinder) im Fach neben dem Verdampfer, aufgeschnitten; Gas am Eingang Cyan, am Ausgang Orange-Rot glühend | „Verdichter“ · „über 70 °C“ |
| B07 | 32.4–37.8 | Zusammen ergibt das einen Kreislauf: verdampfen, verdichten, Wärme abgeben, Druck absenken. | Erklär-Grafik (Schema) | Blaupausen-Blau mit Raster | Nur Hintergrund – Schema setzen wir selbst: 4 Bauteile im Kreis, gestrichelte Pfade, kalt Cyan → heiß Orange | „verdampfen“ · „verdichten“ · „Wärme abgeben“ · „Druck absenken“ (nacheinander, synchron zum Wort) |
| B08 | 37.8–39.3 | Und dann alles von vorn. | Auflösung | Nacht, warmes Licht im Haus | Gleiches Haus wie B01, als Puppenhaus aufgeschnitten: warmes Wohnzimmer, Heizkörper/Fußbodenheizung warm, Außengerät läuft | – |

Kein Bildtyp zweimal direkt hintereinander außer B03→B04 (beides Schnitt, aber Totale-Schnitt → Makro mit anderem Licht; bewusst so).

## Prompts (Englisch, nach Vorlage)

Gemeinsamer Anfang für alle:
> Still from a high-quality 3D explainer ANIMATION (clean CG look, smooth simplified surfaces, no dirt, no photographic noise, saturated tasteful colours, soft clean lighting), 16:9.

Gemeinsames Ende für alle:
> Clear composition. Absolutely no text, no letters, no numbers, no signs, no arrows.

**B01** – Blue hour in winter, fresh snow. A typical German single-family house (white render, dark tiled pitched roof), warm yellow light in the windows. A white air-source heat pump outdoor unit stands on a small base next to the house wall. Cold outside air drawn into the unit shown as a soft glowing cyan stream. Wide shot, slightly elevated. Empty space in the upper left and right thirds for labels.

**B02** – Same house and outdoor unit as reference, blue hour, snow. Medium shot of the outdoor unit: one large round fan behind a protective grille on the front, technical compartment on the right, light frost on the edges, warm window light falling from the side. Camera at unit height. Empty space on the right third for labels.

**B03** – The same outdoor unit with its front panel removed, placed in a dark neutral studio with cool soft light. The fan is semi-transparent so the evaporator behind it is visible: a large block of thin aluminium fins traversed by bent copper tubes. Three-quarter view. Empty space at the left and top for labels.

**B04** – Macro cutaway in a bright neutral studio: a single copper tube cut open lengthwise between thin aluminium fins. Inside, liquid refrigerant starts to boil, small bubbles rising, the liquid shown in light cyan. Shallow but clean depth. Empty space on the right half for labels.

**B05** – Clean light-grey paper texture background, very subtle grid, completely empty, soft vignette. Nothing else. (Grafik kommt aus `src/illustration/`.)

**B06** – Inside the technical compartment of the outdoor unit, next to the evaporator: a black hermetic compressor cylinder with copper pipes, cut open. Gas entering glows cyan, gas leaving at the top glows bright orange-red. Warm dramatic side light, dark background. Medium close-up, low angle. Empty space on the left third for labels.

**B07** – Blueprint-blue background with a fine white engineering grid, completely empty. Nothing else. (Schema kommt aus `src/illustration/`.)

**B08** – Same house as reference, night, cut open like a dollhouse: warm cosy living room with warm-glowing radiator and underfloor heating shown in soft orange, the outdoor unit outside running, faint cyan air stream entering it. Wide shot, warm inviting light, snow outside.

## Stand Bilder (20.11.2026)
Erzeugt mit Flow (Nano Banana 2.1, Einzelmodus), liegen in `bilder/B01–B08.jpeg`. Checkliste:
- B01 ok – aber der Cyan-Luftstrom sieht aus wie ein Schlauch, nicht wie Luft.
- B02 ok – gleiches Haus und Gerät wie B01.
- B03 ok – Lamellen, Kupferrohre und Verdichter sichtbar.
- B04 ok – Rohr im Verhältnis zu den Lamellen sehr dick (stilisiert, vertretbar).
- B05 ok – leeres Papier mit Raster.
- B06 ok – Saugleitung Cyan unten, Druckleitung Orange oben, technisch richtig.
- B07 ok – Blaupause, Raster recht kräftig.
- B08 Haus passt nicht zu B01 (anderer Hausschnitt, nur 1,5 Geschosse), Rest gut.

## Beschriftung (20.11.2026)
Props pro Bild in `beschriftung/B0x.json`, fertige Bilder `beschriftung/B0x.png` (1920×1080), Übersicht `beschriftung/uebersicht.jpg`.
Rendern: `npx remotion still src/index.ts Illustration <out.png> --props=<json>` (Quelle der Bilder: `public/illustration/waermepumpe/`).
B04, B05, B06 nutzen `theme: light` (dunkle Schrift auf hellem Grund).

## Video (20.11.2026)
`export/video.mp4` (1920×1080, 40 s, mit Voiceover). Komposition `Bildfolge` (`src/illustration/Bildfolge.tsx`), Props in `video.json`: Startzeit pro Bild, Labels/Pfeile mit `in` (Sekunde ab Bildbeginn, passend zum gesprochenen Wort), Zoom 3 % pro Bild (Grafiken B05/B07 ohne Zoom).
Rendern: `npx remotion render src/index.ts Bildfolge videos/2026-11-15_test-studio-look/export/video.mp4 --props=videos/2026-11-15_test-studio-look/video.json --codec=h264 --audio-codec=aac --crf=18` (Audio vorher nach `public/render-input/waermepumpe-test.wav` kopieren).

## Offene Punkte
- B07: Label-Zeiten aus den Wort-Timestamps genau setzen (verdampfen ab 34.4 s).
- B04/B05: „rund minus vierzig Grad“ – Quelle sagt −42 °C (R290 bei 1 bar), passt.
- Danach: Bilder per `flow_agent_images` parallel erzeugen, Checkliste prüfen, beschriften.
