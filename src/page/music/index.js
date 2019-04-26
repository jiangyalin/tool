const { ipcRenderer } = require('electron')

$('.j-add').click(() => {
  ipcRenderer.send('open-file-dialog')
})

ipcRenderer.on('open-file-reply', (event, arg) => {
  $('.j-list').html('')
  arg.forEach(item => {
    $('.j-list').append('<li><p>' + item.name + '</p><p>' + item.path + '</p><p>' + item.size + '</p></li>')
  })
})

$('.j-output').click(() => {
  ipcRenderer.send('compared-file')
})

ipcRenderer.on('compared-file-reply', (event, arg) => {
  $('.j-output-list').html('')
  arg.forEach(item => {
    $('.j-output-list').append('<li><p>' + item.name + '</p><p>' + item.song.path + '</p><p>' + item.song.size + '</p></li>')
  })
})
