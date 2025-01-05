const vision = require("@google-cloud/vision")
const { GOOGLE_APPLICATION_CREDENTIALS } = require("../config/env")

// Проверка наличия переменной окружения
if (!GOOGLE_APPLICATION_CREDENTIALS) {
  throw new Error("GOOGLE_APPLICATION_CREDENTIALS is not defined")
}

const client = new vision.ImageAnnotatorClient({
  keyFilename: GOOGLE_APPLICATION_CREDENTIALS,
})

const detectText = async (filePath) => {
  const [result] = await client.textDetection(filePath)
  return result.textAnnotations[0]?.description || "Текст не найден"
}

module.exports = { detectText }
