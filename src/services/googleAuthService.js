const { GoogleAuth } = require("google-auth-library")
const path = require("path")

// Путь к JSON файлу с учетными данными сервисного аккаунта
const KEYFILEPATH = path.resolve(
  __dirname,
  "../../keys/pay-me-445906-20376f17a821.json"
)

// Создание экземпляра GoogleAuth
const auth = new GoogleAuth({
  keyFile: KEYFILEPATH,
  targetAudience: "https://oauth2.googleapis.com/token",
})

// Функция для получения токена доступа
const getAccessToken = async () => {
  const client = await auth.getClient()
  const accessToken = await client.fetchIdToken(
    "https://oauth2.googleapis.com/token"
  )
  return accessToken
}

module.exports = { getAccessToken }
