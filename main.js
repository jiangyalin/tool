// const api = require('./src/api')
const fs = require('fs-extra')
const {app, BrowserWindow, ipcMain, dialog} = require('electron')

let mainWindow

let list = []

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })
  mainWindow.loadFile('./src/page/login/index.html')
  mainWindow.webContents.openDevTools()

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  ipcMain.on('asynchronous-message', (event, arg) => {
    console.log('1', arg) // prints "ping"
    // event.sender.send('asynchronous-reply', 'pong')
  })

  ipcMain.on('open-file-dialog', event => {
    dialog.showOpenDialog({
      properties: ['openFile', 'openDirectory', 'multiSelections']
    }, (files) => {

      let _list = []

      _list = getFileInfo(files)
      console.log('list', _list)

      copyFile(_list, '/Users/jiangyalin/Music/test')

      list.push(..._list)

      event.sender.send('open-file-reply', list)

      if (files) {
        event.sender.send('selected-directory', files)
      }
    })
  })
}

const getFileInfo = paths => {
  const list = []
  paths.forEach(path => {
    const state = fs.statSync(path)
    const name = getFileName(path)
    list.push({
      name,
      path,
      size: state.size
    })
  })
  return list
}

const getFileName = path => {
  const index = path.lastIndexOf('/') + 1
  return path.substring(index)
}

const copyFile = (files, folder) => {
  files.forEach(file => {
    fs.copy(file.path, folder + '/' + file.name, err => {
      if (err) return console.log(err)
    })
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
  if (mainWindow === null) createWindow()
})
