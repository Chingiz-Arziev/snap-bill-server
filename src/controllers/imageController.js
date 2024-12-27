const fs = require("fs")
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
