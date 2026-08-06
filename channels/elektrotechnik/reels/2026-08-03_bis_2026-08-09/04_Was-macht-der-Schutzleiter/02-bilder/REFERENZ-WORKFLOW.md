# Referenz-Workflow für hochwertige Bilder

Die Bilder nicht mehr als zehn unabhängige Generierungen erzeugen.

## 1. Referenz MOTOR-A

Zuerst den Cover-Hintergrund erzeugen. Das beste Ergebnis als Referenzbild für Szene 01, 02, 04 und 09 verwenden. Der Motor, die Metallfarbe, die PE-Verbindung und das allgemeine Materialbild sollen erkennbar gleich bleiben.

## 2. Referenz CABINET-B

Danach Szene 06 erzeugen. Das beste Schaltschrankbild als Referenz für Szene 07 und 08 verwenden. Gehäusefarbe, DIN-Schiene, Klemmen und Licht sollen gleich bleiben.

## 3. Mechanismus-Szenen

Szene 03 und 05 benötigen kein Google-Flow-Bild. Sie werden als ruhige, kontrollierte Remotion-Szenen gebaut und dort vollständig auf Deutsch beschriftet.

## 4. Deutsche Beschriftungen in Google Flow ansehen

Nach der Erzeugung eines Basisbildes den passenden Editprompt aus dieser Datei verwenden:

```text
02-bilder/FLOW-BESCHRIFTUNGS-EDITPROMPTS.txt
```

Dadurch werden bereits in der Flow-Vorschau deutsche Überschriften und Bauteil-Callouts ergänzt, zum Beispiel:

- `Beschädigte Isolation`
- `Kontakt zum Metallgehäuse`
- `Schutzleiter (PE)`

Google Flow darf dabei Bildaufbau und Bauteile nicht verändern.

## 5. Verbindliche finale Beschriftung

Google Flow kann einzelne Buchstaben trotz guter Anweisung falsch schreiben. Deshalb wird die veröffentlichte Version zusätzlich kontrolliert beschriftet:

```bash
npm run electrical:label-images -- "channels/elektrotechnik/reels/2026-08-03_bis_2026-08-09/04_Was-macht-der-Schutzleiter"
```

Die fertigen Dateien liegen anschließend unter:

```text
02-bilder/final-labeled/
```

Das System setzt nicht nur eine Überschrift, sondern auch deutsche Bauteil-Callouts mit:

- dunklen kompakten Textfeldern
- farbigen Pfeillinien
- Zielpunkten direkt am Bauteil
- Grün-Gelb für PE
- Blau für Neutralleiter
- Rot oder Orange für Fehlerstellen

Zusätzlich wird jedes beschriftete Bild als `generated-final-labeled.png` in den jeweiligen Szenenordner kopiert. Die Produktionspipeline bevorzugt diese Dateien automatisch, weil `final` im Dateinamen enthalten ist.
