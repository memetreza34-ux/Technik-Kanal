# Science Image Prompt Template

Jeder Szenenprompt folgt demselben Grundvertrag.

## 1. Wissenschaftliche Aussage

```text
The viewer must immediately understand exactly one scientific statement: [GENAUE FACHLICHE AUSSAGE].
```

## 2. Erklärdarstellung wählen

Vor dem Prompt wird entschieden, welche Darstellungsform die Aussage am besten erklärt:

- real object
- cutaway
- cross-section
- exploded view
- macro
- micro / molecular
- before-and-after
- controlled experiment setup
- spatial process
- cosmic scale relationship

Keine abstrakte Sci-Fi-Darstellung wählen, wenn ein klarer Cutaway oder Aufbau möglich ist.

## 3. Hauptmotiv

```text
Show one dominant explanatory subject: [HAUPTMOTIV].
Make the cause-and-effect relationship or internal structure visually obvious.
Use only the supporting elements necessary to understand this one statement.
Do not introduce a second competing concept.
```

## 4. Bildwelt

```text
Scientific Cutaway 3D Explainer.
High-end stylized scientific 3D explanation image, scientifically plausible, realistic materials and believable proportions, adult premium educational look, clear cause-and-effect, clean spatial structure, strong mobile readability, restrained lighting, minimal decorative glow, no sci-fi spectacle.
Prefer real objects, cutaways, cross-sections, macro or micro views when they explain the idea better than an abstract scene.
```

## 5. Farbsemantik

Nur fachlich sinnvolle Akzente verwenden:

- Cyan/Blau: Energie, Strom, Signal
- Gold/Gelb: Fokus oder relevante Energie
- Orange: Wärme
- Rot: Gefahr/kritischer Zustand
- Violett: nur für fachlich passende Felder, Plasma oder kosmische Vorgänge
- natürliche Stofffarben für reale Materialien und Stoffe

## 6. Textfreie Basisbilder + spätere Labels

Jeder Prompt muss enthalten:

```text
No visible text, labels, letters, numbers, formulas, units, logos, watermark or fake type plate in the generated image.
Leave clean visual space near important components so controlled German labels can be added later as static overlays.
```

Wenn wichtige Elemente beschriftet werden sollen, muss der Prompt zusätzlich nennen:

```text
Label targets to keep visually distinct: [MAXIMAL 1–3 ZIELE].
```

Die KI soll die Begriffe **nicht** rendern. Sie soll nur klare Zielobjekte und Platz für spätere Labels schaffen.

## 7. Layout

```text
Vertical 9:16, full-bleed edge-to-edge.
Make the main explanatory subject large and dominant.
Keep the upper 18 percent reasonably calm for optional title text.
Keep the lower 25 percent calm enough for subtitles.
If labels are planned, reserve clean side space and keep each label target clearly visible.
No white or gray bars, no letterboxing, no decorative split background.
```

## 8. Keine Motion-Cues

```text
The final still image must fully explain the idea without animation.
Do not rely on camera movement, zoom, pan, parallax, motion blur, animated particles or later motion effects.
```

## 9. Cover / Bild 01

Bild 01 ist zugleich erste Szene und Cover-Hintergrund.

- drei unterschiedliche Kompositionsvarianten
- gleiche zentrale Frage
- gleicher Scientific-Cutaway-Stil
- ein starkes Hauptmotiv
- keine separate Thumbnail-Bildwelt
- Gewinnerbild muss klein noch klar verständlich sein

## Negativprompt

```text
Pixar, clay, childish cartoon, generic schoolbook 2D diagram, abstract sci-fi art, glowing energy orb, fantasy machinery, excessive neon, excessive bloom, heavy fog, decorative particles, fake science, impossible physics, wrong wiring, random cables, visible text, labels, letters, numbers, formulas, logos, watermark, UI dashboard, HUD, overcrowded schematic, tiny subject, white border, gray strip, letterboxing, unnecessary arrows, motion blur
```

## Dateinamen

```text
02-bilder/prompts/NN-szenenname.txt
02-bilder/images/NN-szenenname/NN-szenenname-final.png
```
