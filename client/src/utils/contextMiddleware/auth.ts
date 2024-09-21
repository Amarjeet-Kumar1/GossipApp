import { getActiveSocket } from "../../config/globalSocket"
import { getAccessToken, setAccessToken } from "../accessToken"
import { SocketIO } from "../socket"
import { googleSignin, logoutUser } from "../../api/login"
import { SERVER_URL } from "../../api/api"

export const initiateSigninMiddleware = async ({ payload, context }: any) => {
  const { setSocketConnectionSuccess } = context
  const userData = await googleSignin(payload)
  setAccessToken(userData.accessToken)
  const initializedSocket = new SocketIO(
    SERVER_URL as string,
    getAccessToken(),
    context
  )
  initializedSocket.getActiveSocket()
  const socket = getActiveSocket()
  if (socket) {
    setSocketConnectionSuccess()
  }
}

export const initiateLogoutMiddleware = async ({ logout }: any) => {
  const status = await logoutUser()
  if (status === 200) {
    localStorage.removeItem("GossipApp_token")
    logout()
  }
}

export const initAuthuserInfoUpdateMiddleware = ({
  payload,
  authuserInfoUpdateSuccessfull,
}: any) => {
  const socket = getActiveSocket()
  socket.emit("updateUserProfile", payload)
  authuserInfoUpdateSuccessfull(payload)
}
