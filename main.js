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

      createSingerInfo(list)

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

  return files.filter(item => isRepeatDownName(item.name))
}

// 以'('开始并以')'为结束，并且中间为数值的判定为重复下载文件
const isRepeatDownName = (name) => {
  const rearIndex = name.lastIndexOf(').')

  const _name = name.substring(0, rearIndex)

  const beforeIndex = _name.lastIndexOf('(') + 1

  const number = _name.substring(beforeIndex, rearIndex)

  const re = /^[0-9]$/

  return !re.test(number)
}

// 获取歌手姓名
const getSingerName = (fileName) => {
  const rearIndex = fileName.indexOf('-')

  const _name = fileName.substring(0, rearIndex)

  let index = 0
  for (let i = _name.length; i > 1; i--) {
    if (_name.substring(i - 1, i) !== ' ') {
      index = i
      i = 1
    }
  }
  return fileName.substring(0, index)
}

// 获取音乐名称
const getSongName = (fileName) => {
  let beforeIndex = fileName.indexOf('-')

  const beforeName = fileName.substring(beforeIndex + 1)

  for (let i = 0; i < beforeName.length; i++) {
    if (beforeName.substring(i, i + 1) !== ' ') {
      beforeIndex += i
      i = beforeName.length
    }
  }

  let rearIndex = fileName.indexOf('.')

  const rearName = fileName.substring(0, rearIndex)

  for (let i = rearName.length; i > 1; i--) {
    if (rearName.substring(i - 1, i) !== ' ') {
      rearIndex = i
      i = 1
    }
  }

  return fileName.substring(beforeIndex + 1, rearIndex)
}

// 生成歌手信息
const createSingerInfo = (list) => {
  list.forEach(item => {
    const singer = {
      name: getSingerName(item.name),
      song: {
        name: getSongName(item.name),
        fileName: item.name
      }
    }
    recordSingerInfo(singer)
  })
}

// 记录歌手信息
const recordSingerInfo = (singer) => {
  const data = fs.readFileSync('./data/music/singer/index.json', {
    encoding: 'utf8',
    flag: 'a+'
  })

  let obj = JSON.parse(data || '{}')

  // 不存在此歌手
  if (!obj[singer.name]) {
    obj[singer.name] = {
      name: singer.name,
      song: [{
        name: singer.song.name,
        fileNames: [{
          name: singer.song.fileName
        }]
      }]
    }
  } else {

    let song = obj[singer.name].song

    // 存在此歌曲
    const isExistenceSongName = song.map(item => item.name).indexOf(singer.song.name) !== -1
    if (isExistenceSongName) {
      song = song.map(item => {
        if (item.name === singer.song.name) {
          let fileNames = item.fileNames

          // 存在此文件
          const isExistenceSongFileName = fileNames.map(node => node.name).indexOf(singer.song.fileName) === -1
          if (isExistenceSongFileName) {
            fileNames.push({
              name: singer.song.fileName
            })
          }
          return {
            ...item,
            fileNames
          }
        } else {
          return item
        }
      })
    } else {
      song.push({
        name: singer.song.name,
        fileName: [{
          name: singer.song.fileName
        }]
      })
    }

    obj[singer.name].song = song
  }
  fs.writeFileSync('./data/music/singer/index.json', JSON.stringify(obj), {
    encoding: 'utf-8'
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
  if (mainWindow === null) createWindow()
})
