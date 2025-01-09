const joinRoom = (io, socket, rooms) => {
  const normalizeItems = (items) => {
    return items.map((item) => ({
      ...item,
      originalQuantity: item.quantity, // Сохраняем изначальное количество
      unitPrice: item.quantity > 0 ? item.price / item.quantity : item.price, // Рассчитываем цену за единицу один раз
    }))
  }

  socket.on("joinRoom", ({ roomId, username }, callback) => {
    if (!rooms[roomId]) {
      console.log(`Попытка подключения к несуществующей комнате: ${roomId}`)
      return callback({ success: false, error: "Комната не существует" })
    }

    const existingUser = rooms[roomId].users.find(
      (user) => user.id === socket.id
    )

    if (!existingUser) {
      let userName
      const userCount = rooms[roomId].users.length

      if (userCount === 0) {
        userName = "Чингиз"
      } else if (userCount === 1) {
        userName = "Эльнура"
      } else {
        userName = `Гость-${userCount}`
      }

      rooms[roomId].users.push({
        id: socket.id,
        username: userName,
        userBill: 0,
      })
      console.log(`${userName} присоединился к комнате ${roomId}`)
    }

    // Нормализуем данные billData.items при каждом подключении
    if (rooms[roomId].billData && rooms[roomId].billData.items) {
      rooms[roomId].billData.items = normalizeItems(
        rooms[roomId].billData.items
      )
    }

    socket.join(roomId)

    io.to(roomId).emit("userJoined", { users: rooms[roomId].users })

    callback({
      success: true,
      roomData: rooms[roomId].billData,
      users: rooms[roomId].users,
    })
  })
}

module.exports = joinRoom
