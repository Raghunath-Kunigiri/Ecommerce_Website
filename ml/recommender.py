from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
from typing import Dict, List

import json

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


DATA_PATH = Path(__file__).parent / "data" / "products.json"


@dataclass
class ProductRecord:
  id: str
  name: str
  category: str
  taste: str
  texture: str
  ingredients: List[str]
  festival: bool
  price_range: str

  @classmethod
  def from_dict(cls, data: Dict) -> "ProductRecord":
    return cls(
      id=str(data.get("id", "")).strip(),
      name=str(data.get("name", "")).strip(),
      category=str(data.get("category", "")).strip(),
      taste=str(data.get("taste", "")).strip(),
      texture=str(data.get("texture", "")).strip(),
      ingredients=[str(x).strip() for x in data.get("ingredients", [])],
      festival=bool(data.get("festival", False)),
      price_range=str(data.get("priceRange", "")).strip(),
    )

  def feature_text(self) -> str:
    parts: List[str] = [
      self.category,
      self.taste,
      self.texture,
      "festival" if self.festival else "everyday",
      self.price_range,
      " ".join(self.ingredients),
    ]
    return " ".join(p for p in parts if p)


class ContentRecommender:
  def __init__(self, data_path: Path = DATA_PATH) -> None:
    raw = json.loads(data_path.read_text(encoding="utf-8"))
    self.products: List[ProductRecord] = [ProductRecord.from_dict(p) for p in raw]
    self.id_to_index: Dict[str, int] = {
      p.id: idx for idx, p in enumerate(self.products)
    }

    corpus = [p.feature_text() for p in self.products]
    self.vectorizer = TfidfVectorizer(stop_words="english")
    self.matrix = self.vectorizer.fit_transform(corpus)
    self.similarity = cosine_similarity(self.matrix)

  def recommend(self, product_id: str, top_k: int = 4) -> List[str]:
    if product_id not in self.id_to_index:
      raise KeyError(f"Unknown product_id: {product_id}")

    idx = self.id_to_index[product_id]
    scores = self.similarity[idx]

    ranked_indices = sorted(
      range(len(self.products)),
      key=lambda i: scores[i],
      reverse=True,
    )

    result: List[str] = []
    for i in ranked_indices:
      if i == idx:
        continue
      result.append(self.products[i].id)
      if len(result) >= top_k:
        break
    return result


_recommender: ContentRecommender | None = None


def get_recommender() -> ContentRecommender:
  global _recommender
  if _recommender is None:
    _recommender = ContentRecommender()
  return _recommender


def recommend(product_id: str, top_k: int = 4) -> List[str]:
  """
  Convenience wrapper used by FastAPI route.
  """
  return get_recommender().recommend(product_id, top_k=top_k)

