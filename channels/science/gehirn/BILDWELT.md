# Bildwelt — Technical Editorial Explainer 2.5D

> **Die frühere visuelle Ausführung von „Scientific Scene Explainer“ ist ersetzt.** Der alte interne Stil-Identifier `scientific-scene-explainer-v1` bleibt nur aus technischer Rückwärtskompatibilität bestehen. Inhaltlich gilt ausschließlich diese Bildwelt.

## Ziel

Jedes Bild soll **eine konkrete Aussage verständlich erklären** und trotzdem sofort wie derselbe Wissenschafts- und Technikkanal wirken.

Die Wiedererkennung kommt aus einer konstanten **Illustrationssprache**, nicht aus immer derselben Komposition.

Leitfrage pro Beat:

> Welche Darstellungsform erklärt diese Aussage am schnellsten, ohne die gemeinsame Bildwelt zu verlassen?

## Format

- 1920×1080 / 16:9
- statische Szenenbilder
- Thumbnail separat in 1280×720
- gesamter Bildraum darf genutzt werden

## Fester Style-Lock für ALLE Szenen

Jeder Google-Flow-Prompt muss dieselbe Stilbasis verwenden:

- moderne technische Editorial-Illustration
- sauberer **2D/2.5D vector-like Look**
- vereinfachte, aber glaubwürdige Proportionen
- matte Materialien statt Fotorealismus
- klare Kanten und saubere Formen
- dezente Gradients
- weiche, kontrollierte Schatten
- moderate räumliche Tiefe
- konsistente Linienstärke
- erwachsen, professionell, ruhig
- technisch erklärend statt dekorativ

### Feste Farb- und Materialsprache

Grundfamilie:
- warmes Off-White / helles Beige für neutrale Flächen
- Graphit / Anthrazit für Technik und Linien
- gedeckte Industrietöne

Akzentfarben nur mit Bedeutung:
- Kupfer = Leiter/Spule
- Blau = Feld, Kälte, Luft, Wasser oder neutrale Energiepfade
- Orange/Rot = Wärme
- Grün = aktiv / korrekt / erkannt
- Gelb = Warnung oder gezielter Fokus

**Wichtig:** Nicht jedes Bild braucht denselben Hintergrund. Die Umgebung darf wechseln, aber Rendering, Linien, Materialvereinfachung, Schatten und Label-Stil bleiben konstant.

## Was ausdrücklich NICHT die Bildwelt ist

Verboten:
- Fotorealismus
- echte Fotooptik
- hyperrealistische Küchen, Werkstätten oder Fahrzeuge
- weißes Schulbuch-/PowerPoint-Infografik-Layout
- generische KI-Kunstoptik
- Pixar-/Kinder-Cartoon
- Sci-Fi-HUD
- Neon-Glow als Hauptstil
- Fantasy-Partikel
- stark cineastische Filmoptik

## Verschiedene Erklärformen innerhalb derselben Bildwelt

Ein Video darf verschiedene Darstellungsarten verwenden, solange der Style-Lock gleich bleibt.

Erlaubt und erwünscht:
1. vereinfachte Umgebungsszene
2. technische Cutaway-/Querschnittsansicht
3. Explosionsdarstellung
4. Material-/Makroansicht
5. Objektvergleich
6. Prozessdarstellung
7. Draufsicht
8. Bauteil mit Callouts
9. vereinfachtes Diagramm
10. Schaltplan / Funktionsschema
11. Mess-/Instrumentansicht
12. Abschlusskette / Zusammenfassung

Für das 2-Minuten-Profil gilt weiterhin: mindestens **5 deutlich unterschiedliche Darstellungsformen** pro Video.

## Konstanz trotz Vielfalt

Zwischen den Bildern dürfen wechseln:
- Perspektive
- Bildaufbau
- Ort
- Motiv
- Darstellungsform
- Anzahl der Labels

Konstant bleiben müssen:
- 2D/2.5D vector-like Rendering
- matte vereinfachte Materialien
- gleiche Art von Schatten
- gleiche Linienstärke
- gleiche Typografie
- gleiche Callout-/Label-Sprache
- gleiche Akzentfarblogik
- gleiche erwachsene technische Anmutung

## Text, Beschriftungen und Callouts

Beschriftungen sind ausdrücklich erlaubt, wenn sie beim Erklären helfen.

