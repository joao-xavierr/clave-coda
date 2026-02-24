import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import sqlite3 from "sqlite3";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ClientGemini } from "./client.js";

dotenv.config();
const app = express();
app.use(cors({
  origin: "http://127.0.0.1:5500", // ou http://localhost:5500
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}));

app.use(bodyParser.json());


const db = new sqlite3.Database("./usuarios.db", (err) => {
  if (err) console.error("Erro ao conectar com o banco:", err);
  else console.log("🗃️ Banco SQLite conectado.");
});

db.run(`
  CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    senha TEXT NOT NULL
  )
`);



// ======== ROTAS DE AUTENTICAÇÃO ========

// Registrar novo usuário
app.post("/api/register", (req, res) => {
  const { nome, email, senha } = req.body;
  if (!nome || !email || !senha) return res.status(400).json({ error: "Preencha todos os campos." });

  const senhaHash = bcrypt.hashSync(senha, 10);

  db.run(
    "INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)",
    [nome, email, senhaHash],
    function (err) {
      if (err) {
        console.error(err);
        return res.status(400).json({ error: "Email já cadastrado ou erro no registro." });
      }
      res.json({ success: true, message: "Usuário registrado com sucesso!" });
    }
  );
});

// Login
app.post("/api/login", (req, res) => {
  const { email, senha } = req.body;
  if (!email || !senha) return res.status(400).json({ error: "Preencha todos os campos." });

  db.get("SELECT * FROM usuarios WHERE email = ?", [email], (err, user) => {
    if (err) return res.status(500).json({ error: "Erro no servidor." });
    if (!user) return res.status(404).json({ error: "Usuário não encontrado." });

    const senhaCorreta = bcrypt.compareSync(senha, user.senha);
    if (!senhaCorreta) return res.status(401).json({ error: "Senha incorreta." });

    const token = jwt.sign({ id: user.id, nome: user.nome }, process.env.JWT_SECRET || "segredo", {
      expiresIn: "2h",
    });

    res.json({ success: true, token, nome: user.nome });
  });
});

// ======== ROTA DO GEMINI ========
app.post("/api/gemini", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: "Campo 'prompt' é obrigatório." });

    const resposta = await ClientGemini(prompt);
    res.json({ resposta });
  } catch (error) {
    console.error("Erro ao processar solicitação:", error);
    res.status(500).json({ error: "Erro ao processar a solicitação." });
  }
});

// ======== INICIAR SERVIDOR ========
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(` Servidor rodando em http://localhost:${PORT}`));
