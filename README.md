Arenda-Zala.uz — Vite + Vue TSX + SSG

Stack
- Vite + Vue 3 (TSX via @vitejs/plugin-vue-jsx)
- Router, vue-i18n (uz/ru), @unhead/vue (meta)
- vite-ssg for static prerender (SEO)
- zod for form validation

Dev
- npm i
- npm run dev

Build (SSG)
- npm run build
- npm run preview

Telegram relay (serverless)
- Vercel-style function: `api/lead.ts`
- Env vars (Project Settings → Environment Variables):
  - `TELEGRAM_BOT_TOKEN`
  - `TELEGRAM_CHAT_ID`
- Frontend posts JSON to `/api/lead` with validated payload.

Deployment
- Vercel recommended (SSG + serverless):
  - Import repo → set env vars → deploy.
  - Build command: `vite-ssg build` (default from package.json).
  - Output directory: `dist`.
- Netlify alternative:
  - Use Netlify Functions (rename `api/lead.ts` accordingly) or add an external relay endpoint.

SEO
- `@unhead/vue` for per-page meta, OpenGraph, and JSON-LD (EventVenue).
- `public/robots.txt` and `public/sitemap.xml` included.

I18n
- Uzbek and Russian strings in `src/translations/uz.json` and `src/translations/ru.json`.
- Language switch in header (client-side `hreflang` exposed on home page).

Environment (.env)
- Copy `.env.example` → `.env` (dev) and set the same keys in Vercel Project Settings.
- Server-only secrets:
  - `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`
- Client (must be prefixed `VITE_`):
  - Yandex Map: `VITE_YMAPS_API_KEY`, `VITE_MAP_LAT`, `VITE_MAP_LNG`, `VITE_MAP_ZOOM`, `VITE_ADDRESS_TEXT`, `VITE_WORKING_HOURS`
  - Phones: `VITE_PHONE_1(_HUMAN)`, `VITE_PHONE_2(_HUMAN)`
  - Images: `VITE_HERO_IMG1`, `VITE_HERO_IMG2`, `VITE_CARD_IMG_*`, `VITE_HALL*_IMG`
  - Optional footer note: `VITE_FOOTER_NOTE`

Images
- We use remote placeholders (Unsplash). Replace URLs in `.env` to switch to your own images instantly.

Next steps
- Confirm prices and address text from the PDF.
- Add real photos to Gallery (optimized WebP/AVIF) and hall layout images.
- Optionally add analytics (GA4/Yandex) and hCaptcha.

Notes
- Prices and address from PDF need confirmation.
- Images/Gallery are placeholders; add optimized WebP/AVIF.