Regeln:
- sichtbarer Text ausschließlich **Deutsch**
- Google-Flow-Prompt selbst wird **auf Englisch** geschrieben
- normale Szene meist 0–3 kurze Labels
- komplexe technische Darstellung ausnahmsweise bis 5 kurze Labels
- keine Textwand
- keine große Überschrift in normalen Szenen
- Thumbnail darf großen kurzen Text tragen
- dünne, saubere Leader-Lines
- kleine, ruhige Label-Flächen
- keine schwebenden UI-Karten ohne Nutzen

Bevorzugter Label-Stil:
- klare serifenlose Schrift
- Graphit auf hellem neutralem Feld oder Off-White auf dunklem Graphitfeld
- kleine abgerundete Label-Fläche
- dünne Verbindungslinie zum Objekt

## Schaltpläne und technische Diagramme

Schaltpläne sind erlaubt und sollen dieselbe Bildwelt behalten:

- saubere technische Linien
- klare Symbolik
- 2D-Schema darf mit vereinfachter 2.5D-Bauteildarstellung kombiniert werden
- Hintergrund warm-neutral statt reinem Schulbuchweiß
- deutsche Bezeichnungen
- keine dekorativen Elemente, die die Schaltung unklar machen

Fachliche Korrektheit ist wichtiger als Design. Wenn ein exakter Schaltplan nicht sicher dargestellt werden kann, lieber eine einfachere, eindeutige Funktionsdarstellung wählen als falsche Verdrahtung erfinden.

## Menschen und Gesichter

Menschen nur bei fachlichem Nutzen.

- sichtbarer Kopf = vollständige natürliche stilisierte Gesichtszüge
- keine **gesichtslosen sichtbaren Köpfe**
- wenn das Gesicht nicht gebraucht wird, Kopf vollständig aus dem Frame
- keine Person nur als Dekoration
- Personen ebenfalls im gleichen 2D/2.5D-Editorial-Look

## Verbindliche visuelle Vielfalt

- keine identische Hauptkomposition direkt hintereinander
- derselbe dominante Bildanker höchstens 3-mal
- „Hand auf Gegenstand + Pfeile“ höchstens 3-mal
- gleiche Perspektive nicht ständig wiederholen
- gleiche Links/Rechts-Aufteilung nicht ständig wiederholen
- mindestens **5 deutlich unterschiedliche Darstellungsformen** im Video
- wenn drei benachbarte Skriptteile fast dasselbe Bild erzwingen: Skript oder Beat-Plan ändern

## Prompt-Sprache

Alle Google-Flow-Bildprompts werden **auf Englisch** geschrieben.

Nur ausdrücklich verlangter sichtbarer Text im Bild bleibt **Deutsch**.

Jeder Prompt muss einen Style-Lock enthalten oder vom Masterprompt einen Style-Lock erben.

### Verbindlicher Style-Lock für Flow

```text
STYLE LOCK — Technical Editorial Explainer 2.5D
Keep the exact same visual language across the entire video: clean modern 2D/2.5D vector-like technical editorial illustration, simplified but believable proportions, matte materials, clean edges, subtle gradients, soft controlled shadows, consistent line weight, moderate depth, adult professional educational design. Do not use photorealism, real-photo aesthetics, generic AI art, white textbook infographic layouts, Pixar/cartoon styling, sci-fi HUDs or neon-heavy effects. Scene type, perspective and environment may change, but rendering language, material simplification, line quality, typography and callout design must remain consistent. Visible text only in German and only when explicitly requested.
```

## Informationsdichte

Standard: **so wenig Information wie möglich, so viel wie nötig**.

Vermeiden:
- Titel + viele Labels + Infobox + Formel gleichzeitig
- dekorative Pfeile
- dieselbe Aussage mehrfach im Bild
- unnötige Details

## Qualitätsprüfung vor Freigabe

Ein Bild ist nur gut, wenn:

1. die Kernaussage sofort verständlicher wird
2. die Bildwelt eindeutig Technical Editorial Explainer 2.5D bleibt
3. es nicht fotorealistisch wirkt
4. es nicht wie eine weiße Schulbuch-Infografik wirkt
5. es sich sinnvoll vom vorherigen Beat unterscheidet
6. Labels kurz, korrekt und deutsch sind
7. keine gesichtslosen sichtbaren Köpfe vorkommen
8. die Akzentfarben fachlich begründet sind
9. die Szene erwachsen und professionell wirkt
10. der 16:9-Raum sinnvoll genutzt wird

Wenn nicht: Prompt überarbeiten, bevor das Bild übernommen wird.
