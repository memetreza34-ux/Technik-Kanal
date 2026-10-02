# Wissenschaftskanal – Arbeitsregeln

Vor Änderungen zuerst lesen:

1. `gehirn/KANAL.md`
2. `gehirn/LONGFORM.md`
3. `gehirn/REELS.md`
4. `gehirn/BILDWELT.md`
5. `engine/config/science-v1.json`
6. `skills/reel-fertigstellen.md`
7. den aktuellen Video-Ordner

## Kanalrichtung

Dies ist ein deutschsprachiger Kanal für **Alltagswissenschaft und Technik**. Zielgruppe sind vor allem Jugendliche und junge Erwachsene.

Der Kanal ist bewusst **kein allgemeines Wissenschaftslexikon**. Themen sollen greifbar, visuell erklärbar und ohne umfangreiche Vorkenntnisse verständlich sein.

Bevorzugte Bereiche: Physik im Alltag, Elektrotechnik/Elektronik, Energie, Maschinen, Verkehr/Mobilität, Gebäude/Infrastruktur, Materialien/Werkstoffe, einfache Alltagschemie, Wetter/Naturphänomene und greifbare Astronomie.

Nicht als reguläre Kanalthemen verwenden: Biologie, Medizin, Anatomie, Krankheiten, Zellbiologie, DNA/Genetik, Biochemie sowie stark abstrakte Quanten-, Teilchen-, Relativitäts- oder Astrophysik ohne greifbaren Zugang.

Leitfrage:

> Kann ein Jugendlicher ohne großes Vorwissen nach dem Video etwas verstehen, das er sehen, benutzen, erleben oder sich konkret vorstellen kann?

## Aktives Produktionsprofil

`youtube-2min-v1` ist verbindlich:

- normales YouTube-Video, kein Reel
- 1920×1080 / 16:9 / 30 fps
- 90–150 Sekunden, 120 Sekunden ideal
- 230–370 Wörter, 300 ideal
- 12–28 visuelle Beats, 20 ideal
- separates 1280×720-Thumbnail mit drei Kandidaten

Interne Namen wie `ScienceReel` oder der Ordner `reels/` bleiben nur vorübergehend aus Rückwärtskompatibilität bestehen.

## Story

Verbindliche Dramaturgie nach `gehirn/LONGFORM.md`:

**Hook → Kontext → Grundlage → Mechanismus → Vertiefung → Payoff**

- keine Begrüßung oder lange Einleitung
- zentrale Frage sofort öffnen
- Erklärung spätestens innerhalb der ersten 30 Sekunden beginnen
- Ursache → Vorgang → Ergebnis bevorzugen
- keine lose Faktenliste
- Vertiefungen müssen die Hauptfrage unterstützen
- Payoff beantwortet die Ausgangsfrage klar
- Titel, Thumbnail und Hook müssen dasselbe Versprechen geben

## Visuelle Beats

Nicht automatisch einen Satz pro Bild erzeugen.

> Eine verständliche visuelle Aussage = ein Beat.

Ein komplizierter Satz kann mehrere Bilder brauchen. Mehrere Sätze dürfen dasselbe Bild verwenden, solange dieselbe Sache erklärt wird.

## Inhalt und Sicherheit

- fachliche Aussagen mit stabilen Quellen-IDs dokumentieren
- Normen, Grenzwerte und aktuelle Regeln nie ohne Quelle behaupten
- keine gefährlichen Experimente oder riskanten Handlungsanweisungen
- keine Anleitung zu Arbeiten an Netzspannung
- keine Manipulation oder Überbrückung von Schutzgeräten
- chemische, physikalische oder elektrische Gefahren nur erklärend und sicher darstellen
- unnötigen Fachjargon vermeiden
- Fachbegriffe unmittelbar erklären
- konkrete Ursache-Wirkung und sichtbare Beispiele bevorzugen

## Sprache

- Voice-over, Untertitel und kontrollierte Overlays sind Deutsch
- Bildprompts dürfen Englisch oder Deutsch sein
- sichtbarer Text innerhalb generierter Wissenschaftsbilder ist ausschließlich Deutsch
- englische Labels oder englische Infotexte im Bild sind nicht zulässig
- zufällige KI-Schrift, Logos oder Wasserzeichen sind nicht zulässig

## Bildwelt

Die verbindliche Bildwelt ist in `gehirn/BILDWELT.md` definiert.

Kernprinzip:

> Nicht einfach ein Bild vom Thema erzeugen. Eine visuelle Szene bauen, die die konkrete Aussage dieses Beats erklärt.

Dabei gilt:
- eine Hauptaussage pro Bild
- volle Umgebungen und Orte nutzen, wenn sie beim Erklären helfen
- wissenschaftliche Information direkt in die Szene integrieren
- reine Illustrationen, Cutaways, Detailansichten, Vergleiche oder Personen nur einsetzen, wenn sie die beste Darstellungsform sind
- Menschen sind erlaubt, aber stilisiert, erwachsen und nur mit fachlicher Funktion
- Hintergründe und Farben dürfen je nach Thema wechseln
- Titel, Labels, Merksätze, Zahlen und Pfeile sind optional
- sichtbarer Text im Bild nur auf Deutsch
- so wenig Information wie möglich, so viel wie nötig
- keine Informationsüberladung und keine dekorativen Elemente ohne Erklärfunktion

## Thumbnail

Thumbnail ist nicht Bild 01.

- separat planen
- 1280×720
- drei Kandidaten
- fachlich korrekt
- dasselbe Versprechen wie Titel und Hook
- keine irreführende Zuspitzung

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

Erst Thema, Recherche, Story-Struktur und vollständiges Skript abschließen. Danach in visuelle Aussagen zerlegen, Bildwelt anwenden, Prompts und separates Thumbnail planen und erst anschließend Medien erzeugen. Keine Animationen als Ersatz für fehlende Bildplanung verwenden.
