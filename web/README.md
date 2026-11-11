# Quranify Web

A standalone browser build of Quranify. The original Expo application remains at the repository root and is not modified by this web implementation.

## Run locally

From the repository root:

```bash
cd web
npm install
npm run dev
```

Vite starts on port 5173.

## Production build

```bash
cd web
npm install
npm run build
npm run preview
```

The production output is generated in `web/dist`.

## Design and behavior

- Arabic RTL layout with responsive desktop and mobile navigation.
- Dark near-black background with subtle blue ambient gradients and reduced-motion support.
- Liquid Glass surfaces powered by `liquid-glass-react`; use a conventional translucent/blurred fallback in browsers that do not support displacement maps (notably Safari and Firefox).
- Surah metadata is imported from the existing Expo application's Quran service.
- Recitation uses the existing MP3Quran audio server URLs through the browser's native audio element.
- Favorites are stored in browser localStorage.

## Important separation

This folder is the Web target. It is intentionally isolated from the Expo Android/iOS runtime because `liquid-glass-react` is a React DOM library, not a React Native component. The mobile app continues to use its original Expo dependencies and screens.

Google AI Studio should be pointed at this Web app's `web` directory (Vite entry: `web/index.html`) when configuring a browser-based project.
