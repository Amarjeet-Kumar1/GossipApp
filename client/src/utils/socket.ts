import io, { Socket } from "socket.io-client"
import { setActiveSocket } from "../config/globalSocket"
import { InitialState } from "../contexts/types"
import { getInitialChatsMiddleware } from "./contextMiddleware/chat"

export class SocketIO {
  private socket: Socket
  private context: InitialState

  public constructor(
    serverUrl: string,
    accessToken: string,
    context: InitialState
  ) {
    this.socket = io(serverUrl, {
      // Set cred to false as no need to send cookies
      withCredentials: false,
      auth: (cb) => {
        cb({
          accessToken,
        })
      },
    })
    this.context = context
  }

  private configure() {
    // Socket Verified
    this.socket?.on("signInSuccess", (mainPayload: any) => {
      this.context.setAuthSuccess(mainPayload)

      this.context.getInitialChats()

      getInitialChatsMiddleware({
        onChatsLoadComplete: this.context.onChatsLoadComplete,
      })
      this.socket?.emit("getTotalUsers")

      // Total Users
      this.socket?.on("updateTotalUsers", (payload: string) => {
        this.context.updateTotalAuthUsers(payload)
      })

      // Update Users
      this.socket?.on("setInitialTotalUsers", (payload: string) => {
        this.context.setTotalAuthUsers(payload)
      })

      // Handle User's active status
      this.socket?.on("online", (payload: string) => {
        this.context.updateActiveAuthUser(payload)
      })

      // Handle User's inactive status
      this.socket?.on("offline", (payload: string) => {
        this.context.updateInactiveAuthUser(payload)
      })

      // Message was successfully sent
      this.socket.on("messageSentSuccessfully", (payload: any) => {
        this.context.sendMsgSuccessful(payload)
      })

      this.socket.on("recieveMessage", (payload: any) => {
        this.context.recieveMessage(payload)
      })

      this.socket.on("onOtherAuthUsersInfoUpdate", (payload: any) => {
        this.context.updateAuthUsersInfo(payload)
      })

      this.socket.on("onGroupInfoUpdate", (payload: any) => {
        this.context.groupInfoUpdateSuccessfull(payload)
      })

      this.socket.on("incomingCall", (payload: any) => {
        this.context.othersCalling(payload)
      })

      this.socket.on("incomingCallCanceledByOther", () => {
        this.context.othersCalling(null)
      })

      this.socket.on("user-connected-to-vc", (payload: any) => {
        this.context.setNewConnection(payload)
      })

      // // Handle others chat switches
      // this.socket?.on("activeChatsSwitched", (payload: any) => {
      //   this.context.updateLastViewedChatsTimestampOfOtherUser(payload);
      // });

      // // Handle others active chats
      // this.socket?.on("friendCurrentlyOn", (payload: any) => {
      //   this.context.updateOtherUsersActiveChat(payload);
      // });

      // Socket Disconnected
      this.socket?.on("multipleSession", () => {
        this.context.setGlobalModal({
          type: "multipleSession",
          params: {},
        })
      })

      this.socket?.on("updateExistingChats", (payload: any) => {
        this.context.updateChats(payload)
      })

      // Socket Disconnected
      this.socket?.on("disconnect", () => {
        this.context.socketDisconnected()
      })
    })
  }

  public async getActiveSocket(): Promise<Socket> {
    return await new Promise((resolve) => {
      this.socket.on("connect", () => {
        this.configure()
        setActiveSocket(this.socket)
        resolve(this.socket)
      })
    })
  }
}
