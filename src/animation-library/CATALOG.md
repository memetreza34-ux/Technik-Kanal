# Katalog der Animationsbibliothek

Vor jeder neuen Animation zuerst diesen Katalog prüfen.

## Statuswerte

- `bereit` – technisch und visuell geprüft, regulär verwendbar
- `in Prüfung` – vorhanden, aber noch nicht final abgenommen
- `veraltet` – nicht mehr für neue Reels verwenden

## Verfügbare Animationen

| Name | Kategorie | Zweck | Wichtige Props | Status | Datei |
|---|---|---|---|---|---|
| `BreakerTripAnimation` | `protection` | Darstellung eines Leitungsschutzschalters vom eingeschalteten bis zum ausgelösten Zustand | `progress`, `label`, `width`, `height`, `activeColor`, `tripColor`, `onText`, `trippedText` | `bereit` | `protection/BreakerTripAnimation.tsx` |

## Kategorien ohne Eintrag

Für diese Kategorien existiert noch keine freigegebene Bibliotheksanimation. Wird eine passende Darstellung benötigt, muss sie neu erstellt, geprüft und hier eingetragen werden.

- `circuits`
- `components`
- `measurement`
- `fields-signals`
- `data-logic`
- `explanation-ui`

## Neuer Katalogeintrag

Bei jeder neuen Animation dokumentieren:

- exakter Komponentenname
- Kategorie
- fachlicher Zweck
- wichtigste Props
- Prüfstatus
- Dateipfad
- optional: erstes Reel, in dem sie verwendet wurde
