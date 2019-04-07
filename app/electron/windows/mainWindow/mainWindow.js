const { BrowserWindow, ipcMain } = require('electron')
//checking app status
const isDev = require('electron-is-dev')
const path = require('path')
const url = require('url')

const config = require('../../config')
const windows = require('../index')

const mainWindow = module.exports = {
    show,
    win: null,
}

main = () => {

    // Create the browser window.
    let win = mainWindow.win = new BrowserWindow({
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
        windows.preloaderWindow.close()
        win.show()
        //watching for app updates  
        // loading bttv
        BrowserWindow.removeExtension("BetterTTV")
        BrowserWindow.addExtension(config.BTTV_PATH)
        if (!isDev) {
            autoUpdater.checkForUpdates()
        }
    })

    // Emitted when the window is closed.
    win.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win = null
    })

    // win.on('blur', () => {
    //     clearDiscordPresence()
    // })

    // win.on('focus', () => {
    //     win.webContents.send("reset-discord-presence", true)
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

function show() {
    if (!mainWindow.win) {
        main()
    }
}