import { authApi, publicApi } from "./api"

export const getGoogleOauthURI = async () => {
  const { data } = await publicApi.get(`/api/auth/google/uri`)

  return data.data
}

export const googleSignin = async (body: { code: string }) => {
  const { data } = await publicApi.post(`/api/auth/google/authenticate`, {
    code: body.code,
  })

  return data.data
}

export const logoutUser = async () => {
  const { status } = await authApi.get(`/api/auth/logout`)

  return status
}

export const getRefreshToken = async () => {
  const { data } = await publicApi.get(`/api/auth/refresh-token`)

  return data.data.accessToken
}
