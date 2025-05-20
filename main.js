const {
  Menu,
  shell,
  nativeTheme,
  ipcMain,
  app,
  BrowserWindow,
  dialog,
} = require("electron/main");
//dialog: é o modulo electron para ativar caixa de mensagens
// importaçao dos recursos do framekwork
// Ativar o preload

//shell: acessar links e aplicações externos

const clientModel = require("./src/models/Client.js");

const path = require("node:path");
const { conectar, desconectar } = require("./database.js");
const { NOMEM } = require("node:dns");
const { error } = require("node:console");

//importaçao da biblioteca nativa do javascript para manipular arquivos
const fs = require("fs");

//importaçao do pacote jspdf (biblioteca para trabalhar com arquivos pdf) npm install jspdf

const { jspdf, default: jsPDF } = require("jspdf");
//app se refere a aplicaçao
//browsewindow (criaçao da janela)
//nativeTheme (denfinir tema claro ou escuro)
const createWindow = () => {
  //janela principal
  let win;
  win = new BrowserWindow({
    //nativeTheme.themeSource = 'dark',
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });
  //carregr o menu personalizado
  //atençao antes de importar o recurso menu
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));

  //carrega o documento
  win.loadFile("./src/views/index.html");
};
//inicializaçao da aplicaçao (assincronismo)

function itensWindow() {
  nativeTheme.themeSource = "light";
  // Obter a janela principal
  const mainWindow = BrowserWindow.getFocusedWindow();
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
        preload: path.join(__dirname, "preload.js"),
      },
    });
  }
  about.loadFile("./src/views/itens.html");
}

function cadastroWindow() {
  nativeTheme.themeSource = "light";
  // Obter a janela principal
  const mainWindow = BrowserWindow.getFocusedWindow();
  //validação (se existir a janela principal)
  if (mainWindow) {
    about = new BrowserWindow({
      width: 1020,
      height: 520,
      autoHideMenuBar: true,
      resizable: false,
      minimizable: false,
      // Estabelecer uma relação hierarquica entre janelas
      parent: mainWindow,
      webPreferences: {
        preload: path.join(__dirname, "preload.js"),
      },
    });
  }
  about.loadFile("./src/views/cadastro.html");
}
//janela sobre
let about;
function aboutWindows() {
  nativeTheme.themeSource = "system";
  const mainwindow = BrowserWindow.getFocusedWindow();
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
      modal: true,
    });
    about.loadFile("./src/views/sobre.html");
  }
}
app.on("before-quit", async () => {
  await desconectar();
});
//se o sistema não for mac, fechar as janelas quanto encerrar a aplicaçao quando a janeçla for fechada
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
app.commandLine.appendSwitch("log-level", "3");
//abrir janela pelo botao

app.whenReady().then(() => {
  createWindow();
  ipcMain.on("db-connect", async (event) => {
    //a linha abaixo estabelece a conexao com o banco de dados
    await conectar();
    //await conectar()
    //enviar ao renderizador uma mensagem para trocar de imagem do icone de status do banco de dados (criar um dlay de 0.5 ou 1 seg para sincronizaçao com a nuvem)
    setTimeout(() => {
      event.reply("db-status", "conectado");
    }, 500); //500ms = 0.5 seg
  });
  //só ativar a janela se nenhuma outra estiver ativa
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});
ipcMain.on("open-client", (event) => {
  cadastroWindow();
});

//template do menu
const template = [
  {
    label: "Criar cadastro",
    //qnd vc clicar no notas vai aparecer aqla telinha com varias opçies
    submenu: [
      {
        label: "criar cadastro (botao temporario)",
        click: () => itensWindow(),
      },
      {
        label: "Sair",
        acelerator: "Alt+F4",
        click: () => app.quit(),
      },
    ],
  },
  {
    label: "Relatório",
    submenu: [
      {
        label: "Clientes",
        click: () => relatorioClientes(),
      },
    ],
  },
  {
    label: "Ferramentas",
    submenu: [
      {
        label: "aplicar zoom",
        role: "zoomIn",
        //ou control+ ++
      },
      {
        label: "tirar zoom",
        role: "zoomOut",
      },
      //ou ctrl + --
      {
        label: "restaurar o zoom padrao",
        role: "resetZoom",
      },
      {
        type: "separator",
      },
      {
        label: "DevTools",
        role: "toggleDevTools",
      },
      {
        label: "recarregar",
        role: "reload",
      },
    ],
  },

  {
    label: "Ajuda",
    submenu: [
      {
        label: "repositorio",
        click: () =>
          shell.openExternal("https://github.com/caallop/atividade-1.git"),
      },
      {
        label: "sobre",
        click: () => aboutWindows(),
      },
    ],
  },
];
module.exports = { cadastroWindow };

