// require("dotenv").config()

// const missingEnvVars = []

// if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
//   missingEnvVars.push("GOOGLE_APPLICATION_CREDENTIALS")
// }

// if (!process.env.OPENAI_API_KEY) {
//   missingEnvVars.push("OPENAI_API_KEY")
// }

// if (missingEnvVars.length > 0) {
//   throw new Error(
//     `Не все переменные окружения заданы: ${missingEnvVars.join(", ")}`
//   )
// }

// module.exports = {
//   PORT: process.env.PORT || 5000,
//   GOOGLE_APPLICATION_CREDENTIALS: process.env.GOOGLE_APPLICATION_CREDENTIALS,
//   OPENAI_API_KEY: process.env.OPENAI_API_KEY,
// }

// config.js

const path = require("path")

const PORT = 5000

const GOOGLE_APPLICATION_CREDENTIALS = path.resolve(
  __dirname,
  "../../keys/pay-me-445906-53799612402b.json"
)
const OPENAI_API_KEY =
  "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"

module.exports = {
  GOOGLE_APPLICATION_CREDENTIALS,
  OPENAI_API_KEY,
  PORT,
}
