# Visual Quality Gate – Version 4

## Verbindlicher Bildstandard

- semi-fotorealistische technische CGI
- reale europäische Elektrobauteile und reale Proportionen
- jedes sichtbare Bild erhält eine exakt vorgegebene kurze deutsche Beschriftung
- kein englischer Text und keine zusätzlichen KI-Wörter
- Cover enthält den exakten deutschen Hook
- vollständiges 9:16 ohne weiße oder graue Balken, leere Rechtecke, Rahmen oder Letterboxing
- keine pure weiße Hintergrundfläche
- mindestens vier deutlich unterschiedliche Hintergrundfamilien pro Reel
- keine Cartoon-, Spielzeug-, Pixar-, Miniatur- oder Fantasyoptik

## Hintergrundvariation

Ein Reel darf nicht aus neun fast identischen dunkelblauen Studioflächen bestehen. Geeignete wechselnde Umgebungen sind zum Beispiel:

- warmer Graphit-Workshop
- kühle blau-graue Werkstatt
- warmer Metall-Klemmenkasten
- matte Elektro-Laborfläche
- Schaltgeräte-Verteilung
- mittelgrauer Schaltschrank
- gebürstetes Aluminium
- beige-graue Werkbank mit Tageslicht

Die Bilder bleiben als Serie erkennbar, aber Licht, Material, Helligkeit und Umgebung müssen sich sinnvoll unterscheiden.

## Technische Bildprüfung

`npm run electrical:image-qa -- "<reel-ordner>"` prüft:

- weiße oder hellgraue Balken oben und unten
- große weiße Flächen
- leere helle Titelkarten
- Anzahl erkennbarer Hintergrund-Farbfamilien

Die korrekte deutsche Schreibweise wird anschließend visuell geprüft. Falsch geschriebene, englische oder zusätzliche Bildtexte müssen neu generiert werden.

## Produktionsreihenfolge

1. Hook, Skript, Labels und Hintergrundfamilien festlegen.
2. Alle Einzelprompts und die Gesamtdatei vervollständigen.
3. `electrical:preflight` ausführen.
4. Bilder und Voice erzeugen.
5. `electrical:ready` ausführen; dabei läuft die Bilddarstellungs-QA automatisch.
6. Erst danach rendern.
