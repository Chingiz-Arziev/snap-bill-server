const disconnect = (io, socket, rooms) => {
  socket.on("disconnect", () => {
    console.log(`Пользователь ${socket.id} отключился`)

    for (const roomId in rooms) {
      if (rooms[roomId] && Array.isArray(rooms[roomId].users)) {
        const userIndex = rooms[roomId].users.findIndex(
          (user) => user.id === socket.id
        )

        if (userIndex !== -1) {
          rooms[roomId].users.splice(userIndex, 1)

          io.to(roomId).emit("userJoined", { users: rooms[roomId].users })

          if (rooms[roomId].users.length === 0) {
            delete rooms[roomId]
          }
        }
      }
    }
  })
}

module.exports = disconnect
