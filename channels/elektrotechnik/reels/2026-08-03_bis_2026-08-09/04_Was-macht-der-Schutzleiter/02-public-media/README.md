# Öffentliche Bilder – optional

Dieser Reel benötigt **keine Bilder**. Alle neun Szenen werden in Remotion gebaut.

Öffentliche Bilder dürfen nur ergänzt werden, wenn ein reales Motiv einen deutlichen Mehrwert liefert, zum Beispiel bei Kraftwerken, Umspannwerken, historischen Anlagen oder realen Bahnkomponenten.

## Erlaubte Standardlizenzen

- `Public-Domain`
- `CC0-1.0`
- `CC-BY-4.0`

Nicht automatisch verwenden: NC-, ND- oder SA-Lizenzen. Bei `CC-BY-4.0` müssen Autor und Attribution vollständig dokumentiert sein.

## Manifest

Ein Asset wird in `public-assets.json` mit diesen Feldern eingetragen:

```json
{
  "id":"beispiel",
  "sceneId":"02-szene",
  "sourcePage":"https://...",
  "fileUrl":"https://...",
  "license":"CC-BY-4.0",
  "author":"Name",
  "attribution":"Foto: Name, CC BY 4.0",
  "licenseVerified":true,
  "filename":"beispiel.jpg"
}
```

Danach:

```bash
npm run electrical:public-media -- "<reel-ordner>"
```

Das Skript lädt das Asset in den passenden Szenenordner und schreibt die Attribution für den Export. Codex muss Quelle und Lizenz vor dem Eintragen prüfen.
