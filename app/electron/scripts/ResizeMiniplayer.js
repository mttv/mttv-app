exports.resizablePlayer = (enable) => {
    fs.readFile(confUrl, 'utf8', (err, data) => {
        if (err) {
            mainWindow.webContents.send("resizable-player", false)
        } else {
            if (enable) {
                try {
                    conf = JSON.parse(data)
                    conf.playerWindow.resizable = true
                    conf = JSON.stringify(conf)
                    fs.writeFile(confUrl, conf, (err) => {
                        if (err) {
                            mainWindow.webContents.send("resizable-player", false)
                        } else {
                            mainWindow.webContents.send("resizable-player", true)
                        }
                    })
                } catch (err) {
                    mainWindow.webContents.send("resizable-player", false)
                }   
            } else {
                try {
                    conf = JSON.parse(data)
                    conf.playerWindow.resizable = false
                    conf = JSON.stringify(conf)
                    fs.writeFile(confUrl, conf, (err) => {
                        if (err) {
                            mainWindow.webContents.send("resizable-player", false)
                        } else {
                            mainWindow.webContents.send("resizable-player", true)
                        }
                    })
                } catch (err) {
                    mainWindow.webContents.send("resizable-player", false)
                } 
            }
        }
    })
}