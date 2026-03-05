from __future__ import annotations

import os
from typing import List

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from recommender import recommend


app = FastAPI(title="Balaji Snacks Recommender")

origins_env = os.getenv("RECOMMENDER_ALLOWED_ORIGINS", "*")
if origins_env.strip() == "*" or not origins_env.strip():
  allowed_origins = ["*"]
else:
  allowed_origins = [o.strip() for o in origins_env.split(",") if o.strip()]

app.add_middleware(
  CORSMiddleware,
  allow_origins=allowed_origins,
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
)


@app.get("/health")
def health() -> dict:
  return {"status": "ok"}


@app.get("/recommend/{product_id}")
def get_recommendations(product_id: str, top_k: int = 4) -> dict:
  try:
    recs: List[str] = recommend(product_id, top_k=top_k)
  except KeyError:
    raise HTTPException(status_code=404, detail="Product not found")
  return {"recommended": recs}


if __name__ == "__main__":
  import uvicorn

  uvicorn.run(
    "main:app",
    host=os.getenv("RECOMMENDER_HOST", "0.0.0.0"),
    port=int(os.getenv("RECOMMENDER_PORT", "8000")),
    reload=True,
  )

