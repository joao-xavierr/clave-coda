import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import { ClientGemini } from "./client.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post("/api/gemini", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Campo 'prompt' é obrigatório." });
    }

    const resposta = await ClientGemini(prompt);
    res.json({ resposta });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao processar a solicitação." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor rodando em http://localhost:${PORT}`));
