/**
 *preload.js - usado no framework electron para umentar a segurança e o desempenho
 */
 
//perite estabelcer uma conexao entre processos, [main.js e renderer.js (lembrar da imagem do professor)]
//vamos usar para uma conexao de 2 vias
//coontextBridge: permissoes de comunicaçao entre processos usando a api do electron
const { ipcRenderer, contextBridge } = require("electron")

//enviar uma mensagem para o main.js estabelcer uma conexao com o banco de dados quando inciiar a apluicaçao
ipcRenderer.send('db-connect')

//permissao para estabelecer a comunicaçao 
contextBridge.exposeInMainWorld('api', {
    dbStatus: (message) => ipcRenderer.on('db-status', message)
})
