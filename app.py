from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import os
import uvicorn
from anidbpy import get_episodes, handle_watch

app = FastAPI(title="AniDB Python API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {
        "status": "online",
        "service": "AniDB.app Python API",
        "endpoints": [
            "GET /episodes/{anilist_id}",
            "GET /watch/{anilist_id}/{audio}/{ep_num}"
        ]
    }


@app.get("/episodes/{anilist_id}")
async def fetch_episodes(anilist_id: int):
    try:
        data = await get_episodes(anilist_id)
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/watch/{anilist_id}/{audio}/{ep_num}")
async def fetch_watch(anilist_id: int, audio: str, ep_num: int):
    if audio not in ["sub", "dub"]:
        raise HTTPException(status_code=400, detail="Audio must be 'sub' or 'dub'")
    try:
        data = await handle_watch(anilist_id, audio, ep_num)
        if isinstance(data, dict) and data.get("status") == 404:
            raise HTTPException(status_code=404, detail=data.get("error"))
        return data
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("app:app", host="0.0.0.0", port=port)
