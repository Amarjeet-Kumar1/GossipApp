import {
  createNewChat,
  createNewGroup,
  getInitialChatData,
  getMessages,
} from "@/api/chat"
import { getActiveSocket } from "@/config/globalSocket"

const getAllMessages = async (data: any) => {
  return await Promise.all(
    data.map(async (obj: any) => {
      const data = await getMessages({ _id: obj._id })
      console.log(data)
      //@ts-ignore
      return [obj, data]
    })
  )
}

export const getInitialChatsMiddleware = async ({
  onChatsLoadComplete,
}: any) => {
  const _all = await getInitialChatData()
  const chats = await getAllMessages(_all)
  const chatsObj = chats.reduce((result: any, item: any) => {
    result[item[0]._id] = {
      chatInfo: item[0],
      messages: item[1],
    }
    return result
  }, {})
  onChatsLoadComplete(chatsObj)
}

// Send Msg
export const sendMsgStartMiddleware = async ({
  payload,
  newChatSuccessfullyCreated,
  chat,
}: any) => {
  //@ts-ignore
  const socket = getActiveSocket()

  // If chat was just created and this is the first message being sent
  if (payload.clientSide) {
    delete payload.clientSide
    const v: number = await createNewChat({
      chatInfo: chat[payload.refId].chatInfo,
    })
    if (v === 200) {
      newChatSuccessfullyCreated(payload.refId)
      socket.emit("updateOthersChats", {
        chatInfo: {
          ...chat[payload.refId].chatInfo,
        },
        messages: [],
      })
      socket.emit("iTextMessage", {
        ...payload,
      })
    }
  } else {
    // chat already existed, sending message
    socket.emit("iTextMessage", payload)
  }
}

export const setActiveChatMiddleware = () => {
  // getActiveSocket().emit("switchActiveChat", payload)
}

export const createNewGroupMiddleware = async ({
  payload,
  newGroupCreated,
}: any) => {
  const v: number = await createNewGroup({
    chatInfo: payload,
  })
  const socket = getActiveSocket()
  if (v === 200) {
    socket.emit("updateOthersChats", {
      chatInfo: payload,
      messages: [],
    })
    newGroupCreated(payload._id)
  }
}

export const initGroupInfoUpdateMiddleware = ({
  payload,
  groupInfoUpdateSuccessfull,
}: any) => {
  const socket = getActiveSocket()
  socket.emit("updateGroupInfo", payload)
  groupInfoUpdateSuccessfull(payload)
}
