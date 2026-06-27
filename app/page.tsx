"use client";

import { useState } from "react";

type Message = {
  role: "user" | "assistant";
  text: string;
};

const initialMessage: Message = {
  role: "assistant",
  text: "Soy el asistente de la Biblioteca Sarmiento. Preguntame sobre Sarmiento, sus obras, su época o los documentos de la biblioteca.",
};

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([initialMessage]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [section, setSection] = useState<"chat" | "contacto">("chat");

  function nuevoChat() {
    setMessages([initialMessage]);
    setInput("");
    setSection("chat");
  }

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
      background: "#fff",
      color: "#111",
      fontFamily: "Arial, Helvetica, sans-serif",
      display: "flex",
      flexDirection: "column"
    }}>
      <header style={{
        height: 72,
        borderBottom: "1px solid #e5e5e5",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 36px"
      }}>
        <strong style={{ fontFamily: "Georgia, serif", fontSize: 26 }}>
          Biblioteca Sarmiento
        </strong>

        <nav style={{
          display: "flex",
          alignItems: "center",
          gap: 34,
          fontSize: 16
        }}>
          <button onClick={nuevoChat} style={buttonSmall}>
            Nuevo chat
          </button>

          <button onClick={() => setSection("chat")} style={navStyle(section === "chat")}>
            Chat IA
          </button>

          <a
            href="https://sites.google.com/view/megliopedia/x-bs"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#555",
              textDecoration: "none",
              padding: "26px 0"
            }}
          >
            Archivos
          </a>

          <button onClick={() => setSection("contacto")} style={navStyle(section === "contacto")}>
            Contacto
          </button>
        </nav>
      </header>

      {section === "contacto" ? (
        <section style={{
          maxWidth: 760,
          margin: "90px auto",
          padding: "0 24px",
          fontSize: 18,
          lineHeight: 1.6
        }}>
          <h1 style={{ fontFamily: "Georgia, serif", fontSize: 42 }}>
            Contacto
          </h1>
          <p><strong>Mauricio Meglioli</strong></p>
          <p>Responsable del proyecto Biblioteca Sarmiento.</p>
        </section>
      ) : (
        <>
          <section style={{
            flex: 1,
            maxWidth: 860,
            width: "100%",
            margin: "0 auto",
            padding: "54px 24px 150px"
          }}>
            {messages.map((m, i) => (
              <div key={i} style={{
                display: "flex",
                justifyContent: m.role === "user" ? "flex-end" : "flex-start",
                marginBottom: 24
              }}>
                <div style={{
                  maxWidth: "72%",
                  padding: "18px 22px",
                  borderRadius: 18,
                  background: m.role === "user" ? "#111" : "#f4f4f4",
                  color: m.role === "user" ? "#fff" : "#111",
                  fontSize: 17,
                  lineHeight: 1.55,
                  whiteSpace: "pre-wrap"
                }}>
                  {m.text}
                </div>
              </div>
            ))}

            {loading && (
              <p style={{ color: "#777", fontSize: 15 }}>
                Consultando la biblioteca...
              </p>
            )}
          </section>

          <div style={{
            position: "fixed",
            left: 0,
            right: 0,
            bottom: 0,
            background: "#fff",
            borderTop: "1px solid #e5e5e5",
            padding: "18px 24px"
          }}>
            <div style={{
              maxWidth: 860,
              margin: "0 auto",
              display: "flex",
              alignItems: "center",
              gap: 12,
              border: "1px solid #d1d5db",
              borderRadius: 16,
              padding: 12
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
                  minHeight: 46,
                  maxHeight: 130,
                  border: "none",
                  outline: "none",
                  resize: "none",
                  fontSize: 16,
                  fontFamily: "inherit"
                }}
              />

              <button onClick={sendMessage} disabled={loading} style={{
                width: 46,
                height: 46,
                borderRadius: "50%",
                border: "none",
                background: "#111",
                color: "#fff",
                fontSize: 22,
                cursor: "pointer"
              }}>
                ↑
              </button>
            </div>
          </div>
        </>
      )}
    </main>
  );
}

const buttonSmall = {
  background: "#111",
  color: "#fff",
  border: "none",
  borderRadius: 8,
  padding: "10px 14px",
  fontSize: 15,
  cursor: "pointer"
};

function navStyle(active: boolean) {
  return {
    background: "transparent",
    border: "none",
    borderBottom: active ? "3px solid #111" : "3px solid transparent",
    padding: "26px 0",
    fontSize: 16,
    cursor: "pointer",
    fontWeight: active ? 700 : 400,
    color: active ? "#111" : "#555"
  };
}
