# Wissenschaftskanal – Arbeitsregeln

Vor Änderungen zuerst lesen:

1. `gehirn/KANAL.md`
2. `gehirn/REELS.md`
3. `gehirn/BILDSTIL.md`
4. `gehirn/MASTER-STYLE-PROMPT.md`
5. `engine/config/electrical-v1.json` – Legacy-Pfad, während der Migration nur noch technische Pipeline-Quelle
6. `skills/reel-fertigstellen.md`
7. den aktuellen Reel-Ordner

## Kanalrichtung

Dies ist kein reiner Elektrotechnik-Kanal mehr. Der Kanal behandelt allgemein verständliche Wissenschafts- und Bildungsthemen, insbesondere Physik, Chemie, Elektrotechnik, Astronomie, Energie und verwandte Technikthemen.

Elektrotechnik-spezifische Regeln dürfen nur für Elektro-Themen gelten und niemals die globale Kanalidentität bestimmen.

## Inhalt und Sicherheit

- fachliche Aussagen mit stabilen Quellen-IDs dokumentieren
- Normen, Grenzwerte und aktuelle Regeln nie ohne Quelle behaupten
- keine gefährlichen Experimente oder riskanten Handlungsanweisungen
- keine Anleitung zu Arbeiten an Netzspannung
- keine Manipulation oder Überbrückung von Schutzgeräten
- chemische, physikalische oder elektrische Gefahren nur erklärend und sicher darstellen

## Sprache

- Voice-over, Untertitel, Headlines und kontrollierte Overlays sind Deutsch
- Bildprompts dürfen Englisch sein
- generierte Bilder enthalten keinerlei sichtbaren Text, Labels, Zahlen, Einheiten, Logos oder Typenschilder
- alle notwendigen sichtbaren Informationen werden kontrolliert nach der Bildgenerierung gesetzt

## Hook

- direkte zentrale Frage
- kurz und verständlich
- keine künstliche Metapher
- der erste gesprochene Satz stellt die Kernfrage
- Bild 01 trägt gleichzeitig Hook-Szene und Cover-Hintergrund

## Bildwelt

Verbindlicher Stil: `Cinematic Scientific 3D Editorial`.

- ein Hauptmotiv pro Bild
- eine zentrale Aussage pro Bild
- adaptive Bildanzahl statt fester Szenenzahl
- keine überladenen Schaubilder
- keine KI-Schrift
- gleiche visuelle DNA über Physik, Chemie, Elektrotechnik, Astronomie und weitere Wissenschaftsthemen

## Remotion – harte Grenze

Remotion ist ausschließlich technische Montage- und Export-Schicht.

Remotion darf NICHT:

- zoomen
- schwenken
- rotieren
- parallaxen
- Ken-Burns-Bewegung erzeugen
- Partikel erzeugen
- Feldlinien, Strompfade, Moleküle oder Bauteile animieren
- Diagramme animieren
- neue technische Visualisierungen erzeugen
- automatische Crossfades oder dekorative Übergänge erzeugen

Remotion darf nur:

- statische Bilder zeitlich anordnen
- harte Schnitte setzen
- Voice-over abspielen
- Untertitel anzeigen
- statische Overlays anzeigen
- optionale SFX platzieren
- rendern

## Audio und Synchronisation

- finale Voice ist die Zeitquelle
- lokale Wortzeiten mit `whisper.cpp`
- Skript und Transkript werden robust gegeneinander ausgerichtet
- Bildwechsel, Untertitel und SFX verwenden dieselbe Zeitbasis

## Produktionsregel

Erst Recherche, Skript, Bildplan und Preflight abschließen. Danach Bilder und Voice erstellen. Keine Animationen als Ersatz für fehlende oder schwache Bildplanung verwenden.
