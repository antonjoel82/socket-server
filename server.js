const express = require('express')
const index = require('./routes/index')

const ClientManager = require('./ClientManager')
const RoomManager = require('./RoomManager')
const makeHandlers = require('./handlers')
const { handleTimers, TimerActions } = require('./handle-timers')

const SERVER_PORT = process.env.PORT || 9999
const app = express()

// const server = require('http').createServer(app)
const server = require('http').createServer(app)
// require('timesync/server').attachServer(server)
const io = require('socket.io')(server)

const clientManager = ClientManager()
const roomManager = RoomManager()

// TODO: DEBUGGING CODE!
const testRoom = roomManager.createNewRoom('testRoom')

app.use(index)

io.on('connection', function(client) {
  const {
    handleRegister,
    handleJoin,
    handleNewRoom,
    handleCurrentUser,
    handleLeave,
    handleMessage,
    //   handleGetRooms,
    //   handleGetAvailableUsers,
    handleDisconnect
  } = makeHandlers(client, clientManager, roomManager)

  const { handleStartTimer, handlePauseTimer, handleResetTimer } = handleTimers(
    client,
    clientManager,
    roomManager
  )

  // TODO: DEBUGGING CODE!
  testRoom.addMember(client)

  console.log('client connected...', client.id)

  client.on('register', handleRegister)
  client.on('join', handleJoin)
  client.on('newRoom', handleNewRoom)
  client.on('leave', handleLeave)
  client.on('message', handleMessage)

  // client.on('rooms', handleGetRooms)

  // client.on('availableUsers', handleGetAvailableUsers)

  client.on('currentUser', handleCurrentUser)

  // TIMERS
  client.on(TimerActions.START.action, handleStartTimer)
  client.on(TimerActions.PAUSE.action, handlePauseTimer)
  client.on(TimerActions.RESET.action, handleResetTimer)

  client.on('disconnect', handleDisconnect)

  client.on('error', function(err) {
    console.log('received error from client:', client.id)
    console.log(err)
  })
})

server.listen(SERVER_PORT, () => {
  console.log(`Listening on Port ${SERVER_PORT}`)
})