ipcMain.on("cadastrar-cliente", async (event, cadastroCliente) => {

  try {
    const newClient = clientModel({
      gmail: cadastroCliente.gmailCli,
      telefone: cadastroCliente.telCli,
      cpf: cadastroCliente.cpfCli,
      nome: cadastroCliente.nomeCli,
      sexo: cadastroCliente.sexoCli,
      cep: cadastroCliente.cepCli,
      bairro: cadastroCliente.bairroCli,
      numero: cadastroCliente.numCli,
      complemento: cadastroCliente.compCli,
      estado: cadastroCliente.ufCli,
      cidade: cadastroCliente.cidCli,
      logradouro: cadastroCliente.lograCli,
    });
    await newClient.save();
    //confirmaçao do cliente adicionado ao banco (uso do dialog)
    dialog
      .showMessageBox({
        type: "info",
        title: "aviso",
        message: "cliente adicionado com sucesso",
        buttons: ["OK"],
      })
      .then((result) => {
        if (result.response === 0) {
          event.reply("reset-form");
        }
      });
  } catch (error) {
    if (error.code === 11000) {
      dialog
        .showMessageBox({
          type: "error",
          title: "CPF",
          message: "CPF já cadastrado",
          buttons: ["OK"],
        })
        .then((result) => {
          if (result.response === 0) {
            event.reply("reset-Cpf");
          }
        });
    } else {
      console.log(error);
    }
  }
});

//====================================================
// relatorio de clientes inicio ======================

async function relatorioClientes() {
  try {
    //====================================================
    //          configuraçao do documento pdf
    //====================================================
    const doc = new jsPDF("P", "mm", "a4");

    //p (portrait[de pe]) l (landscape)
    //mm (mediçao em milimetros como se ofsse folha de papel)
    //A4(tamanho da "folha") (210mm por 297mm)

    //inserir a data atual no documento
    const dataAtual = new Date().toLocaleDateString("pt-BR");
    //a linha abaixo escreve um texto no documento
    //doc.text() coloca um texto dentro do pdf
    //doc.setFontSize() tamanho da fonte por px
    doc.setFontSize(10);
    doc.text(`Data: ${dataAtual}`, 170, 15); //(x,y (mm))
    doc.setFontSize(18);
    doc.text(`Relatorio De Clientes`, 15, 20);
    doc.setFontSize(12);
    //variavel de apoio
    let y = 40;
    doc.text("Nome", 14, y);
    doc.text("Telefone", 85, y);
    doc.text("E-mail", 130, y);

    y += 5;
    //desenhar ma linha
    doc.setLineWidth(0.5);
    doc.line(10, y, 200, y); //(10(inicio)______________()200)

    //====================================================
    //          configuraçao do documento pdf --fim--
    //====================================================

    //====================================================
    //          obter a listagem de clientes (ordem alfabetica)
    //====================================================

    const clientes = await clientModel.find().sort({ nome: 1 });
    //teste de recebimento
    //console.log(clientes)
    //popular o documento pdf com os lcientes cadastrados

    y += 10;
    clientes.forEach((c) => {
      if (y > 280) {
        doc.addPage();
        y = 20;
        doc.text("Nome", 14, y);
        doc.text("Telefone", 85, y);
        doc.text("E-mail", 130, y);
      }

      doc.text(c.nome, 14, y);
      doc.text(c.telefone, 85, y);
      doc.text(c.gmail, 130, y);
      y += 10;
    });

    //====================================================
    //          obter a listagem de clientes  --fim--
    //====================================================

    //====================================================
    //          obter a listagem de paginas
    //====================================================

    const pages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pages; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.text(`Pagina ${i} de ${pages}`, 105, 290, { align: "center" });
    }
    //====================================================
    //          obter a listagem de paginas  --fim--
    //====================================================

    //====================================================
    //       abrir o arquivo no sistema operacional
    //====================================================
    // Definir o caminho do arquivo temporário e nome do arquivo com extensao .pdf
    const tempDir = app.getPath("temp");
    const filePath = path.join(tempDir, "clientes.pdf");
    // salvar temporariamente o arquivo
    doc.save(filePath);
    // abrir o arquivo no aplicativo padrão de leitura de pdf do computador do usuário
    shell.openPath(filePath);
  } catch (error) {
    console.log(error);
  }
}

//=================================================
// relatorio de clientes fim ======================

//================================================================================
//=========================== CRUD READ- INICIO ==================================
//validaçao da busca
ipcMain.on("validar-busca", () => {
  dialog.showMessageBox({
    type: "warning",
    title: "Atenção",
    message: "preencha o campo de busca",
    buttons: ["OK"],
  });
});

