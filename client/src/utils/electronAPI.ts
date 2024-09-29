export const ELECTRON_API = {
  SEND_NOTIFICATION: ({ type, content }: { type: string; content: string }) => {
    // @ts-ignore
    if (typeof window?.electronAPI?.sendNotification === "function") {
      // @ts-ignore
      window?.electronAPI?.sendNotification({
        type,
        content,
      })
    }
  },
}
