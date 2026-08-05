# Elektrotechnik Image Prompt Template

Jeder Szenenprompt besteht aus vier Teilen.

## 1. Aussage

```text
The viewer must immediately understand: [GENAUE TECHNISCHE AUSSAGE].
```

## 2. Konkrete Szene

```text
Show [HAUPTBAUTEIL ODER MECHANISMUS] in [NORMALZUSTAND / ÜBERLAST / FEHLER / AUSLÖSUNG].
The dominant visual action is [EINDEUTIGE BEWEGUNG ODER ZUSTANDSÄNDERUNG].
Use only these supporting elements: [MAXIMAL 3–5 ELEMENTE].
```

## 3. Beschriftungen

```text
Optional short German labels: [MAXIMAL 3–5 LABELS MIT JE 1–3 WÖRTERN].
Do not generate a headline, subtitle, paragraph, CTA, logo, watermark or fake type plate.
```

## 4. Masterstil

Den vollständigen Block aus `MASTER-STYLE-PROMPT.md` unverändert anhängen.

## Sicherheits- und Layoutblock

Jeder Prompt muss ausdrücklich enthalten:

```text
Keep the entire top 15 percent clear for a later headline.
Keep the entire bottom 25 percent clear for later subtitles.
Use one seamless edge-to-edge background with no white or gray border, no split background and no visible seam.
Make the main subject large and dominant outside the reserved zones.
Do not show exposed live work, hands touching energized parts, protective-device bypassing or impossible wiring.
Any device or platform must sit flush with no visible gap underneath.
```

## Negativprompt

```text
photorealism, real person, Pixar, clay, childish cartoon, wrong wiring, impossible terminals, fake labels, unreadable text, exposed energized conductor, live-work hands, bypassed protection device, explosion, fantasy machinery, floating unrelated icons, UI dashboard, overcrowded schematic, tiny central subject, blank margin, white border, gray strip, letterboxing, split background, banded background, visible seam, floating device, gap under pedestal, logo, watermark, title, subtitle, CTA
```

## Dateiname

```text
02-bilder/prompts/NN-szenenname.txt
02-bilder/images/NN-szenenname/NN-szenenname-final.png
```

Das Bild ist erst freigegeben, wenn die Aussage ohne Prompt verständlich ist und die obere sowie untere Sicherheitszone tatsächlich frei bleiben.
