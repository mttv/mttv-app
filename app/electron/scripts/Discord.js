//discord lib
const DiscordRPC = require('discord-rpc')

const config = require('../config')
const clientId = config.DISCORD_API_ID
const scopes = config.DISCORD_RPC_SCOPES

const windows = require('../windows/index')
const scripts = require('./index')

DiscordRPC.register(clientId)
const rpc = new DiscordRPC.Client({transport: 'ipc'})

module.exports = {
    login,
    clearPresence,
    setActivity
}

//auth app for discord rpc
function login() {
    rpc.login({clientId, scopes})
        .then(res => {
            if (rpc.user === null) {
                scripts.eventHandler.sendMessage(windows.mainWindow.win, "discord-rpc-status", false)
            } else {
                scripts.eventHandler.sendMessage(windows.mainWindow.win, "discord-rpc-status", true)
            }
        }).catch(err => {
            if (err.code === 4002) {
                scripts.eventHandler.sendMessage(windows.mainWindow.win, "discord-rpc-status", true)
            } else {
                scripts.eventHandler.sendMessage(windows.mainWindow.win, "discord-rpc-status", false)
                scripts.eventHandler.sendMessage(windows.mainWindow.win, "discord-rpc-status", err)
            }
        })
}

//Main func for discord user activity handler
async function setActivity(channelName, startTimestamp) {

    if (!rpc || !windows.mainWindow.win) {
        return
    }

    rpc.setActivity({
        details: `Watching ${channelName}`,
        startTimestamp,
        largeImageKey: "icon_discord",
        instance: false
    })
}

function clearPresence() {
    rpc.clearActivity()
}