const { server } = require("./app")
const { PORT } = require("./config/env")

server.listen(PORT, "34.139.139.200", () => {
  console.log(`Сервер запущен на http://34.139.139.200:${PORT}`)
})
