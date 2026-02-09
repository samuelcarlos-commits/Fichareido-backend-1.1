const express = require("express");
const pool = require("../database/connection");

const router = express.Router();

/* LISTAR MODELOS */
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, sistema, nome, descricao
      FROM modelos_ficha
      ORDER BY id DESC
    `);

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao buscar modelos" });
  }
});

/* BUSCAR MODELO COM CAMPOS */
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const modeloResult = await pool.query(
      `SELECT id, sistema, nome, descricao
       FROM modelos_ficha
       WHERE id = $1`,
      [id],
    );

    if (modeloResult.rows.length === 0) {
      return res.status(404).json({ erro: "Modelo não encontrado" });
    }

    const camposResult = await pool.query(
      `SELECT c.nome, c.tipo, c.obrigatorio
       FROM campos c
       JOIN modelos_campos mc ON mc.campo_id = c.id
       WHERE mc.modelo_id = $1
       ORDER BY c.id`,
      [id],
    );

    res.json({
      ...modeloResult.rows[0],
      campos: camposResult.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao buscar modelo" });
  }
});

/* CRIAR MODELO */
router.post("/", async (req, res) => {
  const { criador_id, sistema, nome, descricao, campos } = req.body;

  try {
    const modeloResult = await pool.query(
      `INSERT INTO modelos_ficha (sistema, nome, descricao, criador_id)
       VALUES ($1, $2, $3, $4)
       RETURNING id`,
      [sistema, nome, descricao, criador_id],
    );

    const modeloId = modeloResult.rows[0].id;

    for (const campo of campos) {
      const campoResult = await pool.query(
        `INSERT INTO campos (nome, tipo, obrigatorio)
     VALUES ($1, $2, $3)
     RETURNING id`,
        [campo.nome, campo.tipo, campo.obrigatorio ?? false],
      );

      const campoId = campoResult.rows[0].id;

      await pool.query(
        `INSERT INTO modelos_campos (modelo_id, campo_id)
     VALUES ($1, $2)`,
        [modeloId, campoId],
      );
    }

    res.status(201).json({ modelo_id: modeloId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao criar modelo" });
  }
});

module.exports = router;
