require("dotenv").config()
const port = process.env.PORT || 8080
import cors from "cors"
import http from "http"
import { PeerServer } from "peer"
import express from "express"
import socket from "socket.io"
import cookieParser from "cookie-parser"
import morgan from "morgan"

import { socketMain } from "./socket.io/socketMain"
import { initializeMongoDb } from "./database/mongoInstance"
import { socketAuth } from "./middlewares/auth.middlewares"
import logger from "./utils/winston"
import router from "./routes"
;(async () => {
  const app = express()

  app.use(express.urlencoded({ extended: true }))
  app.use(express.json())
  app.use(cookieParser())
  // @ts-expect-error
  app.use(morgan("common", { stream: logger.stream }))
  app.use(
    cors({
      origin: process.env.FRONTEND_URL,
      credentials: true,
    })
  )

  await PeerServer({ port: 9000, path: "/peer-server" })

  app.use("/", router)

  const server = http.createServer(app)

  const io = new socket.Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      credentials: true,
    },
  })

  await initializeMongoDb()

  server.listen(port, () => logger.info(`server is running on ${port}`))

  io.use(socketAuth)

  io.on("connection", (socket: socket.Socket) => {
    socketMain(io, socket)
  })
})()
