// Module to control application life.
const { app, Tray, shell, dialog } = require('electron')

const config = require('./config')

//Getting all windows
const windows = require('./windows/index')
//Loading app scripts
const scripts = require('./scripts/index')

//Updates module
const { autoUpdater } = require('electron-updater')
//Disabling autoDownload for custom screen
autoUpdater.autoDownload = false

const trayMenu = require('./menus/trayMenu')
let tray = null

//checking app status
const isDev = require('electron-is-dev')

app.commandLine.appendSwitch('js-flags', '--max-old-space-size=512')

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
    // loading app configuration
    scripts.appConf.initConf()
        .then(res => {
            tray = new Tray(config.APP_ICON)
            tray.setToolTip('MTTV')
            tray.setContextMenu(trayMenu)
            windows.preloaderWindow.initWindow()
        })
        .catch(err => {
            dialog.showErrorBox("APP START ERROR", err)
        })

})

app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (preloaderWindow === null) {
        windows.preloaderWindow.initWindow()
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

//exporting all functions from main process that are needed in app for interactions
exports.twitchWindow = () => {
    windows.twitchWindow.initWindow()
}

exports.playerWindow = (channelName) => {
    if (windows.playerWindow.win) {
        windows.playerWindow.closeWindow()
        windows.playerWindow.initWindow(channelName)
    } else {
        windows.playerWindow.initWindow(channelName)
    }
}

exports.subscribeWindow = (channelName) => {
    windows.subscribeWindow.initWindow(channelName)
}

exports.checkForUpdates = () => {
    if (!isDev) {
        autoUpdater.checkForUpdates()
    }
}

exports.authDiscordRPC = () => {
    scripts.discord.login()
}

exports.setDiscordActivity = (channelName, startTimestamp) => {
    scripts.discord.setActivity(channelName, startTimestamp)
}

exports.clearDiscordPresence = () => {
    scripts.discord.clearPresence()
}

exports.resizablePlayer = (newVal) => {
    return new Promise((resolve, reject) => {
        scripts.appConf.miniplayerResize(newVal)
            .then((res) => {
                resolve(res)
            })
            .catch((err) => {
                reject(err)
                dialog.showErrorBox("RESIZE PLAYER ERROR", err)
            })
    })
}

exports.mpSize = (width, height, id) => {
    return new Promise((resolve, reject) => {
        scripts.appConf.miniplayerSize(width, height, id)
            .then(res => {
                resolve(res)
            })
            .catch(err => {
                reject(err)
                dialog.showErrorBox("PLAYER SIZE ERROR", err)
            })
    })
}

autoUpdater.on('checking-for-update', () => {
    scripts.eventHandler.sendMessage(windows.mainWindow.win, "app-update-message", "Checking for update...")
    scripts.eventHandler.sendLogMessage("Checking for update...")
})

autoUpdater.on('update-available', (info) => {
    scripts.eventHandler.sendMessage(windows.mainWindow.win, "app-update-message", "Update available.")
    scripts.eventHandler.sendLogMessage(info)
})

autoUpdater.on('update-not-available', (info) => {
    scripts.eventHandler.sendMessage(windows.mainWindow.win, "app-update-message", "Update not available.")
    scripts.eventHandler.sendLogMessage(info)
})

autoUpdater.on('error', (err) => {
    scripts.eventHandler.sendMessage(windows.mainWindow.win, "app-update-message", "Error in auto-updater.")
    scripts.eventHandler.sendMessage(windows.mainWindow.win, "app-update-message", err)
    scripts.eventHandler.sendLogMessage(err)
})

autoUpdater.on('update-downloaded', (info) => {
    scripts.eventHandler.sendMessage(windows.mainWindow.win, "app-update-message", "Update downloaded.")
    scripts.eventHandler.sendLogMessage(info)
    setTimeout(() => {
        autoUpdater.quitAndInstall()
    }, 1000 * 10)
})

exports.downloadUpdate = (permission) => {
    if (permission) {
        scripts.eventHandler.sendMessage(windows.mainWindow.win, "app-update-message", "Downloading update.")
        autoUpdater.downloadUpdate()   
    }
}