const { app } = require('electron')

exports.restartApp = () => {
    app.relaunch()
    app.exit(0)
}