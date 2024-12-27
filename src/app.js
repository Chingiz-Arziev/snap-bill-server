const express = require("express")
const cors = require("cors")
const apiRoutes = require("./routes/apiRoutes")
const errorHandler = require("./middlewares/errorHandler")
const { PORT } = require("./config/env")

const app = express()

app.use(cors({ origin: "http://localhost:5173" }))
app.use("/api", apiRoutes)
app.use(errorHandler)

module.exports = app
