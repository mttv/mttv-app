const fs = require('fs')
//generating app unique id
const uuid = require('uuid/v4')

const config = require('../config')

//conf path is different for prod and dev versions
const confUrl = config.APP_CONFIG_PATH
const confSchema = config.APP_CONFIG_SCHEMA
const confErrUrl = config.APP_CONFIG_ERROR_PATH

module.exports = {
    loadConf,
    writeErrorConf
}

function writeErrorConf(err) {
    fs.writeFile(confErrUrl, err, (err) => {
        if (err) app.exit()
    })
}

function loadConf() {
    return new Promise((resolve, reject) => {
        fs.readFile(confUrl, 'utf8', (err, data) => {
            if (err) {
                fs.readFile(confSchema, (err, data) => {
                    if (err) {
                        writeErrorConf(err)
                        reject("Error while reading app-conf.json schema")
                    } else {
                        const appConf = JSON.parse(data)
                        appConf.app.appId = uuid()
                        const writeAppConf = JSON.stringify(appConf)
                        fs.writeFile(confUrl, writeAppConf, (err) => {
                            if (err) {
                                writeErrorConf(err)
                                reject("Error while creating new app-conf.json")
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
                            reject("Error while writing app-conf.json")
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
