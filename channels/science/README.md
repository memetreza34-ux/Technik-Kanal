# Alltagswissenschaft & Technik

Deutschsprachiger Faceless-Kanal für verständlich erklärte Physik, Technik, Energie, Materialien, Infrastruktur und greifbare Naturphänomene für Jugendliche und junge Erwachsene.

## Aktives Format

Das aktive Profil ist **`youtube-2min-v1`**:

- normales YouTube-Video, kein Reel
- 1920×1080 / 16:9 / 30 fps
- 90–150 Sekunden, 120 Sekunden ideal
- 230–370 Wörter, 300 ideal
- 12–28 visuelle Beats, 20 ideal
- separates 1280×720-Thumbnail mit drei Kandidaten
- statische Szenenbilder + harte Schnitte
- Voice 1,10× mit Loudness-Normalisierung

Der spätere Ausbau auf etwa 8–12 Minuten bekommt ein eigenes Profil.

## Themen

Schwerpunkt sind greifbare, visuell erklärbare Themen aus Alltagsphysik, Elektrotechnik/Elektronik, Energie, Maschinen, Verkehr/Mobilität, Gebäude/Infrastruktur, Materialien/Werkstoffen, einfacher Alltagschemie, Wetter/Naturphänomenen und greifbarer Astronomie.

Biologie, Medizin, Anatomie, Krankheiten, Zellbiologie, DNA/Genetik und Biochemie gehören nicht zur regulären Kanalrichtung. Stark abstrakte Themen ohne greifbaren Zugang sind ebenfalls nicht vorgesehen.

Leitfrage:

> Kann ein Jugendlicher ohne großes Vorwissen nach dem Video etwas verstehen, das er sehen, benutzen, erleben oder sich konkret vorstellen kann?

## Story

Verbindliche Dramaturgie steht in `gehirn/LONGFORM.md`:

**Hook → Kontext → Grundlage → Mechanismus → Vertiefung → Payoff**

Nicht automatisch ein Satz pro Bild. Eine verständliche visuelle Aussage entspricht einem Beat.

## Bildwelt

Aktive Bildwelt: **Scientific Scene Explainer v1**.

Kernprinzip:

> Nicht einfach ein Bild vom Thema erzeugen, sondern eine visuelle Szene bauen, die die konkrete Aussage des Beats erklärt.

Je nach Aussage dürfen volle Orte/Umgebungen, integrierte Wissenschaftsszenen, technische Illustrationen, Cutaways, Detailansichten, Vergleiche oder stilisierte erwachsene Menschen eingesetzt werden. Hintergründe und Farben richten sich nach Inhalt und Umgebung.

Titel, Labels, Merksätze, Zahlen, Vergleiche und Pfeile sind optional. Leitregel: **so wenig Information wie möglich, so viel wie nötig**. Sichtbarer Bildtext ist ausschließlich Deutsch und muss vor Freigabe geprüft werden.

## Thumbnail

Thumbnail ist separat von Bild 01:
- 1280×720
- drei Kandidaten
- ein Gewinner
- muss dasselbe Versprechen wie Titel und Hook geben

## Remotion-Rolle

Remotion darf nur Bilder zeitlich anordnen, harte Schnitte setzen, Voice/Captions/SFX abspielen und exportieren. Wissenschaftliche Visualisierungen werden nicht in Remotion erzeugt.

## Befehle

```bash
npm run science:new -- --week=YYYY-MM-DD_bis_YYYY-MM-DD --slot=01 --title="Wie funktioniert ein Induktionsherd?" --hook="Wie funktioniert ein Induktionsherd?" --scenes=20
npm run science:preflight -- "<video-ordner>"
npm run science:ready -- "<video-ordner>"
npm run science:finish -- "<video-ordner>"
```

Interne Namen wie `ScienceReel`, `reels/` und einzelne `electrical-*`-Dateinamen bleiben vorerst nur aus Rückwärtskompatibilität bestehen; neue Produktionsbefehle sind ausschließlich `science:*`.
