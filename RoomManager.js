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
   *
   * Takes an optional parameter for the new key to use
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
    rooms.forEach((room) => room.removeMember(client.id))
  }

  function getRoomsForClient(clientId) {
    const filteredRooms = []
    rooms.forEach((room) => {
      if (room.hasMember(clientId)) {
        filteredRooms.push(room)
      }
    })

    return filteredRooms
  }

  function serializeRooms() {
    return Array.from(rooms.values()).map((room) => room.serialize())
  }

  return {
    addRoom,
    removeRoom,
    getRoom,
    getRoomsForClient,
    createNewRoom,
    removeClient,
    serializeRooms
  }
}
