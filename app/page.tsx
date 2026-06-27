"use client";

import { useState } from "react";
import Image from "next/image";

type Message = {
  role: "user" | "assistant";
  text: string;
};

export default function Home() {
  const initialMessage: Message = {
    role: "assistant",
    text: "Soy el asistente de la Biblioteca Sarmiento.\nPreguntame sobre Sarmiento, sus obras, su época o los documentos de la biblioteca.",
  };

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
      background: "#ffffff",
      color: "#111",
      fontFamily: "Arial, Helvetica, sans-serif",
      display: "flex"
    }}>
      <aside style={{
        width: 310,
        borderRight: "1px solid #e5e5e5",
        padding: "26px 22px",
        display: "flex",
        flexDirection: "column",
        gap: 24
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <Image
            src="/sarmiento.jpg"
            alt="Domingo F. Sarmiento"
            width={72}
            height={72}
            style={{ borderRadius: "50%", objectFit: "cover" }}
          />
          <div style={{ fontFamily: "Georgia, serif", fontSize: 28, lineHeight: 1.05 }}>
            Biblioteca<br />Sarmiento
          </div>
        </div>

        <button onClick={nuevoChat} style={{
          marginTop: 20,
          background: "#111",
          color: "#fff",
          border: "none",
          borderRadius: 8,
          padding: "16px 18px",
          fontSize: 17,
          textAlign: "left",
          cursor: "pointer"
        }}>
          + Nuevo chat
        </button>

        <div style={{ borderTop: "1px solid #e5e5e5", paddingTop: 22 }}>
          <p style={{ color: "#666", fontSize: 14, letterSpacing: 1 }}>ARCHIVOS</p>

          {[
            "Facundo",
            "Recuerdos de provincia",
            "Viajes por Europa, África...",
            "Educación popular",
            "Correspondencia"
          ].map((item) => (
            <div key={item} style={{ marginBottom: 18 }}>
              <strong>{item}</strong>
              <p style={{ margin: "4px 0 0", color: "#666", fontSize: 14 }}>
                Domingo F. Sarmiento
              </p>
            </div>
          ))}

          <a
            href="https://sites.google.com/view/megliopedia/x-bs"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#111", textDecoration: "none", fontWeight: 600 }}
          >
            Ver todos los archivos →
          </a>
        </div>

        <div style={{ marginTop: "auto", borderTop: "1px solid #e5e5e5", paddingTop: 22 }}>
          <button onClick={() => setSection("contacto")} style={{
            background: "transparent",
            border: "none",
            fontSize: 16,
            cursor: "pointer",
            padding: "8px 0"
          }}>
            Contacto
          </button>
        </div>
      </aside>

      <section style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <header style={{
          height: 92,
          borderBottom: "1px solid #e5e5e5",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 42px"
        }}>
          <strong style={{ fontSize: 20 }}>Biblioteca Sarmiento</strong>

          <nav style={{ display: "flex", gap: 52, fontSize: 18 }}>
            <button onClick={() => setSection("chat")} style={navStyle(section === "chat")}>
              Chat IA
            </button>

            <a
              href="https://sites.google.com/view/megliopedia/x-bs"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "#555",
                textDecoration: "none"
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
          <div style={{ maxWidth: 780, margin: "90px auto", fontSize: 20, lineHeight: 1.6 }}>
            <h1 style={{ fontFamily: "Georgia, serif", fontSize: 42 }}>Contacto</h1>
            <p><strong>Mauricio Meglioli</strong></p>
            <p>
              Responsable del proyecto Biblioteca Sarmiento.
            </p>
          </div>
        ) : (
          <>
            <div style={{
              flex: 1,
              maxWidth: 1040,
              width: "100%",
              margin: "0 auto",
              padding: "70px 32px 170px"
            }}>
              {messages.map((m, i) => (
                <div key={i} style={{
                  display: "flex",
                  justifyContent: m.role === "user" ? "flex-end" : "flex-start",
                  gap: 20,
                  marginBottom: 38
                }}>
                  {m.role === "assistant" && (
                    <Image
                      src="/sarmiento.jpg"
                      alt="Sarmiento"
                      width={56}
                      height={56}
                      style={{ borderRadius: "50%", objectFit: "cover", marginTop: 4 }}
                    />
                  )}

                  <div style={{
                    maxWidth: 620,
                    padding: "22px 26px",
                    borderRadius: 18,
                    background: m.role === "user" ? "#111" : "#f4f4f4",
                    color: m.role === "user" ? "#fff" : "#111",
                    fontSize: 18,
                    lineHeight: 1.55,
                    whiteSpace: "pre-wrap"
                  }}>
                    {m.text}
                  </div>
                </div>
              ))}

              {loading && <p style={{ color: "#666" }}>Consultando la biblioteca...</p>}
            </div>

            <div style={{
              position: "fixed",
              left: 310,
              right: 0,
              bottom: 0,
              background: "#fff",
              borderTop: "1px solid #e5e5e5",
              padding: "22px 32px"
            }}>
              <div style={{
                maxWidth: 980,
                margin: "0 auto",
                display: "flex",
                alignItems: "center",
                gap: 12,
                border: "1px solid #d1d5db",
                borderRadius: 16,
                padding: 14
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
                    minHeight: 56,
                    maxHeight: 140,
                    border: "none",
                    outline: "none",
                    resize: "none",
                    fontSize: 18,
                    fontFamily: "inherit"
                  }}
                />

                <button onClick={sendMessage} disabled={loading} style={{
                  width: 54,
                  height: 54,
                  borderRadius: "50%",
                  border: "none",
                  background: "#111",
                  color: "#fff",
                  fontSize: 24,
                  cursor: "pointer"
                }}>
                  ↑
                </button>
              </div>

              <p style={{
                maxWidth: 980,
                margin: "10px auto 0",
                color: "#777",
                fontSize: 14
              }}>
                Podés presionar Enter para enviar · Shift + Enter para salto de línea
              </p>
            </div>
          </>
        )}
      </section>
    </main>
  );
}

function navStyle(active: boolean) {
  return {
    background: "transparent",
    border: "none",
    borderBottom: active ? "3px solid #111" : "3px solid transparent",
    padding: "32px 0",
    fontSize: 18,
    cursor: "pointer",
    fontWeight: active ? 700 : 400,
    color: active ? "#111" : "#555"
  };
}
