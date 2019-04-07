const { Tray, BrowserWindow } = require('electron')
const path = require('path')
const url = require('url')

const config = require('../../config')
const trayMenu = require('../../menus/trayMenu')
const windows = require('../index')

let tray = null

const preloaderWindow = module.exports = {
    show,
    close,
    win: null
}

preloader = () => {

    let win = preloaderWindow.win = new BrowserWindow({
        width: 420,
        height: 500,
        frame: false,
        show: false,
        resizable: false,
        fullscreen: false,
        fullscreenable: false,
        movable: true,
        backgroundColor: '#0c0d0e',
        icon: config.APP_ICON,
        webPreferences: {
            devTools: false
        }
    })

    const preloaderUrl = url.format({
        pathname: path.join(__dirname, './preloader.html'),
        protocol: 'file',
        slashes: true
    })
    win.loadURL(preloaderUrl)

    win.on('ready-to-show', () => {
        tray = new Tray(config.APP_ICON)
        tray.setToolTip('MTTV')
        tray.setContextMenu(trayMenu)
        win.show()
        setTimeout(() => {
            windows.mainWindow.show()
        }, 3000)
    })

    win.on('closed', () => {
        win = null
    })
}

function show() {
    if (!preloaderWindow.win) {
        preloader()
    }
}

function close() {
    if (preloaderWindow.win) {
        preloaderWindow.win.close()
    }
}