# Technik-Kanal – feste Regeln für alle neuen Videos

**Jeder neue Short folgt dem Rahmen in [docs/RAHMEN.md](docs/RAHMEN.md)** – Bausteine in `src/frame/Frame.tsx` (`Z`, `CaptionSlot`, `Mark`, `Shade`, `Heading`, `Marker`). Kurzfassung:

- **Jeder Short ist individuell.** Welt, Farben und Bühne passen zum Thema (2D-Zeichnung, Schaltplan, 3D-Modell, Tag oder Nacht) – mit Alltags-Bildbeispielen, das echte Gerät statt abstrakter Kästen.
- **Wenn es eine richtige 3D-Animation wird, ist die Nacht-Welt der Maßstab** (Vorlage `src/short/scenes/Waermepumpe.tsx`): eine Welt drumherum (z. B. aufgeschnittenes Haus wie ein Puppenhaus), Kamerafahrt ins Gerät, aufschneiden, Ströme als leuchtende Teilchen, am Ende zurück in die Totale. Licht, Atmosphäre und Detailgrad mindestens auf diesem Niveau.
- **Text:** Untertitel als Haupttext (Schlüsselwort farbig). Dazu erlaubt: **kleine Zwischenüberschrift oben** (`Heading`) und **kurze Markierungen am Bauteil** (`Marker`). Keine Karten, keine Merksätze, kein Fortschrittsbalken, keine Kanal-Marke.
- **Untertitel im unteren Drittel** (y 1420), immer genau eine Zeile (max. 860 px breit).
- **Unten ab y 1530 frei** (App-Bedienung).
- Vorbild ist Welt und Raster von @haustechnikehrlich, **nicht** seine Marke: eigener Name „Technik verstehen“, Blitz, Gelb.

Bestehende Videos werden nicht automatisch umgebaut – nur auf ausdrücklichen Wunsch.
