const name = '小木曽雪菜    -    あなたを想いたい   .flac'

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

console.log('getSongName', getSongName(name))

// const rearIndex = name.indexOf('-')
// console.log('rearIndex', rearIndex)
//
// const _name = name.substring(0, rearIndex)
// console.log('_name', _name)
//
// let index = 0
// for (let i = _name.length; i > 1; i--) {
//   if (_name.substring(i - 1, i) !== ' ') {
//     index = i
//     i = 1
//   }
// }
// console.log('ddd', name.substring(0, index + 1))

// const beforeIndex = _name.lastIndexOf('(') + 1
// console.log('beforeIndex', beforeIndex)
//
// const number = _name.substring(beforeIndex, rearIndex)
// console.log('number', number)
//
// const re = /^[0-9]$/
//
// console.log('name', re.test(number))
