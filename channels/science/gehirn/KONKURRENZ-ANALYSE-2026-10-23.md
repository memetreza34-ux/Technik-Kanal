# Konkurrenzanalyse: Script, Szenen, Bilder, Titel, Thumbnails

Stand 23.10.2026. Ziel: Unsere Regeln an Kanälen messen, die funktionieren. Die Analyse vom 18.10. (`ANALYSE-2026-10-18.md`) hat nur Titel und Aufrufe verglichen. Hier geht es darum, **wie** diese Videos gebaut sind.

## Methode

- **6 deutsche Kanäle mit Erzählstimme**, je 2 Videos: das stärkste und ein typisches. So lässt sich innerhalb eines Kanals vergleichen, was einen Treffer von einem normalen Video unterscheidet.
- **Script:** YouTube-Untertitel (bei Terra X und Kurzgesagt die manuellen) mit Wortzahl, Satzlänge, Fragen, Vorausdeutungen und Zahlen. Die Messung ist automatisch und grob, das Hook-Muster ist von Hand gelesen.
- **Szenen:** Schnitterkennung mit `ffmpeg` (Schwelle 0,30) in den ersten 7 Minuten, dazu ein Kontaktbogen alle 15 s.
- **Thumbnails:** Alle 12 nebeneinander verglichen.
- Zwei Videos ließen sich für die Schnittanalyse nicht laden (Verlorene Schiffe: U-Boot, Stahl und Meer: Ark Royal). Kurzgesagt hat durchgehende Animation ohne harte Schnitte, deshalb fehlt dort der Bildtakt.
- **Grenze:** Zuschauerbindung und Klickrate sehen nur die Kanalbetreiber. Alle Regeln unten sind gut begründete Annahmen und werden mit unseren eigenen YouTube-Studio-Werten geprüft.

## Die Videos

| Kanal | Abos | Video | Länge | Aufrufe |
|---|---:|---|---:|---:|
| Dinge Erklärt – Kurzgesagt | 2,69 Mio. | Atomkraft erklärt: Wie funktioniert sie? | 6:00 | 1.470.011 |
| | | Die absurdeste Waffe, von der Du noch nie gehört hast | 13:27 | 1.392.964 |
| Terra X Nature | 229.000 | Wie der Auftrieb tonnenschwere Schiffe über Wasser hält | 7:06 | 360.554 |
| | | Wie der Lithium-Ionen-Akku funktioniert | 6:16 | 173.111 |
| Simplicissimus | 2,59 Mio. | Wie dieser Junge die USA gehackt hat | 35:50 | 1.771.372 |
| | | Die tragische Geschichte des Air-India-Überlebenden | 25:05 | 1.658.309 |
| Stahl unter Wasser | 518 | Das echte U-Boot aus «Das Boot» – 5 Dinge, die der Film nicht erzählt | 17:25 | 70.805 |
| | | Warum liegt die Bismarck immer noch dort? | 21:39 | 4.430 |
| Verlorene Schiffe | 1.130 | Wie diese gigantischen Kriegsschiffe aus Holz gebaut wurden | 28:49 | 39.651 |
| | | Die faszinierende Technik des U-Bootes – Eine unglaubliche Ingenieursleistung | 30:20 | 138 |
| Stahl und Meer | 418 | Britanniens „unsinkbarer“ Stolz sank in 13 Minuten | 71:13 | 16.950 |
| | | Der Zerstörer der Zukunft, der sich als Flop entpuppte: USS Zumwalt | 33:45 | 1.586 |

## 1. Script

