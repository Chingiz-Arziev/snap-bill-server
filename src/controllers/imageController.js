const { v4: uuidv4 } = require("uuid")
const { detectText } = require("../services/visionService")
const { processTextToJson } = require("../services/openAIService")
const { removeFile } = require("../utils/fileUtils")
const rooms = require("../sockets/events/rooms")

const uploadImage = async (req, res) => {
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
