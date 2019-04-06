const { app, Menu } = require('electron')

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