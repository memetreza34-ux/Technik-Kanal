# Visual Quality Gate – Version 6

## Ziel

Die Bildserie muss wie eine hochwertige technische Dokumentation wirken. Texte werden klar nach ihrer Funktion getrennt.

## Verbindliche Texttrennung

### Ausschließlich Remotion

- Cover-Hook
- Kicker
- Szenenüberschrift
- allgemeine Kernaussage
- CTA
- Untertitel

Diese Texte dürfen niemals in das Basisbild eingebrannt oder von der Bild-KI erzeugt werden.

### Technische Callouts im finalen Bild

Direkt im Bild sind nur kurze deutsche Markierungen erlaubt, wenn sie auf ein konkretes technisches Ziel zeigen:

- Bauteil
- Leiter
- Klemme oder Anschluss
- Fehlerstelle
- Schalterzustand
- wichtiger Prozesspunkt

Callouts brauchen eine Linie oder einen Zielpunkt. Sie dürfen keine allgemeine Szenenüberschrift ersetzen. Nicht jedes Bild braucht Callouts; maximal drei pro Bild.

## Verbindliche Produktionsmethode

1. Serienreferenzen für wiederkehrende Objekte erzeugen.
2. Verwandte Szenen mit derselben Referenz generieren.
3. KI-Basisbilder vollständig textfrei halten.
4. Nur notwendige technische Callouts kontrolliert einbrennen:

```bash
npm run electrical:label-images -- "<reel-ordner>"
```

5. Hook und Szenenüberschriften erst beim Remotion-Render ergänzen.

## Bildsprache

- cinematic industrial editorial photography
- reale europäische Bauteile und reale Proportionen
- konsistente wiederkehrende Objekte
- konsistentes Serien-Grading
- sichtbare Werkstatt- oder Anlagenumgebung statt leerer Produktfläche
- unterschiedliche, bewusst gewählte Kameratypen
- kontrollierte Set-Familien

## Verboten

- Covertext oder Szenenheadline im KI-Bild
- allgemeine Textsätze als Bildbeschriftung
- Callouts ohne konkretes Ziel
- mehr als drei Callouts pro Bild
- isolierte Katalog- oder Amazon-Produktfotos
- schwebende Bauteile
- zufällig wechselnde Geräte und Bildstile
- KI-generierte Schrift
- weiße Balken, Titelkarten oder Letterboxing
- Cartoon-, Spielzeug-, Pixar-, Miniatur- oder Fantasyoptik

## Qualitätsprüfung

Der Preflight blockiert künftig:

- fehlende Serienreferenzen und Kameratypen
- Prompts mit sichtbarer KI-Schrift
- Prompts ohne Serienfarbgrading oder Full-bleed-Regeln
- Katalog-, Floating- oder Stockfoto-Sprache
- mehr als drei technische Callouts
- zu lange Callout-Texte

Die finale visuelle Prüfung kontrolliert zusätzlich Motivqualität, Kontinuität, Callout-Zielgenauigkeit und fachliche Plausibilität.
