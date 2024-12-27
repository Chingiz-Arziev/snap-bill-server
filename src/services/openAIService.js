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
        content: `Ты преобразуешь текст из чека в структурированный JSON...`,
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
