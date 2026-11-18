# Achint — Portfolio (Advanced Redesign)

Static portfolio: HTML + CSS + vanilla JS (GSAP, ScrollTrigger and Lenis load from CDN — internet needed).

## Files
- `index.html` — structure + content
- `style.css` — OS-style interface, laptop (pure CSS 3D), responsive styles
- `main.js` — intro timeline, physics, dock, scroll animations
- `achint.jpg` — your photo

## What's new
1. **Laptop-opening intro** — closed laptop → lid opens in 3D → screen boots with a real loading bar (waits for the page to actually load) → desktop appears → camera zooms into the screen → portfolio. `Skip intro` button bottom-right.
2. **Laptop-OS interface** — top menubar with live clock/wifi/battery, sections as app windows (traffic-light dots), macOS-style dock with magnification + active-section highlight.
3. **Photo fixed** — ID card shows face + shoulders properly (`object-position: 50% 6%`); profile avatar is face-centred.
4. **Swinging ID card** — hangs on a strap with pendulum physics; drag it and let go.
5. **Animations** — masked word-by-word headings, scroll reveals, scroll-speed marquee, line-drawing pipeline, count-up, 3D tilt cards, drag carousel with snap, typing email, magnetic buttons, custom cursor, smooth scroll (Lenis).

## Run
Keep all files in one folder, open `index.html` (VS Code Live Server recommended). GitHub Pages: upload to repo root → Settings → Pages.

## Tweaks
- Intro speed: timeline positions in `runIntro()` in `main.js`.
- Replace the photo: same filename `achint.jpg`; if the face sits higher/lower, change `object-position` in `.id-photo img`.
- Respects `prefers-reduced-motion` (intro and heavy motion are skipped).
- Project GitHub links still point to your profile — put exact repo URLs in `index.html`.
