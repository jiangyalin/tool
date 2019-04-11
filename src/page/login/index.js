$('.j-btn').click(() => {
  const name = $('.j-name').val()
  const pwd = $('.j-pwd').val()
  if (name === 'root' && pwd === '123456') {
    // console.log(require('electron').ipcRenderer)
    // ipcRenderer.on('asynchronous-reply', (event, arg) => {
    //   console.log('3', arg) // prints "pong"
    // })
    // ipcRenderer.send('asynchronous-message', 'ping')
    window.location.href = './../home/index.html'
  }
})
