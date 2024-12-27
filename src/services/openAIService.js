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
        content: `Преобразуй текст чека в JSON. Все блюда в массив items с полями id, name, quantity, price. Служебную информацию в отдельный массив: total, services_fee (percentage, amount), discount_fee (percentage, amount)`,
        // content: `Ты преобразуешь текст из чека в структурированный JSON. Все блюда в чеке засунь в массив items. у каждого блюдоа есть id с 0 и до конца блюд, наименования блюда по ключу name, количество по ключу quantity, цена по ключу price, так же засунь в отдельный массив служебную информацию, обсщий счет по ключу total, процент обслуживания в обьект services_fee с полями percentage & amount. а так же процент дисконта в обьект discount_fee с полями percentage & amount`,
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
