// import Icon from "@/assets/images/icon.png"
import { ELECTRON_API } from "./electronAPI"

export const askNotificationPermission = async () => {
  if (!("Notification" in window)) {
    console.log("This browser does not support notifications.")
    return
  }
  const permission = await Notification.requestPermission()

  return permission
}

const showNotification = ({
  type,
  content,
}: {
  type: string
  content: string
}) => {
  if (document.hidden) {
    const notification = new Notification("New from GossipApp", {
      body: content,
      // icon: Icon,
      tag: type,
    })

    notification.onclick = function () {
      const targetUrl = window.location.href
      window.open(targetUrl, "_blank")
      notification.close()
    }

    setTimeout(() => {
      notification.close()
    }, 10000)
  }
}

export const sendNotification = ({
  type,
  content,
}: {
  type: string
  content: string
}) => {
  ELECTRON_API.SEND_NOTIFICATION({ type, content })
  if (Notification?.permission === "granted") {
    showNotification({ type, content })
  } else {
    askNotificationPermission().then((permission) => {
      if (permission === "granted") {
        showNotification({ type, content })
      }
    })
  }
}
