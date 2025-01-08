const createRoom = require("./events/createRoom")
const joinRoom = require("./events/joinRoom")
const updateUserBill = require("./events/updateUserBill")
const updateBill = require("./events/updateBill")
const disconnect = require("./events/disconnect")

const setupSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("Новый пользователь подключился:", socket.id)

    createRoom(io, socket)
    joinRoom(io, socket)
    updateUserBill(io, socket)
    updateBill(io, socket)
    disconnect(io, socket)
  })
}

module.exports = setupSocket
