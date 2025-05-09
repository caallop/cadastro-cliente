//const {cadastroWindow} = require('../../main')

//fluxo
let frmCadastro = document.getElementById("frmCadastro");
//abaixo os let('S) com os campos (nome, idade...) com os id's que deve ser colocado em cada linha do html cadastro, exemplo em notes do sticky notes.
//====
let frmSearchClient = document.getElementById("frmSearchClient");
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
let cadLogra = document.getElementById("cadLogra");
let IdCliente = document.getElementById("id");

const foco = document.getElementById("buscarCli");

//criar um vetor global para manipular os dados do cliente
let arrayClient = [];

document.addEventListener("DOMContentLoaded", () => {
  //barra na busca do cliente
  foco.focus();
  //desativar os botoes
  btnCreate.disabled = false;
  btnUpdate.disabled = true;
  btnDelete.disabled = true;
});

function resetForm() {
  //recarrega a pagina
  location.reload();
}

function resetCpf() {
  const cpfFoco = document.getElementById("cadCpf");
  cpfFoco.focus();
  cpfFoco.value = "";
}

api.resetCpf((args) => {
  resetCpf();
});

//uso da api para resetar quando salvar, editar, sair e excluir um cliente
api.resetForm((args) => {
  resetForm();
});

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

    cadCpf.classList.remove("is-valid");
    cadCpf.classList.add("is-invalid");
  } else {
    cpfNotificacao.style.display = "none"; // Esconde o popup
    cadCpf.classList.remove("is-invalid");
    cadCpf.classList.add("is-valid");
  }
}

//====

//crud create - inicio
frmCadastro.addEventListener("submit", async (event) => {
  event.preventDefault();

  //estrategia para usar o submit para cadastras um novo cliente ou editar os dados de um cliente já existente
  //verificar a existencia do cliente
  if (IdCliente.value === "") {
    //cadastrar um novo cliente
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
      lograCli: cadLogra.value,
    };
    api.cadastroBanco(cadastroCliente);
  } else {
    //alterar os dados de um cliente existente
    const cadastroCliente = {
      idCli: IdCliente.value,
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
      lograCli: cadLogra.value,

    
    };
      //mandar o cliente pro birigubeigos
      
    api.updateClient(cadastroCliente)
  }
});

//crud create - fim

//================================================================================
//======================= MANIPULAÇAO DO BOTAO ENTER =============================
function teclaEnter(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    searchClient();
  }
}

frmSearchClient.addEventListener("keydown", teclaEnter);


function restaurarEnter() {
  frmSearchClient.removeEventListener("keydown", teclaEnter);
}
//======================= MANIPULAÇAO DO BOTAO ENTER =============================
//================================================================================

//================================================================================
//=========================== CRUD READ- INICIO ==================================

//setar o noem do cliente para fazer um novo cadastro se a vbusca retornar que o cliente deseja cadastras um novo cliente ocm o alert

api.setName((args) => {
  console.log(
    "meu deus meu senhor me ajdua por favor é no trabalaho na esocla ou faukdad"
  );
  // "recortar" o nome da busca e salovar e setar o nome do form
  let busca = document.getElementById("buscarCli").value;
  //focar no campo nome
  cadNome.focus();
  //copiar o nome do cliente para o campo nome
  cadNome.value = foco.value;
  //limpar o campo de busca

  foco.value = "";
});
//=====================================================================================================================
api.setCpf((args) => {
  console.log(
    "meu deus meu senhor me ajdua por favor é no trabalaho na esocla ou faukdad"
  );
  // "recortar" o nome da busca e salovar e setar o nome do form
  let busca = document.getElementById("buscarCli").value;
  //focar no campo nome
  cadCpf.focus();
  console.log(busca);
  let valorBusca = foco.value;
  console.log(valorBusca);
  //copiar o nome do cliente para o campo nome
  cadCpf.value = foco.value;
  console.log(valorBusca);
  //limpar o campo de busca

  foco.value = "";
});

function searchClient() {
  //console.log("teste do botão buscar");
  //passo 1 - pega os nome pra buscar
  let nomeCli = document.getElementById("buscarCli").value;
  let cpfCli = document.getElementById("buscarCli").value;
  const temNumero = /\d+/.test(foco.value);
  console.log(`${temNumero} acho que ta certo `);
  if (foco.value === "") {
    //enviar ao main um pedido para alertar o usuario
    api.validarBusca();
  } else if (temNumero === true) {
    console.log("teste 123213");
    api.searchCpf(cpfCli);
    api.renderCpf((event, clientCPF) => {
      console.log("chegou o cpf do cliente aq no renderer dnv");
      console.log(clientCPF);
      const clientDataCPF = JSON.parse(clientCPF);
      arrayClient = clientDataCPF;
      //uso do laço foreach para percorrer o vetor e extrair os dados
      arrayClient.forEach((c) => {
        IdCliente.value = c._id;
        cadNome.value = c.nome;
        cadEmail.value = c.gmail;
        cadTel.value = c.telefone;
        cadCpf.value = c.cpf;
        cadSexo.value = c.sexo;
        cadCep.value = c.cep;
        cadBairro.value = c.bairro;
        cadNumb.value = c.numero;
        cadComp.value = c.complemento;
        cadUf.value = c.estado;
        cadCid.value = c.cidade;
        cadLogra.value = c.logradouro;

        restaurarEnter();
        btnCreate.disabled = true;
        btnDelete.disabled = false;
        btnUpdate.disabled = false;
      });
    });
  } else {
    api.searchName(nomeCli);
    api.renderClient((event, client) => {
      console.log("teste");
      console.log(client);

      //passo 6- cobverter os dados de string para json. renderizaçao dos dados para o html
      const clientData = JSON.parse(client);
      arrayClient = clientData;
      //uso do laço foreach para percorrer o vetor e extrair os dados
      arrayClient.forEach((c) => {
        IdCliente.value = c._id;
        cadNome.value = c.nome;
        cadEmail.value = c.gmail;
        cadTel.value = c.telefone;
        cadCpf.value = c.cpf;
        cadSexo.value = c.sexo;
        cadCep.value = c.cep;
        cadBairro.value = c.bairro;
        cadNumb.value = c.numero;
        cadComp.value = c.complemento;
        cadUf.value = c.estado;
        cadCid.value = c.cidade;
        cadLogra.value = c.logradouro;
        restaurarEnter();
        btnCreate.disabled = true;
        btnDelete.disabled = false;
        btnUpdate.disabled = false;
      });
    });
  }
}
//=========================== CRUD READ- FIM =====================================
//================================================================================

//================================================================================
//=========================== CRUD DELETE- FIM ===================================
function removeClient() {
  //console.log("teste1")
  //recebimento e envio do id para o main
  api.deleteClient(IdCliente.value);
}

//=========================== CRUD DELETE- FIM ===================================
//================================================================================

