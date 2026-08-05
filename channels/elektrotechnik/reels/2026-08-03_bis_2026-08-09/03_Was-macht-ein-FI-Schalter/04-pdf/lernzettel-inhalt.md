# Lernzettel: FI-Schalter / RCD

## 1. Aufgabe

Ein Fehlerstrom-Schutzschalter – umgangssprachlich FI, technisch RCD – vergleicht den Strom, der in einen Stromkreis hinein- und wieder zurückfließt.

## 2. Normalzustand

- Strom über den Außenleiter hinaus
- gleich großer Strom über den Neutralleiter zurück
- magnetische Wirkungen im Summenstromwandler heben sich auf
- kein Auslösesignal

## 3. Fehlerfall

Bei einem Isolationsfehler kann ein Teil des Stroms einen anderen Weg nehmen, zum Beispiel über ein leitfähiges Gehäuse und den Schutzleiter zur Erde.

Dann gilt:

```text
Hin-Strom ≠ Rück-Strom
```

Die Differenz heißt Fehler- beziehungsweise Differenzstrom.

## 4. Auslösung

1. Der Summenstromwandler erkennt ein verbleibendes Magnetfeld.
2. In seiner Sekundärwicklung entsteht ein Signal.
3. Der Auslöser entriegelt das Schaltschloss.
4. Die Kontakte öffnen.
5. Der betroffene Stromkreis wird abgeschaltet.

## 5. Bedeutung von 30 mA

RCDs mit einem Bemessungsdifferenzstrom von höchstens 30 mA werden häufig für zusätzlichen Personenschutz eingesetzt. `30 mA` ist eine Gerätekenngröße und darf nicht als Garantie verstanden werden, dass jeder elektrische Unfall verhindert wird.

## 6. FI/RCD versus LS

| Schutzgerät | Reagiert hauptsächlich auf | Schutzziel |
|---|---|---|
| FI / RCD | Differenz- beziehungsweise Fehlerstrom | zusätzlicher Schutz bei Fehlerströmen |
| LS | Überlast und Kurzschluss | Schutz der Leitung vor unzulässig hoher Erwärmung und Kurzschlussfolgen |

**Merksatz:** Der FI beobachtet, ob Strom fehlt. Der LS beobachtet, ob zu viel Strom fließt.

## 7. Sicher reagieren

- Geräte ausschalten und Stecker ziehen, soweit gefahrlos möglich.
- Schutzgerät niemals überbrücken.
- Nicht ständig blind zurücksetzen.
- Bei wiederholtem Auslösen Ursache durch eine Elektrofachkraft prüfen lassen.
- Keine Arbeiten an geöffneten oder spannungsführenden Anlagenteilen durchführen.

## 8. Prüfungsfrage

**Warum löst ein RCD aus?**

Weil der über alle aktiven Leiter gemessene Summenstrom nicht mehr null ist. Ein Teil des Stroms fließt über einen unerwünschten Weg ab; der RCD erkennt die Differenz und öffnet seine Kontakte.
