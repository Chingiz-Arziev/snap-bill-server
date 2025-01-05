const vision = require("@google-cloud/vision")
const fs = require("fs")
const { GOOGLE_APPLICATION_CREDENTIALS } = require("../config/env")

// Проверка наличия переменной окружения
if (!GOOGLE_APPLICATION_CREDENTIALS) {
  throw new Error("GOOGLE_APPLICATION_CREDENTIALS is not defined")
}

// Проверка доступа к файлу с учетными данными
try {
  const credentials = fs.readFileSync(GOOGLE_APPLICATION_CREDENTIALS, "utf8")
  console.log("Credentials loaded successfully")
} catch (error) {
  console.error("Error loading credentials:", error.message)
  throw error
}

const client = new vision.ImageAnnotatorClient({
  keyFilename: GOOGLE_APPLICATION_CREDENTIALS,
})

const detectText = async (filePath) => {
  const [result] = await client.textDetection(filePath)
  return result.textAnnotations[0]?.description || "Текст не найден"
}

module.exports = { detectText }
