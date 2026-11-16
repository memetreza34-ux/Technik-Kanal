# Bildwelt für Langvideos (16:9) – Vorlage

Stand 16.11.2026. Gleicher Look wie die Shorts (Vorlage `src/short/scenes/Waermepumpe.tsx`), damit Kanal und Shorts zusammenpassen.

## Referenzbilder
`docs/bildwelten/wie-shorts/` (Aufzug-Storyboard, Google Flow / Nano Banana):
- `01-haus.jpeg` – **Welt-Vorlage**: aufgeschnittenes Haus bei Nacht (immer als Stil-Referenz mitgeben)
- `04-fliehkraftregler.jpeg`, `05-bremskeil.jpeg` – **Detail-Vorlage**: Glasgehäuse, aktives Teil leuchtet
- `07-uebersicht.jpeg` – **Schema-Vorlage**: leuchtendes Schema, Rest als Geisterform

`docs/bildwelten/erklaergrafiken/` – **Erklär-Grafiken** im selben Look: Diagramm, Formel, Rechnung, Mindmap, Vergleich, Zeitstrahl, Kräfte, Ablauf. Glas-Karten mit Leuchtrand, Text weiß, Ergebnis orange.

## Drei Ebenen
| Ebene | Anteil | Inhalt |
|---|---|---|
| Welt | ~15 % | Haus/Raum bei Nacht, warme Zimmer, Schnee, Sterne – zeigt *wo* das Gerät sitzt |
| Gerät | ~60 % | stilisiertes 3D-Gerät, Gehäuse aus Glas, Ströme als leuchtende Teilchen |
| Erklär-Grafik | ~25 % | Diagramme, Formeln, Rechnungen, Mindmaps, Ablauf-Schritte – im selben Look |

## Feste Regeln
- **Stil:** schlichte, saubere 3D-Formen, glatte Materialien, dunkles Navy, weiches Leuchten (Bloom). Nicht fotorealistisch, nicht kindlich.
- **Farben:** Orange = das Wichtige / Wärme / Kraft · Cyan = Signale, Seile, Strom · Rot = Fehler/Gefahr · Weiß = Text.
- **Text in Grafiken:** kurz, deutsch, schlichte weiße Schrift, dünne Hinweislinien. Wichtige Zahlen/Formeln später exakt in Remotion setzen – KI-Text immer prüfen.
- **Eine Aussage pro Bild**, ein Hauptobjekt.
- **Gleiche Welt im ganzen Video:** dasselbe Haus (01-haus) als Referenz, sonst wechseln Dach/Fassade.

## Prompt-Baustein (Englisch, an jeden Prompt hängen)
> Same simple clean stylized 3D look as the style references (copy only the style, not their objects): deep navy background, smooth materials, soft bloom, glowing particles, warm orange for the important part, cyan for signals, short clean white German labels with thin leader lines. Not photorealistic, not childish.

## Ehrliche Einschätzung
- **Stark:** einheitlich mit den Shorts, hochwertig, Mechanismen gut lesbar, Welt macht neugierig.
- **Risiko:** nur Nacht/Navy wird über 10 Minuten eintönig → je Kapitel Licht variieren (Abenddämmerung, Innenraum hell, Technikraum kühl).
- **Risiko:** KI-Bilder sind von Bild zu Bild nicht 100 % gleich → Referenzbilder immer mitgeben; Kamerafahrten und genaue Zahlen lieber in Remotion.
- **Grenze:** Formeln, Rechnungen, Diagramme müssen fachlich exakt sein → KI-Bild nur als Look-Vorlage, echte Werte in Remotion animieren.
