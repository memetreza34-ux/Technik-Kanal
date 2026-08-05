# Bildprompt-Paket – Warum fliegt die Sicherung raus?

## Verwendung

Die technische Erklärung entsteht primär in Remotion. Die folgenden Prompts sind für hochwertige Hintergrund- oder Objektbilder gedacht. Formeln, Überschriften, Werte, Pfeile und Beschriftungen werden **nicht** im KI-Bild erzeugt, sondern kontrolliert in Remotion gesetzt.

## Globaler Stilblock

Diesen Stilblock an jeden Prompt anhängen:

```text
premium 3D educational illustration for a German electrical engineering short-form video, physically plausible components, clean industrial product visualization, dark navy technical environment, electric blue normal-state accents, warm gold explanation accents, orange and red only for heat or fault states, realistic materials with slightly stylized clarity, cinematic soft rim lighting, high contrast, crisp edges, uncluttered composition, vertical 9:16, 1080x1920 framing, large central subject, no people, no hands, no logos, no watermark, no captions, no labels, no letters, no numbers, no formulas, no decorative sparks, reserve the upper 320 pixels for title graphics, reserve the lower 400 pixels for subtitles and CTA, keep the rightmost 170 pixels free of essential details
```

## Globaler Negativblock

```text
wrong wiring, impossible terminals, exposed live work by a person, burned house, explosion, dramatic fireball, fantasy machinery, random circuit boards, unreadable text, fake labels, symbols, equations, watermark, brand logo, human face, hands, clutter, tiny subject, low resolution, flat stock photo, childish cartoon, excessive neon, unsafe electrical behavior
```

---

## Bild 01 – Hook: ausgelöster Leitungsschutzschalter

**Dateiname:** `01-hook-breaker-trip.png`  
**Einsatz:** 0–6 s, optional als Produkt-Hintergrund hinter der Remotion-Auslösung

```text
A single modern DIN-rail miniature circuit breaker shown as a premium cutaway product render, centered and slightly angled toward the viewer, toggle in the tripped middle-to-down position, subtle red fault glow inside the mechanism, two clean empty visual zones on the lower left and lower right for later overlay cards representing two different causes, realistic molded plastic housing and metal terminals, controlled studio lighting, no visible brand and no printed text
```

**Spätere Remotion-Ebene:** Schalterbewegung, `ÜBERLAST`, `KURZSCHLUSS`.

---

## Bild 02 – Leitung wird geschützt

**Dateiname:** `02-cable-heating-protection.png`  
**Einsatz:** 6–13 s

```text
A technically plausible cross-section of an insulated copper cable running horizontally through the center, copper conductor clearly visible inside intact insulation, the left half cool with electric-blue energy flow and the right half gradually warming to orange without melting, a clean protective boundary shape behind the cable suggesting interruption before dangerous overheating, large open space around the cable for animated labels, educational cutaway view, no flames and no damaged building
```

**Spätere Remotion-Ebene:** Temperaturwechsel, Schutzschild, Markierung der Leitung.

---

## Bild 03 – Überlast durch mehrere Verbraucher

**Dateiname:** `03-overload-appliances.png`  
**Einsatz:** 13–21 s

```text
Three recognizable high-power household appliances arranged in a clean technical display: an electric space heater, an electric kettle and an oven, each connected by an individual cable that visually converges toward one protected circuit path at the bottom center, all plugs and cables physically plausible, no overloaded multi-socket chaos, generous spacing between the three appliances, dark premium educational stage, leave a wide empty horizontal zone below them for an animated current bar
```

**Spätere Remotion-Ebene:** Geräte nacheinander aktivieren, Strombalken erhöhen.

---

## Bild 04 – Thermische Bimetall-Auslösung

**Dateiname:** `04-bimetal-cutaway.png`  
**Einsatz:** 21–29 s; empfohlen ist die reine Bibliotheksanimation, Bild nur als optionale Tiefenebene

```text
Macro cutaway view inside a miniature circuit breaker showing a simplified but technically credible curved bimetal strip, fixed at one end and positioned near a mechanical release latch, cool blue at the fixed end and gradually warmer orange toward the bending end, enough separation between parts to make the bending direction obvious, clean educational mechanism visualization, no text and no random extra components
```

**Spätere Remotion-Ebene:** `ThermalBimetalTripAnimation`, Wärmeverlauf, Biegung, Entriegelung.

---

## Bild 05 – Kurzschlusskontakt

**Dateiname:** `05-short-circuit-contact.png`  
**Einsatz:** 29–36 s; empfohlen ist die reine Bibliotheksanimation

