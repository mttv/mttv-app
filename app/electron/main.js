const fs = require('fs')
const electron = require('electron')

// Module to control application life.
const { app, Menu, shell, Tray, ipcMain, globalShortcut } = require('electron')

//Updates module
const { autoUpdater } = require('electron-updater')
//Disabling autoDownload for custom screen
autoUpdater.autoDownload = false

//checking app status
const isDev = require('electron-is-dev')

//generating app unique id
const uuid = require('uuid/v4')

////discord lib
const DiscordRPC = require('discord-rpc')
const clientId = '558341590888742914'
const scopes = ['identify', 'email', 'rpc', 'rpc.api', 'rpc.notifications.read']

// DiscordRPC.register(clientId)
const rpc = new DiscordRPC.Client({transport: 'ipc'})
// let rpcReady = false

//checking if rpc is running
// rpc.on('ready', () => {
//     rpcReady = true
// })

//auth app for discord rpc
exports.authDiscordRPC = (status) => {
    if (status) {
        rpc.login({clientId, scopes})
            .then(r => {
                if (rpc.user === null) {
                    mainWindow.webContents.send("discord-rpc-status", false)
                } else {
                    mainWindow.webContents.send("discord-rpc-status", true)
                }
                    mainWindow.webContents.send("discord-rpc-status", rpc.user)
            })

    }
}

//Main func for discord user activity handler
exports.setActivity = async (channelName, startTimestamp) => {

    if (!rpc || !mainWindow) {
        return
    }

    //if user leave channel presense will be cleared
    if (channelName === "none") {
        clearDiscordPresence()
    } else {
        rpc.setActivity({
            details: `Watching ${channelName}`,
            startTimestamp,
            largeImageKey: "icon_discord",
            instance: false
        })
    }
}

const clearDiscordPresence = () => {
    rpc.clearActivity()
}

//Updates log conf
const log = require('electron-log')
autoUpdater.logger = log
autoUpdater.logger.transports.file.level = 'info'
log.info('App starting...')

//conf path is different for prod and dev versions
const confUrl = app.getPath("userData") + '/app-conf.json'
const confErrUrl = app.getPath("userData") + '/app-crash-error.json'
const bttvUrl = __dirname + '/extensions/bttv'

// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

//if app-conf.json can not load, app won't launch
let conf = null

const path = require('path')
const url = require('url')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
let preloaderWindow
let playerWindow
let subWindow
let tWindow
let tray = null

app.commandLine.appendSwitch('js-flags', '--max-old-space-size=512')

// app.disableHardwareAcceleration()

preloader = () => {
    preloaderWindow = new BrowserWindow({
        width: 420,
        height: 500,
        frame: false,
        show: false,
        resizable: false,
        fullscreen: false,
        fullscreenable: false,
        movable: true,
        backgroundColor: '#0c0d0e',
        icon: __dirname + '/icons/icon_r.ico',
        webPreferences: {
            devTools: false
        }
    })

    const preloaderUrl = url.format({
        pathname: path.join(__dirname, './windows/preloader.html'),
        protocol: 'file',
        slashes: true
    })
    preloaderWindow.loadURL(preloaderUrl)

    preloaderWindow.on('ready-to-show', () => {
        tray = new Tray(__dirname + '/icons/icon_r.ico')
        const contextMenu = Menu.buildFromTemplate([
            {
                label: 'Check for Updates',
                click: () => {
                    if (!isDev) {
                        autoUpdater.checkForUpdates() 
                    }
                }
            },
            { 
                label: 'Open App', 
                click:  () => {
                    if (!mainWindow) {
                        createWindow()
                    } else {
                        mainWindow.show()
                    }
                }
            },
            {
                label: 'Exit MTTV',
                click:  () => {
                    app.quit()
                }
            }
        ])
        tray.setToolTip('MTTV')
        tray.setContextMenu(contextMenu)
        preloaderWindow.show()
        setTimeout(() => {
            createWindow()
        }, 3000)
    })

    preloaderWindow.on('closed', () => {
        preloaderWindow = null
    })

}

