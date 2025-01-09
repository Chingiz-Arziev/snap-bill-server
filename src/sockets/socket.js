const rooms = require("./events/rooms")

const assignUsername = require("./events/assignUsername")
const createRoom = require("./events/createRoom")
const joinRoom = require("./events/joinRoom")
const updateUserBill = require("./events/updateUserBill")
const updateBill = require("./events/updateBill")
const resetUserBill = require("./events/resetUserBill")
const disconnect = require("./events/disconnect")

const setupSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("Новый пользователь подключился:", socket.id)

    assignUsername(io, socket, rooms)
    createRoom(io, socket, rooms)
    joinRoom(io, socket, rooms)
    updateUserBill(io, socket, rooms)
    updateBill(io, socket, rooms)
    resetUserBill(io, socket, rooms)
    disconnect(io, socket, rooms)
  })
}

module.exports = setupSocket
