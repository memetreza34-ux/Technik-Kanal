# Motion Design – FI/RCD

## Grundprinzip

Bild-first, aber die eigentliche elektrische Funktion wird mit wiederverwendbaren Remotion-Mechanismen erklärt. Zoom allein zählt nicht als Mechanismus-Animation.

## Szenen

| Szene | Hauptbewegung | Bibliothek / Layer |
|---|---|---|
| 01 | Fehlerstrom zweigt ab, FI-Hebel fällt | `ResidualCurrentBalanceAnimation`, `RcdContactTripAnimation` |
| 02 | sanfter Cutaway-Reveal | Engine-Header + RCD-Gerätekarte |
| 03 | gleich große Strompfeile, Felder löschen sich | `ResidualCurrentBalanceAnimation` balanced |
| 04 | roter Fehlerweg entsteht zur Erde | eigener Earth-Leakage-Layer |
| 05 | Rückstrom wird kleiner, Differenz wächst | `ResidualCurrentBalanceAnimation` fault |
| 06 | Restmagnetfeld pulsiert und Sekundärsignal läuft | `ResidualCurrentBalanceAnimation` signal |
| 07 | Auslöser entriegelt und Kontakte öffnen | `RcdContactTripAnimation` |
| 08 | `30 mA` erscheint als Gerätekenngröße | Zahlen-Badge, kein Alarm-Countdown |
| 09 | FI und LS werden funktional gegenübergestellt | zwei Geräte in einem kontinuierlichen Layout |
| 10 | Überbrücken wird durchgestrichen, sichere Schritte erscheinen | Warning-/Payoff-Layer |

## Bewegung

- harte Schnitte oder maximal acht Frames Crossfade
- pro Bild nur minimaler 1,00→1,035-Zoom
- elektrische Pfade bewegen sich semantisch entlang der Leiter
- Rot erscheint ausschließlich bei Fehlerstrom oder Warnung
- keine unnötigen Partikel

## Caption-Safe-Zone

Unterhalb von 75 % Bildhöhe keine wichtigen Mechanismusteile platzieren.
