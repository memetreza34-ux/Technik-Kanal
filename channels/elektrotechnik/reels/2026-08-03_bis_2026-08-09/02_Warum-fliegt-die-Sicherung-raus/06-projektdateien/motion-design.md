# Animationen – Warum fliegt die Sicherung raus?

**Composition:** `SicherungsReel`  
**FPS:** 30  
**Gesamtdauer:** 2070 Frames / 69 Sekunden

## Grundregeln

- Bewegung beginnt erst, wenn der zugehörige Begriff gesprochen wird.
- Keine dauerhaften Kamerazooms als Ersatz für Erklärung.
- Pro Zeitpunkt höchstens zwei Informationsebenen.
- Blau = Normalzustand, Gold = Erklärung, Orange = Wärme/Überlast, Rot = Fehler/Auslösung.
- Captions mindestens 260 px über der Unterkante und 150 px vom rechten Rand entfernt.

| Szene | Zeit / Frames | Hauptanimation | Exakter Ablauf | Bibliothek |
|---|---|---|---|---|
| 1 Hook | 0–6 s / 0–180 | LSS löst aus | Frame 0–55 Titel; 65–125 Schaltergriff kippt; ab 105 Ursache-Karten sichtbar | `protection/BreakerTripAnimation` |
| 2 Schutzaufgabe | 6–13 s / 180–390 | Leitung erwärmt sich | Kabel startet blau; 230–350 Farbwechsel Richtung Rot; Schutzschild bleibt sichtbar | bei Wiederverwendung nach `protection` auslagern |
| 3 Überlast | 13–21 s / 390–630 | Verbraucher erhöhen Strom | Geräte bei 420, 465 und 510 aktivieren; Strombalken von 18 % auf 100 % | `explanation-ui/CurrentLevelBar` |
| 4 Bimetall | 21–29 s / 630–870 | thermische Auslösung | 650–830 Wärme steigt; Bimetall biegt sich; Entriegelung am Ende; `ZEITVERZÖGERT` erscheint | `protection/ThermalBimetalTripAnimation` |
| 5 Kurzschluss | 29–36 s / 870–1080 | Leiterkontakt + Stromsprung | 900–950 Leiter nähern sich; 950–1000 kurzer Lichtbogen; Strombalken springt auf Maximum | `circuits/ShortCircuitContactAnimation`, `explanation-ui/CurrentLevelBar` |
| 6 Magnetauslösung | 36–43 s / 1080–1290 | Spule zieht Anker | 1100–1180 Feld aufbauen, Anker anziehen, Kontakt öffnen | `protection/MagneticInstantTripAnimation` |
| 7 Vergleich | 43–50 s / 1290–1500 | zwei Reaktionswege | linke Karte zuerst ruhig; rechte Karte danach schneller; Merkwörter zuletzt | später optional `explanation-ui/TripMethodComparison` |
| 8 Reaktion | 50–57 s / 1500–1710 | Geräte aus, einmal resetten | 1510–1590 Geräte ausblenden; 1580–1660 Schalter von ausgelöst auf ein | `protection/BreakerTripAnimation` |
| 9 Grenze | 57–63 s / 1710–1890 | erneutes Auslösen | 1740–1790 erneute Auslösung; danach Warnkarte; keine Hände oder Werkzeuge | `protection/BreakerTripAnimation` |
| 10 LSS/FI + CTA | 63–69 s / 1890–2070 | Gerätevergleich + CTA | LSS und FI zeigen; Unterschiedskarte; CTA separat; letzter Impuls auf `SICHERUNG` | `protection/BreakerTripAnimation` plus FI-Karte |

## Übergänge

- Szenenwechsel: 14 Frames Ein-/Ausblendung.
- Keine 3D-Rotation des gesamten Bildes.
- Mechanische Bewegungen: kurze Ease-in-out-Kurve.
- Kurzschluss und Magnetauslösung sichtbar schneller als das Bimetall.
- CTA mindestens zwei Sekunden vollständig lesbar halten.

## Verwendete Bibliotheksanimationen

- `BreakerTripAnimation`
- `CurrentLevelBar`
- `ThermalBimetalTripAnimation`
- `ShortCircuitContactAnimation`
- `MagneticInstantTripAnimation`

Fehlt bei einem späteren Reel eine passende Animation, wird sie neu erstellt, richtig kategorisiert und in `src/animation-library/CATALOG.md` eingetragen.
