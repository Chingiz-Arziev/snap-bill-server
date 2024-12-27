const fs = require("fs")
const { v4: uuidv4 } = require("uuid")

const { detectText } = require("../services/visionService")
const { processTextToJson } = require("../services/openAIService")
const { removeFile } = require("../utils/fileUtils")

const rooms = require("../services/socketService").rooms

const uploadImage = async (req, res) => {
  const filePath = req.file.path
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
