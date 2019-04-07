//Exporting playerWindow.html to Stream Component
exports.miniPlayer = (channelName, mpWidth, mpHeight, mpResizable) => {
    const width = mpWidth ? mpWidth : conf.playerWindow.width
    const height = mpHeight ? mpHeight : conf.playerWindow.height
    const resizable = mpResizable ? mpResizable : conf.playerWindow.resizable
    playerWindow = windows.playerWindow = new BrowserWindow({
        width: width,
        height: height,
        minWidth: width,
        minHeight: height,
        frame: false,
        show: true,
        modal: true,
        fullscreen: false,
        fullscreenable: false,
        movable: true,
        resizable: resizable,
        alwaysOnTop: true,
        icon: __dirname + '/icons/icon_r.ico',
        backgroundColor: '#0c0d0e',
        webPreferences: {
            webSecurity: false,
            devTools: false,
            allowRunningInsecureContent: true,
          }
    })

    const playerUrl = url.format({
      pathname: path.join(__dirname, './windows/playerWindow.html'),
      protocol: 'file',
      slashes: true
    })

    playerWindow.loadURL(playerUrl)

    playerWindow.webContents.on('did-finish-load', () => {
      playerWindow.webContents.send('open-player-window', channelName)
    })
    
    playerWindow.on('closed', () => {
        if (mainWindow) {
            mainWindow.webContents.send('close-player-window', true)
        }
        playerWindow = null
    })
}