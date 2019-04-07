//Exporting twitch subscripiton window
exports.subscribeWindow = (channelName) => {
    subWindow = windows.subWindow = new BrowserWindow({
        width: 940,
        height: 740,
        minWidth: 940,
        minHeight: 740,
        frame: true,
        show: true,
        modal: true,
        fullscreen: false,
        fullscreenable: true,
        autoHideMenuBar: true,
        icon: __dirname + '/icons/icon_r.ico',
        backgroundColor: '#0c0d0e'
    })

    const subWinUrl = url.format({
        pathname: path.join(__dirname, './windows/subscribeWindow.html'),
        protocol: 'file',
        slashes: true
    })

    subWindow.loadURL(subWinUrl)

    subWindow.webContents.on('did-finish-load', () => {
        subWindow.webContents.send('get-subscription-url', "https://www.twitch.tv/subs/" + channelName)
    })

    subWindow.on('closed', () => {
        subWindow = null
    })
}