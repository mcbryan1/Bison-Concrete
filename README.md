# Bison Concrete Ltd — Website

A fast, self-contained marketing website for Bison Concrete Ltd (ready-mix concrete production & delivery, Tema Community 18, Greater Accra). Built with plain HTML, CSS and JavaScript — no build step, no frameworks. It runs on any static host.

## Pages
| File | Purpose |
|------|---------|
| `index.html` | Home |
| `about.html` | About, vision/mission, objectives, operating discipline |
| `services.html` | Products & services, concrete grades, pumping, value proposition |
| `sectors.html` | Sectors served + typical applications |
| `quality.html` | Quality control, GS 1317 alignment, health/safety/environment |
| `quote.html` | Request-a-quote form |
| `contact.html` | Contact details, message form, map, FAQ |

## Assets
- `assets/css/styles.css` — all styling (brand system: crimson red + charcoal + white)
- `assets/js/main.js` — nav, scroll reveals, accordion, form handling
- `assets/img/` — logo (SVG), favicon, and the mixer-truck render

---

## ⚠️ Before going live — 3 things to update

### 1. Contact details (placeholders right now)
These are dummy values. Find & replace across **all `.html` files**:

| Placeholder | Replace with |
|-------------|--------------|
| `+233301234567` (in `tel:` links) | real phone, digits only with country code |
| `+233 30 123 4567` (displayed) | real phone, formatted |
| `233241234567` (in `wa.me/` links) | real WhatsApp number, digits only, no `+` |
| `+233 24 123 4567` (displayed WhatsApp) | real WhatsApp, formatted |
| `info@bisonconcrete.com` | real email |

Quickest way (macOS Terminal, from this folder):
```
grep -rl "233301234567" . --include=*.html
```
then edit each, or use a find-and-replace in your editor.

### 2. Make the forms actually send email
The quote form (`quote.html`) and contact form (`contact.html`) currently show a success
message **without sending anything** (safe demo mode).

To receive real enquiries by email, use a free form backend like **Formspree**:
1. Go to https://formspree.io, sign up, create a form, and copy its endpoint
   (looks like `https://formspree.io/f/abcdwxyz`).
2. In `quote.html` and `contact.html`, find:
   ```
   action="https://formspree.io/f/REPLACE_WITH_FORM_ID"
   ```
   and paste your real endpoint in place of `REPLACE_WITH_FORM_ID`.

That's it — submissions will be emailed to you. (The JavaScript auto-detects a real
endpoint and switches from demo mode to live sending.)

### 3. Social links
The footer LinkedIn link points to `#`. Update it (in `index.html` and the footer of
each page) if/when social profiles exist.

---

## Optional polish
- **Real photos:** the sector tiles on the home page use brand-coloured panels with
  icons. To use real project photography instead, edit each tile's inline
  `style="background:..."` in `index.html` to a `background-image`.
- **Concrete grades:** the grades table in `services.html` shows indicative strength
  classes and applications. Adjust to match what the plant will actually supply.
- **Map:** `contact.html` embeds a Google Map pointing at "Tema Community 18". Replace
  the `src` with a precise pin once the exact plant address is set.

## Hosting
Upload the whole folder to any static host: **Netlify** (drag-and-drop the folder),
**Vercel**, **Cloudflare Pages**, **GitHub Pages**, or ordinary **cPanel** hosting.
No server or database needed.

## Notes
- Brand fonts load from Google Fonts (Archivo). Requires an internet connection to
  display the exact typeface; otherwise it falls back to a system sans-serif.
- Fully responsive (desktop / tablet / mobile) and accessible (keyboard nav, reduced-motion support).
