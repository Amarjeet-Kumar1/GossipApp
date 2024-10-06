import { getRefreshToken } from "@/api/login"
import { storeTokens } from "./token"

export const refreshToken = async () => {
  try {
    const { accessToken, refreshToken } = await getRefreshToken()
    if (accessToken && refreshToken)
      await storeTokens(accessToken, refreshToken)
  } catch (err: any) {
    console.log(err)
    throw new Error(err)
  }
}
