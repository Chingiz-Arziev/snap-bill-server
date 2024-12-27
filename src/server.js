const app = require("./app")
const { PORT } = require("./config/env")

app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`)
})
