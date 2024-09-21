import { getRefreshToken } from "../api/login"
import { setAccessToken } from "./accessToken"

export const refreshToken = async () => {
  try {
    const accessToken = await getRefreshToken()
    if (accessToken) setAccessToken(accessToken)
  } catch (err: any) {
    console.log(err)
    throw new Error(err)
  }
}
