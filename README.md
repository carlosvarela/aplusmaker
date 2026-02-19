# A+ Generator (Trust Office + GXTrust)

Next.js + Tailwind app to:
- Import/Export JSON
- Generate HTML
- Preview in iframe
- Download / Copy HTML
- Two templates: Trust Office + GXTrust
- Base de 4 bloques (usa los primeros 4; si faltan, rellena)

## Local
```bash
npm i
npm run dev
```

## Deploy (Vercel)
Framework Preset: **Next.js** (auto-detect)

## API
POST `/api/generate`
```json
{
  "template": "trust-office" | "gxtrust",
  "data": { ... },
  "options": { "fragment": false }
}
```
