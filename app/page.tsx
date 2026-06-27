"use client";

import { useState } from "react";

type Message = {
  role: "user" | "assistant";
  text: string;
};

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: "Soy el asistente de la Biblioteca Sarmiento. Preguntame sobre Sarmiento, sus obras, su época o los documentos de la biblioteca.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendMessage() {
    if (!input.trim() || loading) return;

    const question = input.trim();
    setInput("");
    setMessages((m) => [...m, { role: "user", text: question }]);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: question }),
      });

      const data = await res.json();

      setMessages((m) => [
        ...m,
        { role: "assistant", text: data.answer || "No pude obtener una respuesta." },
      ]);
    } catch {
      setMessages((m) => [
        ...m,
        { role: "assistant", text: "Error al conectar con el bot." },
      ]);
    }

    setLoading(false);
  }

  return (
    <main style={{
      minHeight: "100vh",
      background: "#f7f3ea",
      color: "#1f1a14",
      fontFamily: "Georgia, serif",
      display: "flex",
      flexDirection: "column"
    }}>
      <header style={{
        padding: "18px 28px",
        borderBottom: "1px solid #ddd2c0",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <strong>Biblioteca Sarmiento</strong>
        <span>Chat IA</span>
      </header>

      <section style={{
        flex: 1,
        maxWidth: 900,
        width: "100%",
        margin: "0 auto",
        padding: "32px 20px 140px"
      }}>
        {messages.map((m, i) => (
          <div key={i} style={{
            display: "flex",
            justifyContent: m.role === "user" ? "flex-end" : "flex-start",
            marginBottom: 18
          }}>
            <div style={{
              maxWidth: "75%",
              padding: "16px 18px",
              borderRadius: 18,
              background: m.role === "user" ? "#1f1a14" : "#efe6d6",
              color: m.role === "user" ? "#fff" : "#1f1a14",
              lineHeight: 1.5,
              whiteSpace: "pre-wrap"
            }}>
              {m.text}
            </div>
          </div>
        ))}

        {loading && <p>Consultando la biblioteca...</p>}
      </section>

      <div style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        background: "#f7f3ea",
        borderTop: "1px solid #ddd2c0",
        padding: 18
      }}>
        <div style={{
          maxWidth: 900,
          margin: "0 auto",
          display: "flex",
          gap: 10
        }}>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            placeholder="Preguntá algo sobre Sarmiento..."
            style={{
              flex: 1,
              minHeight: 54,
              maxHeight: 140,
              padding: 14,
              borderRadius: 16,
              border: "1px solid #cbbda7",
              fontSize: 16,
              fontFamily: "inherit"
            }}
          />
          <button
            onClick={sendMessage}
            disabled={loading}
            style={{
              padding: "0 22px",
              borderRadius: 16,
              border: "none",
              background: "#1f1a14",
              color: "#fff",
              cursor: "pointer"
            }}
          >
            Enviar
          </button>
        </div>
      </div>
    </main>
  );
}
