const axios = require("axios")
const FormData = require("form-data")
const fs = require("fs")
const { v4: uuidv4 } = require("uuid")
const { removeFile } = require("../utils/fileUtils")
const rooms = require("../sockets/events/rooms")

const uploadImage = async (req, res) => {
  const filePath = req.file ? req.file.path : null

  if (!filePath) {
    console.error("No file uploaded")
    return res.status(400).json({ error: "No file uploaded" })
  }

  try {
    // Подготовка данных для запроса
    const formData = new FormData()
    formData.append("file", fs.createReadStream(filePath))

    // Отправка изображения в FastAPI
    const response = await axios.post(
      "http://0.0.0.0:8000/process-check",
      formData,
      {
        headers: {
          ...formData.getHeaders(),
        },
      }
    )

    const structuredData = response.data.data

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
