const fs = require('fs-extra')

module.exports = {
  read: path => {
    const data = fs.readFileSync(path, {
      encoding: 'utf8',
      flag: 'a+'
    })
    const obj = JSON.parse(data || '{"node":[]}')
    return obj.node
  },
  write: (path, node) => {
    const obj = {
      node
    }
    return fs.writeFileSync(path, JSON.stringify(obj), {
      encoding: 'utf-8'
    })
  }
}
