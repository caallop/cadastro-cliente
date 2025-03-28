console.log("electron processo principal")
const { Menu, shell, nativeTheme, ipcMain, app, BrowserWindow } = require('electron/main')
// importaçao dos recursos do framekwork
// Ativar o preload

const clientModel = require ('./src/models/Client.js')

const path = require('node:path')
const { conectar, desconectar } = require('./database.js')
const { NOMEM } = require('node:dns')
//app se refere a aplicaçao
//browsewindow (criaçao da janela)
//nativeTheme (denfinir tema claro ou escuro)
const createWindow = () => {
  //janela principal
  let win
  win = new BrowserWindow({
    //nativeTheme.themeSource = 'dark',
    //1010
    width: 800,
    //720 (exemplos para mexer na altura e largura)
    height: 600,
    //fullscrean//dxa em tela cheia
    // resizable: false, //mudar tamanho?
    // minimizable: true, //minizavel?
    //closable: true, //fechavel?
    // fullscreen: false, //tela cheia?
    // autoHideMenuBar: true, //menu bar escondida?
    //frame: true, //tira TUDO
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })
  //carregr o menu personalizado
  //atençao antes de importar o recurso menu
  Menu.setApplicationMenu(Menu.buildFromTemplate(template))


  //carrega o documento
  win.loadFile('./src/views/index.html')
}
//inicializaçao da aplicaçao (assincronismo)


function cadastroWindow() {
  nativeTheme.themeSource = 'light'
  // Obter a janela principal
  const mainWindow = BrowserWindow.getFocusedWindow()
  //validação (se existir a janela principal)
  if (mainWindow) {
    about = new BrowserWindow({
      width: 1020,
      height: 580,
      autoHideMenuBar: true,
      resizable: false,
      minimizable: false,
      // Estabelecer uma relação hierarquica entre janelas
      parent: mainWindow,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js')
      }
    })
  }
  about.loadFile('./src/views/cadastro.html')
}
//janela sobre
let about
function aboutWindows() {
  nativeTheme.themeSource = 'system'
  const mainwindow = BrowserWindow.getFocusedWindow()
  //vlidaçao de: se existir a janela princial
  if (mainwindow) {
    about = new BrowserWindow({
      width: 500,
      height: 320,
      autoHideMenuBar: true,
      resizable: false,
      minimizable: false,
      //estabelcer uma relaçao hieraquica entre janelas
      parent: mainwindow,
      modal: true
    })
    about.loadFile("./src/views/sobre.html")
  }
}
app.on('before-quit', async () => {
  await desconectar()
})
//se o sistema não for mac, fechar as janelas quanto encerrar a aplicaçao quando a janeçla for fechada
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
app.commandLine.appendSwitch('log-level', '3')
//abrir janela pelo botao 

app.whenReady().then(() => {
  createWindow()
  ipcMain.on('db-connect', async (event) => {
    //a linha abaixo estabelece a conexao com o banco de dados
    await conectar()
    //await conectar()
    //enviar ao renderizador uma mensagem para trocar de imagem do icone de status do banco de dados (criar um dlay de 0.5 ou 1 seg para sincronizaçao com a nuvem)
    setTimeout(() => {
      event.reply('db-status', "conectado")
    }, 500) //500ms = 0.5 seg
  })
  //só ativar a janela se nenhuma outra estiver ativa
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})
ipcMain.on('open-client', (event) => {
  cadastroWindow()
})

//template do menu
const template = [
  {
    label: 'Criar cadastro',
    //qnd vc clicar no notas vai aparecer aqla telinha com varias opçies
    submenu: [
      {
        label: 'criar cadastro (botao temporario)',
        click: () => cadastroWindow()
      },
      {
        label: 'Sair',
        acelerator: 'Alt+F4',
        click: () => app.quit()
      }
    ]
  },
  {
    label: 'Relatório',
    submenu: [
      {
        label: "Clientes"
      }
    ]
  },
  {
    label: 'Ferramentas',
    submenu: [
      {
        label: 'aplicar zoom',
        role: 'zoomIn'
        //ou control+ ++
      },
      {
        label: "tirar zoom",
        role: "zoomOut"
      },
      //ou ctrl + --
      {
        label: "restaurar o zoom padrao",
        role: "resetZoom"
      },
      {
        type: "separator"
      },
      {
        label: 'DevTools',
        role: 'toggleDevTools',
      },
      {
        label: 'recarregar',
        role: 'reload'
      }
    ]
  },

  {
    label: 'Ajuda',
    submenu: [
      {
        label: 'repositorio',
        click: () => shell.openExternal("https://github.com/caallop/atividade-1.git")
      },
      {
        label: 'sobre',
        click: () => aboutWindows()
      }

    ]
  }
]
module.exports = { cadastroWindow }

ipcMain.on('cadastrar-cliente', async(event, cadastroCliente)=>{
  console.log(cadastroCliente)

  const newClient = clientModel ({
    gmail: cadastroCliente.gmailCli,
    telefone:cadastroCliente.telCli,
    cpf: cadastroCliente.cpfCli,
    nome: cadastroCliente.nomeCli,
    sexo: cadastroCliente.sexoCli,
    cep: cadastroCliente.cepCli,
    bairro: cadastroCliente.bairroCli,
    numero: cadastroCliente.numCli,
    complemento: cadastroCliente.compCli,
    estado: cadastroCliente.ufCli,
    cidade: cadastroCliente.cidCli
  })
  newClient.save()
})