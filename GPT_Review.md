Nice — I pulled your repo and skimmed the layout. I can do a focused review (security, XSS, upload handling, code style) — below are the most important findings and prioritized fixes so you can patch things fast.

Quick facts I looked at (repo root & files): ([GitHub][1]) ([GitHub][1]) ([GitHub][1]) ([GitHub][1]) ([GitHub][1])

* repo contains `server.js`, `package.json`, `README.md` and folders `controllers`, `routes`, `middlewares`, `public`, `models`. ([GitHub][1])
* I also noticed `main.sqlite3` checked into the repo — that’s sensitive/dev data you usually don’t commit. ([GitHub][1])

---

# High-priority security & correctness recommendations (apply these first)

## 1) **Remove `main.sqlite3` from the repo**

Why: database files often contain real data, secrets, or test users. Don’t commit DB files to source control.
How:

```bash
git rm --cached main.sqlite3
echo "main.sqlite3" >> .gitignore
git commit -m "Remove DB file from repo; add to .gitignore"
```

(Keep a local backup before removing.)

## 2) **Harden HTTP headers — use `helmet` + CSP**

Add helmet and a content-security-policy so even if something slips through sanitizers, the browser will block inline scripts / remote resources.

```js
const helmet = require('helmet');
app.use(helmet());
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'"], // avoid 'unsafe-inline'
    imgSrc: ["'self'", 'data:', 'https:'],
    // adjust as needed
  }
}));
```

## 3) **Sanitization: continue using DOMPurify but be explicit**

Your DOMPurify setup is a great start. Use a strict config on output, forbid attributes you don't need, and **sanitize after converting markdown** (not before). Example hardened config:

```js
const clean = DOMPurify.sanitize(html, {
  USE_PROFILES: { html: true },
  FORBID_ATTR: ['style', 'onerror', 'onclick', 'class'],
  FORBID_TAGS: ['iframe', 'object', 'embed', 'script'],
  ALLOW_DATA_ATTR: false
});
```

Then modify DOM (add your known classes/wrappers) **after** sanitization using JSDOM — that keeps attacker-controlled attributes out while allowing you to add safe classes.

## 4) **File upload safety (Multer)**

If you accept uploads, validate file type, size, and sanitize the filename; store with a generated name (UUID) to avoid path traversal / collisions.

Example multer settings:

```js
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const uploadDir = path.join(__dirname, 'public', 'uploads');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, uuidv4() + path.extname(file.originalname))
});

function fileFilter (req, file, cb) {
  const allowed = ['image/jpeg','image/png','image/webp','image/gif'];
  cb(null, allowed.includes(file.mimetype));
}

const upload = multer({ storage, fileFilter, limits: { fileSize: 5*1024*1024 }});
```

Also: never use user-provided filenames directly for `src` without sanitization.

## 5) **Sessions & cookies**

Make sure session cookies are secure (in production):

```js
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  }
}));
```

## 6) **CSRF protection**

If you have state-changing POST forms, add CSRF tokens (e.g. `csurf`) so attackers can’t trick logged-in users into posting.

---

# Medium-priority (UX / maintainability / safety)

## 7) **Store raw Markdown in DB, render on read**

You’ve talked about this already — definitely store the raw markdown (makes editing simple) and render → sanitize → post-process on GET.

## 8) **Post-sanitization DOM edits**

Good pattern: run `marked()` → `DOMPurify.sanitize()` → `JSDOM` to add classes/wrappers. Add classes programmatically (so you don’t allow user-supplied `class` or `style`).

Example snippet:

```js
const rawHtml = marked.parse(markdown);
const safe = DOMPurify.sanitize(rawHtml, { USE_PROFILES: { html: true }, FORBID_ATTR: ['style','class'] });

const dom = new JSDOM(safe);
const doc = dom.window.document;
doc.querySelectorAll('img').forEach(img => {
  const wrapper = doc.createElement('p');
  wrapper.className = 'article-image-wrapper';
  img.className = 'article-image';
  img.replaceWith(wrapper);
  wrapper.appendChild(img);
});
const out = doc.body.innerHTML; // render this in view
```

## 9) **Explicitly check URLs used in images**

Avoid `src="javascript:..."`—DOMPurify blocks many but validate `src` (only `http(s):`, `data:image/` optionally). If you allow local uploads, ensure `src` starts with `/uploads/...` or `https://`.

## 10) **Logging & error handling**

Ensure you don’t log sensitive data. Don’t print raw HTML to logs in production.

---

# Low-priority / optional improvements

* Add `express-rate-limit` for login routes (mitigate brute force).
* Add automated tests for sanitization: run a few XSS payloads to ensure none passes.
* Use environment variables for secrets and don’t commit `.env`. I noticed `.env` exists in the file list — make sure it doesn’t include secrets or is removed from repo. ([GitHub][1])

---

# Quick checklist you can copy/paste

* [ ] `git rm --cached main.sqlite3`, add to `.gitignore`. ([GitHub][1])
* [ ] Add `helmet` + CSP.
* [ ] Use DOMPurify with `FORBID_ATTR` and sanitize after markdown parse.
* [ ] Use multer with `fileFilter`, size limits, UUID filenames.
* [ ] Enable CSRF protection for POST routes.
* [ ] Ensure `SESSION_SECRET` in env and `cookie.secure` when `NODE_ENV=production`.
* [ ] Add tests that feed known XSS payloads and confirm output is safe.

---

If you want, I can now:

* Do a detailed line-by-line review of `server.js`, `controllers/*`, or the upload handler (pick one file or folder).
* Create a PR patch with the exact changes (helmet, multer, DOMPurify config, `.gitignore`) and example code.

Which file should I inspect first? (I can start with `server.js` and the upload route since those are highest-impact.)

[1]: https://github.com/FarlanFadillah/Personal_Blog_Project.git "GitHub - FarlanFadillah/Personal_Blog_Project"
