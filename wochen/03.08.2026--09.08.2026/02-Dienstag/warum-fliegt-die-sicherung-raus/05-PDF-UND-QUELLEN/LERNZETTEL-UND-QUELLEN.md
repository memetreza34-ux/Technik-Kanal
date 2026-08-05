# Lernzettel und Quellen – Warum fliegt die Sicherung raus?

## Kernaussage

Der Leitungsschutzschalter, kurz **LSS**, schützt vor allem die Leitung vor zu hohem Strom und zu starker Erwärmung.

## Überlast

- Zu viele oder zu leistungsstarke Geräte laufen gleichzeitig.
- Der Strom ist länger zu hoch, aber nicht schlagartig extrem.
- Im Leitungsschutzschalter erwärmt sich ein Bimetall.
- Das Bimetall verbiegt sich und löst zeitverzögert aus.

**Merke:** Überlast wird thermisch erkannt und löst meist langsamer aus.

## Kurzschluss

- Zwei Leiter treffen mit sehr kleinem Widerstand aufeinander.
- Der Strom steigt schlagartig stark an.
- Der elektromagnetische Schnellauslöser zieht den Anker an.
- Der Stromkreis wird sehr schnell getrennt.

**Merke:** Kurzschluss wird magnetisch erkannt und löst sehr schnell aus.

## Vergleich

| Fehler | Stromverlauf | Auslöser | Reaktion |
|---|---|---|---|
| Überlast | länger zu hoch | thermisches Bimetall | zeitverzögert |
| Kurzschluss | schlagartig sehr hoch | magnetischer Schnellauslöser | sehr schnell |

## Richtig reagieren

1. Geräte ausschalten oder Stecker ziehen.
2. Den Leitungsschutzschalter nur einmal wieder einschalten.
3. Löst er erneut aus, nicht ständig zurücksetzen.
4. Ursache fachgerecht prüfen lassen.
5. Nie an spannungsführenden Teilen arbeiten.
6. Verteilung nicht öffnen und Schutzeinrichtungen nicht überbrücken.

## LSS ist nicht FI/RCD

- **LSS:** schützt Leitungen vor Überlast und Kurzschluss.
- **FI/RCD:** besitzt eine andere Schutzaufgabe und erkennt Fehlerströme.
- Ein Leitungsschutzschalter ersetzt keinen FI/RCD.

## Primärquellen

- Siemens – SENTRON Miniature Circuit Breakers: https://www.siemens.com/de-de/products/sentron/miniature-circuit-breakers/
- Siemens – Miniature Circuit Breakers Technology Primer: https://cache.industry.siemens.com/dl/files/304/109482304/att_866617/v1/MiniatureCircuitBreakers_primer_EN_201601250852395217.pdf?download=true
- ABB – Miniature Circuit Breakers & Supplementary Protectors: https://electrification.us.abb.com/products/circuit-breakers/miniature-circuit-breakers-supplementary-protectors

## PDF

Der Generator `scripts/create_lernzettel.py` erzeugt:

```text
outputs/lernzettel-sicherung.pdf
```

Befehl:

```bash
python scripts/create_lernzettel.py
```
