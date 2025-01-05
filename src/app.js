require("dotenv").config() // Загружает переменные окружения из .env

const http = require("http")
const express = require("express")
const { Server } = require("socket.io")
const cors = require("cors")
const apiRoutes = require("./routes/apiRoutes")
const errorHandler = require("./middlewares/errorHandler")
const { setupSocket } = require("./services/socketService")

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: ["http://34.107.68.9"],
    methods: ["GET", "POST"],
    credentials: true,
  },
})

app.use(
  cors({
    origin: ["http://34.107.68.9"],
    methods: ["GET", "POST"],
    credentials: true,
  })
)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get("/", (req, res) => {
  res.send("Hello world")
})

app.use("/api", apiRoutes)

setupSocket(io)

console.log("Key file path:", process.env.GOOGLE_APPLICATION_CREDENTIALS)
console.log("Key")

app.use(errorHandler)

module.exports = { app, server }
