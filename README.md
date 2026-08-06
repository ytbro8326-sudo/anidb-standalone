# AniDB Standalone Python API

FastAPI web service for extracting episode metadata and stream links from AniDB.app.

## Directory Structure
- `app.py` - FastAPI web application
- `anidbpy.py` - Core AniDB scraper logic
- `requirements.txt` - Python dependencies
- `Procfile` & `render.yaml` - Render deployment settings
- `proxy/` - Cloudflare Worker proxy to bypass Cloudflare IP blocks

## Environment Variables
- `PROXY_URL`: Cloudflare Worker proxy URL (e.g., `https://anidb-proxy.YOUR_NAME.workers.dev`)

## Endpoints
- `GET /episodes/{anilist_id}`
- `GET /watch/{anilist_id}/{audio}/{ep_num}`
