const { BrowserWindow, ipcMain, app, shell, Menu } = require('electron')
//checking app status
const isDev = require('electron-is-dev')
//Updates module
const { autoUpdater } = require('electron-updater')
const path = require('path')
const url = require('url')

const config = require('../../config')
const windows = require('../index')
const scripts = require('../../scripts/index')
const appMenu = require('../../menus/appMenu')

const mainWindow = module.exports = {
    initWindow,
    show,
    win: null,
}

main = () => {

    // Create the browser window.
    const win = mainWindow.win = new BrowserWindow({
      width: 940,
      height: 740,
      minWidth: 940,
      minHeight: 740,
      frame: true,
      show: false,
      fullscreen: false, //conf.app.fullScreenLaunch
      icon: config.APP_ICON,
      fullscreenable: true,
      autoHideMenuBar: true,
      webPreferences: {
        webSecurity: false,
        devTools: true,
        allowRunningInsecureContent: true
      },
      backgroundColor: '#0c0d0e'
    })

    // and load the index.html of the app.
    const startUrl = process.env.ELECTRON_START_URL || url.format({
            pathname: path.join(__dirname, '../../build/index.html'),
            protocol: 'file:',
            slashes: true
    })
    win.loadURL(startUrl)

    win.on('ready-to-show', () => {
        windows.preloaderWindow.closeWindow()
        //Setting up app menu
        Menu.setApplicationMenu(appMenu)
        win.show()
        //watching for app updates  
        // loading bttv
        BrowserWindow.removeExtension("BetterTTV")
        BrowserWindow.addExtension(config.BTTV_PATH)
        if (!isDev) {
            autoUpdater.checkForUpdates()
        }
        setTimeout(() => {
            scripts.discord.login()
        }, 1500)
    })

    // Emitted when the window is closed.
    win.on('closed', () => {
        app.quit()
    })

    /*
        WAITING FOR FUTURE IMPROVEMENT
    */
    // win.on('blur', () => {
    //     scripts.discord.clearPresence()
    // })

    // win.on('focus', () => {
    //     scripts.eventHandler.sendMessage(mainWindow.win, "reset-discord-presence", true)
    // })

    //Opening external links in a browser
    win.webContents.on('new-window', (event, url) => {
        event.preventDefault()
        shell.openExternal(url)
    })
}

ipcMain.on("open-dev-tools", (event, res) => {
    if (res) {
        mainWindow.win.webContents.openDevTools()
    }
})

function initWindow() {
    if (!mainWindow.win) {
        main()
    }
}

function show() {
    if (mainWindow.win) {
        mainWindow.win.show()
    }
}