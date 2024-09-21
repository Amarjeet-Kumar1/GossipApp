import { Socket } from "socket.io"

export const disconnectVideoCall = (
  socket: Socket,
  roomId: string,
  peerUserId: string
) => {
  socket.broadcast.to(roomId).emit("user-disconnected-from-vc", peerUserId)
}
