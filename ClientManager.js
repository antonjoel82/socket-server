module.exports = function() {
  // clientId => { client, }
  const clients = new Map()

  function addClient(client) {
    clients.set(client.id, { client })
  }

  function registerClient(client, user) {
    clients.set(client.id, { client, user })
  }

  function removeClient(client) {
    clients.delete(client.id)
  }

  // TODO?
  // I ignored all user templates / user availability

  return {
    addClient,
    registerClient,
    removeClient
  }
}
