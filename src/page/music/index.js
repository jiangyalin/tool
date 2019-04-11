const { ipcRenderer } = require('electron')

$('.j-add').click(() => {
  ipcRenderer.send('open-file-dialog')
  // ipcRenderer.send('asynchronous-message', 'ping')
})

ipcRenderer.on('open-file-reply', (event, arg) => {
  console.log(arg)
  $('.j-list').html('')
  arg.forEach(item => {
    $('.j-list').append('<li><p>' + item.name + '</p><p>' + item.path + '</p><p>' + item.size + '</p></li>')
  })
})
