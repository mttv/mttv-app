const { BrowserWindow } = require('electron')
const path = require('path')
const url = require('url')

const config = require('../../config')
const scripts = require('../../scripts/index')

const subscribeWindow = module.exports = {
    initWindow,
    win: null
}

subscribe = (channelName) => {
    const win = subscribeWindow.win = new BrowserWindow({
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
            devTools: false
        }
    })

    const subWinUrl = url.format({
        pathname: path.join(__dirname, './subscribeWindow.html'),
        protocol: 'file',
        slashes: true
    })

    win.loadURL(subWinUrl)

    win.webContents.on('did-finish-load', () => {
        scripts.eventHandler.sendMessage(subscribeWindow.win, "get-subscription-url", `https://www.twitch.tv/subs/${channelName}`)
    })

    win.on('closed', () => {
        subscribeWindow.win = null
    })
}

function initWindow(channelName) {
    if (!subscribeWindow.win) {
        subscribe(channelName)
    }
}