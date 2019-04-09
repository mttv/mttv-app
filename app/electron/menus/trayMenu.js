const { app, Menu } = require('electron')
//checking app status
const isDev = require('electron-is-dev')
//Updates module
const { autoUpdater } = require('electron-updater')

const windows = require('../windows/index')

module.exports = Menu.buildFromTemplate([
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
            if (!windows.mainWindow.win) {
                windows.mainWindow.initWindow()
            } else {
                windows.mainWindow.show()
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