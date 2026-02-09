document.addEventListener("DOMContentLoaded", () => {
  carregarModelos();
});

async function carregarModelos() {
  try {
    const container = document.getElementById("lista-modelos");

    if (!container) {
      console.error("Container #lista-modelos não encontrado");
      return;
    }

    const resposta = await fetch("http://localhost:3000/modelos");

    if (!resposta.ok) {
      throw new Error(`Erro HTTP: ${resposta.status}`);
    }

    const modelos = await resposta.json();

    container.innerHTML = "";

    if (modelos.length === 0) {
      container.innerHTML =
        "<p class='text-muted'>Nenhum modelo encontrado.</p>";
      return;
    }

    modelos.forEach((modelo) => {
      const coluna = document.createElement("div");
      coluna.className = "col-md-4";

      coluna.innerHTML = `
        <div class="card bg-secondary text-light h-100">
          <div class="card-body">
            <h5 class="card-title">${modelo.sistema}</h5>
            <h6 class="card-subtitle mb-2 text-muted">${modelo.nome}</h6>
            <p class="card-text">${modelo.descricao ?? "Sem descrição"}</p>
            <a href="VisualizarFicha.html?id=${modelo.id}" class="btn btn-primary">
              Usar modelo
            </a>
          </div>
        </div>
      `;

      container.appendChild(coluna);
    });
  } catch (err) {
    console.error("Erro ao carregar modelos:", err);
  }
}
