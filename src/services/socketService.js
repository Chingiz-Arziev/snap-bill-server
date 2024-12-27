const rooms = {}

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("Новый пользователь подключился:", socket.id)

    // Пользователь подключается к комнате
    socket.on("joinRoom", ({ roomId, userName }) => {
      socket.join(roomId)
      console.log(`${userName} подключился к комнате ${roomId}`)

      // Уведомляем всех в комнате о новом участнике
      io.to(roomId).emit("userJoined", {
        userName,
        message: `${userName} присоединился к комнате.`,
      })
    })

    // Пользователь обновляет счет
    socket.on("updateBill", ({ roomId, updatedBill }) => {
      // Обновляем данные комнаты
      rooms[roomId] = updatedBill

      // Рассылаем всем участникам обновленные данные
      io.to(roomId).emit("billUpdated", updatedBill)
    })

    // Отключение пользователя
    socket.on("disconnect", () => {
      console.log(`Пользователь ${socket.id} отключился`)
    })
  })
}
