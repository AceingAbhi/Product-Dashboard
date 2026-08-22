# Product Management Dashboard

A responsive product management dashboard built for the Frontend Developer technical assignment. Users can browse, search, filter, sort, paginate, view details, and add products against the [DummyJSON Products API](https://dummyjson.com/products).

## Tech Stack

- **React + Vite + TypeScript** — chosen over Next.js since the assignment doesn't require SSR/SSG, and Vite's dev server is faster to iterate in within a one-day time box.
- **React Router v6** — client-side routing for `/` and `/products/:id`.
- **Redux Toolkit + RTK Query** — a single library for both global app state and API data fetching/caching, which kept the codebase small. RTK Query's built-in hooks handle loading/error states and caching without hand-rolled `useEffect` data fetching.
- **Ant Design (antd)** — used in place of Tailwind + Shadcn/UI as a "comparable reusable component system" (explicitly permitted by the brief). Ant Design's Table, Form, Select, Pagination and validation come largely pre-built, which suited the tight time budget while still requiring real integration work (typed props, custom render functions, responsive config).

## Getting Started

```bash
npm install
npm run dev       # starts local dev server (default: http://localhost:5173)
npm run build     # type-checks and builds for production into dist/
npm run preview   # serves the production build locally
```

No environment variables are required — the app talks directly to the public `https://dummyjson.com` API.

## Project Structure

```
src/
  components/   # Reusable presentational components (table, filters, tags, states, form)
  pages/        # Route-level pages (list, details)
  layouts/      # App shell (header/footer)
  services/     # RTK Query API slice (productsApi.ts)
  store/        # Redux store + productsSlice (filters/search/sort/pagination/local state)
  hooks/        # Typed Redux hooks + useDebouncedValue
  types/        # Shared TypeScript interfaces for Product/API shapes
  utils/        # Formatting helpers (price, stock status, category labels)
```

Structure follows the brief's suggested layout, with UI, business logic, API access, and types kept in separate folders.

## State Management Approach

**Redux Toolkit** was used for state that's genuinely global:
- Search term, category filter, sort option, and pagination — kept global so they persist if a user opens a product's detail page and navigates back.
- Locally-added products (from the Add Product form) — since DummyJSON's `POST /products/add` doesn't persist server-side, newly added products are kept in the Redux store and merged into the listing.
- Favourite product IDs — a small bonus feature; global because it's toggled from both the list and the detail page.

**Local component state** (`useState`) was used for things scoped to a single component: the Add Product modal's open/closed state and Ant Design's own internal form state (`Form.useForm`).

**RTK Query** manages all server data (products, categories, individual product lookups, add-product mutation) — this keeps API caching, loading flags, and error flags out of the Redux slice entirely.

## API Integration Notes

- `GET /products` — default paginated listing (`limit`/`skip`).
- `GET /products/search?q=` — used automatically once the (debounced) search box has a value.
- `GET /products/category/:category` — used when a category filter is active and there's no search term.
- `GET /products/:id` — product details page. If the id belongs to a locally-added product, the API call is skipped entirely and the local copy is used.
- `POST /products/add` — Add Product form. DummyJSON simulates the create and returns a new product object (with generated `id`) but does not persist it, per the assignment's note that permanent storage isn't required.

**Known limitation:** Sorting (by price/rating) is applied client-side to the *current page* of results, not across the entire filtered dataset. DummyJSON does support `sortBy`/`order` query params on `/products`, but not consistently across the `/search` and `/category` endpoints, so a single client-side approach was used for consistency across all three data sources. A banner is shown in the UI when this limitation is relevant (sorting + not on page 1).

## Performance Optimisations

Implemented (more than the required minimum of two):
1. **Debounced search** — `useDebouncedValue` hook delays firing a search request until 400ms after the user stops typing.
2. **Route-level code splitting** — the Product Details page is lazy-loaded via `React.lazy` + `Suspense`, so it's excluded from the initial bundle.
3. **Memoisation** — `ProductFilters` and `ProductTable` are wrapped in `React.memo`, and derived data (merged/sorted product lists) uses `useMemo`, avoiding unnecessary recompute/re-render on unrelated state changes.
4. **Optimised image loading** — thumbnails use `loading="lazy"` and are rendered at fixed, small dimensions in the table.

## Accessibility

- Semantic layout via Ant Design's `Layout` components (`header`, `main` content region, `footer`).
- All interactive filter controls have `aria-label`s (search input, category select, sort select, reset button).
- Icon-only action buttons (view details, favourite toggle) include `aria-label` and a `Tooltip` for sighted users.
- Form fields use proper `<label>` associations via Ant Design's `Form.Item`.
- Focus states rely on Ant Design's built-in visible focus rings (not overridden).

## Responsive Behaviour

- Layout tested down to ~360px width; the filter bar stacks into full-width rows on mobile via Ant Design's `Row`/`Col` grid.
- The product table uses horizontal scroll (`scroll={{ x: 700 }}`) on narrow viewports rather than being squeezed illegibly.
- Global CSS disables horizontal page overflow.

## Assumptions

- "Test credentials" are not applicable — no authentication is implemented, as the brief doesn't require a login flow.
- Favourites and locally-added products are kept in memory only (Redux store), not persisted to `localStorage`, since the brief doesn't require persistence across reloads.
- Category options are sourced from `GET /products/categories` rather than hardcoded, so the filter stays in sync with the API.

## Known Limitations / Incomplete Features

- Sorting is page-local rather than across the full filtered dataset (see API Integration Notes above).
- No automated tests were added (listed as an optional bonus item, deprioritised in favour of completing all core requirements).
- No `localStorage` persistence for favourites/added products — they reset on a full page reload.

## Approximate Time Spent

~3.25 hours — approximately 2h 45m for feature implementation (listing, 
filters, details page, add-product form, card/table view toggle) and 
30m for testing, commit, and deployment.
