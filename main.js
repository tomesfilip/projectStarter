const { app, BrowserWindow, Menu } = require('electron')

//set environment
process.env.NODE_ENV = 'dev'

const isDev = process.env.NODE_ENV !== 'production' ? true : false
const isMac = process.platform === 'darwin' ? true : false

let mainWindow
let aboutWindow

function createMainWindow(){
  mainWindow = new BrowserWindow({
    title: 'Project Starter',
    width: isDev ? 900 : 480,
    height: 620,
        icon: `${__dirname}/assets/icons/icon.png`,
        resizable: isDev,
        backgroundColor: 'white',
        webPreferences: {
            enableRemoteModule: true,
            nodeIntegration: true,
        },
  })

  if (isDev){
    mainWindow.webContents.openDevTools()
    }

  mainWindow.loadFile('./app/index.html')
}

function createAboutWindow () {
  aboutWindow = new BrowserWindow({
      title: 'Project Starter',
      width: 300,
      height: 300,
      icon: `${__dirname}/assets/icons/icon.png`,
      resizable: false,
      backgroundColor: 'white'
  })

  aboutWindow.loadFile('./app/about.html')
}


app.on('ready', () =>{
    createMainWindow()

    const mainMenu = Menu.buildFromTemplate(menu)
    Menu.setApplicationMenu(mainMenu)

    mainWindow.on('closed', () => mainWindow = null)
})

const menu = [
  ...(isMac ? [{
      label: app.name,
      submenu: [
          {
              label: 'About',
              click: createAboutWindow,
          }
      ],
  },] : []),
  {
      role: 'fileMenu',
  },
  ...(!isMac ? [
      {
          label: 'Help',
          submenu: [
              {
                  label: 'About',
                  click: createAboutWindow,
              },
          ],
      },
  ] : []),
  ...(isDev ? [
      {
          label: 'Developer',
          submenu: [
              {role: 'reload'},
              {role: 'forcereload'},
              {type: 'separator'},
              {role: 'toggledevtools'},
          ],
      },
  ] : []),
]



app.on('window-all-closed', () => {
  if (!isMac){
      app.quit()
  }
})

app.on('activate', () => {
  if(BrowserWindow.getAllWindows().length === 0){
      createMainWindow()
  }
})