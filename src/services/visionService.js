const vision = require("@google-cloud/vision")
const fs = require("fs")
const { getAccessToken } = require("../../keys/pay-me-445906-53799612402b.json")

const client = new vision.ImageAnnotatorClient()

const detectText = async (filePath) => {
  const accessToken = await getAccessToken()
  const [result] = await client.textDetection({
    image: { source: { filename: filePath } },
    auth: accessToken,
  })
  return result.textAnnotations[0]?.description || "Текст не найден"
}

module.exports = { detectText }
