const form = document.getElementById("formLogin");

form.addEventListener("submit", function (event) {
  event.preventDefault(); // impede o reload da página

  const email = document.getElementById("emailLogin").value;
  const senha = document.getElementById("senhaLogin").value;

  console.log("Email:", email);
  console.log("Senha:", senha);
});

const form1 = document.getElementById("formCadastro");

form1.addEventListener("submit", function (event) {
  event.preventDefault();

  const nome = document.getElementById("nomeCadastro").value;
  const email = document.getElementById("emailCadastro").value;
  const senha = document.getElementById("senhaCadastro").value;

  console.log("Nome:", nome);
  console.log("Email:", email);
  console.log("Senha:", senha);
});
