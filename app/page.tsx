export default function Home() {
  return (
    <main style={{
      minHeight: "100vh",
      padding: "60px 24px",
      fontFamily: "Georgia, serif",
      background: "#f7f3ea",
      color: "#1f1a14"
    }}>
      <section style={{ maxWidth: "900px", margin: "0 auto" }}>
        <h1 style={{ fontSize: "48px", marginBottom: "16px" }}>
          Biblioteca Sarmiento
        </h1>

        <p style={{ fontSize: "22px", lineHeight: "1.5", marginBottom: "32px" }}>
          Archivo digital, obras completas y consulta inteligente sobre Domingo F. Sarmiento,
          su época, sus escritos y su recepción histórica.
        </p>

        <nav style={{ display: "flex", gap: "16px", flexWrap: "wrap", marginBottom: "48px" }}>
          <a href="#biblioteca">Biblioteca</a>
          <a href="#obras">Obras completas</a>
          <a href="#articulos">Artículos</a>
          <a href="#chat">Chat IA</a>
        </nav>

        <section id="biblioteca">
          <h2>Biblioteca digital</h2>
          <p>
            Reúne documentos, ediciones, estudios críticos y materiales históricos
            vinculados con Sarmiento y el siglo XIX argentino.
          </p>
        </section>

        <section id="obras" style={{ marginTop: "36px" }}>
          <h2>Obras completas</h2>
          <p>
            Próximamente: índice, cronología, textos introductorios y acceso organizado
            a las obras de Sarmiento.
          </p>
        </section>

        <section id="articulos" style={{ marginTop: "36px" }}>
          <h2>Artículos</h2>
          <p>
            Ensayos, notas bibliográficas y materiales de investigación.
          </p>
        </section>

        <section id="chat" style={{ marginTop: "36px" }}>
          <h2>Chat IA</h2>
          <p>
            Próximamente: un asistente basado en la biblioteca documental del proyecto.
          </p>
        </section>
      </section>
    </main>
  );
}
