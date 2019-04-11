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

  // 添加待处理文件
  ipcMain.on('open-file-dialog', event => {
    dialog.showOpenDialog({
      properties: ['openFile', 'openDirectory', 'multiSelections']
    }, (files) => {

      let _list = []

      _list = getFileInfo(files)
      console.log('list', _list)

      list.push(..._list)

      // 传递文件列表
      event.sender.send('open-file-reply', list)

    })
  })

  // 处理文件并输出
  ipcMain.on('compared-file', event => {
    list = removeRepeatDown(list)

    copyFile(list, '/Users/jiangyalin/Music/test')

    event.sender.send('compared-file-reply', list)
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

// 删除重复下载文件
const removeRepeatDown = (files) => {
  // 以'('开始并以')'为结束，并且中间为数值的判定为重复下载文件
  return files.filter(item => isRepeatDownName(item.name))
}

const isRepeatDownName = (name) => {
  const rearIndex = name.lastIndexOf(').')

  const _name = name.substring(0, rearIndex)

  const beforeIndex = _name.lastIndexOf('(') + 1

  const number = _name.substring(beforeIndex, rearIndex)

  const re = /^[0-9]$/

  return !re.test(number)
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
  if (mainWindow === null) createWindow()
})
