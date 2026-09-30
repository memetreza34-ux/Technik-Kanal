# Wissenschaftskanal – Arbeitsregeln

Vor Änderungen zuerst lesen:

1. `gehirn/KANAL.md`
2. `gehirn/REELS.md`
3. `engine/config/science-v1.json`
4. `skills/reel-fertigstellen.md`
5. den aktuellen Reel-Ordner

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
- Bildprompts dürfen Englisch sein
- generierte Bilder dürfen keine zufällige KI-Schrift, Logos oder Wasserzeichen enthalten

## Hook

- direkte zentrale Frage
- kurz und verständlich
- keine künstliche Metapher
- der erste gesprochene Satz stellt die Kernfrage
- Bild 01 ist zugleich erster visueller Shot und Coverquelle

## Bildwelt

Aktuell ist **keine feste Bildwelt definiert**.

Bis eine neue Bildwelt ausdrücklich beschlossen und im Repo verankert wird:

- keinen Markenstil erfinden
- keinen früheren Scientific-3D-Stil wiederverwenden
- keine alten Style-Prompts rekonstruieren
- keine festen Farb-, Material-, Kamera- oder Labelregeln als Kanalstandard annehmen

Technisch bleiben nur neutrale Produktionsregeln bestehen: 9:16, statische Szenenbilder, ein Bild pro Beat und keine Remotion-Kamerabewegung.

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

Erst Recherche, Skript und Szenenplanung abschließen. Die visuelle Produktion bleibt blockiert, bis eine neue Bildwelt festgelegt wurde. Keine Animationen als Ersatz für fehlende Bildplanung verwenden.
