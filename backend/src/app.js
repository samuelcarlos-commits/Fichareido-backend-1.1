const express = require("express");
const cors = require("cors");

const usuariosRoutes = require("./routes/usuarios");
const modelosRoutes = require("./routes/modelos");
const app = express();

app.use(cors());
app.use(express.json());

// rotas mega importantes para eu não me explodir
app.get("/", (req, res) => {
  res.send("Servidor rodando porra");
});

app.use("/modelos", modelosRoutes);
app.use("/usuarios", usuariosRoutes);
app.use("/fichas", require("./routes/fichas"));

// servidor
app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});
