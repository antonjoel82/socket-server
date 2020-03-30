module.exports = function() {
  // clientId => { client, }
  const clients = new Map()

  function createUser(username, clientId) {
    return {
      name: username,
      clientId
    }
  }

  function addClient(client) {
    clients.set(client.id, { client })
  }

  function registerClient(client, user) {
    clients.set(client.id, { client, user })
  }

  function hasClient(clientId) {
    return clients.has(clientId)
  }

  function removeClient(client) {
    clients.delete(client.id)
  }

  function getUserByClientId(clientId) {
    const entry = clients.get(clientId)
    return entry ? entry.user : undefined
  }

  function getAllClients() {
    return clients
  }

  // TODO?
  // I ignored all user templates / user availability

  return {
    createUser,
    getUserByClientId,
    getAllClients,
    addClient,
    registerClient,
    hasClient,
    removeClient
  }
}
