const resetUserBill = (io, socket, rooms) => {
  socket.on("resetUserBill", (data) => {
    const { roomId, userId } = data

    const room = rooms[roomId]
    if (!room) {
      io.to(userId).emit("error", { message: "Комната не найдена" })
      return
    }

    const user = room.users.find((user) => user.id === userId)
    if (!user) {
      io.to(userId).emit("error", {
        message: "Пользователь не найден в комнате",
      })
      return
    }

    const amountToReset = user.userBill || 0
    user.userBill = 0

    room.billData.total += amountToReset

    if (user.addedItems) {
      for (const itemPrice in user.addedItems) {
        const item = room.billData.items.find(
          (item) => item.price === parseFloat(itemPrice)
        )
        if (item) {
          item.quantity += user.addedItems[itemPrice]
        }
      }
      user.addedItems = {}
    }

    console.log("Sending userBillUpdated event:", {
      users: room.users,
      items: room.billData.items,
      total: room.billData.total,
    })

    io.to(roomId).emit("userBillUpdated", {
      users: room.users,
      items: room.billData.items,
      total: room.billData.total,
    })
  })
}

module.exports = resetUserBill
