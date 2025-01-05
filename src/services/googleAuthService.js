const { GoogleAuth } = require("google-auth-library")
const { GOOGLE_APPLICATION_CREDENTIALS } = require("../config/env")

// Путь к JSON файлу с учетными данными сервисного аккаунта
const KEYFILEPATH = GOOGLE_APPLICATION_CREDENTIALS

// Создание экземпляра GoogleAuth
const auth = new GoogleAuth({
  keyFile: KEYFILEPATH,
  scopes: ["https://www.googleapis.com/auth/cloud-platform"],
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
