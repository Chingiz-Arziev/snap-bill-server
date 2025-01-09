const resetUserBill = (roomId, userId, io) => {
  const room = rooms[roomId]
  if (!room) {
    io.to(userId).emit("error", { message: "Комната не найдена" })
    return
  }

  const user = room.users.find((user) => user.id === userId)
  if (!user) {
    io.to(userId).emit("error", { message: "Пользователь не найден в комнате" })
    return
  }

  const amountToReset = user.userBill || 0
  user.userBill = 0

  room.billData.total += amountToReset

  io.to(roomId).emit("userBillUpdated", {
    users: room.users,
    items: room.billData.items,
    total: room.billData.total,
  })
}

module.exports = resetUserBill
