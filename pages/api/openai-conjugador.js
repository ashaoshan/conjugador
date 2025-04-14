// pages/api/openai-conjugador.js
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  console.log("CLAVE DE API:", process.env.OPENAI_API_KEY);
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Falta el prompt" });
  }

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
    });

    const respuesta = completion.data.choices[0].message.content;

    // Intentamos convertir la respuesta a JSON
    const conjugaciones = JSON.parse(respuesta);
    res.status(200).json(conjugaciones);
  } catch (error) {
    console.error("Error en el backend:", error);
    res.status(500).json({ error: "Error al generar conjugaciones" });
  }
}
