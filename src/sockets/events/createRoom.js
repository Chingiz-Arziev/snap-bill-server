const rooms = require("./rooms")

const createRoom = (io, socket) => {
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
}

module.exports = createRoom
