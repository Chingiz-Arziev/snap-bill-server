const express = require("express")
const multer = require("multer")
const { uploadImage } = require("../controllers/imageController")

const router = express.Router()

// Multer configuration
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, "./uploads"),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
  }),
})

router.post("/upload", upload.single("file"), uploadImage)

module.exports = router
