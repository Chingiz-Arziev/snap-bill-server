const { GoogleAuth } = require("google-auth-library")
const path = require("path")

// Путь к JSON файлу с учетными данными сервисного аккаунта
const KEYFILEPATH = path.resolve(
  __dirname,
  "../../keys/pay-me-445906-53799612402b.json"
)

// Создание экземпляра GoogleAuth
const auth = new GoogleAuth({
  keyFile: KEYFILEPATH,
  scopes: ["https://www.googleapis.com/auth/cloud-platform"],
})

// Функция для получения токена доступа
const getAccessToken = async () => {
  const client = await auth.getClient()
  const accessToken = await client.getAccessToken()
  return accessToken
}

module.exports = { getAccessToken }
