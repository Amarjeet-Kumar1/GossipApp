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
import { PeerServer } from "peer"
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
    // This stores our workers. We need to keep them to be able to reference
    // them based on source IP address. It's also useful for auto-restart,
    // for example.
    const workers: any = []

    // Helper function for spawning worker at index 'i'.
    const spawn = (i: number) => {
      workers[i] = cluster.fork()

      // Optional: Restart worker on exit
      workers[i].on("exit", () => {
        logger.info("respawning worker", i)
        spawn(i)
      })
    }

    // Spawn workers.
    for (var i = 0; i < num_processes; i++) {
      spawn(i)
    }

    // Helper function for getting a worker index based on IP address.
    // This is a hot path so it should be really fast. The way it works
    // is by converting the IP address to a number by removing non numeric
    // characters, then compressing it to the number of slots we have.
    //
    // Compared against "real" hashing (from the sticky-session code) and
    // "real" IP number conversion, this function is on par in terms of
    // worker index distribution only much faster.
    const worker_index = (ip: string, len: number) => {
      return farmhash.fingerprint32(ip) % len // Farmhash is the fastest and works with IPv6, too
    }

    // in this case, we are going to start up a tcp connection via the net
    // module INSTEAD OF the http module. Express will use http, but we need
    // an independent tcp port open for cluster to work. This is the port that
    // will face the internet
    const server: net.Server = net.createServer(
      { pauseOnConnect: true },
      (connection: net.Socket) => {
        // We received a connection and need to pass it to the appropriate
        // worker. Get the worker for this connection's source IP and pass
        // it the connection.
        const worker =
          workers[worker_index(connection.remoteAddress, num_processes)]
        worker.send("sticky-session:connection", connection)
      }
    )

    server.listen(port)
    logger.info(`Master listening on port ${port}`)
  } else {
    // Note we don't use a port here because the master listens on it for us.
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

    await PeerServer({ port: 9000, path: "/peer-server" })

    app.use("/", router)

    const server: http.Server = app.listen(0, "localhost")
    logger.info("Worker listening...")

    const io = new socket.Server(server, {
      cors: {
        origin: process.env.FRONTEND_URL,
        credentials: true,
      },
    })

    // Tell Socket.IO to use the redis adapter. By default, the redis
    // server is assumed to be on localhost:6379. You don't have to
    // specify them explicitly unless you want to change them.
    // redis-cli monitor
    const pubClient = createClient({ url: process.env.REDIS_URL })
    const subClient = pubClient.duplicate()

    await Promise.all([pubClient.connect(), subClient.connect()])

    logger.info("Redis connection established")

    io.adapter(createAdapter(pubClient, subClient))

    // Here you might use Socket.IO middleware for authorization etc.
    // on connection, send the socket over to our module with socket stuff

    // initialize mongodb
    await initializeMongoDb()

    io.use(socketAuth)

    io.on("connection", (socket: socket.Socket) => {
      socketMain(io, socket)
      logger.info(`connected to worker: ${cluster.worker.id}`)
    })
    // Listen to messages sent from the master. Ignore everything else.
    process.on("message", (message, connection) => {
      if (message !== "sticky-session:connection") {
        return
      }

      // Emulate a connection event on the server by emitting the
      // event with the connection the master sent us.
      server.emit("connection", connection)
      //@ts-ignore
      connection.resume()
    })
  }
})()
