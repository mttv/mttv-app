const fs = require('fs')
//generating app unique id
const uuid = require('uuid/v4')

const config = require('../config')

//Without app-conf.json app shouldn't launch
const confUrl = config.APP_CONFIG_PATH
const confSchema = config.APP_CONFIG_SCHEMA
const confErrUrl = config.APP_CONFIG_ERROR_PATH

module.exports = {
    initConf,
    loadConf,
    writeErrorConf,
    miniplayerResize,
    miniplayerSize
}

/*
    If user launch app for the first time,
    new app-conf.json will be create from template with new unique app id.
    If not, we will read already created app config.
*/
function initConf() {
    return new Promise((resolve, reject) => {
        fs.readFile(confUrl, 'utf8', (err, data) => {
            if (err) {
                fs.readFile(confSchema, (err, data) => {
                    if (err) {
                        writeErrorConf(err)
                        reject("Config init error: Failed to read app-conf.json schema.")
                    } else {
                        const appConf = JSON.parse(data)
                        appConf.app.appId = uuid()
                        const writeAppConf = JSON.stringify(appConf)
                        fs.writeFile(confUrl, writeAppConf, (err) => {
                            if (err) {
                                writeErrorConf(err)
                                reject("Config init error: Failed to create new app-conf.json.")
                            } else {
                                resolve(appConf)
                            }
                        })
                    }
                })
            } else {
                const appConf = JSON.parse(data)
                if (appConf.app.appId === "none" || !appConf.app.appId) {
                    appConf.app.appId = uuid()
                    const writeAppConf = JSON.stringify(appConf)
                    fs.writeFile(confUrl, writeAppConf, (err) => {
                        if (err) {
                            writeErrorConf(err)
                            reject("Config init error: Failed to write app-conf.json.")
                        } else {
                            resolve(appConf)
                        }
                    })
                } else {
                    resolve(appConf)
                }
            }
        })
    })
}

function writeErrorConf(err) {
    fs.writeFile(confErrUrl, err, (err) => {
        if (err) app.exit()
    })
}

function loadConf() {
    return new Promise((resolve, reject) => {
        fs.readFile(confUrl, (err, data) => {
            if (err) {
                writeErrorConf(err)
                reject("Config loader error: Failed to load app-conf.json.")
            } else {
                resolve(JSON.parse(data))
            }
        })
    })
}

//functions for editing app-conf.json
function miniplayerSize(width, height, id) {
    return new Promise((resolve, reject) => {
        loadConf()
        .then(res => {
            const appConf = res
            appConf.playerWindow.width = width
            appConf.playerWindow.height = height
            const writeAppConf = JSON.stringify(appConf)
            fs.writeFile(confUrl, writeAppConf, (err) => {
                if (err) {
                    writeErrorConf(err)
                    reject("Error while editing app-conf.json.")
                } else {
                    resolve(id)
                }
            })
        })
        .catch(err => {
            reject(err)
            writeErrorConf(err)
        })
    })
}

function miniplayerResize(newVal) {
    return new Promise((resolve, reject) => {
        loadConf()
            .then(res => {
                const appConf = res
                appConf.playerWindow.resizable = newVal
                const writeAppConf = JSON.stringify(appConf)
                fs.writeFile(confUrl, writeAppConf, (err) => {
                    if (err) {
                        writeErrorConf(err)
                        reject("Error while editing app-conf.json.")
                    } else {
                        resolve(newVal)
                    }
                })
            })
            .catch(err => {
                reject(err)
                writeErrorConf(err)
            })
    })
}
