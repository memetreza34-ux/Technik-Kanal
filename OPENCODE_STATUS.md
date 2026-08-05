# Produktionsstatus – Elektrotechnik-Kanal

## Migration

- eigenständiges Repository am 04.08.2026 eingerichtet
- aktiver neuer Elektro-Reel aus dem Faceless-Studio übernommen
- keine Abhängigkeit vom früheren gemeinsamen Root oder dessen Shared-Komponenten
- alte verworfene Wochen, Bilder und Exporte nicht übernommen

## Animationsbibliothek

- verbindlicher Bibliotheksablauf eingeführt
- Ablage: `src/animation-library/`
- Kategorien und Namensregeln dokumentiert
- Katalog unter `src/animation-library/CATALOG.md` angelegt
- erste Komponente: `protection/BreakerTripAnimation`
- Status der ersten Komponente: `in Prüfung`

Ab jetzt gilt: Wird für einen Erklärschritt eine Animation benötigt und existiert keine fachlich passende Bibliothekskomponente, wird die richtige Animation neu erstellt, allgemein parametrisiert, korrekt kategorisiert, eindeutig benannt, exportiert und katalogisiert. Es wird keine unpassende Ersatzanimation verwendet.

## Aktiver Reel

- Thema: `Warum fliegt die Sicherung raus?`
- Composition: `SicherungsReel`
- Dauer: 69 Sekunden
- zehn visuelle Beats
- Voice-over, Szenenplan, Caption, Quellen und Produktionsstatus vorhanden
- Render-Befehl: `npm run render`

## Noch offen vor Veröffentlichung

1. lokale Breaker-Hilfskomponente im Sicherungs-Reel durch `BreakerTripAnimation` aus der Bibliothek ersetzen
2. `BreakerTripAnimation` mit Start-, Mittel- und Endzustand prüfen und danach auf `bereit` setzen
3. finale Iro-Voice-over-Datei aufnehmen
4. Audio einfügen und Wort-Timings kalibrieren
5. funktionale SFX ergänzen
6. `npm run check` ausführen
7. Kontrollframes aller zehn Beats prüfen
8. finalen MP4-Export vollständig ansehen
9. Nachanalyse anlegen

## Verbindliche Regel

Kein zweites Reel vorbereiten, bevor der Sicherungs-Reel mit finalem Ton geprüft und abgenommen wurde.
