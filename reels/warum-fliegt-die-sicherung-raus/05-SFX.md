# SFX – Warum fliegt die Sicherung raus?

**Grundsatz:** keine Musik. Sound erklärt Zustandswechsel und bleibt deutlich unter dem Voice-over.

| Zeit | Ereignis | SFX | Ziel-Dateiname | Lautstärke |
|---|---|---|---|---|
| 2,2 s | LSS löst im Hook aus | kurzer mechanischer Schalter-Klick mit trockenem Snap | `sfx-breaker-trip-hook.wav` | etwa -22 dB unter Voice |
| 7,5 s | Schutzwirkung wird sichtbar | kurzer weicher Technik-Reveal | `sfx-protection-reveal.wav` | -28 dB |
| 14,5 / 16 / 17,5 s | Verbraucher schalten nacheinander zu | drei dezente Steck-/Relais-Klicks | `sfx-load-step.wav` | -28 dB je Impuls |
| 22–28 s | Bimetall erwärmt und verbiegt sich | leises ansteigendes Metall-/Wärme-Ticken, am Ende Klick | `sfx-bimetal-bend-trip.wav` | -26 dB |
| 32,2 s | Leiter berühren sich | sehr kurzer elektrischer Impuls, keine Explosion | `sfx-short-circuit-pulse.wav` | -22 dB |
| 37,5 s | Magnetauslöser zieht an | kurzer Coil-Pull plus Kontakt-Trennung | `sfx-magnetic-trip.wav` | -23 dB |
| 44 / 47 s | Vergleich Überlast/Kurzschluss | langsamer Tick links, schneller Snap rechts | `sfx-compare-slow.wav`, `sfx-compare-fast.wav` | -29 dB |
| 52 s | Geräte werden ausgeschaltet | dezenter Steckerklick | `sfx-unplug.wav` | -27 dB |
| 55,2 s | Schalter einmal zurücksetzen | kontrollierter mechanischer Klick | `sfx-breaker-reset.wav` | -24 dB |
| 59 s | erneutes Auslösen | kurzer Warn-Snap plus leiser Warnimpuls | `sfx-breaker-retrip-warning.wav` | -23 dB |
| 64,5 s | LSS/FI-Vergleich erscheint | neutraler UI-Reveal | `sfx-lss-fi-compare.wav` | -29 dB |
| 67,2 s | CTA `SICHERUNG` | kurzer heller Bestätigungsimpuls | `sfx-cta-confirm.wav` | -27 dB |

## Technische Regeln

- alle SFX als WAV, 48 kHz
- kein Hall, kein Bass-Boost, keine Meme- oder Kinotrailer-Sounds
- Kurzschluss-Sound maximal etwa 250 ms
- kein SFX darf das Wortverständnis verdecken
- bei gleichzeitigem Voice-over SFX kurz um weitere 2 bis 4 dB absenken
- finalen Mix mit Kopfhörern und Smartphone-Lautsprecher prüfen
