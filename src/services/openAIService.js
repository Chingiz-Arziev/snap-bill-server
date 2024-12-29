const OpenAI = require("openai")
const { OPENAI_API_KEY } = require("../config/env")

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
})

const processTextToJson = async (text) => {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `Преобразуй текст чека в JSON. Все блюда в массив items с полями id, name, quantity, price. Служебную информацию в отдельный массив: total, services_fee (percentage, amount), discount_fee (percentage, amount) это твоя структура, не нужно ничего менять или добавлять! делай ровно по заданной структуре`,
      },
      {
        role: "user",
        content: text,
      },
    ],
  })

  const response = completion.choices[0]?.message?.content
  if (!response) throw new Error("Ответ OpenAI пустой или неверный.")

  return JSON.parse(
    response
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim()
  )
}

module.exports = { processTextToJson }
