# Katalog der Animationsbibliothek

Vor jeder neuen Animation zuerst diesen Katalog prüfen.

## Statuswerte

- `bereit` – technisch und visuell geprüft, regulär verwendbar
- `in Prüfung` – vorhanden und eingebaut, aber noch nicht final gerendert und abgenommen
- `veraltet` – nicht mehr für neue Reels verwenden

## Verfügbare Animationen

| Name | Kategorie | Zweck | Wichtige Props | Status | Datei | Erster Einsatz |
|---|---|---|---|---|---|---|
| `BreakerTripAnimation` | `protection` | Leitungsschutzschalter zwischen eingeschaltetem und ausgelöstem Zustand | `progress`, `label`, `width`, `height`, `activeColor`, `tripColor`, `onText`, `trippedText` | `in Prüfung` | `protection/BreakerTripAnimation.tsx` | Sicherungs-Reel |
| `ThermalBimetalTripAnimation` | `protection` | Erwärmung, Biegung und zeitverzögerte Auslösung eines Bimetalls | `progress`, `width`, `height`, `title`, `resultText`, Farben | `in Prüfung` | `protection/ThermalBimetalTripAnimation.tsx` | Sicherungs-Reel |
| `MagneticInstantTripAnimation` | `protection` | Feldaufbau, Ankerbewegung und schnelle magnetische Auslösung | `progress`, `width`, `height`, `title`, `resultText`, Farben | `in Prüfung` | `protection/MagneticInstantTripAnimation.tsx` | Sicherungs-Reel |
| `ShortCircuitContactAnimation` | `circuits` | Annäherung zweier Leiter und kontrollierter Kurzschlussimpuls | `progress`, `width`, `height`, Leiterfarben, `arcColor`, `label` | `in Prüfung` | `circuits/ShortCircuitContactAnimation.tsx` | Sicherungs-Reel |
| `CurrentLevelBar` | `explanation-ui` | animierte Darstellung eines steigenden oder gefährlich hohen Stromwerts | `value`, `width`, `height`, `danger`, `label`, `valueLabel`, Farben | `in Prüfung` | `explanation-ui/CurrentLevelBar.tsx` | Sicherungs-Reel |

## Kategorien ohne freigegebenen Eintrag

Für diese Kategorien existiert noch keine freigegebene Bibliotheksanimation. Wird eine passende Darstellung benötigt, muss sie neu erstellt, geprüft und hier eingetragen werden.

- `components`
- `measurement`
- `fields-signals`
- `data-logic`

## Freigabeablauf

1. TypeScript-Prüfung erfolgreich.
2. Start-, Mittel- und Endzustand gerendert.
3. Fachliche Bedeutung geprüft.
4. Mobile Lesbarkeit geprüft.
5. Erst danach Status von `in Prüfung` auf `bereit` ändern.

## Neuer Katalogeintrag

Bei jeder neuen Animation dokumentieren:

- exakter Komponentenname
- Kategorie
- fachlicher Zweck
- wichtigste Props
- Prüfstatus
- Dateipfad
- erstes Reel, in dem sie verwendet wurde
