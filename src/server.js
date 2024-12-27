const { server } = require("./app")
const { PORT } = require("./config/env")

server.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`)
})
