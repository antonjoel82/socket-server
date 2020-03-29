function makeHandleEvent(client, clientManager, roomManager) {
  function ensureUserSelected(clientId) {
    return ensureExists(
      () => clientManager.getUserByClientId(clientId),
      `No user is associated with client ${clientId}`
    )
  }

  function ensureValidRoom(roomKey) {
    return ensureExists(
      () => roomManager.getRoom(roomKey),
      `Client ${client.id} attempted to access non-existent room ${roomKey}.`
    )
  }

  function ensureValidRoomAndUserSelected(roomKey) {
    return Promise.all([
      ensureValidRoom(roomKey),
      ensureUserSelected(client.id)
    ]).then(([room, user]) => Promise.resolve({ room, user }))
  }

  function handleEvent(roomKey, createEntry) {
    return ensureValidRoomAndUserSelected(roomKey).then(function({
      room,
      user
    }) {
      // append event to chat history
      const entry = { user, ...createEntry() }
      room.addEntry(entry)

      // Relay the message to everyone in the room.
      room.broadcastMessage({ room: roomKey, ...entry })
      return room
    })
  }

  return handleEvent
}

/**
 *
 * @param {function} getter Function to retrieve desired data
 * @param {string} rejectionMsg User-facing error message
 * @param {string?} logError Optional: error to be used in logs, but not user-facing
 */
function ensureExists(getter, rejectionMsg, logError) {
  return new Promise(function(resolve, reject) {
    const res = getter()
    if (!res) {
      console.error(logError || rejectionMsg)
      return reject(rejectionMsg)
    }

    return resolve(res)
  })
}

module.exports = {
  ensureExists,
  makeHandleEvent
}
