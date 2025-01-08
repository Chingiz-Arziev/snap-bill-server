const rooms = require("./rooms")

const updateUserBill = (io, socket) => {
  socket.on(
    "updateUserBill",
    ({ roomId, userId, itemPrice, discountPercentage }) => {
      const room = rooms[roomId]
      if (!room) {
        socket.emit("error", { message: "Комната не найдена" })
        return
      }

      const user = room.users.find((user) => user.id === userId)
      if (!user) {
        socket.emit("error", { message: "Пользователь не найден в комнате" })
        return
      }

      const item = room.billData.items.find((item) => item.price === itemPrice)
      if (!item || item.quantity <= 0) {
        socket.emit("error", { message: "Элемент недоступен" })
        return
      }

      item.quantity -= 1

      const serviceFee = (itemPrice * discountPercentage) / 100
      const totalAmount = itemPrice + serviceFee

      user.userBill = (user.userBill || 0) + totalAmount
      room.billData.total -= itemPrice

      io.to(roomId).emit("userBillUpdated", {
        users: room.users,
        items: room.billData.items,
        total: room.billData.total,
      })
    }
  )
}

module.exports = updateUserBill