| Video | Wörter/Satz | kurze Sätze ≤ 6 W. | Zahlen pro 1000 W. | Fragen pro 1000 W. |
|---|---:|---:|---:|---:|
| Kurzgesagt Atomkraft | 12,8 | 16 % | 29,0 | 15,1 |
| Kurzgesagt Waffe | 11,6 | 22 % | 19,6 | 4,0 |
| Terra X Auftrieb | 12,2 | 14 % | 11,8 | 10,9 |
| Terra X Akku | 12,3 | 23 % | 0,0 | 4,9 |
| Simplicissimus Hacker | 9,6 | 26 % | 8,3 | 1,0 |
| Simplicissimus Air India | 11,9 | 22 % | 12,6 | 1,7 |
| Stahl unter Wasser «Das Boot» | 13,3 | 19 % | 25,3 | 0,8 |
| Verlorene Schiffe Holz | 12,5 | 20 % | 12,5 | 1,4 |
| Stahl und Meer Ark Royal | 9,9 | 37 % | 17,8 | 1,4 |
| **Wissonaut Stahlschiff** | 10,2 | 22 % | **0** | 5,4 |
| **Wissonaut Steckdose** | 10,1 | 17 % | **0** | 3,1 |

Gezählt sind Zahlen als Ziffern. Bei uns stehen sie zum Teil ausgeschrieben im Text, `science:script-qa` zählt beides.

**Was daraus folgt:**

1. **Zahlen:** 10 von 11 messbaren Videos haben 8–29 Zahlen pro 1000 Wörter. Unsere Mindestgrenze lag bei 2, also bei einem Viertel des schwächsten Konkurrenten. → **Neu: mindestens 6 pro 1000 Wörter.**
2. **Zahlenstapel im Hook:** Der Treffer von Verlorene Schiffe eröffnet mit vier Zahlen in 15 Sekunden (Bäume, Kilometer Tauwerk, Kanonen, Tonnen) und setzt dann den Kontrast „und alles aus Holz“. Kurzgesagt macht es bei der Waffe genauso. Unsere Regel „höchstens 3 Zahlen in 120 Wörtern“ hätte beide Hooks blockiert. → **Neu: Im Hook sind bis zu 6 Zahlen erlaubt, danach gilt die alte Grenze.**
3. **Größenvergleich:** Große Zahlen werden sofort greifbar gemacht, etwa bei Terra X das Containerschiff „so schwer wie 200.000 Kleinwagen“ oder bei Kurzgesagt die Sprengstoffpyramide im Vergleich zur Cheops-Pyramide. → Neue Handwerksregel.
4. **Spannung ohne Fragen:** Die Story-Kanäle stellen kaum Fragen (1 pro 1000 Wörter). Sie halten die Spannung mit Vorausdeutungen wie „Zu diesem Zeitpunkt ahnte niemand …“, „Doch dann …“ oder „Plötzlich …“. Unsere Prüfung kannte nur Fragen und Ankündigungen. → **Vorausdeutungen zählen jetzt als offene Schleife.**
5. **Satzrhythmus:** Wörter pro Satz (9,6–13,3) und Anteil kurzer Sätze (14–37 %) liegen bei uns schon im Bereich der Konkurrenz. Keine Änderung.

**Hook-Muster der 12 Videos (von Hand gelesen):**

| Muster | Beispiele | Anzahl |
|---|---|---:|
| **Szene mit Datum, Uhrzeit, Ort** (Cold Open) | Bismarck am 27. Mai 1941 kurz nach 10 Uhr, U-Boot in der Straße von Gibraltar, Sitzplatz 11A bei 37 Grad | 5 |
| **Zahlenstapel + Kontrast** | Holz-Kriegsschiff, geheime Atomwaffe | 2 |
| **Rekordobjekt + Zahl + Frage** | größtes Containerschiff, 200.000 Tonnen, warum geht es nicht unter? | 1 |
| **Person mit Wendepunkt** | Junge, der Zauberer werden wollte, wird meistgesuchter Hacker; Erfinder des Akkus | 2 |
| **Direkte Ansprache** | „Hast du schon mal über … diskutiert?“ | 1 |
| **Atmosphäre / Rätsel** | Nebel, aus dem ein seltsamer Bug auftaucht | 1 |

Unser `hookAnchor` deckt Zahl, Ereignis, Ort, Person und Paradox schon ab. Neu dokumentiert sind die Szene mit Datum und Uhrzeit und der Zahlenstapel mit Kontrast als Vorlagen.

