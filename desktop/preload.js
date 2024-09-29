const { contextBridge, ipcRenderer } = require("electron")

contextBridge.exposeInMainWorld("electronAPI", {
  sendNotification: ({ type, content }) =>
    ipcRenderer.send("notification", { type, content }),
})
