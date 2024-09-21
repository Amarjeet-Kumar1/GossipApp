import { authApi } from "./api"

export const getInitialChatData = async () => {
  const { data } = await authApi.get(`/api/chats`)

  return data.data
}

export const getMessages = async (body: { _id: string }) => {
  const { data } = await authApi.get(`/api/chats/${body._id}`)

  return data.data
}

export const createNewChat = async (body: { chatInfo: any }) => {
  const { status } = await authApi.post(
    `/api/chats/create-new-chat`,
    body.chatInfo
  )

  return status
}

export const createNewGroup = async (body: { chatInfo: any }) => {
  console.log("object", body)
  const { status } = await authApi.post(
    `/api/chats/create-new-group`,
    body.chatInfo
  )

  return status
}
