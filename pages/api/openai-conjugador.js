import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  const { prompt } = req.body;

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
    });

    const respuesta = completion.data.choices[0].message.content;
    const json = JSON.parse(respuesta);
    res.status(200).json(json);
  } catch (error) {
    console.error("Error con OpenAI:", error);
    res.status(500).json({ error: "Error al generar conjugaciones" });
  }
}