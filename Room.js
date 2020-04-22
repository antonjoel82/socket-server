/**
 *
 * @param {*} key unique identifier of the room
 */
module.exports = function (key) {
  const members = new Map()
  let chatHistory = []

  function getKey() {
    return key
  }

  function broadcastMessage(message) {
    broadcastAction('message', message, false)
  }

  function broadcastAction(action, content, shouldEmitMessage = true) {
    console.log(`Emitting action [${action}] for ${getKey()}`)
    members.forEach((member) => {
      // console.log(`Emitting action [${action}] for ${JSON.stringify(member)}`)

      // Prevent message actions from double-emitting
      if (shouldEmitMessage && action !== 'message') {
        member.emit('message', content)
      }

      return member.emit(action, content)
    })
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

  function removeMember(clientId) {
    members.delete(clientId)
  }

  function hasMember(clientId) {
    return members.has(clientId)
  }

  function serialize() {
    return {
      key,
      numMembers: members.size,
    }
  }

  return {
    getKey,
    broadcastMessage,
    broadcastAction,
    addEntry,
    getChatHistory,
    addMember,
    hasMember,
    removeMember,
    serialize,
  }
}
