const http = require("http")
const express = require("express")
const { Server } = require("socket.io")
const cors = require("cors")
const apiRoutes = require("./routes/apiRoutes")
const errorHandler = require("./middlewares/errorHandler")
const { setupSocket } = require("./services/socketService")

const { getAccessToken } = require("./services/googleAuthService")

const testAccessToken = async () => {
  try {
    const accessToken = await getAccessToken()
    console.log("Access Token:", accessToken)
  } catch (error) {
    console.error("Ошибка при получении токена доступа:", error)
  }
}

testAccessToken()

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

module.exports = { app, server }
