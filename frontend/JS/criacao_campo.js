document.addEventListener("DOMContentLoaded", () => {
  const paginaFicha = document.getElementById("pagina-ficha");
  const nomeCampo = document.getElementById("nomeCampo");

  const params = new URLSearchParams(window.location.search);
  const modeloId = params.get("id");

  const btnTexto = document.getElementById("campoTexto");
  const btnNumero = document.getElementById("campoNumero");
  const btnSalvar = document.getElementById("btnSalvar");

  // MODO VISUALIZAÇÃO
  if (modeloId) {
    fetch(`http://localhost:3000/modelos/${modeloId}`)
      .then((res) => res.json())
      .then((modelo) => {
        paginaFicha.innerHTML = "";

        modelo.campos.forEach((campo) => {
          const div = document.createElement("div");
          div.classList.add("mb-3");

          div.innerHTML = `
            <label class="form-label">${campo.nome}</label>
            <input
              type="${campo.tipo}"
              class="form-control"
              disabled
            >
          `;

          paginaFicha.appendChild(div);
        });

        // trava edição
        btnSalvar.disabled = true;
        nomeCampo.disabled = true;
      });

    return;
  }

  btnSalvar.addEventListener("click", () => {
    const campos = [];

    const blocos = paginaFicha.querySelectorAll(".mb-3");

    blocos.forEach((bloco, index) => {
      const label = bloco.querySelector("label");
      const input = bloco.querySelector("input");

      if (!label || !input) return;

      campos.push({
        nome: label.textContent.trim(),
        tipo: input.type,
        ordem: index + 1,
        obrigatorio: input.hasAttribute("required"),
      });
    });

    const dados = {
      criador_id: 1,
      sistema: "Sistema Teste",
      nome: "Modelo Teste",
      descricao: "Criado pelo front",
      campos,
    };

    fetch("http://localhost:3000/modelos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados),
    })
      .then((res) => res.json())
      .then(() => alert("Modelo criado com sucesso!"))
      .catch(() => alert("Erro ao criar modelo"));
  });

  function criarCampo(tipo) {
    const nome = nomeCampo.value.trim();
    if (!nome) return alert("Digite o nome do campo");

    const campo = document.createElement("div");
    campo.classList.add("mb-3");

    campo.innerHTML = `
      <label class="form-label">${nome}</label>
      <input type="${tipo}" class="form-control">
    `;

    paginaFicha.appendChild(campo);
    nomeCampo.value = "";

    bootstrap.Modal.getInstance(document.getElementById("modalCampo")).hide();
  }

  btnTexto.addEventListener("click", () => criarCampo("text"));
  btnNumero.addEventListener("click", () => criarCampo("number"));
});
