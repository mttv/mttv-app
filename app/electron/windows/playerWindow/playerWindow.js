const { BrowserWindow, dialog } = require('electron')
const path = require('path')
const url = require('url')

const config = require('../../config')
const scripts = require('../../scripts/index')
const windows = require('../index')

const playerWindow = module.exports = {
    initWindow,
    closeWindow,
    win: null
}

miniPlayer = (channelName, mpWidth, mpHeight, mpResizable) => {
    const win = playerWindow.win = new BrowserWindow({
        width: mpWidth,
        height: mpHeight,
        minWidth: mpWidth,
        minHeight: mpHeight,
        frame: false,
        show: true,
        modal: true,
        fullscreen: false,
        fullscreenable: false,
        movable: true,
        resizable: mpResizable,
        alwaysOnTop: true,
        icon: config.APP_ICON,
        backgroundColor: '#0c0d0e',
        webPreferences: {
            webSecurity: false,
            devTools: false,
            allowRunningInsecureContent: true,
          }
    })

    const playerUrl = url.format({
      pathname: path.join(__dirname, './playerWindow.html'),
      protocol: 'file',
      slashes: true
    })

    win.loadURL(playerUrl)

    win.webContents.on('did-finish-load', () => {
        scripts.eventHandler.sendMessage(playerWindow.win, "open-player-window", `https://www.twitch.tv/${channelName}`)
    })
    
    win.on('closed', () => {
        playerWindow.win = null
        scripts.eventHandler.sendMessage(windows.mainWindow.win, "close-player-window", true)
    })
}

function initWindow(channelName) {
    scripts.appConf.loadConf()
        .then(res => {
            miniPlayer(channelName, res.playerWindow.width, res.playerWindow.height, res.playerWindow.resizable)
        })
        .catch(err => {
            dialog.showErrorBox("MINI PLAYER ERROR", err)
        })
}

function closeWindow() {
    if (playerWindow.win) {
        playerWindow.win.close()
    }
}