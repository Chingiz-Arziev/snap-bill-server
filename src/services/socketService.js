const rooms = {}
const guestCounters = {}

const setupSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("Новый пользователь подключился:", socket.id)

    socket.on("createRoom", ({ roomId, username, billData }, callback) => {
      if (rooms[roomId]) {
        console.warn(`Комната ${roomId} уже существует`)
        callback({ success: false, error: "Комната с таким ID уже существует" })
        return
      }

      try {
        rooms[roomId] = {
          users: [{ id: socket.id, username, userBill: 0 }],
          billData,
        }

        socket.join(roomId)

        console.log(`Комната ${roomId} создана пользователем ${username}`)

        callback({
          success: true,
          roomData: rooms[roomId].billData,
          users: rooms[roomId].users,
        })
      } catch (error) {
        console.error("Ошибка при создании комнаты:", error.message)
        callback({ success: false, error: "Не удалось создать комнату" })
      }
    })

    socket.on("joinRoom", ({ roomId, username }, callback) => {
      if (!rooms[roomId]) {
        console.log(`Попытка подключения к несуществующей комнате: ${roomId}`)
        return callback({ success: false, error: "Комната не существует" })
      }

      const existingUser = rooms[roomId].users.find(
        (user) => user.id === socket.id
      )
      if (!existingUser) {
        // Назначаем имя пользователя в зависимости от количества людей в комнате
        let userName
        if (rooms[roomId].users.length === 0) {
          userName = "Чингиз"
        } else if (rooms[roomId].users.length === 1) {
          userName = "Эльнура"
        } else {
          userName = `Гость-${rooms[roomId].users.length}`
        }

        // Добавляем пользователя в комнату
        rooms[roomId].users.push({ id: socket.id, username: userName })
        console.log(`${userName} присоединился к комнате ${roomId}`)
      }

      // Присоединяем сокет к комнате
      socket.join(roomId)

      // Уведомляем всех в комнате о новом пользователе
      io.to(roomId).emit("userJoined", { users: rooms[roomId].users })

      // Возвращаем данные комнаты через callback
      callback({
        success: true,
        roomData: rooms[roomId].billData,
        users: rooms[roomId].users,
      })
    })

    socket.on(
      "updateUserBill",
      ({ roomId, userId, itemPrice, discountPercentage }) => {
        const room = rooms[roomId]
        if (!room) {
          socket.emit("error", { message: "Room not found" })
          return
        }

        const user = room.users.find((user) => user.id === userId)
        if (!user) {
          socket.emit("error", { message: "User not found in room" })
          return
        }

        // Находим элемент и уменьшаем количество
        const item = room.billData.items.find(
          (item) => item.price === itemPrice
        )
        if (!item || item.quantity <= 0) {
          socket.emit("error", { message: "Item not available" })
          return
        }

        item.quantity -= 1

        // Вычисляем сумму с учетом процента обслуживания
        const serviceFee = (itemPrice * discountPercentage) / 100
        const totalAmount = itemPrice + serviceFee

        // Обновляем счет пользователя
        user.userBill = (user.userBill || 0) + totalAmount

        // Обновляем общий счет
        room.billData.total -= itemPrice

        // Сообщаем всем пользователям об обновлении
        io.to(roomId).emit("userBillUpdated", {
          users: room.users,
          items: room.billData.items,
          total: room.billData.total,
        })
      }
    )

    socket.on("updateBill", ({ roomId, updatedBill }) => {
      if (!rooms[roomId]) {
        console.warn(
          `Попытка обновления счета для несуществующей комнаты: ${roomId}`
        )
        return
      }

      rooms[roomId].billData = updatedBill

      console.log(`Данные счета обновлены в комнате ${roomId}`)

      io.to(roomId).emit("billUpdated", updatedBill)
    })

    socket.on("disconnect", () => {
      console.log(`Пользователь ${socket.id} отключился`)
      for (const roomId in rooms) {
        const userIndex = rooms[roomId].users.findIndex(
          (user) => user.id === socket.id
        )
        if (userIndex !== -1) {
          rooms[roomId].users.splice(userIndex, 1)
          io.to(roomId).emit("userJoined", { users: rooms[roomId].users })
        }
      }
    })
  })
}

module.exports = { setupSocket, rooms }
