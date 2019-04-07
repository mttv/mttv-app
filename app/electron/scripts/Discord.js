//discord lib
const DiscordRPC = require('discord-rpc')
const clientId = '558341590888742914'
const scopes = ['identify', 'email', 'rpc', 'rpc.api']

DiscordRPC.register(clientId)
const rpc = new DiscordRPC.Client({transport: 'ipc'})

module.exports = {
    login,
    clearDiscordPresence,
    setActivity
}

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
            }).catch(e => {
                mainWindow.webContents.send("discord-rpc-status", false)
                if (e.code === 4002) {
                    mainWindow.webContents.send("discord-rpc-status", true)
                } else {
                    mainWindow.webContents.send("discord-rpc-status", false)
                    mainWindow.webContents.send("discord-rpc-status", e)
                }
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