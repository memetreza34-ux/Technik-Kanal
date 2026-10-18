# Wissonaut – Post-Video-Review

## Technische und redaktionelle QA nach fertig gerendertem Video

- Ganzen Film inklusive Ton ansehen: Hook, Sprechertext, Bildwechsel, 45 komplette Bilder, Proportionen, korrekte deutsche Bildlabels, Schluss.
- Check: Kein Thumbnail im MP4, keine KI-Animationen, keine eingebrannten Captions, keine fehlenden Assets, kein dupliziertes Bild.
- Check: Auftriebsdiagramme, Tiefgang, Schwerpunkt, Schiffsschotts und Ballasttanks müssen fachlich korrekt sein.

## Nach Veröffentlichung

- Metriken nach 24 h / 72 h / 7 d / 28 d in 05-export/youtube-analytics.json eintragen.
- Beobachtete CTR mit Impressionen und Retention-Dips inklusive Zeitstempel notieren.
- Höchstens drei konkrete Veränderungen fürs nächste Video nennen und in den Lernbrief übertragen.

## Beobachtung → Hypothese → nächster Test

1. Noch keine Ergebnisse: tatsächliche Daten abwarten.

## Tatsächliche Erstbewertung des exportierten Films (15.10.2026)

Quelle: hochgeladenes `warum-sinkt-ein-riesiges-stahlschiff-nicht.mp4` (6:03.157, 1920×1080, 30 FPS, AAC, H.264). Ein 12-Sekunden-Kontaktbogen über den vollständigen Film und gezielt zwei Einzelbilder wurden geprüft. Audio-Loudness aus FFmpeg: -16.46 LUFS integriert, -4.46 dBTP Peak. Das ist ein technischer Indikator; das komplette Zuhören und manuelle Sprach-/Schnittreview bleiben nötig.

**Stärken:** einheitliche ruhige Technical-Editorial-2.5D-Welt, zahlreiche Schiffsquerschnitte, Laborbeispiele, klare Wasserfarben; erster Filmframe ist eigenständiges Video statt Thumbnail.

**Schwachstellen und nächste Tests:**
1. **Priorität hoch:** Bei **04:36** ist sichtbar `35 | DEEPENING` in der oberen linken Ecke. Das ist verbotene Produktionsmetadaten im Bild, kein erklärender Text. Die betroffene Google-Flow-Szene regenerieren, vor Veröffentlichung manuell prüfen; bei zukünftigen Videos alle Bilder auf Beat-IDs/englische Staging-Begriffe prüfen.
2. **Priorität hoch:** Nicht genug wirklich beschriftete und lesbare technische Infografiken. Beispielsweise Auftrieb vs. Gewicht, mittlere Dichte, Stabilität und Salzwasser/Süßwasser als mechanistisch klare Vergleichsgrafiken zeigen. Normal bis 3 Labels, komplex bis 5.
3. **Priorität mittel:** Wiederholte Schiffsaußenansichten nicht ohne neue Aussage verwenden. Entsprechend andere Ansichten, klare Schemata und beschriftete Detailillustrationen einplanen.
4. **Erfolg prüfen:** Nach Veröffentlichung echte Zuschauerbindung um den Einstieg und die Grafikszenen, Klickrate und Abonnentengewinn messen. Keine Wirkung ohne Studio-Daten behaupten.

**Freigabeempfehlung:** Der sichtbare Metadatenfehler spricht für eine kleine gezielte Korrektur vor Veröffentlichung. Der Rest ist eher Verbesserung für das nächste Video als komplette Neuproduktion.
