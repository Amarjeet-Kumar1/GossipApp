import { getActiveSocket } from "@/config/globalSocket"
import { v4 as uuidv4 } from "uuid"

export const initCallMiddleware = ({
  payload,
  callingActive,
  setRoomModal,
  chat,
}: any) => {
  const peerId = uuidv4()
  callingActive()

  setRoomModal({
    peerId,
    callBy: payload.callBy,
    groupInfo: chat[payload.refId].chatInfo,
    extraParam: { ...payload, peerId },
    acceptedCall: false,
  })
}

export const rejectCallMiddleware = () => {
  const socket = getActiveSocket()
  socket.emit("reject-call")
}
