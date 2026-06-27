import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  const { message } = await req.json();

  const response = await client.responses.create({
    model: "gpt-4.1-mini",
    input: message,
    instructions:
      "Respondé como asistente académico de la Biblioteca Sarmiento. Usá la biblioteca documental como fuente principal. Si no encontrás información suficiente en los documentos, decilo con claridad.",
    tools: [
      {
        type: "file_search",
        vector_store_ids: [process.env.VECTOR_STORE_ID as string],
      },
    ],
  });

  return Response.json({
    answer: response.output_text,
  });
}
