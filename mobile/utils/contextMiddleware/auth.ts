import { removeStoredTokens, storeTokens } from "../token"
import { SocketIO } from "../socket"

import { GoogleSignin } from "@react-native-google-signin/google-signin"
import { googleSignin } from "@/api/login"
import { SERVER_URL } from "@/constants/env"
import { getActiveSocket } from "@/config/globalSocket"

const signInWithGoogle = async () => {
  try {
    GoogleSignin.configure({
      webClientId:
        "978234600776-res9llujubq2d3ra6req99vm4hukmdsn.apps.googleusercontent.com",
      offlineAccess: true,
      scopes: ["profile", "email"],
    })

    await GoogleSignin.hasPlayServices()
    const userInfo = await GoogleSignin.signIn()

    const { data } = userInfo

    if (data && data.user) {
      const userData = {
        name: data.user.name || "",
        email: data.user.email || "",
        picture: data.user.photo || "",
      }

      const res = await googleSignin(userData)

      return res
    }
  } catch (error) {
    console.error("Google Sign-In Error:", error)
    throw new Error(`Google Sign-In Error, ${error}`)
  }
}

export const initiateSigninMiddleware = async ({ context }: any) => {
  const { setSocketConnectionSuccess } = context
  const userData = await signInWithGoogle()
  await storeTokens(userData.accessToken, userData.refreshToken)
  const initializedSocket = new SocketIO(
    SERVER_URL as string,
    userData.accessToken,
    context
  )
  initializedSocket.getActiveSocket()
  const socket = getActiveSocket()
  if (socket) {
    setSocketConnectionSuccess()
  }
}

export const initiateLogoutMiddleware = async ({ logout }: any) => {
  await removeStoredTokens()
  logout()
}

export const initAuthuserInfoUpdateMiddleware = ({
  payload,
  authuserInfoUpdateSuccessfull,
}: any) => {
  const socket = getActiveSocket()
  socket.emit("updateUserProfile", payload)
  authuserInfoUpdateSuccessfull(payload)
}
