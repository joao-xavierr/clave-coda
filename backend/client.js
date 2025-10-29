import { GoogleGenAI } from "@google/genai";

// O client pega a API key do ambiente (já inicializada no server.js)
const ai = new GoogleGenAI({});

export default async function ClientGemini(prompt) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });
  return response.text;
}
