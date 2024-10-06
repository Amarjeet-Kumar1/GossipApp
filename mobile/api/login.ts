import { getStoredRefreshToken } from "@/utils/token"
import { publicApi } from "./api"

export const googleSignin = async (body: {
  name: string
  picture: string
  email: string
}) => {
  const { data } = await publicApi.post(
    `/api/auth/mobile/google/authenticate`,
    { name: body.name, picture: body.picture, email: body.email }
  )

  return data.data
}

export const getRefreshToken = async () => {
  const refreshToken = await getStoredRefreshToken()
  const { data } = await publicApi.post(`/api/auth/mobile/refresh-token`, {
    refreshToken: refreshToken,
  })

  return data.data
}
