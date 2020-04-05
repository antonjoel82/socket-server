const { makeHandleEvent, ensureExists, EventTypes } = require('./handle-events')

module.exports = function(client, clientManager, roomManager) {
  const { handleEvent, ensureUserExists } = makeHandleEvent(
    client,
    clientManager,
    roomManager
  )

  function handleRegister(username, cb) {
    if (clientManager.hasClient(client.id)) {
      console.warn(`Client ${client.id} is already registered.`)
      return cb(null, clientManager.getUserByClientId(client.id))
      // return cb('You have already registered!')
    }

    const user = clientManager.createUser(username, client.id)
    clientManager.registerClient(client, user)

    return cb(null, user)
  }

  function handleJoin(roomKey, cb) {
    const createEntry = () => ({
      event: `joined the room!`,
      type: EventTypes.SYSTEM
    })

    handleEvent(roomKey, createEntry)
      .then((room) => {
        // Add the client to the room
        room.addMember(client)
        console.log(`${client.id} joined room '${roomKey}'`)

        return cb(null, room.getChatHistory())
      })
      .catch(cb)
  }

  function handleLeave(roomKey, cb) {
    const createEntry = () => ({
      event: `left the room.`,
      type: EventTypes.SYSTEM
    })

    handleEvent(roomKey, createEntry)
      .then((room) => {
        // Remove the client from the room
        room.removeMember(client.id)
        console.log(`${client.id} left room '${roomKey}'`)

        return cb(null)
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

    const createEntry = () => ({ event: message, type: EventTypes.MESSAGE })

    handleEvent(roomKey, createEntry)
      .then(() => cb(null))
      .catch(cb)
  }

  function handleCurrentUser(cb) {
    ensureUserExists(client.id)
      .then((user) => cb(null, user))
      .catch(cb)
  }

  function handleDisconnect() {
    roomManager.getRoomsForClient(client.id).forEach((room) => {
      handleLeave(room.getKey(), () => {})
    })

    // remove user profile
    clientManager.removeClient(client)
    // remove member from all chatrooms
    roomManager.removeClient(client)
  }

  return {
    handleRegister,
    handleCurrentUser,
    handleJoin,
    handleLeave,
    handleNewRoom,
    handleMessage,
    handleEvent,
    handleDisconnect
  }
}
