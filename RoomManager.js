const Room = require('./Room')
const { generateRandStr } = require('./utils')

module.exports = function() {
  const rooms = new Map()

  function addRoom(room) {
    rooms.set(room.getKey(), room)
  }

  function removeRoom(room) {
    rooms.delete(room.getKey())
  }

  function getRoom(roomKey) {
    return rooms.get(roomKey)
  }

  /**
   * Generates a new room with random key and adds it to the Map
   * Returns the newly created room.
   */
  function createNewRoom(_roomKey) {
    let roomKey = _roomKey || undefined

    while (roomKey === undefined || rooms.has(roomKey)) {
      roomKey = generateRandStr()
    }

    const room = Room(roomKey)
    addRoom(room)

    return room
  }

  /**
   * Remove a client from all rooms they were in
   * @param {} client
   */
  function removeClient(client) {
    rooms.forEach((room) => room.removeMember(client))
  }

  function serializeRooms() {
    return Array.from(rooms.values()).map((room) => room.serialize())
  }

  return {
    addRoom,
    removeRoom,
    getRoom,
    createNewRoom,
    removeClient,
    serializeRooms
  }
}
