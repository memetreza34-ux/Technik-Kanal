# PRIORITÄT 1 – Wissonaut wird nach jedem Video besser

## Oberste Kanalregel

**Kontinuierliche, nachweisbare Verbesserung steht über reiner Produktionsgeschwindigkeit, Videoanzahl und optischem Perfektionismus.** Ziel sind dauerhaft mehr qualifizierte Aufrufe, längere sinnvolle Wiedergabezeit, zufriedene Zuschauer und mehr relevante Abonnenten. Hohe Reichweite ist ein Ziel, keine garantierbare Eigenschaft. Keine Kennzahlen erfinden und keine unbelegten Algorithmus-Versprechen.

Jeder Agent (Claude, Codex, Antigravity, ChatGPT) liest diese Datei **vor der Planung und nach dem Rendering jedes Videos**. Eine Erkenntnis gilt erst als übernommen, wenn sie im nächsten Video als konkrete Aktion auftaucht. Neue Experimente dürfen Sicherheit, Fachrichtigkeit, Bildwelt und bestehenden Asset-Handoff nicht verletzen.

## Verbindlicher Verbesserungszyklus pro Video

1. **VOR dem Skript**: Rückblick auf letzte Retrospektive, vorherigen Lernbericht und channels/science/learning/active-lessons.json. Maximal 3 priorisierte Verbesserungen übertragen. In 06-projektdateien/learning-brief.json eine überprüfbare Hypothese, *eine* bewusste Änderung und eine Primärmetrik eintragen. Es wird nicht blind jede Woche alles geändert.
2. **Thema und Verpackung**: konkreter Nutzen für die Zielgruppe, Neugierlücke ohne Täuschung, unterscheidbarer Titel, klares Thumbnail-Versprechen, Hook der dasselbe Versprechen einlöst. Keine künstlichen Versprechen oder Clickbait, den das Video nicht erfüllt.
3. **Während der Produktion**: Script-/Beat-Logik, die ersten 30 Sekunden, fachlich korrekte leicht lesbare 2.5D-Bilder, Bildwechsel an Erkenntnisschritten, keine unnötigen Füllsätze und keine wiederholten Motive. Letztes Video als Maßstab für konkrete Schwächen benutzen.
4. **NACH dem Rendern**: vollständige MP4 mit Ton ansehen, Kontaktbogen und Thumbnail visuell prüfen, Retrospektive POST-VIDEO-REVIEW.md mit Fehlern/Stärken ausfüllen. Renderer-QA alleine reicht nicht. Phase 3 darf weiterhin keine Google-Flow-Bilder selbst erzeugen.
5. **NACH Veröffentlichung**: echte Studio-Zahlen nach ungefähr 24 h, 72 h, 7 d und 28 d in 05-export/youtube-analytics.json übernehmen. Mit npm run science:learn -- report VIDEO_ORDNER vergleichen. Messwerte nicht schätzen; fehlende Felder null lassen. Kennzahlen ändern sich mit der Zeit; capturedAt und publishedAt eintragen.
6. **LERNEN**: Einbrüche der Retentionskurve anhand der Zeitstempel prüfen. Ergebnisse mit gleichen Zeitfenstern und ähnlicher Videolänge vergleichen. Editoriale Beobachtung von Ursache-Hypothese unterscheiden. Maximal drei konkrete Verbesserungen für das nächste Video beschließen; jede hat Beobachtung, Hypothese, Änderung und Erfolgskriterium.
7. **DAUERHAFT VERANKERN**: bestätigte redaktionelle/technische Fehler als Regel/Test in active-lessons.json und passenden QA-/Promptregeln verankern. Hypothesen bleiben ausdrücklich Hypothesen. Erfolgreiche Tests bei genügend Daten wiederholen, schwache Ansätze überarbeiten oder verwerfen. Die neue Videovorlage übernimmt aktive Regeln und die letzten datenbasierten Testideen automatisch.

## YouTube-Funnel sinnvoll auswerten

| Messgröße | Was sie beantwortet | Typische Prüfentscheidung |
|---|---|---|
| Impressionen + Traffic-Quellen | Wurde das Video wem gezeigt? | Nicht vorschnell aus wenigen Impressionen auf schlechten Titel schließen |
| Impressionen-Klickrate (CTR) | Zieht die Kombination Titel/Thumbnail? | Verpackung mit Konkurrenten und dem ehrlichen Video-Versprechen vergleichen |
| Zuschauerbindung nach 30 Sekunden | Hält der Einstieg das Versprechen? | Einstieg, Tempo, erste Visualisierung überprüfen |
| Durchschnittliche Wiedergabedauer und durchschnittlich angesehener Anteil | Bleibt die Erklärung interessant und verständlich? | Konkrete Retention-Dips, Pausen, abstrakte Passagen und lange Bildhaltezeiten prüfen |
| Gewonnene Abonnenten / 1.000 Aufrufe | Macht das Video Lust auf mehr vom Kanal? | Wiedererkennbaren Seriennutzen und passendes nächstes Video anbieten |
| Kommentare und Fragen | Was möchten Zuschauer als Nächstes verstehen? | Themen- und Erklärlücken redaktionell erfassen |

CTR **nicht** aus gesamten Aufrufen / Impressionen schätzen: YouTube-CTR bezieht sich auf registrierte Thumbnail-Impressionen und entsprechende Aufrufe. Durchschnittlich angesehener Anteil ist nicht für jedes Video auf 100 % begrenzt. Keine einzelnen Kennzahlen isoliert optimieren; Ziel ist nachhaltiger Zuschauerwert.

## Vergleichsregeln

Der Lernbericht vergleicht automatisch mit bis zu fünf jüngsten anderen Videos **desselben Produktionsprofils**, **desselben Messfensters** und benötigt für einen Indikator mindestens drei Vergleichsvideos mit ausreichender Stichprobe. Bei weniger Daten wird bewusst kein Gewinner/Verlierer bestimmt. Eine Abweichung von mehr als 10 % unter dem Median erzeugt eine **Testhypothese**, keine automatische Diagnose oder Zwangsänderung.

Wichtig: Thema, Veröffentlichungszeit, Zielgruppe, Traffic-Quelle und Ausspielung unterscheiden sich. Diese Effekte **manuell** kontrollieren. Thumbnail-/Titeltests sind nur aussagekräftig, wenn die Plattform einen sauberen Vergleich zulässt; nicht mehrere Dinge gleichzeitig austauschen und den Effekt einer Änderung zuschreiben.

## Verbindliche Dateien und Befehle

- Globale Lernregeln: channels/science/learning/active-lessons.json
- Neuer Videobrief: 06-projektdateien/learning-brief.json
- Video-Retrospektive: 06-projektdateien/POST-VIDEO-REVIEW.md
- Reale Studio-Messwerte: 05-export/youtube-analytics.json
- Maschinenlesbare Auswertung: 06-projektdateien/learning-report.json

Befehle:

- npm run science:new -- --week=... --slot=01 --title="..." --hook="..." --profile=youtube-6to7min-v1 --scenes=46
- npm run science:learn -- start "VIDEO_ORDNER" (bestehende Dateien nie überschreiben)
- npm run science:learn -- report "VIDEO_ORDNER" (nach Eintrag neuer Daten wiederholen)
- npm run validate:science-learning (Regressionstest)

**Pflichtausgabe nach jedem Video:** Was lief gut? Was war schwach? Welche konkreten Änderungen werden beim nächsten Mal umgesetzt? Welche Evidenz gibt es? Welche Daten fehlen noch? Keine Aussage wie "viral garantiert" oder "Algorithmus beherrscht".
