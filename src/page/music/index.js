const { ipcRenderer } = require('electron')

$('.j-add').click(() => {
  ipcRenderer.send('open-file-dialog')
  ipcRenderer.on('open-file-reply', (event, arg) => {
    arg.forEach(item => {
      $('.j-list').append('<li><p>' + item.name + '</p><p>' + item.path + '</p><p>' + item.size + '</p></li>')
    })
    console.log(arg)
  })
  // ipcRenderer.send('asynchronous-message', 'ping')
})
