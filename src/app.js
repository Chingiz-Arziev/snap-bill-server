require("dotenv").config()

const http = require("http")
const express = require("express")
const { Server } = require("socket.io")
const cors = require("cors")
const apiRoutes = require("./routes/apiRoutes")
const errorHandler = require("./middlewares/errorHandler")
const setupSocket = require("./sockets/socket")

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://192.168.0.105:5173"],
    methods: ["GET", "POST"],
    credentials: true,
  },
})

app.use(
  cors({
    origin: [
      "http://localhost:8000/process-check",
      "http://192.168.0.105:5173",
      "http://localhost:5173",
    ],
    methods: ["GET", "POST"],
    credentials: true,
  })
)

// app.use(
//   cors({
//     origin: ["http://localhost:5173"],
//     methods: ["GET", "POST"],
//     credentials: true,
//   })
// )

app.use("/api", apiRoutes)

setupSocket(io)

app.use(errorHandler)

module.exports = { app, server }
