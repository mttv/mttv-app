// Module to control application life.
const { app, Menu, shell, dialog } = require('electron')

//Getting all windows
const windows = require('./windows/index')
//Loading app scripts
const scripts = require('./scripts/index')

//Updates module
const { autoUpdater } = require('electron-updater')
//Disabling autoDownload for custom screen
autoUpdater.autoDownload = false

//checking app status
const isDev = require('electron-is-dev')

//Loading all main menus
const appMenu = require('./menus/appMenu')

//Updates log conf
const log = require('electron-log')
autoUpdater.logger = log
autoUpdater.logger.transports.file.level = 'info'
log.info('App starting...')

//Keeping it global for passing to other functions
//Without app-conf.json app shouldn't launch
let appConf = null

app.commandLine.appendSwitch('js-flags', '--max-old-space-size=512')


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
    // loading app configuration
    scripts.appConfLoader.loadConf()
        .then(res => {
            appConf = res
            //Setting up app menu
            Menu.setApplicationMenu(appMenu)
            windows.preloaderWindow.show()
        })
        .catch(err => {
            dialog.showErrorBox("APP START ERROR", err)
        })

})

app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (preloaderWindow === null) {
        windows.preloaderWindow.show()
    }
})

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
        // const ses = mainWindow.webContents.session
        // ses.clearStorageData()
    }
})

// app.on('will-quit', () => {
//     globalShortcut.unregisterAll()
// })

// Listen for web contents being created
app.on('web-contents-created', (e, contents) => {
    // Check for a webview
    if (contents.getType() == 'webview') {
      // Listen for any new window events
      contents.on('new-window', (e, url) => {
        e.preventDefault()
        shell.openExternal(url)
      })
    }
})

const sendStatusToWindow = (text) => {
    log.info(text)
    if (mainWindow) {
        mainWindow.webContents.send('app-update-message', text)   
    }
}

autoUpdater.on('checking-for-update', () => {
    sendStatusToWindow('Checking for update...')
})

autoUpdater.on('update-available', (info) => {
    sendStatusToWindow('Update available.')
})

autoUpdater.on('update-not-available', (info) => {
    sendStatusToWindow('Update not available.')
})

autoUpdater.on('error', (err) => {
    sendStatusToWindow("Error in auto-updater.")
    sendStatusToWindow(err)
})

autoUpdater.on('update-downloaded', (info) => {
    sendStatusToWindow('Update downloaded.')
    setTimeout(() => {
        autoUpdater.quitAndInstall()
    }, 1000 * 10)
})

exports.downloadUpdate = (permission) => {
    if (permission) {
        sendStatusToWindow("Downloading update.")
        autoUpdater.downloadUpdate()   
    }
}

exports.checkForUpdates = () => {
    if (!isDev) {
        autoUpdater.checkForUpdates()
    }
}