// const name = '   as  df '
//
// const getSingerName = (str) => {
//   console.log('str', str)
//   return str.replace(/^\s+|\s+$/g, '')
// }
//
// console.log('getSongName', getSingerName(name))

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


let name = '花篝(はなかが)り'
const rearIndex = name.lastIndexOf(')') + 1

const _name = name.substring(0, rearIndex)

const beforeIndex = _name.lastIndexOf('(')

const remark = _name.substring(beforeIndex, rearIndex)

console.log('remark', remark)

console.log('remark', name.substring(0, beforeIndex) + name.substring(rearIndex))
