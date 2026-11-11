# Quranify Web

A standalone browser target built with Vite + React. Its React 19 runtime and Liquid Glass package are isolated in `web/package.json`; the original Expo Android/iOS application keeps its root React 18 runtime and native commands.

## Run the Web app

From the repository root:

```bash
npm install
npm run dev
```

Vite serves the Web app on port 5173. The `predev` script installs the isolated Web runtime automatically. The root `index.html` loads `web/src/main.tsx`, making the repository root directly recognizable as a Vite app by browser-based build environments such as Google AI Studio. You can also run `npm run setup:web` explicitly.

## Production build

```bash
npm run build
npm run preview
```

The production output is generated in `dist/`.

## Native Android/iOS

The original Expo workflows remain available:

```bash
npm start
npm run android
npm run ios
```

For Expo's own web preview, use `npm run web:expo`.

## Design and behavior

- Arabic RTL layout with responsive desktop and mobile navigation.
- Dark near-black background with subtle blue ambient gradients and reduced-motion support.
- Selective Liquid Glass surfaces powered by `liquid-glass-react`; use a conventional translucent/blurred fallback in browsers that do not support displacement maps (notably Safari and Firefox).
- Surah metadata is imported from the existing Quran service.
- Recitation uses the existing MP3Quran audio server URLs through the browser's native audio element.
- Favorites are stored in browser localStorage.

## Platform boundary

`liquid-glass-react` requires React 19 in the published npm package. To avoid changing the Expo app's React 18 dependency, the Web runtime installs its own React 19 / React DOM 19 pair under `web/node_modules`. The Expo Android/iOS screens and audio engine remain separate and unchanged.
