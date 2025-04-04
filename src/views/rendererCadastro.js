//const {cadastroWindow} = require('../../main')

btnCreate.disabled = true

const foco = document.getElementById("buscarCli");
document.addEventListener("DOMContentLoaded", () => {
  //barra na busca do cliente
  foco.focus();
  //desativar os botoes
  btnUpdate.disabled = true;
  btnDelete.disabled = true;
});

function resetForm() {
  //recarrega a pagina
  location.reload();
}

function resetCpf() {
  const cpfFoco = document.getElementById("cadCpf");
  cpfFoco.focus()
  cpfFoco.value = ""

 
}

api.resetCpf((args) => {
  resetCpf();
} );

//uso da api para resetar quando salvar, editar, sair e excluir um cliente
api.resetForm((args) => {});

function buscarEndereco() {
  let cep = document.getElementById("cadCep").value;
  let urlAPI = `https://viacep.com.br/ws/${cep}/json/`;
  fetch(urlAPI)
    .then((response) => response.json()) // Corrigido o nome da variável para 'response'
    .then((dados) => {
      document.getElementById("cadLogra").value = dados.logradouro;
      document.getElementById("cadBairro").value = dados.bairro;
      document.getElementById("cadCid").value = dados.localidade;
      document.getElementById("cadUf").value = dados.uf;
      document.getElementById("cadComp").value = dados.complemento;
    })
    .catch((error) => console.error("Erro ao buscar o endereço:", error));
}

// Validar CPF
function validaCPF(cpf) {
  cpf = cpf.replace(/\D/g, ""); // Remove caracteres não numéricos

  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
    return false; // Verifica se tem 11 dígitos e se não é uma sequência repetida (ex: 111.111.111-11)
  }

  // Validação do primeiro dígito verificador
  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(cpf[i]) * (10 - i);
  }
  let resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf[9])) return false;

  // Validação do segundo dígito verificador
  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cpf[i]) * (11 - i);
  }
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf[10])) return false;
  return true;
}

// Checar CPF
function testaCPF() {
  let inputCPF = document.getElementById("cadCpf");
  let cpfNotificacao = document.getElementById("cpfNotificacao");
  if (!validaCPF(inputCPF.value)) {
    cpfNotificacao.style.display = "block"; // Mostra o popup
    btnCreate.disabled = true
    
  } else {
    cpfNotificacao.style.display = "none"; // Esconde o popup
    btnCreate.disabled = false
  }
}

//fluxo
let frmCadastro = document.getElementById("frmCadastro");
//abaixo os let('S) com os campos (nome, idade...) com os id's que deve ser colocado em cada linha do html cadastro, exemplo em notes do sticky notes.
//====
let cadEmail = document.getElementById("cadEmail");
let cadTel = document.getElementById("cadTel");
let cadNome = document.getElementById("cadNome");
let cadCpf = document.getElementById("cadCpf");
let cadSexo = document.getElementById("cadSexo");
let cadCep = document.getElementById("cadCep");
let cadBairro = document.getElementById("cadBairro");
let cadNumb = document.getElementById("cadNumb");
let cadComp = document.getElementById("cadComp");
let cadUf = document.getElementById("cadUf");
let cadCid = document.getElementById("cadCid");

//====

//crud create - inicio
frmCadastro.addEventListener("submit", async (event) => {
  event.preventDefault();
  console.log(
    cadEmail.value,
    cadTel.value,
    cadNome.value,
    cadCpf.value,
    cadSexo.value
  );
  const cadastroCliente = {
    gmailCli: cadEmail.value,
    telCli: cadTel.value,
    cpfCli: cadCpf.value,
    nomeCli: cadNome.value,
    sexoCli: cadSexo.value,
    cepCli: cadCep.value,
    bairroCli: cadBairro.value,
    numCli: cadNumb.value,
    compCli: cadComp.value,
    ufCli: cadUf.value,
    cidCli: cadCid.value,
  };
  api.cadastroBanco(cadastroCliente);
});

//crud create - fim
