import { authApi } from "./api"

export const uploadChatFile = async (body: FormData) => {
  const { data } = await authApi.post(`/api/chats/file-upload`, body, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })

  return data.data.path
}
