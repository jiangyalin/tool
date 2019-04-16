const fs = require('./tool')
const _path = './../data/music/song.json'
const _singer = require('./singer.js')
const _file = require('./file.js')

class song {
  add = (name = '', alias = [], singer = '', isManyPeople = false) => {
    const node = fs.read(_path)

    const data = {
      id: node.length,
      name: name,
      alias: alias,
      singer: _singer.findName(singer).id,
      isManyPeople: isManyPeople,
      file: _file.filterPath(),
    }

    node.push(data)

    fs.write(_path, node)

    return data
  }
  findName = name => {
    const node = fs.read(_path)
    return node.find(item => item.path === name)
  }
}

module.exports = song
