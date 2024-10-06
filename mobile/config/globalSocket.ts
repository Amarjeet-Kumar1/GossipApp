import { Socket } from "socket.io-client"

let socket: Socket

export const setActiveSocket = (activeSocket: Socket) => {
  socket = activeSocket
}

export const getActiveSocket = () => socket
