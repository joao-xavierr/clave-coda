import express from 'express';
import dotenv from 'dotenv';
import ClientGemini from './client.js';

dotenv.config(); // Inicializa as variáveis de ambiente

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.post('/generate', async (req, res) => {
  const { prompt } = req.body;
  try {
    const response = await ClientGemini(prompt);
    res.json({ response });
  } catch (error) {
    console.error(error); // Para debugar erros reais
    res.status(500).json({ error: 'Não conseguimos gerar a resposta' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
