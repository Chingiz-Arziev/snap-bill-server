const rooms = require("./rooms")

const updateBill = (io, socket) => {
  socket.on("updateBill", ({ roomId, updatedBill }) => {
    if (!rooms[roomId]) {
      console.warn(
        `Попытка обновления счета для несуществующей комнаты: ${roomId}`
      )
      return
    }

    rooms[roomId].billData = updatedBill

    console.log(`Счет в комнате ${roomId} обновлен`)
    io.to(roomId).emit("billUpdated", updatedBill)
  })
}

module.exports = updateBill
