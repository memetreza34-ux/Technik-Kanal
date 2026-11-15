# Rahmen für alle Shorts (1080 × 1920)

Vorlage: Aufbau der Reels von @haustechnikehrlich (Bild für Bild ausgemessen, Nov. 2026) –
übernommen ist nur das **Raster**, nicht Name, Logo oder Farben. Seitdem nach Armans Wünschen vereinfacht.

## Zonen (von oben nach unten)

| Zone | y (px) | Inhalt | Regel |
|---|---|---|---|
| Rand oben | 0–410 | nichts | Inhalt sitzt **mittig**, nicht oben |
| Bühne | 420–1185 | das Objekt / die Animation | Objekt füllt 50–70 % der Zone |
| Untertitel | 1420–1510 | **Haupttext**, immer genau eine Zeile, im unteren Drittel, 58 px | max. 860 px breit; zu lang → wird kleiner, nie zweizeilig |
| Ruhezone | 1530–1920 | nichts | App-Beschreibung + Knöpfe liegen hier |

Seitenränder: 80 px links, 120 px rechts zwischen y 900–1700 (Like/Kommentar-Knöpfe).

## Regeln

1. **Untertitel = Haupttext.** Zusätzlich erlaubt: kleine Zwischenüberschrift oben (`Heading`) und kurze Markierungen am Bauteil (`Marker`). Keine Datenkarten, kein Merksatz.
2. **Betonung per Farbe im Untertitel**: das Schlüsselwort gelb hinterlegt (`Mark`); Phasen/Bauteile dürfen in ihrer Farbe stehen. Bei Stimme: das gerade gesprochene Wort ist farbig.
3. **Zahlen stehen im Untertitel**, wenn sie gesagt werden – nicht als extra Karte.
4. **Kein Fortschrittsbalken, keine Marke oben.**
5. **Übergang zwischen Kapiteln**: Kamerafahrt, Aufschneiden, Scan – nie harter Sprung mit Text.
6. **Jeder Short ist individuell** – Welt, Farben und Bühne passen zum Thema (Theme `light` oder `dark`).
7. **Bei richtiger 3D-Animation ist die Nacht-Welt der Maßstab** (Vorlage `src/short/scenes/Waermepumpe.tsx`): Welt → Kamerafahrt ins Gerät, aufschneiden → zurück in die Totale; leuchtende Teilchen, warmes Licht, Atmosphäre.

Code: `src/frame/Frame.tsx` (Zonen `Z`, `CaptionSlot`, `Mark`, `Shade`, `ZoneGuide`). `Heading` und `Marker` sind erlaubt, `CardSlot` nur für alte Videos.
