const assignUsername = (io, socket, rooms) => {
  socket.on("userConnection", ({ roomId, userId }, callback) => {
    if (!roomId) {
      callback({ success: false, error: "Room ID is required" })
      return
    }

    let user

    if (userId) {
      const existingUser = rooms[roomId]?.users.find((u) => u.id === userId)
      if (existingUser) {
        user = existingUser
        console.log("Повторное подключение пользователя:", user)
      }
    }

    if (!user) {
      const userCount = rooms[roomId]?.users.length || 0

      let username
      switch (userCount) {
        case 0:
          username = "Чингиз"
          break
        case 1:
          username = "Эльнура"
          break
        default:
          username = `Гость-${userCount}`
      }

      user = {
        id: socket.id,
        username,
        userBill: 0,
      }

      if (!rooms[roomId]) {
        rooms[roomId] = { users: [], billData: {} }
      }

      rooms[roomId].users.push(user)
      console.log("Новый пользователь:", user)
    }

    callback({ success: true, user })
  })
}

module.exports = assignUsername
