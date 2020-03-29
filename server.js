const express = require('express')
const index = require('./routes/index')

const ClientManager = require('./ClientManager')
const RoomManager = require('./RoomManager')
const makeHandlers = require('./handlers')

const SERVER_PORT = process.env.PORT || 9999
const app = express()

const server = require('http').createServer(app)
const io = require('socket.io')(server)

const clientManager = ClientManager()
const roomManager = RoomManager()

// const testRoom = roomManager.createNewRoom('testRoom')

app.use(index)

io.on('connection', function(client) {
  const {
    handleRegister,
    handleJoin,
    handleNewRoom,
    //   handleLeave,
    handleMessage
    //   handleGetRooms,
    //   handleGetAvailableUsers,
    //   handleDisconnect
  } = makeHandlers(client, clientManager, roomManager)

  // testRoom.addMember(client)

  console.log('client connected...', client.id)

  client.on('register', handleRegister)

  client.on('join', handleJoin)

  client.on('newRoom', handleNewRoom)

  // client.on('leave', handleLeave)

  client.on('message', handleMessage)

  // client.on('rooms', handleGetRooms)

  // client.on('availableUsers', handleGetAvailableUsers)

  client.on('disconnect', function() {
    console.log('client disconnect...', client.id)
    roomManager.removeClient(client)
    // handleDisconnect()
  })

  client.on('error', function(err) {
    console.log('received error from client:', client.id)
    console.log(err)
  })
})
server.listen(SERVER_PORT, () => {
  console.log(`Listening on Port ${SERVER_PORT}`)
})
