const rooms = {} // Хранилище комнат

const setupSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("Новый пользователь подключился:", socket.id)

    // Пользователь подключается к комнате
    socket.on("joinRoom", ({ roomId, username }, callback) => {
      if (!rooms[roomId]) {
        console.warn(`Попытка подключения к несуществующей комнате: ${roomId}`)
        callback({ success: false, error: "Комната не существует" })
        return
      }

      socket.join(roomId)

      // Добавляем пользователя в список комнаты
      rooms[roomId].users.push({ id: socket.id, username })

      console.log(`${username} присоединился к комнате ${roomId}`)

      // Уведомляем всех участников о новом пользователе
      io.to(roomId).emit("userJoined", { username })

      callback({ success: true })
    })

    // Создание новой комнаты
    socket.on("createRoom", ({ roomId, username, billData }, callback) => {
      if (rooms[roomId]) {
        console.warn(`Комната ${roomId} уже существует`)
        callback({ success: false, error: "Комната с таким ID уже существует" })
        return
      }

      try {
        // Создаем комнату
        rooms[roomId] = {
          users: [{ id: socket.id, username }], // Добавляем пользователя в список участников
          billData, // Сохраняем данные счета
        }

        // Подключаем создателя к комнате
        socket.join(roomId)

        console.log(`Комната ${roomId} создана пользователем ${username}`)

        // Подтверждаем успешное создание комнаты
        callback({ success: true })
      } catch (error) {
        console.error("Ошибка при создании комнаты:", error.message)
        callback({ success: false, error: "Не удалось создать комнату" })
      }
    })

    // Обновление счета
    socket.on("updateBill", ({ roomId, updatedBill }) => {
      if (!rooms[roomId]) {
        console.warn(
          `Попытка обновления счета для несуществующей комнаты: ${roomId}`
        )
        return
      }

      // Обновляем данные счета в комнате
      rooms[roomId].billData = updatedBill

      console.log(`Данные счета обновлены в комнате ${roomId}`)

      // Рассылаем обновления всем участникам комнаты
      io.to(roomId).emit("billUpdated", updatedBill)
    })

    // Отключение пользователя
    socket.on("disconnect", () => {
      console.log(`Пользователь ${socket.id} отключился`)

      // Удаляем пользователя из всех комнат
      for (const [roomId, room] of Object.entries(rooms)) {
        const userIndex = room.users.findIndex((user) => user.id === socket.id)

        if (userIndex !== -1) {
          const [disconnectedUser] = room.users.splice(userIndex, 1)

          console.log(
            `Пользователь ${disconnectedUser.username} (${socket.id}) покинул комнату ${roomId}`
          )

          // Уведомляем остальных участников комнаты
          io.to(roomId).emit("userLeft", {
            username: disconnectedUser.username,
          })

          // Если комната пустая, удаляем её
          if (room.users.length === 0) {
            console.log(
              `Комната ${roomId} удалена, так как все пользователи покинули её`
            )
            delete rooms[roomId]
          }
        }
      }
    })
  })
}

module.exports = { setupSocket, rooms }
