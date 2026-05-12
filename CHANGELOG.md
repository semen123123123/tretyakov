# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added
- Server data-fetching layer: ConstructorServer.tsx fetches stones server-side, eliminates client-side supabase-js import
- Non-blocking font loading: `<link rel="preload" as="style">` replaces render-blocking `<link rel="stylesheet">`

### Changed
- Hero.tsx: GSAP loaded dynamically via `await import('gsap')` instead of top-level import (removes GSAP from critical bundle)
- Constructor.tsx: GSAP loaded dynamically, supabase data-fetching replaced with server props, `loading` state removed
- StonesClient.tsx: removed unused top-level GSAP/ScrollTrigger imports
- layout.tsx: removed `dns-prefetch` to supabase.co (no longer needed on main page)

### Fixed
- **35-second page load**: root cause was render-blocking `<link rel="stylesheet">` for IdealistSans font from `db.onlinewebfonts.com`. CDN connection resets in Russia, browser waited ~30s timeout. Fixed with preload + onload-switch pattern (non-blocking).
- Hero.tsx: was using `gsap` without import (broken ReferenceError at runtime), fixed with dynamic import
