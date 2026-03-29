"use client";
import { useState } from "react";

export default function AIRecommendChat({ currentProduct }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "ai",
      text: `Hi! Looking at ${currentProduct}? Ask me anything — I can suggest similar items, gift combos, or festival specials! 🍬`,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendMessage() {
    if (!input.trim()) return;
    const userMsg = input;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentProduct,
          question: userMsg,
        }),
      });
      const data = await res.json();
      const text =
        typeof data.recommendation === "string" && data.recommendation.trim()
          ? data.recommendation
          : data.error || "Sorry, I couldn’t get a suggestion right now.";
      setMessages((prev) => [...prev, { role: "ai", text }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: "Sorry, try again in a moment." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Floating button */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          zIndex: 1000,
          background: "#B45309",
          color: "white",
          border: "none",
          borderRadius: "50px",
          padding: "12px 20px",
          cursor: "pointer",
          fontSize: "14px",
          fontWeight: 500,
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        }}
      >
        {open ? "✕ Close" : "🍬 Ask AI"}
      </button>

      {/* Chat window */}
      {open && (
        <div
          style={{
            position: "fixed",
            bottom: "80px",
            right: "24px",
            zIndex: 999,
            width: "340px",
            maxHeight: "420px",
            background: "white",
            borderRadius: "16px",
            border: "1px solid #E5E7EB",
            display: "flex",
            flexDirection: "column",
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "14px 16px",
              borderBottom: "1px solid #F3F4F6",
              background: "#FEF3C7",
              borderRadius: "16px 16px 0 0",
            }}
          >
            <div style={{ fontWeight: 600, fontSize: "14px" }}>
              🍬 Balaji Sweets Assistant
            </div>
            <div
              style={{ fontSize: "11px", color: "#92400E", marginTop: 2 }}
            >
              Ask for suggestions, combos & gifting ideas
            </div>
          </div>

          {/* Messages */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "12px",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  alignSelf: m.role === "user" ? "flex-end" : "flex-start",
                  background: m.role === "user" ? "#B45309" : "#F9FAFB",
                  color: m.role === "user" ? "white" : "#111",
                  padding: "8px 12px",
                  borderRadius: "12px",
                  fontSize: "13px",
                  maxWidth: "90%",
                  lineHeight: 1.5,
                }}
              >
                {m.text}
              </div>
            ))}
            {loading && (
              <div style={{ fontSize: "12px", color: "#9CA3AF" }}>Thinking...</div>
            )}
          </div>

          {/* Input */}
          <div
            style={{
              display: "flex",
              padding: "10px 12px",
              borderTop: "1px solid #F3F4F6",
              gap: "8px",
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="e.g. gift box for Diwali?"
              style={{
                flex: 1,
                padding: "8px 10px",
                borderRadius: "8px",
                border: "1px solid #E5E7EB",
                fontSize: "13px",
              }}
            />
            <button
              type="button"
              onClick={sendMessage}
              style={{
                background: "#B45309",
                color: "white",
                border: "none",
                borderRadius: "8px",
                padding: "8px 14px",
                cursor: "pointer",
                fontSize: "13px",
              }}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}
