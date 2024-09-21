import { verify } from "jsonwebtoken"
import logger from "../utils/winston"
import { NextFunction, Request, Response } from "express"
import { unauthorizedResponse } from "../utils/response"
import { Socket } from "socket.io"

const auth = (req: Request, res: Response, next: NextFunction) => {
  const authorization = req.headers["authorization"]

  if (!authorization) {
    return unauthorizedResponse(res)
  }

  try {
    const token: string = authorization.split(" ")[1]
    const payload: any = verify(token, process.env.JWT_ACCESS_SECRET)
    req.payload = payload
    return next()
  } catch (err) {
    logger.error(err)
    return unauthorizedResponse(res)
  }
}

// Socket.io middleware
const socketAuth = (socket: Socket, next: any) => {
  const { accessToken }: any = socket.handshake.auth
  verify(
    accessToken,
    process.env.JWT_ACCESS_SECRET,
    (err: any, payload: any) => {
      if (err) {
        socket.disconnect(true)
        return next(new Error("Not Authorized!"))
      }
      return next()
    }
  )
}

export { auth, socketAuth }
