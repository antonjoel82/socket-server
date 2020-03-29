const { makeHandleEvent, ensureExists } = require('./handle-events')

module.exports = function(client, clientManager, roomManager) {
  const handleEvent = makeHandleEvent(client, clientManager, roomManager)

  function handleRegister(username, cb) {
    if (clientManager.hasClient(client.id)) {
      console.warn(`Client ${client.id} is already registered.`)
      return cb('Already registered!')
    }

    const user = clientManager.createUser(username)
    clientManager.registerClient(client, user)

    return cb(null, user)
  }

  function handleJoin(roomKey, cb) {
    const createEntry = () => ({ event: `joined the room!` })

    handleEvent(roomKey, createEntry)
      .then((room) => {
        // Add the client to the room
        room.addMember(client)
        console.log(`${client.id} joined room '${roomKey}'`)

        return cb(null, room.getChatHistory())
      })
      .catch(cb)
  }

  function handleNewRoom(cb) {
    //TODO prevent client from creating more than X rooms

    ensureExists(
      () => roomManager.createNewRoom(),
      'Could not create a new room'
    )
      .then((room) => {
        console.log(`Client ${client.id} created new room '${room.getKey()}'`)
        return cb(null, room.getKey())
      })
      .catch(cb)
  }

  function handleMessage(params, cb) {
    const { roomKey, message } = params
    console.log(`Message from ${client.id} in Room '${roomKey}': ${message}`)

    const createEntry = () => ({ event: message })

    handleEvent(roomKey, createEntry)
      .then(() => cb(null))
      .catch(cb)
  }

  return {
    handleRegister,
    handleJoin,
    handleNewRoom,
    handleMessage,
    handleEvent
  }
}
