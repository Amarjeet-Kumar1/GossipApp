import { createNewChat } from "@/api/chat"
import { uploadChatFile } from "@/api/file"
import { getActiveSocket } from "@/config/globalSocket"

const uploadFile = async (
  attachmentArr: any[],
  msginfo: any,
  updateSentFileUrl: any
) => {
  return await Promise.all(
    attachmentArr.map(async (_data: any) => {
      const formData = new FormData()
      formData.append("file", _data[0])

      const fileType = _data[0].type.split("/")[0]
      const msgType = ["image", "video"].includes(fileType)
        ? fileType
        : fileType === "audio"
        ? "voice"
        : "document"

      const path = await uploadChatFile(formData)

      updateSentFileUrl({
        refId: msginfo.refId,
        updatedUrl: path,
        tempId: _data[1].clientParams.tempId,
      })

      getActiveSocket().emit("iTextMessage", {
        tempId: _data[1].clientParams.tempId,
        ...msginfo,
        msgType,
        msgParams: {
          ..._data[1].extraParam,
          url: path,
        },
      })
    })
  )
}

const sendInitialMessages = (data: any, sendFileInit: any) => {
  data.files.forEach((filedata: any) => {
    const fileType = filedata[0].type.split("/")[0]
    const msgType = ["image", "video"].includes(fileType)
      ? fileType
      : fileType === "audio"
      ? "voice"
      : "document"

    sendFileInit({
      tempId: filedata[1].clientParams.tempId,
      ...data.msgInfo,
      timestamp: Date.now(),
      msgType,
      msgParams: filedata[1].extraParam,
    })
  })
}

export const uploadAttachmentsMiddleware = async ({
  payload,
  resetFileAttachmentModal,
  newChatSuccessfullyCreated,
  chat,
  sendFileInit,
  updateSentFileUrl,
}: any) => {
  resetFileAttachmentModal()
  // update UI (sending state)
  sendInitialMessages(payload, sendFileInit)

  // if chat was just created
  if (payload.clientSide) {
    const socket = getActiveSocket()

    delete payload.clientSide
    const v: number = await createNewChat({
      chatInfo: chat[payload.msgInfo.refId].chatInfo,
    })
    if (v === 200) {
      newChatSuccessfullyCreated(payload.msgInfo.refId)
      socket.emit("updateOthersChats", {
        chatInfo: {
          ...chat[payload.msgInfo.refId].chatInfo,
        },
        messages: [],
      })
    }
  }

  await uploadFile(payload.files, payload.msgInfo, updateSentFileUrl)
}
