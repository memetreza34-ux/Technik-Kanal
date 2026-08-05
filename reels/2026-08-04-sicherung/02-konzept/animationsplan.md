# Animationsplan – Sicherungs-Reel

**Composition:** `SicherungsReel`  
**FPS:** 30  
**Gesamtdauer:** 2070 Frames / 69 Sekunden

## Grundregeln

- Bewegung beginnt erst, wenn der zugehörige Begriff gesprochen wird.
- Keine dauerhaften Kamerazooms als Ersatz für Erklärung.
- Pro Zeitpunkt höchstens zwei Informationsebenen.
- Zustandsfarben: Blau = normal, Gold = Erklärung, Orange = Wärme/Überlast, Rot = Fehler/Auslösung.
- Captions bleiben mindestens 260 px über der Unterkante und 150 px vom rechten Rand entfernt.

| Szene | Zeit / Frames | Hauptanimation | Exakter Ablauf | Bibliothek |
|---|---|---|---|---|
| 1 Hook | 0–6 s / 0–180 | LSS löst aus | Frame 0–55 Titel; 65–125 Schaltergriff kippt; ab 105 Ursache-Karten links/rechts sichtbar | `protection/BreakerTripAnimation` |
| 2 Schutzaufgabe | 6–13 s / 180–390 | Leitung erwärmt sich | Kabel startet blau; 230–350 Farbwechsel Richtung Rot; Schutzschild bleibt als Gegenwirkung sichtbar | lokale Szenenkomposition, später bei Wiederverwendung nach `protection` auslagern |
| 3 Überlast | 13–21 s / 390–630 | Verbraucher erhöhen Strom | Geräte bei 420, 465 und 510 aktivieren; Strombalken von 18 % auf 100 %; Ergebnis erst nach der Steigerung | `explanation-ui/CurrentLevelBar` |
| 4 Bimetall | 21–29 s / 630–870 | thermische Auslösung | 650–830 Wärme steigt; Bimetall biegt bis 28 Grad; Entriegelungshebel bewegt sich am Ende; `ZEITVERZÖGERT` erscheint | `protection/ThermalBimetalTripAnimation` |
| 5 Kurzschluss | 29–36 s / 870–1080 | Leiterkontakt + Stromsprung | 900–950 Leiter nähern sich; 950–1000 kurzer Lichtbogen; 945–985 Strombalken springt auf Maximum | `circuits/ShortCircuitContactAnimation`, `explanation-ui/CurrentLevelBar` |
| 6 Magnetauslösung | 36–43 s / 1080–1290 | Spule zieht Anker | 1100–1180 Feldringe aufbauen, Anker anziehen und Kontakt öffnen; Ergebnistext danach halten | `protection/MagneticInstantTripAnimation` |
| 7 Vergleich | 43–50 s / 1290–1500 | zwei Reaktionswege | linke Karte zuerst ruhig; rechte Karte danach schneller; Merkwörter erst nach Mechanismen einblenden | bestehende Kartenkomposition; bei Wiederverwendung als `explanation-ui/TripMethodComparison` auslagern |
| 8 Reaktion | 50–57 s / 1500–1710 | Geräte aus, einmal resetten | 1510–1590 Geräteseite absenken/ausblenden; 1580–1660 Schalter von ausgelöst auf ein; nur eine Bewegung | `protection/BreakerTripAnimation` |
| 9 Grenze | 57–63 s / 1710–1890 | erneutes Auslösen | 1740–1790 erneute Auslösung; Warnkarte erst danach; keine Hand- oder Werkzeuganimation | `protection/BreakerTripAnimation` |
| 10 LSS/FI + CTA | 63–69 s / 1890–2070 | Gerätevergleich und CTA | LSS und FI gleichzeitig zeigen; Unterschiedskarte; CTA in separater unterer Karte; letzter Impuls auf `SICHERUNG` | `protection/BreakerTripAnimation` plus statische FI-Karte |

## Übergänge

- Szenenwechsel: 14 Frames Ein-/Ausblendung.
- Keine 3D-Rotation des gesamten Bildes.
- Mechanische Bewegungen: kurze Ease-in-out-Kurve.
- Kurzschluss und Magnetauslösung: schneller als Bimetall, aber nicht als unlesbarer Einzel-Frame.
- CTA mindestens 2 Sekunden vollständig lesbar halten.

## Bibliotheksstatus nach diesem Reel

- `BreakerTripAnimation` – im Reel verwendet
- `CurrentLevelBar` – im Reel verwendet
- `ThermalBimetalTripAnimation` – im Reel verwendet
- `ShortCircuitContactAnimation` – im Reel verwendet
- `MagneticInstantTripAnimation` – im Reel verwendet

Vor Status `bereit` müssen TypeScript-Prüfung und Kontrollframes erfolgreich sein.