## 2. Szenen und Bildtakt

Bildwechsel in den ersten 7 Minuten:

| Video | Aufrufe | Median | unter 3 s | 3–6 s | 6–10 s | über 10 s |
|---|---:|---:|---:|---:|---:|---:|
| Simplicissimus Air India | 1,66 Mio. | 1,6 s | 67 % | 20 % | 11 % | 2 % |
| Simplicissimus Hacker | 1,77 Mio. | 2,0 s | 65 % | 19 % | 6 % | 9 % |
| Terra X Akku | 173.111 | 3,4 s | 47 % | 38 % | 8 % | 8 % |
| Terra X Auftrieb | 360.554 | 4,7 s | 22 % | 41 % | 11 % | 26 % |
| Kurzgesagt Waffe | 1,39 Mio. | 5,0 s | 17 % | 38 % | 21 % | 25 % |
| Stahl unter Wasser «Das Boot» (Treffer) | 70.805 | 5,4 s | 43 % | 12 % | 29 % | 16 % |
| Verlorene Schiffe Holz (Treffer) | 39.651 | 5,7 s | 3 % | 96 % | 0 % | 1 % |
| Stahl unter Wasser Bismarck (typisch) | 4.430 | 6,0 s | 25 % | 20 % | 34 % | 21 % |
| Stahl und Meer Zumwalt (typisch) | 1.586 | 6,7 s | 0 % | 2 % | 78 % | 20 % |
| **Wissonaut Stahlschiff** | – | **8,0 s** | | | | |

**Was daraus folgt:**

- Jeder Vergleichskanal wechselt das Bild schneller als wir. Am nächsten an unseren 8 s liegt das schwächste Video im Vergleich (Zumwalt, 6,7 s).
- Innerhalb desselben Kanals ist der Treffer schneller geschnitten als das typische Video (Stahl unter Wasser 5,4 s gegenüber 6,0 s).
- Gleichmäßiger Takt allein schadet offenbar nicht: Der Holz-Treffer wechselt fast exakt alle 5,7 s. Entscheidend ist eher das Tempo.
- → **Neu: Bildzahl individuell pro Video statt fester Zahl.** Jede sichtbare Aussage bekommt ein eigenes Bild, bevorzugt 4–7 s pro Bild, ab 8 s Teilung prüfen. `science:script-qa` meldet lange Szenen, `npm run science:scenes` passt das Gerüst an. Als Hypothese `hyp-003` im Lernsystem.

## 3. Bilder

Gesehen in den Kontaktbögen:

- **Menschen in Aktion:** In den Story- und Technikvideos arbeitet in fast jedem Bild jemand: Arbeiter fällen Eichen, sägen Balken oder ziehen Taue, eine Moderatorin legt einen Holzklotz ins Wasserglas, Figuren reagieren mit Gefühl. Unsere Bilder zeigten oft nur Objekte, „graue Würfel“.
- **Größenvergleich als eigenes Bild:** Kurzgesagt stellt die Sprengstoffpyramide neben die Cheops-Pyramide, Terra X legt ein Containerschiff neben Kleinwagen.
- **Alltagsexperiment:** Terra X erklärt Dichte mit Holzklotz, Glas und Wasser auf einem Tisch.
- **Pfeile direkt auf echte Szenen:** Terra X zeichnet Auftriebs- und Gewichtspfeile auf das echte Schiffsfoto und den Schwimmer. Das bestätigt unsere Label-Regel.
- **Ort-/Zeit-Marken:** Kurzgesagt und Simplicissimus setzen kleine Ecken-Labels wie „1945“, „Hiroshima, Japan“ oder einen Namen. Bei uns wäre das ein angefragtes deutsches Label.
- **Beweisbilder:** Simplicissimus zeigt Dokumente, Untersuchungsberichte und Datengrafiken. Das macht Behauptungen glaubwürdig.
- **Einheitlicher Look:** Jeder Kanal hat einen klar wiedererkennbaren Stil (Kurzgesagt flach und bunt, Verlorene Schiffe filmisch-fotorealistisch, Stahl unter Wasser Archivmaterial). Das bestätigt unseren Style-Lock.

