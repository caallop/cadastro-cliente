console.log("electron processo principal")

const { Menu, shell, nativeTheme } = require('electron/main')
const { app, BrowserWindow } = require('electron/main')
// importaçao dos recursos do framekwork
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
  })

  //carregr o menu personalizado
  //atençao antes de importar o recurso menu
  Menu.setApplicationMenu(Menu.buildFromTemplate(template))


  //carrega o documento
  win.loadFile('./src/views/index.html')
}
//inicializaçao da aplicaçao (assincronismo)
app.whenReady().then(() => {
  createWindow()
  //só ativar a janela se nenhuma outra estiver ativa
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

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
      
      //
      modal: true
    })
    about.loadFile("./src/views/sobre.html")
  }
}





//se o sistema não for mac, fechar as janelas quanto encerrar a aplicaçao quando a janeçla for fechada
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.commandLine.appendSwitch('log-level', '3')

//template do menu
const template = [
  {
    label: 'Criar cadastro',
    //qnd vc clicar no notas vai aparecer aqla telinha com varias opçies
    submenu: [
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