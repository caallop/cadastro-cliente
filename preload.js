/**
 *preload.js - usado no framework electron para umentar a segurança e o desempenho
 */

//perite estabelcer uma conexao entre processos, [main.js e renderer.js (lembrar da imagem do professor)]
//vamos usar para uma conexao de 2 vias
//coontextBridge: permissoes de comunicaçao entre processos usando a api do electron
const { ipcRenderer, contextBridge } = require("electron");

//enviar uma mensagem para o main.js estabelcer uma conexao com o banco de dados quando inciiar a apluicaçao
ipcRenderer.send("db-connect");

//permissao para estabelecer a comunicaçao
contextBridge.exposeInMainWorld("api", {
  dbStatus: (message) => ipcRenderer.on("db-status", message),
  openClient: () => ipcRenderer.send("open-client"),
  cadastroBanco: (cadastroCliente) => ipcRenderer.send("cadastrar-cliente", cadastroCliente),
  resetCpf: (args) => ipcRenderer.on("reset-Cpf", args),
  resetForm: (args) => ipcRenderer.on("reset-form", args),
  searchName: (nomeCli) => ipcRenderer.send('search-name', nomeCli),
  renderClient: (client) => ipcRenderer.on('render-client', client),
  validarBusca: () => ipcRenderer.send('validar-busca'),
  setName: (args) => ipcRenderer.on('set-name', args),
  searchCpf:(cpfCli) => ipcRenderer.send('search-cpf', cpfCli),
  renderCpf:(clientCPF) => ipcRenderer.on("render-clientCPF", clientCPF),
  setCpf:(args) => ipcRenderer.on('set-cpf', args),
});
