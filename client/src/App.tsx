import s from "./App.module.scss"
import { ChatContainer } from "./components/ChatContainer/ChatContainer"
import { DropMenu } from "./widgets/Dropmenu/Dropmenu"
import { Login } from "./components/Login/Login"
import { MovableModal } from "./widgets/MovableModal/MovableModal"
import { RoomModal } from "./widgets/RoomModal/RoomModal"
import { Sidebar } from "./components/Sidebar/Sidebar"
import { CallerInfo } from "./widgets/CallerInfo/CallerInfo"
import { useContext, useEffect } from "react"
import { Context } from "./contexts/Context"
import { refreshToken } from "./utils/refreshToken"
import { getAccessToken } from "./utils/accessToken"
import { SocketIO } from "./utils/socket"
import { SERVER_URL } from "./api/api"
import { GlobalModal } from "./widgets/GlobalModal/GlobalModal"
//@ts-ignore
import LegendaryCursor from "legendary-cursor"
import { askNotificationPermission } from "./utils/notification"

const App = () => {
  const context = useContext(Context)
  const { auth, socketStatus, setAuthFailed, setSocketConnectionSuccess } =
    context

  useEffect(() => {
    LegendaryCursor.init({
      lineSize: 0.02,
    })
    askNotificationPermission()
    ;(async () => {
      try {
        await refreshToken()
        const accessToken = getAccessToken()

        if (!accessToken) {
          setAuthFailed(null)
          return
        } else {
          const initializedSocket = new SocketIO(
            SERVER_URL as string,
            getAccessToken(),
            context
          )
          const socket = await initializedSocket.getActiveSocket()
          if (socket.connected) {
            setSocketConnectionSuccess()
          }
          return
        }
      } catch (error) {
        setAuthFailed(null)
        return
      }
    })()
  }, [])

  return auth ? (
    <div>
      {socketStatus ? null : (
        <div className={s.smoke}>
          <div className={s.modal}>
            <div className={s.disconnectedModal}>
              <p>Sorry, server down. We'll be back back soon.</p>
            </div>
          </div>
        </div>
      )}
      <CallerInfo />
      <RoomModal />
      <MovableModal />
      <GlobalModal />
      <DropMenu />
      <div className={s.app}>
        <div className={s.appContainer}>
          <Sidebar />
          <ChatContainer />
        </div>
      </div>
    </div>
  ) : (
    <div
      style={{
        textAlign: "center",
      }}
      className={s.app}
    >
      <Login />
    </div>
  )
}

export default App
