# Sriju's Little Corner

This is the React/Vite project reconstructed from the Gemini-generated TSX file.

## Run it

1. Install Node.js 18+ (Node 20+ recommended).
2. Open a terminal in this folder.
3. Run `npm install`.
4. Run `npm run dev`.
5. Open the local URL Vite prints (usually http://localhost:5173).

## Important

The original file used Tailwind CSS utility classes, React, Framer Motion, and Lucide icons. The downloaded `.tsx` file alone was not a complete website project, so this folder supplies the missing Vite/Tailwind entry files and dependencies.

I also fixed one React issue in the original: the bubble-pop section was calling `useState()` inside a `.map()`. Each bubble is now its own `Bubble` component, which follows React's hook rules without changing the intended UI.

The site also loads Google Fonts and SoundHelix audio from the URLs already present in the original code, so an internet connection is needed for those external resources.
# srijus-little-corner
