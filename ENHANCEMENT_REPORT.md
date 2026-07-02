# Almoedat (المعدات) — Enhancement Report

## Context

The project started as a [Magic Patterns](https://magicpatterns.com)-generated visual mockup of an Arabic-language (RTL), Saudi-focused heavy-equipment rental marketplace. It looked complete but almost nothing worked: there was no router (a single `useState` faked 3 "pages"), every equipment card linked to the same one hardcoded detail page, the search bar and most buttons (login, hero CTAs, load-more, phone reveal, WhatsApp, share, footer/nav links) had no handlers, and "Near Me" was a static CSS graphic with no real geolocation. The PWA plumbing (install prompt, offline indicator, update prompt, service-worker registration) was genuinely coded but dead in practice — no `manifest.json`/`sw.js`/icons existed.

This pass turned it into a fully-interactive frontend prototype: real routing, a shared mock-data layer, working search/filter/favorites/contact actions, new pages the nav already referenced but didn't lead anywhere, a real interactive map with geolocation, and a working installable PWA — all frontend-only (localStorage-backed mock persistence, no real backend), while preserving the existing Mantine gold/navy visual identity, Cairo font, and RTL layout.

## Update: real equipment photos

Every equipment listing previously showed a flat navy gradient with a generic truck icon — recognizable as a placeholder even at a glance. All 20 seed listings now show a real, category-matched photo (telescopic crane, scissor lift, excavator, forklift, mobile crane, wheel loader, backhoe loader, boom lift, skid steer, road roller, tower crane, mini excavator, flatbed truck, asphalt paver), sourced from Wikimedia Commons via `scripts/fetch-equipment-images.mjs` (a one-off script, same pattern as the PWA icon generator) and downscaled/compressed with `sharp` to ~900×600 JPEGs (1.9MB total for all 14 photos). Licenses/authors are recorded in `public/images/equipment/ATTRIBUTIONS.md`.

The `Equipment.imageDataUrl` field was renamed to `Equipment.image` (in `src/data/types.ts` and everywhere it's consumed) since it now holds either a static asset path (seed data) or a user-uploaded data URL (`/post-listing`) — the old name was misleading once it wasn't always a data URL. `EquipmentCard` and `EquipmentDetails` fall back to the original gradient+icon placeholder whenever `image` is absent, so user-submitted listings without a photo still render correctly.

## What changed, by area

### Dependencies added
`react-router-dom`, `leaflet` + `react-leaflet` + `@types/leaflet`, `@mantine/hooks`, `@mantine/form`, `@mantine/notifications`, and `sharp` (dev-only, used by a one-off icon-generation script).

### Mock data layer (`src/data/`)
- `types.ts` — `Equipment` and `Company` types.
- `cities.ts` — 15 Saudi cities with lat/lng, used for map coordinates and the post-listing city picker.
- `equipment.ts` / `companies.ts` — 20 seed equipment listings across 7 companies (merged from the original scattered hardcoded arrays), each with a stable id and deterministically-jittered coordinates so map markers in the same city don't overlap.
- `repository.ts` — single source of truth: `getAllEquipment/ByCompanyId/ById`, `getAllCompanies/ById`, merges seed data with user-submitted listings/companies from localStorage.
- `navLinks.ts` — one shared list consumed by both `Header` and `Footer` (fixes the original bug where every nav link pointed at "home").

### Routing (`react-router-dom`)
`BrowserRouter` wraps the app in `src/index.tsx`. `App.tsx`'s old `useState<'home'|'details'|'locator'>` page-switcher is gone, replaced with real routes:

| Route | Page |
|---|---|
| `/` | Home (hero, search, featured grid, features) |
| `/equipment` | Searchable/filterable results (`useSearchParams`-driven) |
| `/equipment/:id` | Equipment details |
| `/locator` | Near Me (real map) |
| `/companies`, `/companies/:id` | Company directory & profile |
| `/pricing` | Package tiers |
| `/post-listing` | Auth-gated listing form |
| `/favorites` | Favorited equipment |
| `/about` | About page |
| `*` | 404 |

### Core functionality wired up
- **Search** (`SearchSection`) is now controlled and actually filters `/equipment` results by keyword/service type/category/region.
- **Favorites** (`useFavorites` hook, localStorage) — heart icons on cards and the details page persist across reloads.
- **Equipment cards** now carry a real `id` and link to their own detail page instead of all sharing one static page.
- **Equipment details** — phone-reveal, WhatsApp deep link (`wa.me`), share (Web Share API with clipboard fallback), and "view all company listings" all do something real.
- **Header** — nav links go to distinct real pages; "دخول" opens a login/signup modal; once authenticated, shows the user's name with a dropdown (my listings / favorites / logout).
- **Hero CTAs** navigate to `/equipment` and `/post-listing`.
- **Load more** is a real paginated "show more" (`usePaginatedList` hook), reused across the results, company profile, etc.

### New pages
Company directory + profile, pricing (4 tiers, no real payment), post-a-listing (form validation via `@mantine/form`, real photo upload resized client-side to a capped JPEG data URL, auto-creates a company record for first-time posters), login/signup modal (`AuthContext` + `AuthModal`, mock localStorage "users table" — intentionally simplified since there's no backend), favorites, about, 404.

### Real map for "Near Me"
- `useGeolocation` hook wraps `navigator.geolocation`.
- `NearMeMap` component: `react-leaflet` + OpenStreetMap tiles, custom SVG marker icons (avoids the common Leaflet/Vite default-icon path bug).
- Real haversine distance sorting against the user's location (`src/utils/geo.ts`), with a Riyadh fallback + retry alert when permission is denied.

### PWA
- Designed a truck-silhouette icon (gold on navy, matching the `TruckIcon` motif used throughout) at `design/icon-source.svg`.
- `scripts/generate-icons.mjs` (one-off, uses `sharp`) rasterizes it into all 8 manifest sizes + apple-touch-icon + favicon.
- Real `public/manifest.json` and `public/sw.js` (previously only existed as commented-out reference text in a doc file, which has since been deleted).
- `index.html` fixed: `lang="ar" dir="rtl"` (was `lang="en"`), manifest link, theme-color/apple meta tags, real title/description.
- Verified against a production build (`vite build && vite preview`) that the service worker actually registers and activates.

## Bugs found and fixed during verification

1. **Leaflet map rendering at 0 height.** Mantine's `Grid`/`Grid.Col` didn't propagate a definite height through the nested flex layout, so the map container collapsed to zero size (tiles loaded, but nothing was visible). Fixed by replacing `Grid` with a plain `Flex`/`Box` layout and making the map `position: absolute; inset: 0` inside a `position: relative` parent, sidestepping the percentage-height-in-flex-item ambiguity entirely.
2. **Jitter math pushed markers outside the search radius.** The per-item coordinate jitter (added so same-city markers don't perfectly overlap) used JS's signed `%`, producing an asymmetric range up to ~10km per axis — enough to push in-city items outside the default 10km radius filter, returning 0 results. Fixed with an unsigned hash and a smaller (~1km) jitter range.
3. **Unhandled clipboard rejection.** The share button's clipboard-fallback path could throw an uncaught promise rejection if clipboard permission was denied; wrapped in a try/catch with a user-facing error toast.

## Verification performed

- `npm run build` and `npm run lint` are both clean (0 errors).
- Full Playwright click-through against the dev server: home load → card click → unique detail page → back; search → filtered `/equipment` results; every header nav link → distinct real page; signup → session persists, header updates; favoriting → persists via `/favorites`; phone-reveal shows the real number; post-listing (with photo upload) → success → new listing visible on its own detail page and in `/equipment` results.
- Mobile viewport (390×844) re-tested after the layout fix — map and responsive drawer both work.
- Production preview (`vite build && vite preview`) confirmed the service worker registers/activates and the manifest is valid.

## Known limitations (by design, given "no real backend")

- All persistence is localStorage-based (favorites, mock auth "users table" with plaintext passwords, user listings/companies) — intentional for a frontend-only prototype, not production-appropriate as-is.
- No real payment on the pricing page, no real messaging/notifications backend.
- JS bundle is ~664KB minified (Vite flags this); not code-split. Fine for a prototype, worth addressing with route-based `React.lazy()` if this grows into a real app.

## Running it

```bash
npm install
npm run dev       # http://localhost:5173
npm run build && npm run preview   # production build, needed to see PWA install/offline behavior
```
