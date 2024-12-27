const http = require("http")
const express = require("express")
const { Server } = require("socket.io")
const cors = require("cors")

const apiRoutes = require("./routes/apiRoutes")
const errorHandler = require("./middlewares/errorHandler")

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
  cors: { origin: "http://localhost:5173" },
})

app.use(cors({ origin: "http://localhost:5173" }))
app.use("/api", apiRoutes)

require("./services/socketService")(io)

app.use(errorHandler)

module.exports = { app, server }
