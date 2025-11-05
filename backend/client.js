import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const API_KEY = process.env.GOOGLE_API_KEY;
const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

export async function ClientGemini(prompt) {
  try {
    const response = await fetch(`${GEMINI_URL}?key=${API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Erro da API:", data);
      throw new Error(data.error?.message || "Erro desconhecido na API Gemini");
    }

    // Extrai o texto da resposta
    const output = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sem resposta do modelo.";
    return output;

  } catch (error) {
    console.error("Erro ao gerar conteúdo:", error);
    throw error;
  }
}
