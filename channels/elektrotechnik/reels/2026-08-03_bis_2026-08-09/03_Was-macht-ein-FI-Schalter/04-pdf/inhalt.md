# Lernzettel: FI-Schalter / RCD

## Aufgabe

Ein Fehlerstrom-Schutzschalter – umgangssprachlich FI, technisch RCD – vergleicht den Strom, der in einen Stromkreis hinein- und wieder zurückfließt.

## Normalzustand

- Strom fließt über den Außenleiter zum Verbraucher.
- Derselbe Strom fließt über den Neutralleiter zurück.
- Die magnetischen Wirkungen im Summenstromwandler heben sich auf.
- Der FI bleibt eingeschaltet.

## Fehlerfall

Bei einem Isolationsfehler kann ein Teil des Stroms über einen unerwünschten Weg zur Erde abfließen. Dann gilt:

```text
Hin-Strom ≠ Rück-Strom
```

Die Differenz heißt Fehler- oder Differenzstrom.

## Auslösung

1. Der Summenstromwandler erkennt die Differenz.
2. Ein Auslösesignal wird erzeugt.
3. Das Schaltschloss löst aus.
4. Die Kontakte öffnen.
5. Der betroffene Stromkreis wird abgeschaltet.

## 30 mA

RCDs mit einem Bemessungsdifferenzstrom von nicht größer als 30 mA werden häufig für zusätzlichen Personenschutz eingesetzt. Das ist eine Gerätekenngröße und keine Garantie, dass jeder elektrische Unfall verhindert wird.

## FI/RCD und LS

| Schutzgerät | Reagiert auf |
|---|---|
| FI / RCD | Fehler- beziehungsweise Differenzstrom |
| LS | Überlast und Kurzschluss |

**Merksatz:** Der FI prüft, ob Strom fehlt. Der LS prüft, ob zu viel Strom fließt.

## Sicher reagieren

- Schutzgerät niemals überbrücken.
- Nicht ständig blind zurücksetzen.
- Geräte ausschalten und Stecker ziehen, soweit gefahrlos möglich.
- Wiederholtes Auslösen durch eine Elektrofachkraft prüfen lassen.
- Keine Arbeiten an geöffneten oder spannungsführenden Anlagenteilen durchführen.
