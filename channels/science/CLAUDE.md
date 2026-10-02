# Wissenschaftskanal – Arbeitsregeln

Vor Änderungen zuerst lesen:

1. `gehirn/KANAL.md`
2. `gehirn/LONGFORM.md`
3. `gehirn/REELS.md`
4. `gehirn/BILDWELT.md`
5. `gehirn/FLOW-WORKFLOW.md`
6. `engine/config/science-v1.json`
7. `skills/reel-fertigstellen.md`
8. den aktuellen Video-Ordner

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
- **Google Flow erzeugt ausschließlich statische Bilder**
- keine KI-Videoclips und kein Image-to-Video

Interne Namen wie `ScienceReel` oder der Ordner `reels/` bleiben nur vorübergehend aus Rückwärtskompatibilität bestehen. Sie dürfen nicht als Produktdefinition interpretiert werden.

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

## Google Flow – verbindlicher Produktionsablauf

`gehirn/FLOW-WORKFLOW.md` ist verbindlich.

Für jedes aktive Video müssen vor Bildproduktion vorhanden und final sein:

- `06-projektdateien/flow-plan.json`
- `02-bilder/GOOGLE-FLOW-MASTER-PROMPT.txt`
- alle Einzelprompts unter `02-bilder/prompts/`

Ablauf:

1. zuerst drei Thumbnail-Kandidaten erzeugen
2. danach **STOPP** und auf die Nutzerauswahl warten
3. gewählten Kandidaten als lockere visuelle Referenz verwenden
4. danach Beat 01, Beat 02, Beat 03 usw. **streng einzeln nacheinander** erzeugen
5. jeder Beat erhält genau ein finales statisches 16:9-Bild
6. keine KI-Videoclips, keine Animationen und kein Image-to-Video erzeugen

Wenn ein Vorgang als einzelnes Standbild nicht klar genug ist, den visuellen Beat verbessern oder in mehrere statische Bilder aufteilen.

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
- in Flow zuerst erzeugen und danach auf die Nutzerauswahl warten

## Remotion – harte Grenze

Remotion ist ausschließlich technische Montage- und Export-Schicht.

Remotion darf nur finale statische Bilder zeitlich anordnen, harte Schnitte setzen, Voice-over abspielen, Untertitel und statische Overlays anzeigen, optionale SFX platzieren und rendern.

Remotion darf NICHT zoomen, schwenken, rotieren, parallaxen, Ken-Burns-Bewegung erzeugen, Partikel erzeugen, wissenschaftliche Prozesse animieren oder Videoclips als Szenenquelle erwarten.

## Audio und Synchronisation

- Roh-Voice wird auf exakt **1,10×** verarbeitet; Tonhöhe bleibt erhalten
- finale Voice ist die verbindliche Zeitquelle
- lokale Wortzeiten mit `whisper.cpp`
- Skript und Transkript werden robust gegeneinander ausgerichtet
- Bildwechsel, Untertitel und SFX verwenden dieselbe Zeitbasis

## Produktionsregel

Erst Thema, Recherche, Story-Struktur und vollständiges Skript abschließen. Danach visuelle Aussagen planen, Bildwelt anwenden, Einzelprompts und Flow-Plan festlegen und den Google-Flow-Masterprompt bauen. Erst anschließend Bilder erzeugen. **Keine Video- oder Animationsplanung als Ersatz für gute statische Bilddramaturgie.**
