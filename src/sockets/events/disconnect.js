const rooms = require("./rooms")

const disconnect = (io, socket) => {
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
}

module.exports = disconnect
