/**
 *
 * @param {*} key unique identifier of the room
 */
module.exports = function(key) {
  const members = new Map()
  let chatHistory = []

  function getKey() {
    return key
  }

  function broadcastMessage(message) {
    addEntry(message) // TODO: remove this when I implement handle event
    members.forEach((member) => member.emit('message', message))
  }

  function addEntry(entry) {
    chatHistory = chatHistory.concat(entry)
  }

  function getChatHistory() {
    return chatHistory.slice()
  }

  function addMember(client) {
    members.set(client.id, client)
  }

  function removeMember(client) {
    members.delete(client.id)
  }

  function serialize() {
    return {
      key,
      numMembers: members.size
    }
  }

  return {
    getKey,
    broadcastMessage,
    addEntry,
    getChatHistory,
    addMember,
    removeMember,
    serialize
  }
}
