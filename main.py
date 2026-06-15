from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import RedirectResponse

app = FastAPI(title="JOG API")

# Allow the Next.js dev server to call the API directly during development.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_methods=["*"],
    allow_headers=["*"],
)


# --- API (consumed by the Next.js frontend, proxied via /api/*) ---
@app.get("/api/health")
async def health():
    return {"status": "ok"}


# --- Legacy static prototype (kept for reference during the migration) ---
app.mount("/static", StaticFiles(directory="static"), name="static")


@app.get("/")
async def root():
    return RedirectResponse(url="/static/index.html")
