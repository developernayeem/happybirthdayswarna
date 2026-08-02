# 💙 Happy Birthday Website — for Swarna

A mobile-first, interactive birthday surprise website: passkey lock screen → loading → welcome → age counter → memories gallery → letter reveal → cake-cutting celebration with confetti and music.

Right now the site **already works with no images/audio added** — every picture spot falls back to a cute emoji (🔒 🐼 💃 💙) so nothing looks broken. Add your own files (see below) any time to make it fully personal, and it'll just work automatically.

---

## 📁 Folder structure

```
birthday-website/
├── index.html
├── css/style.css
├── js/script.js
└── assets/
    ├── images/   ← put your photos & gifs here (exact filenames below)
    └── audio/    ← put your songs & sound effects here (exact filenames below)
```

## 🖼️ Images / GIFs to add (`assets/images/`)

| Filename | Used for | Notes |
|---|---|---|
| `lock-icon.png` | Lock screen icon + pin popup image | Square image, will be cropped to a circle |
| `panda-loading.gif` | Loading screen | Any cute gif |
| `panda-sleeping.gif` | Welcome screen | Any cute gif |
| `dancing.gif` | Age-counter screen | Any dancing/cute gif |
| `memory1.jpg` – `memory5.jpg` | Memories swipe gallery | Portrait photos work best (4:5 ratio) |
| `profile.jpg` | Small circle photo on the cake screen | Optional |
| `favicon.svg` | Browser tab icon | Already included — replace it if you want a custom one |

**Just drop files with these exact names into `assets/images/` — no code changes needed.** If a file is missing, the site quietly shows an emoji instead of breaking.

## 🎵 Audio to add (`assets/audio/`)

| Filename | Used for |
|---|---|
| `click.mp3` | Keypad button click sound |
| `pop.mp3` | Party-popper sound when cake is cut |
| `song1.mp3` | Background music after unlocking (loops) |
| `song2.mp3` | Birthday song after cutting the cake (loops, replaces song1) |

Keep MP3s short/looping and under a few MB so the site loads fast on mobile data. You can find royalty-free birthday music/sound effects on sites like Pixabay Audio or Free Music Archive — just download as MP3 and rename to match the table above.

## ⚙️ Things you can customize in `js/script.js`

At the very top:
```js
const PASSKEY = "2002";                          // the unlock code
const BESTIE_BIRTHDAY = new Date(2002, 10, 14);   // month is 0-indexed, so 10 = November
```

To change the letter message, edit the text inside `#letterModal` in `index.html`.
To change the name on the cake, edit `.cake-name` text in `index.html` (currently "Swarna").

---

## 💻 Step 1 — Test it on your own computer first

1. Put the whole `birthday-website` folder anywhere on your PC.
2. Just double-clicking `index.html` mostly works, but for audio/gifs to load reliably, it's best to run a tiny local server:
   - If you have **VS Code**: install the "Live Server" extension → right-click `index.html` → "Open with Live Server".
   - Or if you have Python installed: open a terminal in the folder and run:
     ```
     python -m http.server 8000
     ```
     then open `http://localhost:8000` in your phone's browser (same wifi) or your PC browser.
3. Check everything works: lock screen → pin `2002` → loading → welcome → age → memories → letter → cake.

---

## 🚀 Step 2 — Upload to GitHub

1. Go to [github.com](https://github.com) → create a **free account** if you don't have one.
2. Click **New repository**. Name it something like `swarna-birthday`. Keep it **Public**. Don't add a README (you already have one).
3. On the new repo page, click **"uploading an existing file"** (or use GitHub Desktop / git commands below).
4. Drag your whole `birthday-website` folder contents (index.html, css/, js/, assets/) into the upload box. Commit the changes.

**Or with git command line:**
```bash
cd birthday-website
git init
git add .
git commit -m "First version of birthday website"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/swarna-birthday.git
git push -u origin main
```

## 🌐 Step 3 — Turn on GitHub Pages

1. In your repo, go to **Settings → Pages** (left sidebar).
2. Under "Build and deployment" → Source, choose **Deploy from a branch**.
3. Branch: `main`, folder: `/ (root)` → **Save**.
4. Wait ~1 minute, refresh — you'll get a live link like:
   `https://YOUR-USERNAME.github.io/swarna-birthday/`
5. Open it on your phone — that's your live site! 🎉

---

## ☁️ Step 4 (optional) — Connect a custom domain with Cloudflare

Only needed if you want something like `swarnasbday.com` instead of the github.io link.

1. Buy a domain (Namecheap, GoDaddy, etc. — or use Cloudflare Registrar).
2. Add the domain to Cloudflare → Cloudflare gives you 2 nameservers → set those nameservers at your domain registrar.
3. In Cloudflare **DNS** settings, add a **CNAME** record:
   - Name: `www` (or `@` for root, Cloudflare supports CNAME flattening on root)
   - Target: `YOUR-USERNAME.github.io`
   - Proxy status: Proxied (orange cloud) — this gives free SSL too.
4. Back in GitHub repo → **Settings → Pages → Custom domain** → enter your domain → Save.
5. Wait a few minutes for DNS to propagate. Your site now loads on your custom domain with HTTPS. 🔒

---

## ✅ Quick checklist before sending the link to Swarna

- [ ] Replace placeholder images/gifs in `assets/images/`
- [ ] Add real audio files in `assets/audio/`
- [ ] Double-check the letter message reads the way you want
- [ ] Test the whole flow on an actual phone (not just desktop)
- [ ] Test with sound ON — some phones need a tap before audio plays, which this site already handles (music starts right when the passkey unlocks, which counts as a tap)

Happy Birthday, Swarna! 🎂💙
