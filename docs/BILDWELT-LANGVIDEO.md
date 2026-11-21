# Bildwelt für Langvideos (16:9) – Handbuch

Stand 21.11.2026. Langvideos bestehen aus **Standbildern** (keine Animation wie bei den Shorts). Jedes Bild muss deshalb allein die Aussage tragen: sofort verständlich, unterhaltsam, sauber – kein KI-Slop.

## 1. Fester Kern (gleich in jedem Video)
Entscheidung 16.11.2026 nach Moodboard echter Kanäle: **„Technik + Schema“** (Richtung The Engineering Mindset – eigene Version, keine Kopie).
- **Render-Stufe 2+ – „animiert“** (Entscheidung Arman 21.11.2026, ersetzt Stufe 2): Look eines 3D-Animationsfilms – weich abgerundete Kanten, vereinfachte saubere Formen, kräftige warme Farben, stilisiertes weiches Licht mit Randlicht, Atmosphäre (z. B. fallender Schnee). Technik bleibt korrekt in Aufbau und Proportionen. Nicht fotoreal, nicht spielzeughaft/Plastik, keine Cartoon-Gesichter. Vergleich alt/neu: `docs/bildwelt-technik-animiert-plus.jpg`, Beispiele: `docs/bildwelten/technik-animiert-plus/`.
- **Echte Umgebung als Standard:** Das Gerät steht dort, wo es wirklich ist (LS-Schalter im Sicherungskasten im Flur, Motor im Akkuschrauber auf der Werkbank, Induktionsspule unter dem Topf in der Küche) – sauber gerendert, Gehäuse aufgeschnitten, Strom/Feld/Wärme als farbige Leucht-Ebene darüber. Beispiele: `docs/bildwelten/technik-umgebung/`.
- **Blaupausen-Blau mit Raster** nur für reine Prinzip-/Schema-Momente.
- **Lokal passend:** deutsche Steckdosen (Schuko), deutsche Straßen/Häuser, deutsche Normfarben.
- **Bauteile:** einfache, saubere 3D-Renderings echter Komponenten (Magnete, Spulen, Eisenkerne, Schalter, Gehäuse im Schnitt) – technisch korrekt, nicht verspielt.
- **Schema-Ebene:** dünne weiße Leitungen mit rechten Winkeln, gestrichelte gelbe Strompfade, Cyan für Magnetfluss, Rot für Fehlerstrom, Phasenfarben braun/schwarz/grau, Schutzleiter grün-gelb.
- **Menschen** nur als schlichte Drahtgitter-/Linienfigur, keine Cartoon-Gesichter.
- **Text kommt nie aus der KI.** Labels, Titel, Pfeile, Formeln, Diagramme setzen wir selbst (`src/illustration/`, Composition „Illustration“).
- **Beschriftung:** Magazin-Callouts ohne Kästen – Text + kurze Unterzeile, farbige Unterstreichung geht direkt in die Hinweislinie über, Ring-Punkt am Bauteil; max. 4 Labels pro Bild; Titel klein oben links mit Orange-Strich; `focus` dunkelt den Rest ab.
- Beispiele: `docs/bildwelten/technik-schema/` (8 Themen + 2 beschriftet).

Verworfen (nicht wieder vorschlagen): Fotorealismus/Doku-Foto, Spielzeug-/Knet-3D, flacher 2D-Cartoon, Neon, graue Isometrie.

## 2. Variabel (pro Video und pro Szene neu entscheiden)
| Stellschraube | Beispiele |
|---|---|
| Tageszeit / Licht | Morgen-Sonne, Tag, Abendgold, Nacht, kaltes Technikraum-Licht |
| Umgebung | Wohnung, Büro, Straße, Keller, Werkstatt, Studio, historisch |
| Hintergrund | Welt (voller Raum) · neutrales Studio (hell/dunkel) · Papier (für Grafiken) |
| Stimmung | Alltag/Humor · Spannung/Gefahr · Ruhe/Erklären · Geschichte |
| Akzentfarbe | je Thema eine eigene Zusatzfarbe (z. B. Grün bei Solar, Blau bei Wasser) |

**Regel:** Licht und Umgebung folgen der Aussage der Szene. Gleiches Licht über ein ganzes Video ist ein Fehler.

## 3. Bildtypen – welcher Satz bekommt welches Bild?
| Bildtyp | wofür | Hintergrund |
|---|---|---|
| **Alltags-Szene** | Hook, „kennst du das?“, Personen, Humor | Welt, passende Tageszeit |
| **Welt-Totale** | Wo sitzt das Ding? (Haus, Stadt, Anlage aufgeschnitten) | Welt |
| **Gerät** | Wie sieht es aus? | Technikraum oder Studio |
| **Schnitt / Detail** | Wie funktioniert es innen? Ein Bauteil, Rest neutral | helles/dunkles Studio, viel Freiraum |
| **Dramatischer Moment** | Was passiert im Fehlerfall? | Welt, starke Lichtstimmung |
| **Geschichte** | Erfinder, Jahreszahl, Herkunft | Sepia/Gaslicht |
| **Erklär-Grafik** | Diagramm, Formel, Rechnung, Mindmap, Ablauf, Vergleich | Papier oder Studio, leere Fläche – Inhalt setzen wir selbst |
| **Auflösung** | Ergebnis, Erleichterung, Alltag wieder normal | Welt, warmes Licht |

Faustregel für 10 Minuten: ca. 40–70 Bilder, alle 8–15 s ein neues Bild, nie zwei gleiche Bildtypen hintereinander.

