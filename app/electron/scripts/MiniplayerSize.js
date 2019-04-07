exports.mpSize = (width, height, id) => {
    fs.readFile(confUrl, 'utf8', (err, data) => {
        if (err) {
            mainWindow.webContents.send("mp-size", false)
        } else {
            try {
                conf = JSON.parse(data)
                conf.playerWindow.width = width
                conf.playerWindow.height = height
                conf = JSON.stringify(conf)
                fs.writeFile(confUrl, conf, (err) => {
                    if (err) {
                        mainWindow.webContents.send("mp-size", false)
                    } else {
                        mainWindow.webContents.send("mp-size", id)
                    }
                })
            } catch (err) {
                mainWindow.webContents.send("mp-size", false)
            }   
        }
    })
}