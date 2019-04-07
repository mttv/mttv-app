const { app, Menu } = require('electron')

//checking app status
const isDev = require('electron-is-dev')

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