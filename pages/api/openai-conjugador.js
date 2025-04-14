// pages/api/openai-conjugador.js
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Falta el prompt" });
  }

  console.log("CLAVE DE API:", process.env.OPENAI_API_KEY);
  console.log("Enviando prompt:", prompt);

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    const respuesta = completion.choices[0].message.content;
    console.log("Respuesta cruda:", respuesta);

    const json = JSON.parse(respuesta);
    res.status(200).json(json);
  } catch (error) {
  console.error("Error completo:", JSON.stringify(error, null, 2));
  res.status(500).json({
    error: "Error al generar conjugaciones",
    detalle: error.message || "Desconocido",
  });
}

}
