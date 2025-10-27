import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Configurar cliente Gemini com API Key
const genAI = new GoogleGenerativeAI({ apiKey: process.env.GEMINI_API_KEY });
const model = genAI.getGenerativeModel({ model: process.env.MODEL_ID });

// Rota de chat
app.post('/api/chat', async (req, res) => {
  try {
    const userMessage = req.body.mensagem;

    const prompt = `
Tu és a SoundIA 🧠, uma inteligência artificial que ensina bateria de forma divertida, simples e educativa.
Responde com entusiasmo e dicas práticas de música.

Pergunta do aluno: ${userMessage}
    `;

    // Chamada para gerar conteúdo
    const result = await model.generateContent({
      request: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    // Extrair texto da resposta
    const resposta = result.output[0].content[0].text || "Não consegui gerar uma resposta 😢";

    res.json({ resposta });
  } catch (erro) {
    console.error('❌ ERRO DETALHADO:', erro);
    res.status(500).json({ resposta: 'Ocorreu um erro ao processar sua mensagem 😢' });
  }
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Servidor Gemini rodando em http://localhost:${PORT}`));
