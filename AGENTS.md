## NORMALER ARBEITSABLAUF – NUR START-HIER (WISSONAUT)

Das Repo heißt `Technik-Kanal`. Die Nutzerschnittstelle ist NUR `START-HIER/<video-slug>/`: `01-SKRIPT.txt` (ein vollständiger deutscher Fließtext), `02-FLOW-COVER.txt` (drei Coveroptionen), `03-FLOW-BILDER-1.txt` bis `07-FLOW-BILDER-5.txt` und `DATEIEN-HIER-REIN/` (alle finalen Bilder, Cover und Stimme). Keine alternativen Skriptvarianten, keine riesige Markdown-Masterkopie und keine 45 Einzeldateien dem Nutzer als primären Einstieg zumuten. Nach Phase 1 diese wenigen Dateien automatisch erzeugen und die echte GitHub-Ordner-URL übermitteln. Renderer-Interna bleiben unverändert unter `channels/science` und dürfen nicht ins tägliche Nutzermenü.

Bei Phase 3 zunächst `npm run technik:import -- "START-HIER/<video-slug>"` oder den automatischen Import in `science:finish` verwenden; niemals Medien selbst erfinden, Bild-IDs ignorieren oder bestehende unterschiedliche Dateien überschreiben. Fehlende/duplizierte Dateien sind zu melden.

# Wissonaut – Agentenregeln

## Priorität 1: Nach jedem Video messbar besser werden

Alle Agenten (ChatGPT, Codex, Claude und Antigravity) müssen vor jeder Wissonaut-Produktion zuerst channels/science/gehirn/VERBESSERUNGSSYSTEM.md und channels/science/learning/active-lessons.json berücksichtigen.

- Jedes neue Video erhält automatisch einen Lernbrief mit den Erkenntnissen aus früheren Videos. Vor dem Skript eine überprüfbare Hypothese, genau eine bewusst veränderte Sache und eine Primärmetrik festlegen.
- Nach dem Rendern wird die vollständige MP4 mit Ton und den Szenenbildern beurteilt; Stärken und konkrete Fehler in POST-VIDEO-REVIEW.md dokumentieren.
- Nach der Veröffentlichung echte Werte aus YouTube Studio nach 24 h, 72 h, 7 d und 28 d erfassen und mit npm run science:learn -- report VIDEO_ORDNER auswerten.
- Nur belastbare Erkenntnisse als dauerhafte Regel übernehmen; das nächste Video muss die relevanten Verbesserungen tatsächlich umsetzen.
- Keine erfundenen Daten, keine Kausalitätsbehauptungen aus einzelnen Kennzahlen, keine Garantie auf Views oder Abonnenten.

Weiterhin verbindlich: Technical Editorial Explainer 2.5D, fachliche Richtigkeit, Cover ist nicht Szene 01, Flow erzeugt nur statische Bilder, Montageagenten dürfen fehlende Bilder niemals selbst erzeugen.

Warnung: Science-Branch nicht ungeprüft in main mergen, da er sonst den ursprünglichen Elektrotechnik-Kanal ersetzt.

## Pflicht nach jeder fertigen Phase 1: EIN GitHub-Kopierlink

Mit `npm run science:phase1 -- "VIDEO_ORDNER"` werden Masterprompt und Qualitätsprüfungen automatisch ausgeführt. Nach erfolgreichem Abschluss entsteht im Videoordner `PHASE-1-START-HIER.md`: das komplette freigegebene Skript, sämtliche Google-Flow-Prompts inklusive Cover, fünf Bildschritte und Einzellinks. **Als Agent diese Datei samt Skript/Prompts auf GitHub committen/pushen und anschließend dem Nutzer sofort den direkten Link auf die konkrete Datei schicken**, nicht nur den Verzeichnisnamen oder eine lokale Datei. Der Link muss am Laptop ohne weitere Suche kopierbar sein. Ein Link auf eine nicht gepushte Datei ist verboten. Nicht als Phase 1 fertig melden, solange der Link nicht funktioniert. Details: `channels/science/gehirn/FLOW-WORKFLOW.md`.

