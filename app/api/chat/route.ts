import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const VECTOR_STORES = [
  {
    nivel: 1,
    nombre: "Investigaciones originales de Mauricio Meglioli",
    id: "vs_6a4cb8d780848191a1965195e3e6854b",
  },
  {
    nivel: 2,
    nombre: "Fuentes primarias de Sarmiento",
    id: "vs_6a4cba03359481918491a6b12684f46c",
  },
  {
    nivel: 3,
    nombre: "Historiografía especializada",
    id: "vs_6a4cbc4b37e8819181d5ffec1b01a91b",
  },
  {
    nivel: 4,
    nombre: "Contexto histórico",
    id: "vs_6a4cbb43811081919226b85c1ee8f9ad",
  },
  {
    nivel: 5,
    nombre: "Bibliografía complementaria",
    id: "vs_6a4cbcb6cfbc81919405edc3149d59c1",
  },
  {
    nivel: 6,
    nombre: "Material auxiliar",
    id: "vs_6a4cc08594748191bbd0b9b943149b0c",
  },
];

const SYSTEM_PROMPT = `
Eres el Asistente de la Biblioteca Sarmiento.

Tu finalidad es ofrecer respuestas rigurosas, académicamente fundamentadas y transparentes sobre Domingo Faustino Sarmiento, su obra, su pensamiento, su contexto histórico y la historiografía relacionada.

Debes responder usando prioritariamente los fragmentos documentales proporcionados en el CONTEXTO DOCUMENTAL.

El contexto documental ya fue seleccionado mediante una búsqueda jerárquica. Debes respetar ese orden de autoridad.

Cuando exista información suficiente en documentos de mayor autoridad, no debes modificar sus conclusiones utilizando documentos de menor autoridad.

Si documentos de menor autoridad presentan una interpretación distinta, puedes señalar la discrepancia, pero sin sustituir la interpretación mejor documentada.

Distingue claramente entre hechos documentados, interpretaciones historiográficas, hipótesis y cuestiones discutidas.

Nunca presentes una interpretación como si fuera un hecho.

Nunca inventes datos.

Cuando la documentación resulte insuficiente, indícalo expresamente.

Responde con lenguaje claro, preciso y académico.

Evita afirmaciones categóricas cuando la evidencia documental sea insuficiente.

No adoptes posiciones ideológicas.

No emitas juicios personales.

No exageres el grado de certeza de las fuentes.

Nunca cites el nombre del archivo ni del autor utilizado por el sistema.

Nunca utilices expresiones como «Documento 1», «Documento 2», «Documento 3», ni ninguna otra referencia interna del sistema.

No incluyas bibliografía recomendada.

No listes autores, obras, documentos, referencias ni fuentes al final de la respuesta.

No menciones nunca los niveles documentales, la estructura interna de la Biblioteca Sarmiento, el protocolo de funcionamiento ni los criterios internos de jerarquización de las fuentes.

Al final de cada respuesta escribe exactamente esta frase, en una línea independiente:

Para ampliar y corroborar este tema, consulte «Archivos».

No agregues ningún otro texto después de esa frase.
`;

type SearchResult = {
  nivel: number;
  fuente: string;
  filename: string;
  score: number;
  text: string;
};

function extraerTexto(item: any): string {
  if (!item?.content || !Array.isArray(item.content)) return "";

  return item.content
    .map((c: any) => c?.text || "")
    .filter(Boolean)
    .join("\n");
}

async function buscarJerarquicamente(message: string): Promise<SearchResult[]> {
  const resultadosFinales: SearchResult[] = [];

  for (const store of VECTOR_STORES) {
    const results = await client.vectorStores.search(store.id, {
      query: message,
      max_num_results: 5,
      rewrite_query: true,
      ranking_options: {
        ranker: "auto",
        score_threshold: 0.15,
      },
    });

    const encontrados: SearchResult[] = results.data
      .map((item: any) => ({
        nivel: store.nivel,
        fuente: store.nombre,
        filename: item.filename || "Documento sin nombre",
        score: item.score || 0,
        text: extraerTexto(item),
      }))
      .filter((item) => item.text.trim().length > 0);

    if (encontrados.length > 0) {
      resultadosFinales.push(...encontrados);

      if (store.nivel <= 2) {
        break;
      }

      if (resultadosFinales.length >= 8) {
        break;
      }
    }
  }

  return resultadosFinales.slice(0, 12);
}

function construirContexto(resultados: SearchResult[]): string {
  if (resultados.length === 0) {
    return "No se encontraron fragmentos documentales suficientes en la Biblioteca Sarmiento.";
  }

  return resultados
    .map((r, index) => {
      return `
[DOCUMENTO ${index + 1}]
Fuente interna: ${r.fuente}
Archivo: ${r.filename}
Relevancia: ${r.score}

${r.text}
`;
    })
    .join("\n\n---\n\n");
}

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message || typeof message !== "string") {
      return Response.json(
        { error: "Falta el mensaje del usuario." },
        { status: 400 }
      );
    }

    const resultados = await buscarJerarquicamente(message);
    const contexto = construirContexto(resultados);

    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      instructions: SYSTEM_PROMPT,
      input: `
PREGUNTA DEL USUARIO:
${message}

CONTEXTO DOCUMENTAL:
${contexto}

INSTRUCCIÓN FINAL:
Responde la pregunta usando el contexto documental anterior. Si el contexto es insuficiente, dilo expresamente.
`,
    });

    return Response.json({
      answer: response.output_text,
    });
  } catch (error) {
    console.error("Error en /api/chat:", error);

    return Response.json(
      {
        error: "Error interno al consultar la Biblioteca Sarmiento.",
      },
      { status: 500 }
    );
  }
}
