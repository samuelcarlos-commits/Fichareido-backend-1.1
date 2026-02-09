const express = require("express");
const pool = require("../database/connection");

const router = express.Router();

router.post("/", async (req, res) => {
  const { criador_id, sistema, nome, descricao, campos } = req.body;

  // DEBUG ESSENCIAL
  console.log("REQ BODY:", req.body);

  // validação mínima (evita insert inútil)
  if (!criador_id || !sistema || !nome || !Array.isArray(campos)) {
    return res.status(400).json({ erro: "Dados inválidos ou incompletos" });
  }

  try {
    // 0. Verifica se o usuário existe (FK safety)
    const userCheck = await pool.query(
      "SELECT id FROM usuarios WHERE id = $1",
      [criador_id],
    );

    if (userCheck.rowCount === 0) {
      return res.status(400).json({ erro: "Usuário criador não existe" });
    }

    // 1. Cria o modelo de ficha
    const modeloResult = await pool.query(
      `
      INSERT INTO modelos_ficha (sistema, nome, descricao, criador_id)
      VALUES ($1, $2, $3, $4)
      RETURNING id
      `,
      [sistema, nome, descricao || null, criador_id],
    );

    const modeloId = modeloResult.rows[0].id;

    // 2. Processa os campos
    for (const campo of campos) {
      if (!campo.nome || !campo.tipo) continue;

      // tenta criar o campo
      const campoResult = await pool.query(
        `
        INSERT INTO campos (nome, tipo)
        VALUES ($1, $2)
        ON CONFLICT (nome) DO NOTHING
        RETURNING id
        `,
        [campo.nome, campo.tipo],
      );

      // se já existia, busca o id
      let campoId;
      if (campoResult.rowCount > 0) {
        campoId = campoResult.rows[0].id;
      } else {
        const campoExistente = await pool.query(
          "SELECT id FROM campos WHERE nome = $1",
          [campo.nome],
        );
        campoId = campoExistente.rows[0].id;
      }

      // 3. Relaciona campo ao modelo
      await pool.query(
        `
        INSERT INTO modelos_campos (modelo_id, campo_id)
        VALUES ($1, $2)
        ON CONFLICT DO NOTHING
        `,
        [modeloId, campoId],
      );
    }

    return res.status(201).json({
      mensagem: "Modelo criado com sucesso",
      modelo_id: modeloId,
    });
  } catch (err) {
    console.error("ERRO AO CRIAR MODELO:", err);
    return res.status(500).json({ erro: "Erro interno ao criar modelo" });
  }
});

module.exports = router;
