const path = '/Users/jiangyalin/Music/网易云音乐/坂本真綾 - CLEAR.flac'

const index = path.lastIndexOf('/') + 1

const name = path.substring(index)

console.log(name)
