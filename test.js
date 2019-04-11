const name = '陈慧琳 - 今生你作伴(国) (2).ncm'

const rearIndex = name.lastIndexOf(').')
console.log('rearIndex', rearIndex)

const _name = name.substring(0, rearIndex)
console.log('_name', _name)

const beforeIndex = _name.lastIndexOf('(') + 1
console.log('beforeIndex', beforeIndex)

const number = _name.substring(beforeIndex, rearIndex)
console.log('number', number)

const re = /^[0-9]$/

console.log('name', re.test(number))
