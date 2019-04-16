const fs = require('./tool')
const _path = './../data/music/file.json'

class file {
  add = (name = '', path = '', size = 0) => {
    const node = fs.read(_path)

    const data = {
      id: node.length,
      name: name,
      path: path,
      size: size
    }

    node.push(data)

    fs.write(_path, node)

    return data
  }
  filterPath = path => {
    const node = fs.read(_path)
    return node.filter(item => item.path === path)
  }
}

module.exports = file
