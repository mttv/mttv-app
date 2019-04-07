//Exporting twitch subscripiton window
exports.twitchWindow = () => {
    tWindow = windows.tWindow = new BrowserWindow({
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
        backgroundColor: '#0c0d0e',
        webPreferences: {
            webSecurity: false,
            devTools: true,
            allowRunningInsecureContent: true
        }
    })

    const twitchWinUrl = url.format({
        pathname: path.join(__dirname, './windows/subscribeWindow.html'),
        protocol: 'file',
        slashes: true
    })

    tWindow.loadURL(twitchWinUrl)

   tWindow.webContents.on('did-finish-load', () => {
        tWindow.webContents.send('get-subscription-url', "https://www.twitch.tv/")
    })

    tWindow.on('closed', () => {
        tWindow = null
    })
}