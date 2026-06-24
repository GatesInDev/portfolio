# CLAUDE.md — Agent Driven Design

## Project Identity

**Name:** static-portfolio  
**Owner:** Vitor Altmann (`@GatesInDev`)  
**Contact:** contato@vitoraltmann.dev  
**Purpose:** Personal developer portfolio — showcases projects, skills, and contact info.  
**Stack:** Pure vanilla JS/HTML5/CSS3. Zero dependencies. Zero build step.

---

## Architecture at a Glance

```
index.html          ← Single entry point; holds all <template> tags
css/styles.css      ← All styles (1100+ lines); CSS variables–driven theming
js/
  app.js            ← SPA router + view renderers + lightbox controller
  data.js           ← Projects database (source of truth for all content)
  particles.js      ← Canvas particle background (self-contained class)
img/
  POS/              ← Project gallery images (.webp)
```

**One rule:** there is no build tool, no bundler, no package.json, no npm. Do not introduce them unless explicitly asked.

---

## Routing

Client-side hash routing. All navigation is handled in `js/app.js`.

| Hash | View rendered |
|---|---|
| `#home` (or empty) | Hero/landing section |
| `#projects` | Filterable project grid |
| `#projects/<id>` | Single project detail view |
| `#contact` | Contact cards |

`window.addEventListener('hashchange', ...)` drives all transitions. When adding a new view, follow the existing `renderX()` → `setActiveNav()` → `fadeIn()` pattern.

---

## Data Layer (`js/data.js`)

This is the **single source of truth** for all project content. Shape of each project object:

```js
{
  id: 'kebab-case-string',        // used in URL hash: #projects/<id>
  title: 'string',
  description: 'short string',    // shown on card
  fullDescription: 'long string', // shown on detail view
  tags: ['string'],               // tech tags
  category: 'dotnet|infra|web|java|linux',  // drives filter buttons
  image: 'img/path.webp',         // card cover image
  gallery: ['img/path.webp'],     // detail view gallery (can be empty [])
  features: ['string'],           // bullet list on detail view
  repoUrl: 'https://github.com/...',
  demoUrl: 'https://... | null'
}
```

**To add a project:** append to the exported array in `data.js`. The grid, filters, and routing all derive from this data automatically — no other file needs editing unless you add a new `category` value.

**To add a category:** add the value to the project object AND add a matching filter button in `index.html` inside `#filter-buttons`.

---

## Theming & Design System

All colors and tokens live as CSS variables in `css/styles.css` at the `:root` block:

```css
--sage-green: #747A47;
--amber-gold: #A36A00;
--bg-dark: #0d0d0d;
--surface: #1a1a1a;
--text-primary: #e8e8e0;
--text-secondary: #9a9a8a;
```

**Aesthetic:** Zelda-inspired — sage green + amber gold on near-black. Glassmorphism on nav and overlays. Triforce SVG decoration. Rune pulse animations.

**Fonts:**
- Headings: `Cinzel` (Google Fonts — serif, ceremonial)
- Body: `Outfit` (Google Fonts — modern, readable)

Do not add new color values directly to selectors. Always use or extend the CSS variable set.

---

## Key Patterns to Follow

### Adding a new section/page
1. Create a `<template id="tmpl-yourview">` block in `index.html`
2. Write `function renderYourView()` in `app.js` that clones the template and inserts into `#app`
3. Add a hash case in the router switch statement
4. Add a nav link in `index.html` `<nav>` if needed

### Animations
- Entry animations use the `fadeUp` keyframe + inline `animation-delay` style
- Apply `.fade-in` class after inserting content into DOM (triggers CSS transition)
- Stagger delays: `0.1s`, `0.2s`, `0.3s`, etc.

### Images
- Format: `.webp` preferred for performance
- Store project images under `img/<project-id>/`
- Lightbox is triggered by `[data-gallery]` attribute on `<img>` elements

### Lightbox
Fully implemented in `app.js`. It reads all `[data-gallery]` images in the current view. No changes needed to use it — just add the `data-gallery` attribute to gallery images.

---

## What NOT to Do

- Do not add npm/node_modules/package.json. This is intentionally dependency-free.
- Do not use `document.write()` or `innerHTML` with unsanitized user input.
- Do not add framework imports (React, Vue, etc.) unless the project is being explicitly migrated.
- Do not change the color palette without updating all CSS variable usages.
- Do not hardcode project data outside `js/data.js`.
- Do not use `var` — use `const`/`let` (ES6+).

---

## Deployment

Static files only. Works on:
- **Vercel** — zero config, just connect repo
- **GitHub Pages** — serve from root or `/docs`
- **Any CDN / S3 bucket** — no server-side logic

There is no build step. What you see in the repo is what gets served.

---

## Live Demos Referenced in Data

| Project | URL |
|---|---|
| web-dictionary | https://dictionary.vitoraltmann.dev |
| hyrule-compendium | https://hyrule.vitoraltmann.dev |

---

## Accessibility Commitments

- Semantic HTML with `role` attributes where needed
- ARIA labels on all interactive elements (nav links, buttons, lightbox controls)
- Keyboard navigation: lightbox supports `←` `→` `Esc`
- Responsive down to 360px viewport width
- High-contrast color choices

When adding new interactive elements, maintain these commitments.

---

## Responsive Breakpoints

| Breakpoint | Target |
|---|---|
| ≤ 768px | Tablet — reduce sizing, 2-col gallery |
| ≤ 480px | Mobile — single column, scrolling filters |
| ≤ 360px | Very small — hide decorative icons, reduce padding |

---

## Git Conventions

Branch: `master`  
Commit style from history: `feat: <description>` (conventional commits, lowercase, imperative).

---

## Common Agent Tasks

**Add a new project:**  
→ Edit `js/data.js`, append object following the schema above. Done.

**Change hero text or bio:**  
→ Edit the `#tmpl-home` template in `index.html`.

**Add a contact link:**  
→ Edit the `#tmpl-contact` template in `index.html`.

**Change color scheme:**  
→ Edit CSS variables at `:root` in `css/styles.css`.

**Add a new filter category:**  
→ Add category string to relevant projects in `data.js` + add `<button data-filter="newcat">` in `index.html`.

**Debug routing:**  
→ All routing logic is in the `hashchange` handler inside `js/app.js`. Check the switch/case block there.

**Debug particles:**  
→ `js/particles.js` is fully self-contained. It instantiates `ParticleNetwork` on the `#particle-canvas` element. Check canvas sizing and `devicePixelRatio` handling if display issues arise on HiDPI screens.
