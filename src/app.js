const express = require('express');
const cors = require('cors');
const multer = require('multer');
const vision = require('@google-cloud/vision');

// Инициализация Google Vision API клиента
const client = new vision.ImageAnnotatorClient({
  keyFilename: '../keys/pay-me-445906-34ea9c5812a4.json', // Укажите путь к вашему JSON с ключом
});

const app = express();
const PORT = 5000;

// Настройка CORS
app.use(cors());

// Настройка Multer для обработки загрузки файлов
const upload = multer({ storage: multer.memoryStorage() });

app.post('/api/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Анализируем изображение с помощью Google Vision API
    const [result] = await client.textDetection(req.file.buffer);
    const textAnnotations = result.textAnnotations;

    // Если текст найден, отправляем его клиенту
    if (textAnnotations.length > 0) {
      res.json({ text: textAnnotations[0].description }); // Возвращаем первый найденный текст
    } else {
      res.json({ text: 'No text detected' });
    }
  } catch (error) {
    console.error('Error processing image:', error);
    res.status(500).json({ error: 'Failed to process image' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
