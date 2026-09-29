# Legacy-Bestand

Dieses Verzeichnis enthält aus der früheren Elektrotechnik-only-Phase weiterhin historische Komponenten und Reels. Sie bleiben vorerst erhalten, damit ältere Produktionen reproduzierbar bleiben und nichts unnötig zerstört wird.

## Nicht als Vorlage verwenden

Für **neue** Videos sind ausschließlich folgende Regeln verbindlich:

- `engine/config/science-v1.json`
- Visual-Policy `science-static-v1`
- Composition `ScienceReel`
- `gehirn/BILDSTIL.md`
- `gehirn/SCIENCE-VISUAL-GRAMMAR.md`
- `CLAUDE.md`
- `science:*`-Befehle

## Historische Elektro-Kompositionen

Diese Kompositionen sind Legacy:

- `SicherungsReel`
- `FiSchalterReel`
- `SchutzleiterReel`
- `LeitungsschutzschalterReel`

Sie dürfen weiterhin zum Reproduzieren alter Projekte existieren, aber ihre Mechanismus-Animationen, Motion-Level, technischen Canvas-Helfer oder visuelle Dramaturgie dürfen nicht in neue Science-Reels übernommen werden.

## Historische Animationsbibliothek

Die vorhandene elektrische Animationsbibliothek und ältere Visual-Kit-/Mechanism-Komponenten sind ebenfalls Legacy. Für `science-static-v1` gilt:

- keine Prozessanimation
- keine Kamerabewegung
- keine Partikel
- kein Ken Burns
- kein Zoom/Pan
- keine animierten Diagramme
- keine Dummy-Mechanismus-Canvases

## Interne Namen

Einige Dateinamen, Funktionen, Workspace-Namen und Ordner heißen intern weiterhin `electrical` oder `elektrotechnik`. Diese Namen bleiben während der Migration aus Rückwärtskompatibilität bestehen.

**Wichtig:** Ein interner Legacy-Name ändert nicht die aktive Kanalrichtung. Neue Produktionen sind fachübergreifende Science-/Bildungsvideos.

## Migration statt Löschung

Legacy-Code wird nur entfernt oder umbenannt, wenn:

1. kein alter Reel ihn mehr benötigt,
2. der Science-Pfad vollständig ersetzt ist,
3. Tests und Renderpfade danach weiterhin reproduzierbar sind.

Bis dahin wird Legacy isoliert, nicht als aktiver Standard behandelt.
