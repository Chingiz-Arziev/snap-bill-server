const http = require("http")
const express = require("express")
const { Server } = require("socket.io")
const cors = require("cors")
const apiRoutes = require("./routes/apiRoutes")
const errorHandler = require("./middlewares/errorHandler")
const { setupSocket } = require("./services/socketService") // Импорт setupSocket

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
  cors: { origin: "*" },
})

// Middleware
app.use(cors({ origin: "http://localhost:5173" }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.use("/api", apiRoutes)

// WebSocket setup
setupSocket(io) // Передаем объект io в setupSocket

// Error handling middleware
app.use(errorHandler)

module.exports = { app, server }
