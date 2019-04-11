const log = require('electron-log')
//Updates module
const { autoUpdater } = require('electron-updater')
autoUpdater.logger = log
autoUpdater.logger.transports.file.level = 'info'

module.exports = {
    sendMessage,
    sendLogMessage
}

function sendMessage(window, event, msg) {
    if (window) {
        window.webContents.send(event, msg)
    }
}

function sendLogMessage(msg) {
    log.info(msg)
}