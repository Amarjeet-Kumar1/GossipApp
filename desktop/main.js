const { app, BrowserWindow, ipcMain, Notification } = require("electron")
const path = require("node:path")

let mainWindow = null

// let url = "http://localhost:5173"
let url = "https://gossipapp-server.onrender.com"

const isMac = process.platform === "darwin"
const isWindows = process.platform === "win32"
const isLinux = process.platform == "linux"

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    icon: path.join(__dirname, "/assets/icon.png"),
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  })

  app.setName("GossipApp")

  mainWindow.loadURL(url).then(() => {
    ipcMain.on("notification", (event, arg) => {
      showNotification(arg)
    })
  })
}

function focusWindow() {
  if (mainWindow) {
    if (mainWindow.isMinimized()) {
      mainWindow.restore()
    }
    mainWindow.show()
    app.focus()
    mainWindow.focus()
  }
}

function showNotification({ type = "", content = "" }) {
  if (app.isReady()) {
    const notification = new Notification({
      title: "New from GossipApp",
      subtitle: type,
      body: content,
      silent: false,
      icon: path.join(__dirname + "/assets/icon.png"),
      sound: false,
      urgency: type === "Call" ? "critical" : "normal",
      closeButtonText: "Close",
    })
    notification.show()

    notification.on("click", (event, arg) => {
      focusWindow()
    })
    setTimeout(() => {
      notification.close()
    }, 10000)
  }
}

app.whenReady().then(() => {
  createWindow()

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on("window-all-closed", () => {
  if (isMac) app.quit()
})
