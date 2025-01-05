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

const { v4: uuidv4 } = require("uuid")
const { detectText } = require("../services/visionService")
const { processTextToJson } = require("../services/openAIService")
const { removeFile } = require("../utils/fileUtils")
const { rooms } = require("../services/socketService")

const uploadImage = async (req, res) => {
  console.log("Request file:", req.file) // Debugging line to check if file is received
  const filePath = req.file ? req.file.path : null
  if (!filePath) {
    console.error("No file uploaded")
    return res.status(400).json({ error: "No file uploaded" })
  }

  try {
    const text = await detectText(filePath)
    const structuredData = await processTextToJson(text)

    const roomId = uuidv4()
    rooms[roomId] = structuredData

    removeFile(filePath)

    res.json({ roomId, structuredData })
  } catch (error) {
    removeFile(filePath)
    console.error("Ошибка обработки изображения:", error.message)
    res.status(500).json({ error: error.message })
  }
}

module.exports = { uploadImage }
