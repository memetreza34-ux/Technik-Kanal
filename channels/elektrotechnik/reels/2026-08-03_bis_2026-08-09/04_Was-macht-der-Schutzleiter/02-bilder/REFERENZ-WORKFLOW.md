# Referenz-Workflow für hochwertige Bilder

Die Bilder nicht als unabhängige Einzelgenerierungen erzeugen.

## 1. Referenz MOTOR-A

Zuerst den textfreien Cover-Hintergrund erzeugen. Das beste Ergebnis als Referenzbild für Szene 01, 02, 04 und 09 verwenden. Motor, Metallfarbe, PE-Verbindung und Materialbild müssen erkennbar gleich bleiben.

## 2. Referenz CABINET-B

Danach Szene 06 erzeugen. Das beste Schaltschrankbild als Referenz für Szene 07 und 08 verwenden. Gehäusefarbe, DIN-Schiene, Klemmen und Licht müssen gleich bleiben.

## 3. Mechanismus-Szenen

Szene 03 und 05 benötigen kein Google-Flow-Bild. Sie werden als kontrollierte Remotion-Szenen gebaut und dort fachlich beschriftet.

## 4. Klare Trennung der Texte

### Ausschließlich Remotion

- Cover-Hook
- Kicker
- Szenenüberschrift
- allgemeine Aussage der Szene
- Untertitel

### Direkt im finalen Szenenbild erlaubt

Nur kurze technische Callouts mit Pfeil zu einem konkreten Ziel:

- Bauteilname
- Leitername
- Anschlussstelle
- Fehlerstelle
- Schalterzustand
- wichtiger Prozesspunkt

Beispiele:

- `Ringkabelschuh`
- `Erdungsschraube`
- `Beschädigte Isolation`
- `Kontakt zum Metallgehäuse`
- `Neutralleiter (N)`
- `Schutzleiter (PE)`

Nicht jedes Bild braucht Callouts. Maximal drei pro Bild.

## 5. Optionale Flow-Vorschau

Für eine Vorschau in Google Flow kann der passende Editprompt aus dieser Datei verwendet werden:

```text
02-bilder/FLOW-BESCHRIFTUNGS-EDITPROMPTS.txt
```

Dort werden ausschließlich technische Callouts verlangt, niemals Überschriften.

## 6. Verbindliche finale Callouts

Für die veröffentlichte Version:

```bash
npm run electrical:label-images -- "channels/elektrotechnik/reels/2026-08-03_bis_2026-08-09/04_Was-macht-der-Schutzleiter"
```

Ausgabe:

```text
02-bilder/final-labeled/
```

Das System setzt ausschließlich technische Callouts mit:

- kompakten dunklen Textfeldern
- farbigen Linien
- Zielpunkten direkt am Bauteil
- Grün-Gelb für PE
- Blau für Neutralleiter
- Rot oder Orange für Fehlerstellen

Die Szenenüberschrift wird nicht in das Bild eingebrannt. Sie kommt beim Reel-Render aus Remotion.
