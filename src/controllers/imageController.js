const fs = require("fs")
const { detectText } = require("../services/visionService")
const { processTextToJson } = require("../services/openAiService")
const { removeFile } = require("../utils/fileUtils")

const uploadImage = async (req, res) => {
  const filePath = req.file.path
  try {
    const text = await detectText(filePath)
    const structuredData = await processTextToJson(text)
    removeFile(filePath)
    res.json({ structuredData })
  } catch (error) {
    removeFile(filePath)
    console.error("Ошибка обработки изображения:", error.message)
    res.status(500).json({ error: error.message })
  }
}

module.exports = { uploadImage }