```text
Two insulated conductors entering from opposite sides in a controlled educational cutaway, one phase-colored warm red and one neutral-colored blue, only the exposed conductor tips approaching each other in the center, a very small clean electrical arc at the contact point, no explosion, no human interaction, dark technical background, clear visual path and large open area below for an animated current indicator
```

**Spätere Remotion-Ebene:** `ShortCircuitContactAnimation`, kurzer Lichtimpuls, sprunghafter Strombalken.

---

## Bild 06 – Magnetischer Schnellauslöser

**Dateiname:** `06-magnetic-instant-trip.png`  
**Einsatz:** 36–43 s; empfohlen ist die reine Bibliotheksanimation

```text
A simplified technical cutaway of the electromagnetic instantaneous release inside a miniature circuit breaker, visible copper coil on the left, movable metal armature in the center and a release lever on the right, components aligned on one clear horizontal action path, subtle electric-blue magnetic field glow around the energized coil, red only at the opening contact, premium mechanical educational visualization, no labels
```

**Spätere Remotion-Ebene:** `MagneticInstantTripAnimation`, Feldaufbau, Ankerbewegung, Kontaktöffnung.

---

## Bild 07 – Vergleich Überlast und Kurzschluss

**Dateiname:** `07-overload-vs-short-circuit.png`  
**Einsatz:** 43–50 s

```text
A clean vertical split educational composition with two equally sized technical panels: left panel shows a warm orange bimetal strip slowly bending with a subtle clock-like progression, right panel shows a blue electromagnetic coil pulling a metal armature instantly with a crisp red contact opening, both panels use matching camera angle and scale, clear visual comparison, no text, no arrows, no numbers
```

**Spätere Remotion-Ebene:** Überschriften, `LANGSAMER`, `SEHR SCHNELL`, zeitlich versetzte Reveals.

---

## Bild 08 – Geräte ausschalten und einmal zurücksetzen

**Dateiname:** `08-safe-reset-sequence.png`  
**Einsatz:** 50–57 s

```text
A safe instructional still life with disconnected household appliance plugs resting clearly away from sockets on the left and a closed electrical distribution board with a single visible miniature circuit breaker on the right, no hands, no exposed conductors, no open enclosure, calm blue normal-state lighting, a clear empty center gap for an animated directional arrow, premium realistic educational render
```

**Spätere Remotion-Ebene:** Geräte ausblenden, Pfeil, einmalige Rücksetzbewegung.

---

## Bild 09 – Erneutes Auslösen: klare Grenze

**Dateiname:** `09-retrip-warning.png`  
**Einsatz:** 57–63 s

```text
A closed household electrical distribution board viewed front-on, one miniature circuit breaker visibly in the tripped position, subtle red warning rim light around only that breaker, the rest of the installation calm and intact, no person, no tools, no open cover, no exposed live parts, large empty lower area for a professional safety warning card
```

**Spätere Remotion-Ebene:** erneute Auslösung, Warnsymbol, Hinweis zur fachgerechten Prüfung.

---

## Bild 10 – LSS ist nicht FI + CTA

**Dateiname:** `10-lss-vs-rcd.png`  
**Einsatz:** 63–69 s

```text
Two different DIN-rail protective devices displayed side by side as clean unbranded product renders: a standard miniature circuit breaker on the left and a residual-current protective device with a clearly different front design and test-button area on the right, equal visual scale, neutral front-facing angle, premium studio background, large empty lower half for a call-to-action card, no printed labels or brand markings
```

**Spätere Remotion-Ebene:** kontrollierte Labels `LSS`, `FI`, `ANDERE SCHUTZAUFGABE`, CTA `SICHERUNG`.

---

## Cover-/Thumbnail-Prompt

**Dateiname:** `cover-warum-fliegt-die-sicherung.png`

```text
A dramatic but technically clean close-up of one unbranded miniature circuit breaker at the exact moment its toggle snaps to the tripped position, premium dark navy electrical engineering background, controlled red fault glow inside the breaker and electric-blue rim light outside, centered large object, strong visual contrast, generous clean space above and below for later German headline typography, no fire, no explosion, no text, no symbols, vertical 9:16 social media cover
```

## Qualitätsprüfung jedes generierten Bildes

- Bauteil eindeutig erkennbar
- keine falschen oder frei schwebenden Anschlüsse
- keine Schriftartefakte
- kein Logo oder Herstellername
- keine Person und keine Arbeit an offenen Netzspannungsanlagen
- vorgesehene Freiflächen wirklich vorhanden
- Bild unterstützt genau den jeweiligen Satz
- ungeeignete Bilder nicht durch Maskierung retten, sondern neu generieren