createWindow = () => {
    // Create the browser window.
    mainWindow = new BrowserWindow({
      width: 940,
      height: 740,
      minWidth: 940,
      minHeight: 740,
      frame: true,
      show: false,
      fullscreen: conf.app.fullScreenLaunch,
      icon: __dirname + '/icons/icon_r.ico',
      fullscreenable: true,
      autoHideMenuBar: true,
      webPreferences: {
        webSecurity: false,
        devTools: true,
        allowRunningInsecureContent: true
      },
      backgroundColor: '#0c0d0e'
    })

    // mainWindow.webContents.setFrameRate(60)

    // and load the index.html of the app.
    const startUrl = process.env.ELECTRON_START_URL || url.format({
            pathname: path.join(__dirname, '/../build/index.html'),
            protocol: 'file:',
            slashes: true
    })
    mainWindow.loadURL(startUrl)

    mainWindow.on('ready-to-show', () => {
        preloaderWindow.close()
        preloaderWindow = null
        mainWindow.show()
        //watching for app updates  
        // loading bttv
        BrowserWindow.removeExtension("BetterTTV")
        BrowserWindow.addExtension(bttvUrl)
        if (!isDev) {
            autoUpdater.checkForUpdates()
        }
        // if (mainWindow) {
        //     setInterval(() => {
        //         mainWindow.webContents.session.clearCache(() => {
        //             //some callback.
        //             mainWindow.webContents.send("cache-cleared", true)
        //         })
        //     }, 1000 * 60 * 3)   
        // }
    })
    // mainWindow.loadURL('http://localhost:5000/')
    // Open the DevTools.
    // mainWindow.webContents.openDevTools()
    // mainWindow.setMenu(null)

    // Emitted when the window is closed.
    mainWindow.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null
    })

    mainWindow.on('minimize', () => {
        clearDiscordPresence()
    })

    mainWindow.on('restore', () => {
        mainWindow.webContents.send("reset-discord-presence", true)
    })

    //Opening external links in a browser
    mainWindow.webContents.on('new-window', (event, url) => {
        event.preventDefault()
        shell.openExternal(url)
    })
}

//Exporting playerWindow.html to Stream Component
exports.miniPlayer = (channelName, mpWidth, mpHeight, mpResizable) => {
    const width = mpWidth ? mpWidth : conf.playerWindow.width
    const height = mpHeight ? mpHeight : conf.playerWindow.height
    const resizable = mpResizable ? mpResizable : conf.playerWindow.resizable
    playerWindow = new BrowserWindow({
        width: width,
        height: height,
        minWidth: width,
        minHeight: height,
        frame: false,
        show: true,
        modal: true,
        fullscreen: false,
        fullscreenable: false,
        movable: true,
        resizable: resizable,
        alwaysOnTop: true,
        icon: __dirname + '/icons/icon_r.ico',
        backgroundColor: '#0c0d0e',
        webPreferences: {
            webSecurity: false,
            devTools: false,
            allowRunningInsecureContent: true,
          }
    })

    const playerUrl = url.format({
      pathname: path.join(__dirname, './windows/playerWindow.html'),
      protocol: 'file',
      slashes: true
    })

    playerWindow.loadURL(playerUrl)

    playerWindow.webContents.on('did-finish-load', () => {
      playerWindow.webContents.send('open-player-window', channelName)
    })
    
    playerWindow.on('closed', () => {
        if (mainWindow) {
            mainWindow.webContents.send('close-player-window', true)
        }
        playerWindow = null
    })
}

// exports.devConsole = (enable) => {
//     fs.readFile(confUrl, 'utf8', (err, data) => {
//         if (err) {
//             mainWindow.webContents.send("dev-console-enable", false)
//         } else {
//             if (enable) {
//                 try {
//                     conf = JSON.parse(data)
//                     conf.app.devTools = true
//                     conf = JSON.stringify(conf)
//                     fs.writeFile(confUrl, conf, (err) => {
//                         if (err) {
//                             mainWindow.webContents.send("dev-console-enable", false)
//                         } else {
//                             mainWindow.webContents.send("dev-console-enable", true)
//                         }
//                     })
//                 } catch (err) {
//                     mainWindow.webContents.send("dev-console-enable", false)
//                 }   
//             } else {
//                 try {
//                     conf = JSON.parse(data)
//                     conf.app.devTools = false
//                     conf = JSON.stringify(conf)
//                     fs.writeFile(confUrl, conf, (err) => {
//                         if (err) {
//                             mainWindow.webContents.send("dev-console-enable", false)
//                         } else {
//                             mainWindow.webContents.send("dev-console-enable", true)
//                         }
//                     })
//                 } catch (err) {
//                     mainWindow.webContents.send("dev-console-enable", false)
//                 } 
//             }
//         }
//     })
// }

exports.resizablePlayer = (enable) => {
    fs.readFile(confUrl, 'utf8', (err, data) => {
        if (err) {
            mainWindow.webContents.send("resizable-player", false)
        } else {
            if (enable) {
                try {
                    conf = JSON.parse(data)
                    conf.playerWindow.resizable = true
                    conf = JSON.stringify(conf)
                    fs.writeFile(confUrl, conf, (err) => {
                        if (err) {
                            mainWindow.webContents.send("resizable-player", false)
                        } else {
                            mainWindow.webContents.send("resizable-player", true)
                        }
                    })
                } catch (err) {
                    mainWindow.webContents.send("resizable-player", false)
                }   
            } else {
                try {
                    conf = JSON.parse(data)
                    conf.playerWindow.resizable = false
                    conf = JSON.stringify(conf)
                    fs.writeFile(confUrl, conf, (err) => {
                        if (err) {
                            mainWindow.webContents.send("resizable-player", false)
                        } else {
                            mainWindow.webContents.send("resizable-player", true)
                        }
                    })
                } catch (err) {
                    mainWindow.webContents.send("resizable-player", false)
                } 
            }
        }
    })
}

