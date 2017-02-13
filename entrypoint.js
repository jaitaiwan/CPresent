let mainWindow = null,
    stage = process.env.stage || "development"

const url = require('url'),
      path = require('path'),
      createWindow = _ => {
          // Create a new browser window
          mainWindow = new BrowserWindow({width: 800, height: 600})
          switch (stage) {
            default:
              mainWindow.loadURL(url.format({
                pathname: path.join(__dirname, "dist", "index.html"),
                protocol: "file:",
                slashes: true,
              }))
              break

            case "development":
              mainWindow.loadURL('http://localhost:8033')
              mainWindow.webContents.openDevTools()
              break
          }


          mainWindow.on('closed', _ => {
            mainWindow = null
          })
        },
      e = require('electron'),
      app = e.app,
      BrowserWindow = e.BrowserWindow,
      crashReporter = e.crashReporter

// crashReporter.start({"companyName": "jaitaiwan"})

// When all windows are closed
app.on('window-all-closed', _ => {
  // If we're not using mac os
  if (process.platform != 'darwin') {
    // Close the app
    app.quit()
  }
})

app.on('ready', createWindow)

app.on('activate', _ => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})
