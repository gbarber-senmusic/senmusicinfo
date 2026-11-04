# Seneca Music website: notes for Claude Code

Static site for the Seneca High School Music Department (Tabernacle, NJ), hosted on GitHub Pages.
The owner is a band director, not a developer: keep everything plain HTML/CSS/JS, no build step,
no frameworks, no package installs.

## Structure
- `updates.js`: the ONLY file the owner edits weekly (`window.SITE`: reminder, events, season toggle,
  competitions, summer dates, member count). Keep its shape stable and its comments friendly.
- `styles.css`: shared styles. Tokens on `:root` (green #14532d, gold #f2c230, page #fffcf5, mint #eef6ef;
  Fredoka headings, Nunito body). Friendly look: pill buttons, rounded cards, sentence-case headings.
- `index.html`, `marching-band.html`: built. Header and footer are duplicated in each page; keep them identical.
- Pages not built yet link to the old Google Site (https://sites.google.com/lrhsd.org/seneca-music/...).

## Next tasks
1. Build remaining pages (wind-bands, jazz, guitar, choir, orchestra, music-classes, tri-m, contact,
   calendar with an embedded public Google Calendar) using the same header/footer and styles,
   then repoint the links. Use [bracketed placeholders] for unknown content, never invented facts.
2. Keep pages working at phone width, 4.5:1 contrast, visible focus, 44px+ touch targets.
3. Render data from updates.js with textContent, never innerHTML.
4. Update UPDATING.md whenever the owner's workflow changes.
