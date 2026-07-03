# Almoedat — Improvement Plan

> **Context:** Almoedat (المعدات) is a frontend-only prototype of an Arabic RTL heavy-equipment
> rental/sale marketplace (React 18, Vite, Mantine v7, react-router-dom v6, react-leaflet,
> TypeScript strict). All persistence is localStorage-backed. The codebase is clean (no `any`
> usage, consistent Arabic labels, proper type contracts) but has room to grow before it's
> production-ready. This document catalogs concrete, actionable improvements.
>
> **Note on auth:** All password/auth comments refer to the *mock* localStorage layer, not a
> real backend. Demo credentials (`demo@almoedat.com` / `123456`) are intentionally public.

## Severity legend

| Icon | Meaning |
|------|---------|
| 🔴   | High — causes bugs, data loss, or blocks production |
| 🟡   | Medium — code quality, maintainability, or UX friction |
| 🟢   | Low — polish, nice-to-have, future-proofing |

---

## 0. Issues in the current uncommitted change — fix first

These are in the uncommitted Profile page / Header / AuthContext changes. Fix them before
merging to avoid shipping known bugs.

### 🔴 Profile form shows blank fields after login-via-modal

`src/pages/Profile.tsx:31-40`

**Problem:** `useForm` reads `user?.name` and `user?.phone` *before* the auth-gate early
return at line 42. When a logged-out user lands on `/profile`, sees the lock screen, and
logs in via the global `AuthModal` (which doesn't cause a remount), the form retains the
empty-string initial values captured when `user` was null.

**How to fix:**

1. Split the authenticated form into a child component (e.g. `ProfileForm`) that only mounts
   after the auth gate, so `useForm` always sees a real user.
2. Alternatively, add a `key={user?.id}` wrapper on the Card so React remounts the form when
   the user changes, and move the `useForm` call (and the early return) into a subcomponent.
3. Or reset the form in a `useEffect` when `user` changes:
   ```tsx
   useEffect(() => {
     if (user) {
       form.setValues({ name: user.name, phone: user.phone });
     }
   }, [user?.id]);
   ```

Option 1 is cleanest — it removes the `useForm`-before-gate anti-pattern entirely.

---

### 🟡 Duplicate success feedback on profile save

`src/pages/Profile.tsx:62-66` and `:88-97`

**Problem:** `handleSubmit` fires both `notifications.show(...)` (a toast) *and* sets
`saved = true` which renders an inline `<Alert>`. The user sees two overlapping confirmations.

**How to fix:** Remove the `saved` state, the `<Alert>` block (lines 88–97), and the
`CheckCircle2Icon` import. Keep only the `notifications.show` toast — it's non-blocking and
consistent with the rest of the app (e.g., PostListing).

---

### 🟡 Desktop and mobile auth actions are duplicated in Header

`src/components/Header.tsx:107-148` (desktop `Menu`) and `:219-279` (mobile `Drawer`)

**Problem:** Four actions — profile, my listings, favorites, logout — are implemented twice
with near-identical `Button` props (~60 lines of duplication). Adding a fifth action means
editing two places.

**How to fix:** Extract a shared component:

```tsx
// src/components/UserMenuActions.tsx
function UserMenuActions({ onSelect }: { onSelect: () => void }) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const go = (path: string) => { navigate(path); onSelect(); };
  // render the 4 buttons/items...
}
```

Then use it in both the desktop `Menu.Dropdown` and the mobile drawer `<Stack>`.

---

### 🟢 `user.name.charAt(0)` unguarded against empty string

`src/pages/Profile.tsx:76` and `src/components/Header.tsx:114`

**Problem:** If a user has an empty `name` (the signup form allows ≥ 2 chars, but the mock
data seeding or `updateProfile` could theoretically produce an empty string),
`charAt(0)` returns `''` — a 0-height, invisible avatar.

**How to fix:** Replace `user.name.charAt(0)` with `user.name.charAt(0) || '؟'` or
`user.name.charAt(0).toUpperCase() || '?'` — a single-character fallback that's always
visible.

---

## 1. Architecture & data layer

### 🔴 `repository.writeJson` doesn't catch `QuotaExceededError`

`src/data/repository.ts:17-19`

**Problem:** `writeJson` calls `localStorage.setItem` without try/catch. When the user's
storage quota is full (common on mobile Safari after a few MB), this throws
`QuotaExceededError` and crashes the `addUserListing` / `addUserCompany` call. (Note:
`readJson` *does* have try/catch — the asymmetry looks like an oversight.)

**How to fix:**

```ts
function writeJson<T>(key: string, value: T): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}
```

Then have callers check the return and show a toast on failure:
```ts
if (!writeJson(LISTINGS_KEY, listings)) {
  // notifications.show({ message: 'مساحة التخزين ممتلئة', color: 'red' });
}
```

---

### 🟡 Centralize all localStorage access

**Problem:** `src/components/InstallPrompt.tsx` reads/writes localStorage directly
(`almoedat-install-dismissed`) instead of going through `repository.ts` or a hook. This
isn't dangerous, but it means localStorage keys are scattered across the codebase.

**How to fix:** Create a `src/utils/storage.ts` that exports typed wrapper functions, or at
minimum document the canonical storage keys in `repository.ts` with a block comment listing
all `almoedat-*` keys. For small state like install-dismissed, a simple custom hook
(`useInstallDismissed`) wrapping `useLocalStorage` is fine.

---

### 🟡 Document the mock auth model

`src/context/AuthContext.tsx:4-10,42-48`

**Problem:** `MockUser.password` is stored and compared in plaintext (line 73:
`u.password === password`). This is intentional for a prototype, but there's no comment
explaining this, so a future contributor might copy the pattern into production code.

**How to fix:** Add a block comment above the `MockUser` interface:

```ts
// ⚠️  MOCK AUTH — plaintext passwords, localStorage-only.
// This is a placeholder for a real backend auth flow (JWT, bcrypt, etc.).
// Do NOT use this pattern in production.
```

Also consider adding `TODO: replace with real auth` as a comment.

---

## 2. Performance

### 🔴 Route-level code splitting

`src/App.tsx:12-23` — all 12 pages are eagerly imported

**Problem:** Every page (including the heavy Leaflet `NearMeLocator`, the image-rich
`EquipmentDetails`, and the form-heavy `PostListing`) is bundled into a single ~664 KB
chunk. Users on slow connections download the entire app before seeing anything.

**How to fix:**

```tsx
// src/App.tsx
import { lazy, Suspense } from 'react';

const Home = lazy(() => import('./pages/Home').then(m => ({ default: m.Home })));
const EquipmentResults = lazy(() => import('./pages/EquipmentResults').then(m => ({ default: m.EquipmentResults })));
// ... etc for all pages

// In AppLayout, wrap <Routes> in <Suspense fallback={<PageLoader />}>
```

Create a simple `PageLoader` component (Mantine `Loader` centered on the viewport). The
`NearMeLocator` (Leaflet) is the biggest win — it pulls in the entire Leaflet library
which is ~40 KB gzipped.

---

### 🟡 Lazy-load Leaflet independently

`src/pages/NearMeLocator.tsx` imports `react-leaflet` which pulls in Leaflet

**Problem:** Even with route splitting, `NearMeLocator`'s leaflet dependency is heavy.
Users who never visit `/locator` still download it if it's in the same chunk.

**How to fix:** The route-level `lazy()` above handles this automatically (Leaflet only
loads when the user navigates to `/locator`). Additionally, you can preconnect the tile
server:

```html
<!-- index.html -->
<link rel="preconnect" href="https://tile.openstreetmap.org" />
```

---

### 🟢 Memoize expensive equipment lookups

`src/data/repository.ts:41-44,47-49`

**Problem:** `getAllEquipment()` merges seed + user data, parses JSON from localStorage,
and sorts by date on every call. Components that render multiple equipment cards trigger
this repeatedly in a single render cycle.

**How to fix:** For the prototype this is negligible (20 items), but if the dataset grows,
wrap with a simple cache that invalidates on write:

```ts
let _cachedEquipment: Equipment[] | null = null;
export function getAllEquipment(): Equipment[] {
  if (_cachedEquipment) return _cachedEquipment;
  _cachedEquipment = [...EQUIPMENT_SEED, ...getUserListings()].sort(/* ... */);
  return _cachedEquipment;
}
// Clear cache in addUserListing
```

---

## 3. Reliability & error handling

### 🔴 Add a global React ErrorBoundary

**Problem:** A render error anywhere in the component tree crashes the entire app with a
white screen. There is no `ErrorBoundary`, `getDerivedStateFromError`, or
`componentDidCatch` anywhere in the codebase.

**How to fix:** Create `src/components/ErrorBoundary.tsx`:

```tsx
import React from 'react';
import { Box, Button, Center, Stack, Text, Title } from '@mantine/core';

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('Unhandled error:', error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <Center mih="50vh">
          <Stack align="center" gap="md">
            <Title order={3}>حدث خطأ غير متوقع</Title>
            <Text c="dimmed">حاول إعادة تحميل الصفحة</Text>
            <Button onClick={() => window.location.reload()}>إعادة التحميل</Button>
          </Stack>
        </Center>
      );
    }
    return this.props.children;
  }
}
```

Then wrap `<Routes>` in `AppLayout` with `<ErrorBoundary>`.

---

### 🟡 Harden `crypto.randomUUID()` with a fallback

`src/context/AuthContext.tsx:86` and `src/data/repository.ts:78`

**Problem:** `crypto.randomUUID()` requires a secure context (HTTPS or localhost). On plain
HTTP (e.g., LAN testing, corporate proxies), it throws `TypeError`.

**How to fix:** Add a fallback utility:

```ts
// src/utils/id.ts
export function generateId(): string {
  try {
    return crypto.randomUUID();
  } catch {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  }
}
```

Use `generateId()` everywhere instead of `crypto.randomUUID()`.

---

### 🟡 Standardize page loading/empty/error states

**Problem:** Pages that fetch data (all of them, via `repository.ts`) have no consistent
loading, error, or empty states. Currently the data is synchronous so this is invisible, but
when the backend is added, every page will need these patterns.

**How to fix:** Create shared components:

- `src/components/EmptyState.tsx` — icon + message + optional CTA (used for "no results",
  "no favorites", "no listings").
- `src/components/PageError.tsx` — retry button + error message.
- `src/components/PageSkeleton.tsx` — Mantine `Skeleton` composite for common layouts.

These don't need to be wired up now, but having them ready makes the backend migration
smoother.

---

## 4. Type safety & code quality

### What's already strong

- Zero `any` or `as any` across the entire `src/` — clean TypeScript.
- Discriminated unions for `login`/`signup` return types (`{ ok: true } | { ok: false; error }`).
- `AuthSession` correctly excludes `password` from `MockUser`.

---

### 🟡 Replace hardcoded colors with theme tokens

`src/components/Header.tsx:37` — `bg="#1B1B2F"`
`src/components/Header.tsx:83` — `#D4A017`
`src/components/Header.tsx:181,197` — `#1B1B2F`

**Problem:** The dark navy (`#1B1B2F`) and gold hover (`#D4A017`) are hardcoded in multiple
places. If the brand palette changes, these won't update. `#D4A017` is also the exact value
of `brand.5` in the theme, so it's redundant.

**How to fix:**

1. Add `darkNavy` to the Mantine theme as a custom color (or use `dark[8]` / `dark[9]`).
2. Replace `#1B1B2F` with the theme token.
3. Replace `#D4A017` with `var(--mantine-color-brand-5)` — this is already the brand primary.
4. For hover effects, consider Mantine's `variant="subtle"` with `color="brand"` instead of
   inline `onMouseEnter`/`onMouseLeave`.

---

### 🟢 Extract shared phone input pattern

`src/pages/Profile.tsx:114-119` and `src/components/auth/AuthModal.tsx` (phone field)

**Problem:** Phone inputs appear in multiple forms with the same pattern: `dir="ltr"`,
placeholder `05xxxxxxxx`, Saudi regex validation.

**How to fix:** Create `src/components/PhoneInput.tsx` — a thin wrapper around Mantine
`TextInput` that bakes in the LTR direction, placeholder, validation, and phone icon. Use it
in Profile, AuthModal, and PostListing.

---

## 5. Accessibility

### 🟡 Icon-only buttons need `aria-label`

**Affected locations (non-exhaustive):**
- Phone reveal button in `EquipmentDetails`
- Share button in `EquipmentDetails`
- Favorite heart buttons in `EquipmentCard`
- Close buttons on modals/drawers
- Map zoom controls

**How to fix:** Add `aria-label="وصف الزر"` to every icon-only `<ActionIcon>` or `<Button>`.
Example:

```tsx
<ActionIcon aria-label="إظهار رقم الهاتف" onClick={revealPhone}>
  <PhoneIcon size={18} />
</ActionIcon>
```

---

### 🟡 Equipment images lack `alt` text

`src/components/EquipmentCard.tsx`, `src/pages/EquipmentDetails.tsx`

**Problem:** Equipment `<img>` elements use the image path but no descriptive `alt` attribute.
Only `NearMeMap.tsx` has `alt` (for map tiles).

**How to fix:**

```tsx
<img src={equipment.image} alt={equipment.title} loading="lazy" />
```

If `equipment.title` is in Arabic, this is fine — screen readers handle Arabic. For
decorative images (where the title is already adjacent text), use `alt=""` to avoid
redundancy.

---

### 🟢 Audit color contrast and focus states

- The gold-on-navy color scheme (`brand.5` on `#1B1B2F`) has a contrast ratio of ~4.1:1,
  which passes WCAG AA for large text but fails for normal text. Consider `brand.3` or
  `brand.2` for body-sized text on dark backgrounds.
- Add visible `focus-visible` outlines for keyboard navigation — Mantine's default is
  minimal. Add a global style:
  ```css
  :focus-visible {
    outline: 2px solid var(--mantine-color-brand-5);
    outline-offset: 2px;
  }
  ```

---

## 6. Testing & tooling

### 🔴 Add a test framework (Vitest + React Testing Library)

**Problem:** Zero test files, no test framework in `devDependencies`, no test script in
`package.json`. The project has no automated safety net.

**How to fix:**

1. Install: `npm i -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom`
2. Add to `vite.config.ts`:
   ```ts
   test: {
     environment: 'jsdom',
     setupFiles: './src/test-setup.ts',
   }
   ```
3. Create `src/test-setup.ts` with `@testing-library/jest-dom` imports.
4. Add `"test": "vitest", "test:run": "vitest run"` to `package.json` scripts.

**Priority tests to write first:**
- `src/data/repository.test.ts` — `getAllEquipment`, `addUserListing`, `getEquipmentById`,
  the `writeJson` error handling.
- `src/utils/geo.test.ts` — haversine distance, coordinate jitter.
- `src/hooks/useFavorites.test.ts` — add/remove/list favorites.
- `src/pages/Profile.test.tsx` — the auth-gate and form-reset behavior (validates the bug fix
  in §0).

---

### 🟡 Resolve dual lockfiles

`bun.lock` and `package-lock.json` both exist at the repo root

**Problem:** Two package managers' lockfiles coexist. This causes confusion about which to
use and can lead to dependency drift.

**How to fix:** Pick one (e.g., `bun` since `bun.lock` is present) and delete the other. Add
the unwanted one to `.gitignore`. Document the choice in `README.md` (e.g., "This project
uses Bun. Run `bun install` to set up.").

---

### 🟡 Add E2E smoke tests

**Problem:** The ENHANCEMENT_REPORT.md describes a manual Playwright click-through. This
should be automated.

**How to fix:** Add `@playwright/test` as a devDependency and write a smoke suite covering:
- Home loads → click equipment card → detail page.
- Signup → session persists → header updates.
- Post listing → new listing appears in results.
- Favorites add/remove.

Run it in CI on every push.

---

### 🟢 Migrate ESLint to flat config and add Prettier

- `.eslintrc.cjs` uses the legacy format (ESLint 8). Migrate to `eslint.config.js` (flat
  config, ESLint 9).
- No Prettier config exists — add `.prettierrc` with project conventions (e.g., single quotes,
  trailing commas, 100-char print width, RTL-friendly).
- Add a `typecheck` script: `"typecheck": "tsc --noEmit"` and run it in CI.
- Consider adding `lint-staged` + `husky` for pre-commit lint/format.

---

## 7. SEO & UX polish

### 🟡 Per-page document titles and meta tags

**Problem:** The app is a SPA with a single `<title>` in `index.html`. Every page shares
"Almoedat | المعدات". This hurts SEO and makes browser tabs indistinguishable.

**How to fix:** Use `react-helmet-async` or a lightweight custom hook:

```tsx
// src/hooks/useDocumentTitle.ts
import { useEffect } from 'react';
export function useDocumentTitle(title: string) {
  useEffect(() => {
    const prev = document.title;
    document.title = `${title} | المعدات`;
    return () => { document.title = prev; };
  }, [title]);
}
```

Call it in every page: `useDocumentTitle('الرئيسية')`, `useDocumentTitle(equipment.title)`, etc.

---

### 🟡 Skeleton loaders instead of blank flashes

**Problem:** When navigating between pages, there's a brief flash of empty content before
the component mounts. With route-level code splitting (§2), this becomes a visible loading
gap.

**How to fix:** Create a `PageSkeleton` component with Mantine `Skeleton` composites that
match common page layouts (grid of cards, detail page, form). Use it as the `<Suspense>`
fallback in the lazy-loaded routes.

---

### 🟢 Breadcrumb and back navigation on detail pages

`src/pages/EquipmentDetails.tsx`, `src/pages/CompanyProfile.tsx`

**Problem:** On detail pages, there's no way to go back except the browser back button. For
a marketplace, breadcrumbs (e.g., الرئيسية > المعدات > معدة X) improve navigation and SEO.

**How to fix:** Add a simple breadcrumb using Mantine's `Anchor` + `Breadcrumbs` component
above the detail content. Link to `/` and `/equipment` (or `/companies`).

---

## 8. PWA follow-ups

### 🟢 Improve service worker caching strategy

`public/sw.js`

**Problem:** The current service worker has minimal caching. It registers and activates but
doesn't implement a robust caching strategy (cache-first for static assets, network-first
for API calls).

**How to fix:** Use Workbox (or a hand-rolled strategy) in the service worker:
- **Precache** the app shell (index.html, main CSS/JS chunks).
- **Cache-first** for static assets (images, fonts, Leaflet tiles).
- **Network-first** with fallback for any future API calls.
- Bump a version constant and show the `UpdatePrompt` when the cached version changes.

---

### 🟢 Add offline fallback page

**Problem:** If the user is offline and navigates to a route they haven't visited before,
they see a browser error page.

**How to fix:** Serve `index.html` from the service worker cache for all navigation
requests (SPA fallback). This is already partially implemented — verify and test with Chrome
DevTools "Offline" mode.

---

## 9. Prioritized implementation checklist

Track progress by checking off items as they're completed.

### 🔴 High priority (before merging / production)

- [ ] Fix Profile form stale-initialValues bug (§0)
- [ ] Add try/catch to `repository.writeJson` (§1)
- [ ] Add global `ErrorBoundary` (§3)
- [ ] Route-level code splitting with `React.lazy()` (§2)
- [ ] Add Vitest + React Testing Library, write first tests (§6)

### 🟡 Medium priority (next iteration)

- [ ] Remove duplicate Profile success feedback (§0)
- [ ] Extract shared `UserMenuActions` in Header (§0)
- [ ] Replace hardcoded colors with theme tokens (§4)
- [ ] Harden `crypto.randomUUID()` with fallback (§3)
- [ ] Add `aria-label` to icon buttons + `alt` to images (§5)
- [ ] Per-page document titles (§7)
- [ ] Resolve dual lockfiles (§6)
- [ ] Document mock auth model (§1)
- [ ] Centralize localStorage key registry (§1)

### 🟢 Low priority (polish / future)

- [ ] Guard `user.name.charAt(0)` with fallback (§0)
- [ ] Extract shared `PhoneInput` component (§4)
- [ ] Skeleton loaders (§7)
- [ ] Breadcrumbs on detail pages (§7)
- [ ] Improve SW caching strategy (§8)
- [ ] Audit color contrast + focus states (§5)
- [ ] E2E smoke tests with Playwright (§6)
- [ ] ESLint flat config + Prettier + pre-commit hooks (§6)
- [ ] Memoize equipment lookups (§2)
- [ ] Offline fallback page (§8)
