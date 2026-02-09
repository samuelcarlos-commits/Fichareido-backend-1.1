const express = require("express");
const bcrypt = require("bcrypt");
const pool = require("../database/connection");

const router = express.Router();

// GET - listar usuários (debug / teste)
router.get("/", async (req, res) => {
  const result = await pool.query(
    "SELECT id, nome, email, role, data_criacao FROM usuarios",
  );
  res.json(result.rows);
});

// POST - criar usuário
router.post("/", async (req, res) => {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res
      .status(400)
      .json({ erro: "Nome, email e senha são obrigatórios" });
  }

  try {
    const senha_hash = await bcrypt.hash(senha, 10);

    const resultado = await pool.query(
      `INSERT INTO usuarios (nome, email, senha_hash)
       VALUES ($1, $2, $3)
       RETURNING id, nome, email, role, data_criacao`,
      [nome, email, senha_hash],
    );

    res.status(201).json(resultado.rows[0]);
  } catch (erro) {
    if (erro.code === "23505") {
      return res.status(409).json({ erro: "Email já cadastrado" });
    }

    console.error(erro);
    res.status(500).json({ erro: "Erro ao criar usuário" });
  }
});

module.exports = router;
