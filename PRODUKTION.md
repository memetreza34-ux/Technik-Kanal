# YouTube-Produktionsstandard

## Ziel
Anonymer deutschsprachiger Technik-Kanal mit gut recherchierten, verständlichen, visuell hochwertigen **16:9-Langvideos**. Technik ist breit: Elektrotechnik, Maschinen, Fahrzeuge, Energie, digitale Systeme und andere nachvollziehbar erklärbare technische Themen.

## Dramaturgie
1. Sofort mit einer echten Frage, einem Mechanismus oder einer überraschenden Beobachtung beginnen. Kein statisches Cover als erste Szene.
2. Kontext: Warum ist das wichtig?
3. Kern: Mechanismus Schritt für Schritt mit einer klaren Ursache-Wirkung-Kette zeigen.
4. Vergleich, anschauliches Beispiel, Grenzen oder häufige Fehlannahme.
5. Konkretes fachliches Ergebnis statt allgemeiner Phrasen.

## Skript und Recherche
- Eine Hauptfrage je Video, natürliche deutsche Erzählweise.
- Fachbegriffe kurz erklären; keine unbelegten Sensationsbehauptungen.
- Zahlen, Normen, Sicherheit und technische Aussagen mit seriösen Quellen dokumentieren.
- Bei Elektrizität keine gefährlichen Handlungsanleitungen zum Arbeiten an Netzspannung.
- Gesamten Sprechtext als kopierbare Datei und in `video.json` kapitelweise aufbewahren; vor Freigabe auf Übereinstimmung prüfen.

## Visuals
- Ein dominantes Motiv je Aussage, gut lesbar auf Mobilgeräten.
- Abwechslung zwischen nachvollziehbaren technischen Diagrammen, Geräteaufnahmen, Schnittbildern, Vergleichen und animierten Abläufen.
- Die verwendeten Komponenten müssen plausibel sein. Bei Schutzschaltern z. B. nicht nur abstrakte Magnet-Icons oder drehende Balken als Ersatz für echte Mechanismen.
- Farblogik: Cyan für normalen Signal-/Stromfluss, Orange für Erwärmung, Rot für Fehler, dunkler Hintergrund.
- Beschriftungen präzise und möglichst im Videoeditor setzen, nicht unkontrolliert in generierte Bilder schreiben lassen.
- Keine erfundenen Messwerte, kein dekorativer Dauer-Zoom, keine repetitiven Folien.
- Bei öffentlichen Fotos Rechte und Attribution prüfen.

## Produktion
Recherche → vollständiges Skript → Kapitel/Visualplan → fachlicher Check → Voice-over → passende Visuals → Synchronisierung → MP4 → gesamte Videoabnahme → Titel/Thumbnail/Beschreibung → Veröffentlichung.

## Gate vor Veröffentlichung
- Hook, Spannungsbogen und fachliche Antwort geprüft.
- Bildinhalt zeigt wirklich die behaupteten Zusammenhänge.
- Technische Sicherheit und Quellen geprüft.
- Lesbarkeit, Audiopegel, Übergänge und Synchronisierung in kompletter MP4 geprüft.
- Keine Platzhalter, schwarzen Frames, fehlenden Grafiken oder falschen Untertitel.
- Video-Thumbnail ist eine **separate Exportdatei** und keine zwischengeschobene Eröffnungsszene.
- Nach Veröffentlichung notieren, an welchen Stellen Zuschauer abspringen, und daraus konkrete Verbesserungen für das nächste Video ableiten.

## Standardablage
```text
videos/YYYY-MM-DD_thema/
  video.json
  script-fliesstext.txt
  bildprompts.txt
  quellen.md
  audio/voiceover.wav
  export/video.mp4
  export/thumbnail.png
  export/beschreibung.txt
```
Der Exportordner enthält nur finale Veröffentlichungsdateien. Audio, Video und Thumbnail werden nicht in Git eingecheckt.