exports.mpSize = (width, height, id) => {
    fs.readFile(confUrl, 'utf8', (err, data) => {
        if (err) {
            mainWindow.webContents.send("mp-size", false)
        } else {
            try {
                conf = JSON.parse(data)
                conf.playerWindow.width = width
                conf.playerWindow.height = height
                conf = JSON.stringify(conf)
                fs.writeFile(confUrl, conf, (err) => {
                    if (err) {
                        mainWindow.webContents.send("mp-size", false)
                    } else {
                        mainWindow.webContents.send("mp-size", id)
                    }
                })
            } catch (err) {
                mainWindow.webContents.send("mp-size", false)
            }   
        }
    })
}

exports.restartApp = () => {
    app.relaunch()
    app.exit(0)
}

//Exporting twitch subscripiton window
exports.subscribeWindow = (channelName) => {
    subWindow = new BrowserWindow({
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
        backgroundColor: '#0c0d0e'
    })

    const subWinUrl = url.format({
        pathname: path.join(__dirname, './windows/subscribeWindow.html'),
        protocol: 'file',
        slashes: true
    })

    subWindow.loadURL(subWinUrl)

    subWindow.webContents.on('did-finish-load', () => {
        subWindow.webContents.send('get-subscription-url', "https://www.twitch.tv/subs/" + channelName)
    })

    subWindow.on('closed', () => {
        subWindow = null
    })
}

//Exporting twitch subscripiton window
exports.twitchWindow = () => {
    tWindow = new BrowserWindow({
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

exports.getAppID = () => {
    return conf.app.appId
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
    //shortcuts for overlay
    // const overlayShortcut = globalShortcut.register('Shift+M', () => {
    //     if (testWindow) {
    //         testWindow.close()
    //     } else {
    //         overlay()
    //     }
    // })

    //loading app configuration
    fs.readFile(confUrl, 'utf8', (err, data) => {
        if (err) {
            fs.readFile(__dirname + '/app-conf.json', (err, data) => {
                if (err) {
                    fs.writeFile(confErrUrl, err, (err) => {
                        app.exit()
                    })
                } else {
                    fs.writeFile(confUrl, data, (err) => {
                        if (err) {
                            fs.writeFile(confErrUrl, err, (err) => {
                                app.exit()
                            })
                        } else {
                            try {
                                conf = JSON.parse(data)
                                if (conf.app.appId === "none" || !conf.app.appId) {
                                    conf.app.appId = uuid()
                                    const newConf = JSON.stringify(conf)
                                    fs.writeFile(confUrl, newConf, (err) => {
                                        if (err) app.exit()
                                    })
                                }
                                preloader()
                            } catch (err) {
                                fs.writeFile(confErrUrl, err, (err) => {
                                    app.exit()
                                })
                            }
                        }
                    })
                }
            })
        } else {
            try {
                conf = JSON.parse(data)
                if (conf.app.appId === "none" || !conf.app.appId) {
                    conf.app.appId = uuid()
                    const newConf = JSON.stringify(conf)
                    fs.writeFile(confUrl, newConf, (err) => {
                        if (err) app.exit()
                    })
                }
                preloader()
            } catch (err) {
                fs.writeFile(confErrUrl, err, (err) => {
                    app.exit()
                })
            }
        }
    })
})

app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (preloaderWindow === null) {
        preloader()
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

exports.clearApp = () => {
    const ses = mainWindow.webContents.session
    ses.clearStorageData()
}

ipcMain.on("open-dev-tools", (event, res) => {
    if (res) {
        mainWindow.webContents.openDevTools()
    }
})

const template = [
    {
      label: 'Edit',
      submenu: [
        {role: 'undo'},
        {role: 'redo'},
        {type: 'separator'},
        {role: 'cut'},
        {role: 'copy'},
        {role: 'paste'},
        {role: 'pasteandmatchstyle'},
        {role: 'delete'},
        {role: 'selectall'}
      ]
    },
    {
      label: 'View',
      submenu: [
        {role: 'reload'},
        {role: 'forcereload'},
        // {role: 'toggledevtools'},
        {
            label: 'Toggle Developer Tools',
            accelerator: process.platform === 'darwin' ? 'Alt+Cmd+I' : 'Ctrl+Shift+I',
            click: () => {
                if (mainWindow) {
                    if (mainWindow) {
                        mainWindow.webContents.send("try-open-dev-tools", true)
                    }
                }
            }
        },
        {type: 'separator'},
        {role: 'resetzoom'},
        {role: 'zoomin'},
        {role: 'zoomout'},
        {type: 'separator'},
        {role: 'togglefullscreen'}
      ]
    },
    {
      role: 'window',
      submenu: [
        {role: 'minimize'},
        {role: 'close'}
      ]
    }
  ]
  
  if (process.platform === 'darwin') {
    template.unshift({
      label: app.getName(),
      submenu: [
        {role: 'about'},
        {type: 'separator'},
        {role: 'services', submenu: []},
        {type: 'separator'},
        {role: 'hide'},
        {role: 'hideothers'},
        {role: 'unhide'},
        {type: 'separator'},
        {role: 'quit'}
      ]
    })
  }

const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)

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