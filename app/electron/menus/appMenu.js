const { Menu } = require('electron')

module.exports = Menu.buildFromTemplate([
    {
      label: 'Edit',
      submenu: [
        {role: 'undo'},
        {role: 'redo'},
        {type: 'separator'},
        {role: 'cut'},
        {role: 'copy'},
        {role: 'paste'},
        {role: 'pasteandmatchstyle'},
        {role: 'delete'},
        {role: 'selectall'}
      ]
    },
    {
      label: 'View',
      submenu: [
        {role: 'reload'},
        {role: 'forcereload'},
        // {role: 'toggledevtools'},
        {
            label: 'Toggle Developer Tools',
            accelerator: process.platform === 'darwin' ? 'Alt+Cmd+I' : 'Ctrl+Shift+I',
            click: () => {
                if (mainWindow) {
                    if (mainWindow) {
                        mainWindow.webContents.send("try-open-dev-tools", true)
                    }
                }
            }
        },
        {type: 'separator'},
        {role: 'resetzoom'},
        {role: 'zoomin'},
        {role: 'zoomout'},
        {type: 'separator'},
        {role: 'togglefullscreen'}
      ]
    },
    {
      role: 'window',
      submenu: [
        {role: 'minimize'},
        {role: 'close'}
      ]
    }
  ])
  
//   if (process.platform === 'darwin') {
//     template.unshift({
//       label: app.getName(),
//       submenu: [
//         {role: 'about'},
//         {type: 'separator'},
//         {role: 'services', submenu: []},
//         {type: 'separator'},
//         {role: 'hide'},
//         {role: 'hideothers'},
//         {role: 'unhide'},
//         {type: 'separator'},
//         {role: 'quit'}
//       ]
//     })
// }