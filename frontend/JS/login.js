const form = document.getElementById("formLogin");

form.addEventListener("submit", function (event) {
  event.preventDefault(); // impede o reload da página

  const email = document.getElementById("emailLogin").value;
  const senha = document.getElementById("senhaLogin").value;

  console.log("Email:", email);
  console.log("Senha:", senha);
});

const formCadastro = document.getElementById("formCadastro");

formCadastro.addEventListener("submit", async function (event) {
  event.preventDefault();

  const nome = document.getElementById("nomeCadastro").value;
  const email = document.getElementById("emailCadastro").value;
  const senha = document.getElementById("senhaCadastro").value;

  try {
    const resposta = await fetch("http://localhost:3000/usuarios", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nome,
        email,
        senha,
      }),
    });

    const dados = await resposta.json();

    if (!resposta.ok) {
      alert(dados.erro || "Erro ao cadastrar usuário");
      return;
    }

    alert("Usuário cadastrado com sucesso!");
    formCadastro.reset();
  } catch (erro) {
    console.error(erro);
    alert("Erro de conexão com o servidor");
  }
});
