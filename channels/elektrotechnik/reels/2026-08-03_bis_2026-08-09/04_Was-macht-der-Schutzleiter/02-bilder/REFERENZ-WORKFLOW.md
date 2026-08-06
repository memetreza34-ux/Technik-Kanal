# Referenz-Workflow für hochwertige Bilder

Die Bilder nicht mehr als zehn unabhängige Generierungen erzeugen.

## 1. Referenz MOTOR-A

Zuerst den Cover-Hintergrund erzeugen. Das beste Ergebnis als Referenzbild für Szene 01, 02, 04 und 09 verwenden. Der Motor, die Metallfarbe, die PE-Verbindung und das allgemeine Materialbild sollen erkennbar gleich bleiben.

## 2. Referenz CABINET-B

Danach Szene 06 erzeugen. Das beste Schaltschrankbild als Referenz für Szene 07 und 08 verwenden. Gehäusefarbe, DIN-Schiene, Klemmen und Licht sollen gleich bleiben.

## 3. Mechanismus-Szenen

Szene 03 und 05 benötigen kein Google-Flow-Bild. Sie werden als ruhige, kontrollierte Remotion-Szenen gebaut.

## 4. Keine KI-Schrift

Die Basisbilder bleiben textfrei. Nach dem Einfügen der Bilder wird die deutsche Beschriftung fehlerfrei in das finale PNG eingebrannt:

```bash
npm run electrical:label-images -- "channels/elektrotechnik/reels/2026-08-03_bis_2026-08-09/04_Was-macht-der-Schutzleiter"
```

Die fertigen Dateien liegen anschließend unter:

```text
02-bilder/final-labeled/
```

Damit ist die Beschriftung im Bild selbst enthalten, aber nicht von der Bild-KI geschrieben.
