const { BrowserWindow } = require('electron')
const path = require('path')
const url = require('url')

const config = require('../../config')

const twitchWindow = module.exports = {
    initWindow,
    win: null
}

twitch = () => {

    const win = twitchWindow.win = new BrowserWindow({
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
        icon: config.APP_ICON,
        backgroundColor: '#0c0d0e',
        webPreferences: {
            webSecurity: false,
            devTools: false,
            allowRunningInsecureContent: true
        }
    })

    const twitchWinUrl = url.format({
        pathname: path.join(__dirname, './twitchWindow.html'),
        protocol: 'file',
        slashes: true
    })

    win.loadURL(twitchWinUrl)

    win.on('closed', () => {
        twitchWindow.win = null
    })
}

function initWindow() {
    if (!twitchWindow.win) {
        twitch()
    }
}