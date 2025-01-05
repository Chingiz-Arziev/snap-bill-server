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

app.get("/api/test", (req, res) => {
  res.json({ message: "Server is working" })
})

app.use("/api", apiRoutes)

setupSocket(io)

app.use(errorHandler)

const fs = require("fs")
const { GOOGLE_APPLICATION_CREDENTIALS } = require("config/env")

try {
  const credentials = fs.readFileSync(GOOGLE_APPLICATION_CREDENTIALS, "utf8")
  console.log("Credentials loaded successfully")
} catch (error) {
  console.error("Error loading credentials:", error.message)
}

module.exports = { app, server }
