const { app } = require('electron')

module.exports = {
    APP_NAME: "MTTV",
    APP_ICON: __dirname + '/icons/icon_r.ico',
    APP_LOGO: __dirname + '/icons/logo.png',
    BTTV_PATH: __dirname + '/extensions/bttv',
    APP_CONFIG_SCHEMA: __dirname + '/app-conf.json',
    APP_CONFIG_PATH: app.getPath("userData") + '/app-conf.json',
    APP_CONFIG_ERROR_PATH: app.getPath("userData") + '/app-crash-error.json',
    DISCORD_API_ID: "558341590888742914",
    DISCORD_RPC_SCOPES: ['identify', 'email', 'rpc', 'rpc.api']
}