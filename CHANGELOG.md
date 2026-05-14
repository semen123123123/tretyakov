# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Changed
- **StonesClient.tsx**: камни в коллекции теперь отображаются круглыми миниатюрами (centered, ~96px) вместо full-width aspect-square — карточки стали компактнее
- **Constructor.tsx**: для Гематита используется clip-path (прямоугольник со скошенными углами) вместо круга — в сетке выбора и на превью браслета
- **stones-data.ts**: пути к фото камней переведены на латиницу (`/stones/hematite.png`) — устранена ByteString ошибка в Node.js fetch
- **layout.tsx**: metadata переведена на английский
- **Удалены**: неиспользуемые `Stones.tsx`, `Catalog.tsx`, `Reviews.tsx` (импортировали Supabase)

### Added
- Server data-fetching layer: ConstructorServer.tsx fetches stones server-side, eliminates client-side supabase-js import
- Non-blocking font loading: `<link rel="preload" as="style">` replaces render-blocking `<link rel="stylesheet">`
- **Catalog with 18 bracelets**: full product data (descriptions, prices, stone compositions, historical facts, advantages) in `src/lib/products-data.ts`
- Product detail modal with full description, stone details, historical reference, advantages list, packaging selector (black/white box)
- GSAP scroll animation for catalog cards (staggered fade-in on scroll)
- Product type extended with display-only fields: `historical_fact`, `advantages`, `stone_details`, `size_info`
- `data.ts`: fallback to local product data when Supabase returns empty (enables offline catalog)

### Changed
- Hero.tsx: GSAP loaded dynamically via `await import('gsap')` instead of top-level import (removes GSAP from critical bundle)
- Constructor.tsx: GSAP loaded dynamically, supabase data-fetching replaced with server props, `loading` state removed
- StonesClient.tsx: removed unused top-level GSAP/ScrollTrigger imports
- layout.tsx: removed `dns-prefetch` to supabase.co (no longer needed on main page)

### Added
- **Constructor redesign**: full interactive bracelet builder with 18 stones, bracelet visualization (SVG cord + stone beads), up to 12 stones selection, modal with screenshot instructions + Telegram link + per-stone descriptions
- **Stone image system**: inline SVG data URIs with gemstone-colored radial gradients replace broken Pexels URLs — always loads instantly, no external dependencies
- `ConstructorServer.tsx`: server component that fetches stones and passes to Constructor

### Changed
- Constructor.tsx: complete rewrite — stone grid, bracelet preview, "Сформировать браслет" modal, no prices, no cart dependency
- StonesClient.tsx: image source now uses `stone.image_url` from data instead of hardcoded 6-image map (all 18 stones visible)
- `globals.css`: `.card-image` height constraint removed for `aspect-square` compatibility
- `stones-data.ts`: Pexels URLs replaced with `stoneSvgDataUrl()` — colored SVG bead generator for each stone

### Fixed
- **35-second page load**: root cause was render-blocking `<link rel="stylesheet">` for IdealistSans font from `db.onlinewebfonts.com`. CDN connection resets in Russia, browser waited ~30s timeout. Fixed with preload + onload-switch pattern (non-blocking).
- Hero.tsx: was using `gsap` without import (broken ReferenceError at runtime), fixed with dynamic import
- `reviews-data.ts`: added missing `author_avatar: null` to fix TypeScript type error
- `StonesClient.tsx`: showed only 6 stones (hardcoded image map), now shows all 18 from data