→ In `BILDWELT.md` als neue Bildarten aufgenommen: **Mensch in Aktion, Größenvergleich, Alltagsexperiment, Vorher/Nachher, Beweisbild.**

## 4. Titel

Vergleich innerhalb desselben Kanals: gleicher Stil, gleiche Stimme, gleiche Abozahl.

| Kanal | Treffer | typisch | Faktor |
|---|---|---|---:|
| Verlorene Schiffe | „Wie diese **gigantischen** Kriegsschiffe **aus Holz** gebaut wurden“ | „Die faszinierende Technik des U-Bootes – Eine unglaubliche Ingenieursleistung“ | 287× |
| Stahl unter Wasser | „Das echte U-Boot aus **«Das Boot»** – **5 Dinge**, die der Film nicht erzählt“ | „Warum liegt die Bismarck immer noch dort?“ | 16× |
| Stahl und Meer | „Britanniens **„unsinkbarer“** Stolz sank in **13 Minuten**“ | „Der Zerstörer der Zukunft, der sich als Flop entpuppte“ | 11× |

- Die Treffer haben einen **konkreten Widerspruch** (gigantisch + Holz, unsinkbar + 13 Minuten) oder einen **bekannten Bezug** (der Film „Das Boot“).
- Die schwachen Titel sind allgemein („faszinierende Technik“, „Zerstörer der Zukunft“).
- → `science:title-check` schlägt jetzt zusätzlich die Formeln **„Bekannter Bezug“** und **„Listen-Versprechen“** vor.

## 5. Thumbnails

- **1–3 große Wörter**, fast nie mehr: ATOMENERGIE, DIE FINALE BOMBE, Stahl schwimmt, EINZIGER ÜBERLEBENDER, DAS ECHTE BOOT, 4.790 METER TIEF.
- **Ein Hauptobjekt**, groß und kontrastreich, oft mit gesättigten Farben.
- **Roter Pfeil oder Kreis** auf das überraschende Detail (Air-India-Sitz, Person im Kreis, Zumwalt-Aufbau, Ark Royal).
- **Vorher/Nachher-Teilung** mit Pfeil (Schlachtschiff → Wrack in 4.790 m Tiefe).
- **Text ergänzt den Titel, statt ihn zu wiederholen:** Titel „Wie der Auftrieb tonnenschwere Schiffe über Wasser hält“, Thumbnail „Stahl schwimmt“.
- Die schwachen Thumbnails haben nur ein Wort ohne Spannung („DAS U-BOOT“) in dunkler, kontrastarmer Optik.

→ Thumbnail-Regeln in `LONGFORM.md` und `VIDEO-AUTOMATIK.md` (Schritt 7) ergänzt.

## 6. Kapitelmarken

Stahl unter Wasser setzt 18–19 Kapitel, Stahl und Meer 9–10, Kurzgesagt 6, Terra X 3. Unsere Captions hatten nur den Platzhalter „Kapitel … ergänzen wir später“, und es wurden nie welche ergänzt.

→ **Neu: `chapterTitle` an der ersten Szene jedes Abschnitts.** `science:finish` schreibt die Kapitel nach dem Render automatisch mit echten Zeitstempeln in `caption.txt` (`npm run science:chapters`).

## Nicht übernommen

- **Moderatorin vor der Kamera** (Terra X): passt nicht zu einem Kanal ohne Gesicht.
- **Sehr schnelle Schnitte unter 2 s** (Simplicissimus): mit Standbildern aus Google Flow nicht machbar und für Technikerklärungen zu hektisch.
- **Zahlen- und Textkarten als eigene Szene** („360 Menschen.“ bei Stahl unter Wasser): wäre ein neues Remotion-Element. Das ist ein eigener nächster Schritt und braucht eine bewusste Entscheidung, weil Remotion bisher keine eigenen Texte einblendet.
