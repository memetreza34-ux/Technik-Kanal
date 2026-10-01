# Wissenschaftskanal – Arbeitsregeln

Vor Änderungen zuerst lesen:

1. `gehirn/KANAL.md`
2. `gehirn/REELS.md`
3. `gehirn/BILDWELT.md`
4. `engine/config/science-v1.json`
5. `skills/reel-fertigstellen.md`
6. den aktuellen Reel-Ordner

## Kanalrichtung

Dies ist ein allgemeiner deutschsprachiger Wissenschafts- und Bildungskanal. Elektrotechnik ist nur ein Themenbereich neben Physik, Chemie, Astronomie, Energie, Materialien und weiteren Wissenschaftsthemen.

## Inhalt und Sicherheit

- fachliche Aussagen mit stabilen Quellen-IDs dokumentieren
- Normen, Grenzwerte und aktuelle Regeln nie ohne Quelle behaupten
- keine gefährlichen Experimente oder riskanten Handlungsanweisungen
- keine Anleitung zu Arbeiten an Netzspannung
- keine Manipulation oder Überbrückung von Schutzgeräten
- chemische, physikalische oder elektrische Gefahren nur erklärend und sicher darstellen

## Sprache

- Voice-over, Untertitel und kontrollierte Overlays sind Deutsch
- Bildprompts dürfen Englisch oder Deutsch sein
- sichtbarer Text innerhalb generierter Wissenschaftsbilder ist ausschließlich Deutsch
- englische Labels oder englische Infotexte im Bild sind nicht zulässig
- zufällige KI-Schrift, Logos oder Wasserzeichen sind nicht zulässig

## Hook

- direkte zentrale Frage
- kurz und verständlich
- keine künstliche Metapher
- der erste gesprochene Satz stellt die Kernfrage
- Bild 01 ist zugleich erster visueller Shot und Coverquelle

## Bildwelt

Die verbindliche Bildwelt ist in `gehirn/BILDWELT.md` definiert.

Kernprinzip:

> Nicht einfach ein Bild vom Thema erzeugen. Eine visuelle Szene bauen, die den konkreten gesprochenen Satz erklärt.

Dabei gilt:

- eine Hauptaussage pro Bild
- volle Umgebungen und Orte nutzen, wenn sie beim Erklären helfen
- wissenschaftliche Information direkt in die Szene integrieren
- reine Illustrationen, Cutaways, Mikroansichten, Vergleiche oder Personen nur dann einsetzen, wenn sie für den Satz die beste Darstellungsform sind
- Menschen sind erlaubt, aber stilisiert, erwachsen und nur mit fachlicher Funktion
- Hintergründe und Farben dürfen je nach Thema wechseln; kein fixer Navy-Hintergrund
- Titel, Labels, Merksätze, Zahlen und Pfeile sind optional, nicht verpflichtend
- sichtbarer Text im Bild nur auf Deutsch
- so wenig Information wie möglich, so viel wie nötig
- keine Informationsüberladung und keine dekorativen Elemente ohne Erklärfunktion

Technisch bleiben die Produktionsregeln bestehen: statische Szenenbilder, ein Bild pro Beat und keine Remotion-Kamerabewegung.

## Remotion – harte Grenze

Remotion ist ausschließlich technische Montage- und Export-Schicht.

Remotion darf NICHT zoomen, schwenken, rotieren, parallaxen, Ken-Burns-Bewegung erzeugen, Partikel erzeugen, wissenschaftliche Prozesse animieren oder neue visuelle Aussagen erfinden.

Remotion darf nur statische Bilder zeitlich anordnen, harte Schnitte setzen, Voice-over abspielen, Untertitel und statische Overlays anzeigen, optionale SFX platzieren und rendern.

## Audio und Synchronisation

- Roh-Voice wird auf exakt **1,10×** verarbeitet; Tonhöhe bleibt erhalten
- finale Voice ist die verbindliche Zeitquelle
- lokale Wortzeiten mit `whisper.cpp`
- Skript und Transkript werden robust gegeneinander ausgerichtet
- Bildwechsel, Untertitel und SFX verwenden dieselbe Zeitbasis

## Produktionsregel

Erst Recherche, Skript und Szenenplanung abschließen. Danach jeden Beat anhand des konkreten Skriptsatzes visuell planen und `gehirn/BILDWELT.md` anwenden. Keine Animationen als Ersatz für fehlende Bildplanung verwenden.
