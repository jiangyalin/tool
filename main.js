// const api = require('./src/api')
const fs = require('fs-extra')
const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const configPath = './data/music/singer/index.json'
const outputPath = '/Users/jiangyalin/Music/test'

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

      const _list = getFileInfo(files)
      // console.log('list', _list)

      list.push(..._list)

      // 传递文件列表
      event.sender.send('open-file-reply', list)

    })
  })

  // 处理文件并输出
  ipcMain.on('compared-file', event => {
    list = removeRepeatDown(list)

    list = createSingerInfo(list)
    console.log('list', list)

    /*
    * 以下为转换数据
    * */

    list = removeSongNameRemark(list)

    list = conversionUnknownName(list)

    list = pluralToOne(list)
    console.log('_list', list.length)

    list.forEach(item => {
      recordSingerInfo(item)
    })

    // copyFile(list, outputPath)

    event.sender.send('compared-file-reply', list)
  })
}

// 获取文件详细信息
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

// 获取文件名（包括后缀名）
const getFileName = path => {
  const index = path.lastIndexOf('/') + 1
  return path.substring(index)
}

// 复制文件到指定目录
const copyFile = (files, folder) => {
  files.forEach(file => {
    fs.copy(file.song.path, folder + '/' + file.song.name, err => {
      if (err) return console.log(err)
    })
  })
}

// 删除重复下载文件
const removeRepeatDown = files => {
  return files.filter(item => !isRepeatDownName(item.name) && !isCopyName(item.name))
}

// 以'('开始并以')'为结束，并且中间为数值的判定为重复下载文件
const isRepeatDownName = name => {
  const rearIndex = name.lastIndexOf(').')

  const _name = name.substring(0, rearIndex)

  const beforeIndex = _name.lastIndexOf('(') + 1

  const number = _name.substring(beforeIndex, rearIndex)

  const re = /^[0-9]$/

  return re.test(number)
}

// 文件名中带有'的副本'判定为复制文件
const isCopyName = name => {
  return name.indexOf('的副本') !== -1
}

// 获取歌手姓名
const getSingerName = fileName => {
  const rearIndex = fileName.indexOf('-')
  let name = trim(fileName.substring(0, rearIndex))
  if (name === '') name = '未知'
  return name
}

// 获取音乐名称
const getSongName = fileName => {
  const beforeIndex = fileName.indexOf('-')
  const rearIndex = fileName.lastIndexOf('.')
  let _name = trim(fileName.substring(beforeIndex + 1, rearIndex))
  _name = formatSongName(_name)
  return _name
}

// 格式化音乐名称
const formatSongName = name => {
  let _name = removeNickname(name)
  return _name
}

// 删除'()'内容
const removeNickname = name => {
  const rearIndex = name.lastIndexOf(')') + 1
  const beforeIndex = name.lastIndexOf('(')
  return name.substring(0, beforeIndex) + name.substring(rearIndex)
}

// 生成歌手信息
const createSingerInfo = list => {
  const _list = []
  list.forEach(item => {
    let singerName = getSingerName(item.name)
    let separator = ','
    if (singerName.indexOf(',') !== -1) separator = ','
    if (singerName.indexOf('、') !== -1) separator = '、'
    singerName = singerName.split(separator).map(node => trim(node)).join(',')
    const singers = singerName.split(',').map(name => {
      return {
        name: name,
        song: {
          name: getSongName(item.name),
          singer: singerName,
          isManyPeople: singerName.split(',').length > 1, // 是否为多人演唱
          fileName: item.name,
          size: item.size,
          path: item.path
        }
      }
    })
    _list.push(...singers)
  })
  return _list
}

// 转换查询未知歌手姓名
const conversionUnknownName = list => {
  return list.map(item => {
    let name = item.name
    let isManyPeople = item.song.isManyPeople
    let singer = item.song.singer
    if (item.name === '未知') {
      list.forEach(node => {
        if (node.name !== '未知' && node.song.name === item.song.name) {
          name = node.name
          singer = node.song.singer
          isManyPeople = node.song.isManyPeople
        }
      })
    }
    return {
      ...item,
      song: {
        ...item.song,
        singer,
        isManyPeople
      },
      name
    }
  })
}

// 删除歌曲备注
const removeSongNameRemark = list => {
  return list.map(item => {
    let name = item.song.name
    const rearIndex = name.lastIndexOf(')') + 1

    const beforeIndex = name.lastIndexOf('(')

    const _name = name.substring(0, beforeIndex) + name.substring(rearIndex)

    return {
      ...item,
      song: {
        ...item.song,
        name: _name
      }
    }
  })
}

// 相同名称的歌曲只保留品质最优的一个
const pluralToOne = list => {
  const record = []
  return list.filter(item => {
    let isSizeMax = true
    list.forEach(node => {
      if (item.song.name === node.song.name) {
        if (item.song.size < node.song.size) isSizeMax = false
      }
    })
    if (record.indexOf(item.song.name) !== -1) isSizeMax = false
    if (record.indexOf(item.song.name) === -1 && isSizeMax) record.push(item.song.name)
    return isSizeMax
  })
}

// 记录歌手信息
const recordSingerInfo = singer => {
  const data = fs.readFileSync(configPath, {
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
        singer: singer.song.singer, // 歌手名
        isManyPeople: singer.song.isManyPeople, // 是否为多人演唱
        files: [{
          name: singer.song.fileName,
          filePath: singer.song.path, // 文件路径
          size: singer.song.size // 文件大小
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
          let files = item.files

          // 存在此文件
          const isExistenceSongFileName = files.map(node => node.path).indexOf(singer.song.path) !== -1
          if (!isExistenceSongFileName) {
            files.push({
              name: singer.song.fileName,
              filePath: singer.song.path, // 文件路径
              size: singer.song.size // 文件大小
            })
          }
          return {
            ...item,
            files
          }
        } else {
          return item
        }
      })
    } else {
      song.push({
        name: singer.song.name, // 歌曲名
        singer: singer.song.singer, // 歌手名
        isManyPeople: singer.song.isManyPeople, // 是否为多人演唱
        files: [{ // 文件名
          name: singer.song.fileName, // 文件名
          filePath: singer.song.path, // 文件路径
          size: singer.song.size // 文件大小
        }]
      })
    }

    obj[singer.name].song = song
  }
  fs.writeFileSync(configPath, JSON.stringify(obj), {
    encoding: 'utf-8'
  })
}

// 去除首位空格
const trim = str => {
  return str.replace(/^\s+|\s+$/g, '')
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
  if (mainWindow === null) createWindow()
})

// const index = {
//   [歌手名]: {
//     name: '', // 歌手名
//     song: [{ // 歌曲列表
//       name: '', // 歌曲名
//       singer: '', // 歌手名
//       isManyPeople: false, // 是否为多人演唱
//       files: [{ // 文件名
//         name: '', // 文件名
//         filePath: '', // 文件路径
//         size: '' // 文件大小
//       }]
//     }]
//   }
// }

// 滴草由実 - 花篝(はなかが)り.mp3
// 和田薫 - 时代を超える想い1.mp3
// 牧野由依,渕上舞,津田美波 - Love∞Destiny (M@STER VERSION).mp3
// 霜月はるか - EXEC_LINCA／.flac
// 水野佐彩 - My Secret (TV size).mp3
// Aimer,SawanoHiroyuki[nZk] - ninelie ＜cry-v＞.flac
// ave;new,佐倉紗織 - Eternal Wish.mp3
// Chen-U - Horizon.mp3
// CHIHIRO,Tarantula from スポンテニア - 永遠.mp3
