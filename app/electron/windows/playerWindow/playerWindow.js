const { BrowserWindow, dialog, shell } = require('electron')
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

miniPlayer = (channelName, mpWidth, mpHeight, mpResizable, chatEnabled, theme) => {
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
        const playerInfo = {
            channelName: channelName,
            chatEnabled: chatEnabled,
            theme: theme
        }
        scripts.eventHandler.sendMessage(playerWindow.win, "open-player-window", playerInfo) //`https://www.twitch.tv/${channelName}`
    })
    
    win.on('closed', () => {
        playerWindow.win = null
        scripts.eventHandler.sendMessage(windows.mainWindow.win, "close-player-window", true)
    })

    win.webContents.on('new-window', (event, url) => {
        event.preventDefault()
        shell.openExternal(url)
    })
}

function initWindow(channelName, chatEnabled, theme) {
    scripts.appConf.loadConf()
        .then(res => {
            miniPlayer(channelName, res.playerWindow.width, res.playerWindow.height, res.playerWindow.resizable, chatEnabled, theme)
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