ipcMain.on("search-cpf", async (event, cpfCli) => {
  try {
    const clientCPF = await clientModel.find({
      cpf: new RegExp(cpfCli),
    });
    console.log(clientCPF);

    if (clientCPF.length === 0) {
      dialog
        .showMessageBox({
          type: "warning",
          title: " Busca CPF",
          message: "Cliente não cadastrado. \n Deseja cadastrar este cliente?",
          defaultId: 0, //
          buttons: ["Sim", "Não"], // [0,1] DEFAULTID esta associado ao sim, enquanto o não esta associado ao não (quando apertar enter ja vai no sim)
        })
        .then((result) => {
          if (result.response === 0) {
            //enviar ao cliente um pedido para copiar o nome do ususario do cliente no campo de bvusca para o campo nome (evitar que o usuario tenha que idigitar novamente o nome)
            event.reply("set-cpf");
          } else {
            //enviar ao renderer cliente, um pedido para limpar os campos
            event.reply("reset-form");
          }
        });
    } else {
      event.reply("render-clientCPF", JSON.stringify(clientCPF));
    }
  } catch (error) {
    console.log(error);
  }
});
ipcMain.on("search-name", async (event, nomeCli) => {
  //teste do recebimento entre arquivos
  console.log(nomeCli);
  try {
    const client = await clientModel.find({
      //RegExp (expressão regular ''i' -> insensitive (ignorar letras maisculas e minusculas))
      nome: new RegExp(nomeCli, "i"),
    });
    console.log(client);
    //melhoriar da experiencia do usuaario (se nao existir um cliente cadastrado enviar uma mensagem ao usuario questionando se ele deseja cadastrar um novo cliente)
    //se o vetor esiver vazio (lenght) fala o tamanho do vetor
    if (client.length === 0) {
      //questionar o usuario...
      dialog
        .showMessageBox({
          type: "question",
          title: " Clientes",
          message: "Cliente não cadastrado. \n Deseja cadastrar este cliente?",
          defaultId: 0, //
          buttons: ["Sim", "Não"], // [0,1] DEFAULTID esta associado ao sim, enquanto o não esta associado ao não (quando apertar enter ja vai no sim)
        })
        .then((result) => {
          if (result.response === 0) {
            //enviar ao cliente um pedido para copiar o nome do ususario do cliente no campo de bvusca para o campo nome (evitar que o usuario tenha que idigitar novamente o nome)
            event.reply("set-name");
          } else {
            //enviar ao renderer cliente, um pedido para limpar os campos
            event.reply("reset-form");
          }
        });
    } else {
      //Mandar para os clientes para o renderClientes
      event.reply("render-client", JSON.stringify(client));
    }
  } catch (error) {
    console.log(error);
  }
});

//=========================== CRUD READ- FIM =====================================
//================================================================================

//================================================================================
//=========================== CRUD DELETE- FIM ===================================
ipcMain.on("delete-client", async (event, id) => {
  const result = await dialog.showMessageBox(win, {
    type: "warning",
    title: "ATENÇÃO",
    message:
      "Cliente será apagado, tem certeza disto?. \n Esta ação não podera ser desfeita",
    buttons: ["Cancelar", "Sim"], // [0,1] DEFAULTID esta associado ao Cancelar, enquanto o não esta associado ao não (quando apertar enter ja vai no sim)
  });
  console.log(result);
  if (result.response === 1) {
    try {
      const deleteClient = await clientModel.findByIdAndDelete(id);
      console.log("deletado");
      event.reply("reset-form");
    } catch (error) {
      console.log(error);
    }
  }
});
//=========================== CRUD DELETE- FIM ===================================
//================================================================================

//================================================================================
//=========================== CRUD EDIT- FIM =====================================

ipcMain.on("edit-client", async (event, cadastroCliente) => {
  //console.log(cadastroCliente);

  try {
    const updateClient =  await clientModel.findByIdAndUpdate(
      cadastroCliente.idCli,
      {
      gmail: cadastroCliente.gmailCli,
      telefone: cadastroCliente.telCli,
      cpf: cadastroCliente.cpfCli,
      nome: cadastroCliente.nomeCli,
      sexo: cadastroCliente.sexoCli,
      cep: cadastroCliente.cepCli,
      bairro: cadastroCliente.bairroCli,
      numero: cadastroCliente.numCli,
      complemento: cadastroCliente.compCli,
      estado: cadastroCliente.ufCli,
      cidade: cadastroCliente.cidCli,
      logradouro: cadastroCliente.lograCli,
    },
  {
    new: true
  }
  );
    //confirmaçao do cliente adicionado ao banco (uso do dialog)
    dialog
      .showMessageBox({
        type: "info",
        title: "aviso",
        message: "cliente alterado com sucesso",
        buttons: ["OK"],
      })
      .then((result) => {
        if (result.response === 0) {
          event.reply("reset-form");
        }
      });
  } catch (error) {
    if (error.code === 11000) {
      dialog
        .showMessageBox({
          type: "error",
          title: "CPF",
          message: "CPF já cadastrado",
          buttons: ["OK"],
        })
        .then((result) => {
          if (result.response === 0) {
            event.reply("reset-Cpf");
          }
        });
    } else {
      console.log(error);
    }
  }
});

//=========================== CRUD DELETE- FIM ===================================
//================================================================================
