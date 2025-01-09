const joinRoom = (io, socket, rooms) => {
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
