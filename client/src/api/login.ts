import { authApi, publicApi } from "./api"

export const getGoogleOauthURI = async () => {
  const { data } = await publicApi.get(`/auth/google/uri`)

  return data.data
}

export const googleSignin = async (body: { code: string }) => {
  const { data } = await publicApi.post(`/auth/google/authenticate`, {
    code: body.code,
  })

  return data.data
}

export const logoutUser = async () => {
  const { status } = await authApi.get(`/auth/logout`)

  return status
}

export const getRefreshToken = async () => {
  const { data } = await publicApi.get(`/auth/refresh-token`)

  return data.data.accessToken
}
