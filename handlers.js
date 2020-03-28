module.exports = function(client, clientManager, roomManager) {
  function handleJoin(roomKey, cb) {
    console.log(`${client.id} joined room '${roomKey}'`)

    const room = roomManager.getRoom(roomKey)
    return cb(null, room.getChatHistory())
  }

  return {
    handleJoin
  }
}
