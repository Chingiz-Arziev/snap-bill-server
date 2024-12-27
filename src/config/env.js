require("dotenv").config()

if (
  !process.env.GOOGLE_APPLICATION_CREDENTIALS ||
  !process.env.OPENAI_API_KEY
) {
  throw new Error("Не все переменные окружения заданы.")
}

module.exports = {
  PORT: process.env.PORT || 5000,
  GOOGLE_APPLICATION_CREDENTIALS: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
}
