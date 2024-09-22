require("dotenv").config()
const port = process.env.PORT || 8080
const cluster = require("cluster")
const { createClient } = require("redis")
const { createAdapter } = require("@socket.io/redis-adapter")
const num_processes = require("os").cpus().length
// const num_processes = 2
import net from "net"
import cors from "cors"
import http from "http"
import { ExpressPeerServer } from "peer"
import express from "express"
import socket from "socket.io"
import farmhash from "farmhash"
import cookieParser from "cookie-parser"
import morgan from "morgan"

import { socketMain } from "./socket.io/socketMain"
import { initializeMongoDb } from "./database/mongoInstance"
import { socketAuth } from "./middlewares/auth.middlewares"
import logger from "./utils/winston"
import router from "./routes"
;(async () => {
  if (cluster.isMaster) {
    const workers: any = []

    const spawn = (i: number) => {
      workers[i] = cluster.fork()

      workers[i].on("exit", () => {
        logger.info("respawning worker", i)
        spawn(i)
      })
    }

    for (var i = 0; i < num_processes; i++) {
      spawn(i)
    }

    const worker_index = (ip: string, len: number) => {
      return farmhash.fingerprint32(ip) % len
    }

    const server: net.Server = net.createServer(
      { pauseOnConnect: true },
      (connection: net.Socket) => {
        const worker =
          workers[worker_index(connection.remoteAddress, num_processes)]
        worker.send("sticky-session:connection", connection)
      }
    )

    server.listen(port)
    logger.info(`Master listening on port ${port}`)
  } else {
    let app = express()

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

    app.use("/", router)

    const server: http.Server = app.listen(0, "localhost")
    logger.info("Worker listening...")

    const peerServer = ExpressPeerServer(server, {
      path: "/peer-server",
    })

    app.use(peerServer)

    const io = new socket.Server(server, {
      cors: {
        origin: process.env.FRONTEND_URL,
        credentials: true,
      },
    })

    const pubClient = createClient({ url: process.env.REDIS_URL })
    const subClient = pubClient.duplicate()

    await Promise.all([pubClient.connect(), subClient.connect()])

    logger.info("Redis connection established")

    io.adapter(createAdapter(pubClient, subClient))

    await initializeMongoDb()

    io.use(socketAuth)

    io.on("connection", (socket: socket.Socket) => {
      socketMain(io, socket)
      logger.info(`connected to worker: ${cluster.worker.id}`)
    })
    process.on("message", (message, connection) => {
      if (message !== "sticky-session:connection") {
        return
      }
      server.emit("connection", connection)
      //@ts-ignore
      connection.resume()
    })
  }
})()
