const fs = require('./tool')
const _path = './../data/music/singer.json'

class singer {
  add = (name = '', alias = []) => {
    const node = fs.read(_path)

    const data = {
      id: node.length,
      name: name,
      alias: alias
    }

    node.push(data)

    fs.write(_path, node)

    return data
  }
  inquire = () => {
    return fs.read(_path)
  }
  findName = name => {
    const node = fs.read(_path)
    return node.find(item => item.name === name || item.alias.indexOf(name) !== -1)
  }
}

module.exports = singer
