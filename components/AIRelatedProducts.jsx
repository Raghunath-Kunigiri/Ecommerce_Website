"use client";
import { useState, useEffect } from "react";

export default function AIRelatedProducts({ currentProduct }) {
  const [recs, setRecs] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/recommend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        currentProduct,
        question: `Suggest 3 products that go well with ${currentProduct}. 
        Format: just list the 3 product names with one short reason each (1 line per product).`,
      }),
    })
      .then((r) => r.json())
      .then((d) => {
        if (cancelled) return;
        const text =
          typeof d.recommendation === "string" && d.recommendation.trim()
            ? d.recommendation
            : d.error || "Couldn't load suggestions.";
        setRecs(text);
      })
      .catch(() => {
        if (!cancelled) setRecs("Couldn't load suggestions.");
      });
    return () => {
      cancelled = true;
    };
  }, [currentProduct]);

  if (!recs) {
    return (
      <div style={{ color: "#9CA3AF", fontSize: 13 }}>
        Finding recommendations...
      </div>
    );
  }

  return (
    <div style={{ marginTop: "2rem" }}>
      <h3 style={{ fontSize: "16px", fontWeight: 600, marginBottom: "12px" }}>
        🍬 You may also like
      </h3>
      <div
        style={{
          background: "#FEF9EE",
          border: "1px solid #FDE68A",
          borderRadius: "12px",
          padding: "14px 16px",
          fontSize: "13px",
          lineHeight: 1.8,
          color: "#1F2937",
          whiteSpace: "pre-wrap",
        }}
      >
        {recs}
      </div>
    </div>
  );
}
