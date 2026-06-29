"use client";

import { useState } from "react";

type Message = {
  role: "user" | "assistant";
  text: string;
};

const initialMessage: Message = {
  role: "assistant",
  text: "Soy el asistente de la Biblioteca Sarmiento. Respondo consultas sobre Domingo F. Sarmiento, sus obras y su época, basado en las investigaciones más rigurosas sobre el sanjuaninno y en sus escritos originales, puestos hoy a disposición del público para su consulta íntegra, sin recortes ni censura.",
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
    <main style={page}>
      <header style={header}>
        <strong style={title}>Biblioteca Sarmiento</strong>
      </header>

      {section === "contacto" ? (
        <section style={contactSection}>
          <h1 style={contactTitle}>Contacto</h1>
          <p><strong>Mauricio Meglioli</strong></p>
          <p>Responsable del proyecto Biblioteca Sarmiento.</p>
        </section>
      ) : (
        <>
          <section style={chatSection}>
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: m.role === "user" ? "flex-end" : "flex-start",
                  marginBottom: 24,
                }}
              >
                <div
                  style={{
                    maxWidth: "78%",
                    padding: "16px 20px",
                    borderRadius: 18,
                    background: m.role === "user" ? "#111" : "#f4f4f4",
                    color: m.role === "user" ? "#fff" : "#111",
                    fontSize: 16,
                    lineHeight: 1.55,
                    whiteSpace: "pre-wrap",
                  }}
                >
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

          <div style={inputBar}>
            <div style={inputBox}>
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
                style={textarea}
              />

              <button onClick={sendMessage} disabled={loading} style={sendButton}>
                ↑
              </button>
            </div>
          </div>
        </>
      )}

      <footer style={footer}>
        <button onClick={nuevoChat} style={footerButton}>
          Nuevo chat
        </button>

        <button onClick={() => setSection("chat")} style={footerButton}>
          Chat IA
        </button>

        <a
          href="https://sites.google.com/view/megliopedia/x-bs"
          target="_blank"
          rel="noopener noreferrer"
          style={footerLink}
        >
          Archivos
        </a>

        <button onClick={() => setSection("contacto")} style={footerButton}>
          Contacto
        </button>
      </footer>
    </main>
  );
}

const page = {
  minHeight: "100vh",
  background: "#fff",
  color: "#111",
  fontFamily: "Arial, Helvetica, sans-serif",
  display: "flex",
  flexDirection: "column" as const,
};

const header = {
  height: 72,
  borderBottom: "1px solid #e5e5e5",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "0 20px",
};

const title = {
  fontFamily: "Georgia, serif",
  fontSize: 26,
  textAlign: "center" as const,
};

const chatSection = {
  flex: 1,
  maxWidth: 860,
  width: "100%",
  margin: "0 auto",
  padding: "42px 18px 170px",
};

const contactSection = {
  flex: 1,
  maxWidth: 760,
  margin: "70px auto",
  padding: "0 24px 120px",
  fontSize: 18,
  lineHeight: 1.6,
};

const contactTitle = {
  fontFamily: "Georgia, serif",
  fontSize: 40,
};

const inputBar = {
  position: "fixed" as const,
  left: 0,
  right: 0,
  bottom: 54,
  background: "#fff",
  borderTop: "1px solid #e5e5e5",
  padding: "14px 16px",
};

const inputBox = {
  maxWidth: 860,
  margin: "0 auto",
  display: "flex",
  alignItems: "center",
  gap: 10,
  border: "1px solid #d1d5db",
  borderRadius: 16,
  padding: 10,
};

const textarea = {
  flex: 1,
  minHeight: 42,
  maxHeight: 120,
  border: "none",
  outline: "none",
  resize: "none" as const,
  fontSize: 16,
  fontFamily: "inherit",
};

const sendButton = {
  width: 42,
  height: 42,
  borderRadius: "50%",
  border: "none",
  background: "#111",
  color: "#fff",
  fontSize: 21,
  cursor: "pointer",
};

const footer = {
  position: "fixed" as const,
  left: 0,
  right: 0,
  bottom: 0,
  height: 54,
  background: "#fff",
  borderTop: "1px solid #e5e5e5",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 18,
  fontSize: 14,
};

const footerButton = {
  background: "transparent",
  border: "none",
  color: "#555",
  fontSize: 14,
  fontFamily: "inherit",
  cursor: "pointer",
  padding: 0,
};

const footerLink = {
  color: "#555",
  textDecoration: "none",
  fontSize: 14,
};
