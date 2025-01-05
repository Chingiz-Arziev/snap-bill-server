require("dotenv").config()

const missingEnvVars = []

if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  missingEnvVars.push("GOOGLE_APPLICATION_CREDENTIALS")
}

if (!process.env.OPENAI_API_KEY) {
  missingEnvVars.push("OPENAI_API_KEY")
}

if (missingEnvVars.length > 0) {
  throw new Error(
    `Не все переменные окружения заданы: ${missingEnvVars.join(", ")}`
  )
}

module.exports = {
  PORT: process.env.PORT || 5000,
  GOOGLE_APPLICATION_CREDENTIALS: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
}

config.js
