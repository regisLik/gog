# JOG

Plateforme d'orientation propulsée par l'IA.

## Architecture

```
joguide/
├─ main.py, requirements.txt   # Backend FastAPI (API IA/LLM)
├─ web/                        # Frontend Next.js 16 (React 19, TS, Tailwind v4, Framer Motion)
└─ static/                     # Ancien prototype statique (référence, non utilisé par l'app)
```

- Le **frontend** (Next.js) sert l'UI.
- Le **backend** (FastAPI) expose l'API sous `/api/*` (Python pour l'IA/LLM).
- En dev, Next **proxifie** `/api/*` vers FastAPI (voir `web/next.config.ts`), donc le navigateur reste same-origin (pas de CORS à gérer côté front).

## Lancer en développement

Deux terminaux.

**1. Backend FastAPI** (port 8000) :

```bash
python -m uvicorn main:app --reload --port 8000
```

**2. Frontend Next.js** (port 3000) :

```bash
cd web
npm run dev
```

Ouvrir http://localhost:3000. Les appels front vers `/api/...` sont automatiquement routés vers FastAPI (`http://127.0.0.1:8000`). Pour cibler un autre backend : `BACKEND_URL=http://host:port npm run dev`.

## Build de production

```bash
cd web && npm run build && npm run start   # frontend (port 3000)
python -m uvicorn main:app --port 8000      # backend
```

## Structure du frontend (`web/src`)

- `app/layout.tsx` — fonts (Inter + Montserrat via `next/font`), métadonnées.
- `app/globals.css` — design system en Tailwind v4 (`@theme`), tokens couleurs/typo, icônes Material Symbols.
- `app/page.tsx` — composition de la page.
- `components/`
  - `Hero.tsx` — héros + barre de recherche.
  - `OrbitingJobs.tsx` — carrousel orbital des métiers (boucle `requestAnimationFrame` déterministe : positions = fonction pure du temps, robuste au changement d'onglet).
  - `AboutSection.tsx` — section « À propos » (révélation en cascade, Framer Motion).
  - `KeyFigures.tsx` — « Les 4 chiffres clés » (cartes alternées gauche/droite qui glissent au scroll).
  - `MobileNav.tsx` — barre de navigation mobile.
- `public/jobs.json` — données des métiers.
