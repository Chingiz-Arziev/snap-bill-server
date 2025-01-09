const updateUserBill = (io, socket, rooms) => {
  socket.on(
    "updateUserBill",
    ({ roomId, userId, itemId, discountPercentage }) => {
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

      const item = room.billData.items.find((item) => item.id === itemId)
      if (!item || item.quantity <= 0) {
        socket.emit("error", { message: "Элемент недоступен" })
        return
      }

      item.quantity -= 1

      const serviceFee = (item.unitPrice * discountPercentage) / 100
      const totalAmount = item.unitPrice + serviceFee

      user.userBill = (user.userBill || 0) + totalAmount

      room.billData.total -= item.unitPrice

      if (!user.addedItems) {
        user.addedItems = {}
      }
      if (!user.addedItems[itemId]) {
        user.addedItems[itemId] = 0
      }
      user.addedItems[itemId] += 1

      io.to(roomId).emit("userBillUpdated", {
        users: room.users,
        items: room.billData.items,
        total: room.billData.total,
      })
    }
  )
}

module.exports = updateUserBill