## 4. Ablauf pro Video
**Vorlage:** `videos/2026-11-15_test-studio-look/` (Wärmepumpe, 40 s) – von Arman am 20.11.2026 als Maßstab abgenommen: Aufbau, Beschriftung und Animation passen. Die Bilder darin sind noch Stufe 2 – neue Videos im Look Stufe 2+. Für jedes neue Video genauso aufbauen (`bildplan.md`, `bilder/`, `beschriftung/`, `video.json`, `export/`).

1. **Skript in Szenen zerlegen:** pro Aussage eine Zeile in `bildplan.md`: Zeit (aus `audio/captions.json`) → Satz → Bildtyp → Licht/Umgebung → was MUSS zu sehen sein → Labels.
2. **Prompt bauen** (Vorlage unten), **ohne jeden Text im Bild**, mit Freiraum dort, wo später Labels hinkommen.
3. **Bilder erzeugen** (`flow_generate` Typ `image`, 0 Credits; `flow_agent_images` für große Stapel). Wiederkehrende Orte/Geräte immer mit Referenzbild (`reference_previous` oder `reference_images`). Nach `bilder/B01.jpeg …` kopieren.
4. **Prüfen** (Checkliste 6.), schlechte Bilder sofort neu – nicht durchwinken.
5. **Beschriften:** pro Bild `beschriftung/B0x.json` (Props der Composition „Illustration“), Bild liegt in `public/illustration/<thema>/`. Helle Bilder `theme: "light"` (dunkle Schrift). Max. 4 Labels, nichts am Bildrand (Zoom schneidet bis 3 % ab).
6. **Video:** Composition „Bildfolge“ (`src/illustration/Bildfolge.tsx`) mit `video.json`: Startzeit pro Bild, jedes Label/jeder Pfeil bekommt `in` = Sekunde des passenden Wortes ab Bildbeginn. Zoom 3 % pro Bild, Grafiken ohne Zoom. Render-Befehl steht im `bildplan.md` der Vorlage.

## 5. Prompt-Vorlage (Englisch)
```
Still from a polished 3D ANIMATED FEATURE FILM style explainer: stylised but technically accurate, softly rounded bevelled edges, simplified clean shapes, rich saturated warm colours, soft stylised lighting with gentle rim light; not photorealistic, not toy-like or plastic.
The device in its REAL ENVIRONMENT, housing cut open, current as bold dashed glowing yellow line, magnetic field cyan, heat orange, air as soft semi-transparent wisps (never a pipe),
[LICHT/TAGESZEIT], [UMGEBUNG].
[WAS GENAU ZU SEHEN IST – ein Hauptobjekt, Zustand, Personen, Handlung].
[KAMERA: Totale / Halbnah / Nah / Untersicht].
Clear composition, empty space at the [right third / top] for labels.
Absolutely no text, no letters, no numbers, no signs, no arrows.
```

## 6. Anti-Slop-Checkliste (jedes Bild)
- [ ] Ist die Aussage in 2 Sekunden klar? Ein Hauptobjekt, Rest ruhig.
- [ ] Technik plausibel? (Teile an der richtigen Stelle, richtige Anzahl, nichts Erfundenes)
- [ ] **Kein KI-Text**, keine Fantasie-Schilder, keine Pseudo-Schrift.
- [ ] Kein Glitzer/Glow ohne Bedeutung – Leuchten nur am wichtigen Teil.
- [ ] Hände, Gesichter, Treppen, Seile: keine Verformungen.
- [ ] Passt Licht/Stimmung zur Szene – und unterscheidet es sich vom Bild davor?
- [ ] Gleiche Welt/Figur wie im restlichen Video (Referenz benutzt)?
- [ ] Freiraum für Labels vorhanden?
- [ ] **Genau wie beschrieben?** Jedes Detail aus dem Bildplan da, nichts dazuerfunden – sonst neu (Wunsch Arman 20.11.2026: mehr Genauigkeit).
- [ ] **Gleicher Ort = gleiches Bild:** wiederkehrendes Haus/Gerät mit Referenzbild, Form, Geschosse, Farbe vergleichen (Fehler im Test: Haus in B08 ≠ B01).
- [ ] **Ströme lesbar:** Luft als weiche, durchsichtige Schwaden, Strom als gestrichelte Leuchtlinie – nie als fester Schlauch (Fehler im Test: B01).
- [ ] **Proportionen echt:** Rohre, Lamellen, Bauteile im richtigen Größenverhältnis (Fehler im Test: B04 Rohr zu dick).
- [ ] Bei Hauptbildern 2 Varianten erzeugen und die genauere nehmen.

## 7. Referenzbilder
- `docs/bildwelten/technik-animiert-plus/` – **aktueller Stil** (Render-Stufe 2+, seit 21.11.2026)
- `docs/bildwelten/technik-animiert/`, `technik-umgebung/` – vorherige Stufe 2 (Aufbau/Umgebung weiter gültig, Look jetzt animierter)
- `docs/bildwelten/technik-schema/` – Blaupausen-Schema für Prinzip-Momente
- `docs/bildwelten/2d-stil/`, `2d-elektrotechnik/`, `wie-shorts/`, `szenen-variiert/`, `technik-stark-animiert/` – verworfene Versuche (nur zum Vergleich)
- `docs/bildwelten/erklaergrafiken/` – Look-Ideen für Grafiken (Text darin nur als Beispiel, nicht übernehmen)
- `docs/bildwelten/beschriftet/` – fertige Beispiele mit unserer Beschriftungs-Ebene
- `videos/2026-11-15_test-studio-look/beschriftung/uebersicht.jpg` – **abgenommene Vorlage** (8 Bilder beschriftet), Video in `export/video.mp4`
