# Full Stack Blog Application

Node.js/Express backend with **local file-based storage** (lowdb — no external database, no connection string, no signup) + React (Vite) + Tailwind CSS frontend.

## Structure

```
fullstack-blog/
├── backend/
│   ├── routes/postRoutes.js
│   ├── db.js              # sets up the local db.json file
│   ├── db.json             # created automatically on first run — your data lives here
│   ├── .env.example
│   ├── server.js
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/ (Navbar, PostCard, PostForm)
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── .env.example
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    └── package.json
```

## How storage works

There's no MongoDB, no Atlas account, and nothing to connect to. The backend uses **lowdb**, which keeps all posts in a plain JSON file at `backend/db.json`. That file is created automatically the first time you start the server. Every create/update/delete writes straight to that file, and it's git-ignored so your local data doesn't get committed.

Want to reset all data? Just delete `backend/db.json` and restart the server — it'll be recreated empty.

## Why port 5050?

The backend defaults to port **5050** instead of the more common 5000, because on macOS (Monterey and later), the built-in AirPlay Receiver service also listens on port 5000. Hitting `localhost:5000` in a browser on a Mac often returns Apple's own "Access denied — HTTP ERROR 403" page instead of reaching your Node server. Using 5050 avoids that conflict entirely. If you'd rather keep port 5000, turn off AirPlay Receiver in System Settings → General → AirDrop & Handoff, then change `PORT` back to `5000` in both `.env` files.

## Local setup

### Backend

```bash
cd backend
cp .env.example .env   # PORT and CLIENT_URL only — no database credentials needed
npm install
npm run dev             # nodemon, http://localhost:5050
```

You should see:

```
Server running on http://localhost:5050
Data is stored locally in backend/db.json — no external database needed.
```

### Frontend

```bash
cd frontend
cp .env.example .env    # optional, defaults to http://localhost:5050/api/posts
npm install
npm run dev              # http://localhost:5173
```

## Fixing "No articles available" / "Couldn't load articles"

- **"No articles available. Start writing!"** → the request succeeded, `db.json` just has no posts yet. Publish one from the form.
- **"Couldn't load articles" (red box)** → the request itself failed. Common causes now that there's no external database:
  1. **Backend isn't running.** Start it with `npm run dev` in `backend/`.
  2. **Wrong `VITE_API_URL`.** If your backend isn't on `localhost:5050`, set `VITE_API_URL` in `frontend/.env`.
  3. **CORS blocked.** The backend only allows the origin in `CLIENT_URL` (default `http://localhost:5173`).
  4. **`backend/db.json` isn't writable** (rare — e.g. read-only filesystem in some hosting setups). Check the backend terminal for a write error.
  5. DevTools → Network tab on the `/api/posts` request will show the exact status code and response.

There's a **Refresh** button next to "Recent Articles" to retry without reloading the page.

## API

| Method | Route             | Description       |
|--------|-------------------|--------------------|
| GET    | /api/posts        | List all posts     |
| GET    | /api/posts/:id    | Get one post       |
| POST   | /api/posts        | Create a post      |
| PUT    | /api/posts/:id    | Update a post      |
| DELETE | /api/posts/:id    | Delete a post      |

## Deployment (Render + Vercel, both free)

This repo includes `render.yaml` (backend) and `frontend/vercel.json` so both platforms can auto-detect the config — you don't have to type in build/start commands by hand. Note: `vercel.json` intentionally has no SPA "rewrite everything to index.html" rule — this app has no client-side routing, and adding one breaks asset loading (causes a blank white page after deploy, since JS/CSS requests get redirected to HTML too). Only add a rewrite here if you later introduce client-side routing (e.g. React Router) with more than one route.

Because storage is a local JSON file, be aware: **Render's free tier wipes the filesystem on redeploy or after the service sleeps from inactivity.** Fine for a demo/portfolio site, not for data you need to keep long-term. For real persistence, swap `backend/db.js` for a hosted database later (e.g. free MongoDB Atlas tier).

**1. Push this repo to GitHub** — both platforms deploy by connecting to a GitHub repository.

**2. Deploy the backend on Render:**
- Go to render.com → New → **Blueprint** → connect your repo. Render reads `render.yaml` automatically and sets up the service (root dir `backend`, build `npm install`, start `node server.js`).
- Alternatively, New → Web Service → point Root Directory at `backend` manually if you skip the Blueprint.
- Render assigns `PORT` itself; you don't need to set it.
- Copy the resulting URL, e.g. `https://your-app.onrender.com`.

**3. Deploy the frontend on Vercel:**
- Go to vercel.com → Add New → Project → import the same repo → set Root Directory to `frontend` (Vercel reads `vercel.json` for the rest).
- Add environment variable `VITE_API_URL=https://your-app.onrender.com/api/posts` (your Render URL from step 2, with `/api/posts` appended).
- Deploy. Copy the resulting URL, e.g. `https://your-blog.vercel.app`.

**4. Allow your deployed frontend through CORS:**
- Back in the Render dashboard → Environment → edit `CLIENT_URL` to include your Vercel URL alongside localhost, comma-separated:
  `http://localhost:5173,https://your-blog.vercel.app`
- Save — Render redeploys automatically. Because `CLIENT_URL` now accepts a list, you never need to toggle this between dev and prod again.

**5. Test:** open your Vercel URL. First load may take 30–50 seconds if Render's free instance was asleep. Try publishing an article to confirm the full round trip.
