const params = new URLSearchParams(window.location.search);
const modeloId = params.get("id");
document.addEventListener("DOMContentLoaded", () => {
  const paginaFicha = document.getElementById("pagina-ficha");

  const params = new URLSearchParams(window.location.search);
  const modeloId = params.get("id");

  if (!modeloId) {
    paginaFicha.innerHTML = "<p class='text-danger'>Modelo não informado.</p>";
    return;
  }

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
            name="${campo.nome}"
          >
        `;

        paginaFicha.appendChild(div);
      });
    })
    .catch((err) => {
      console.error(err);
      paginaFicha.innerHTML =
        "<p class='text-danger'>Erro ao carregar modelo.</p>";
    });
});

fetch(`http://localhost:3000/modelos/${modeloId}`)
  .then((res) => res.json())
  .then((modelo) => {
    const container = document.getElementById("pagina-ficha");

    document.getElementById("titulo").textContent = modelo.nome;

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

      container.appendChild(div);
    });
  });
