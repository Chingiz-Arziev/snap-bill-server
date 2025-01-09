const express = require("express")
const multer = require("multer")
const { uploadImage } = require("../controllers/imageController")

const router = express.Router()

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, "./uploads"),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
  }),
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"]
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("Неверный тип файла"))
    }
    cb(null, true)
  },
})

router.post(
  "/upload",
  upload.single("file"),
  uploadImage,
  (err, req, res, next) => {
    if (err) {
      console.error("Ошибка загрузки файла:", err.message)
      res.status(400).json({ error: err.message })
    } else {
      next()
    }
  }
)

module.exports = router
