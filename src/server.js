const { server } = require("./app")
const { PORT } = require("../../config/env")

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Сервер запущен на http://0.0.0.0:${PORT}`)
})
