const { makeHandleEvent, ensureExists } = require('./handle-events')

const TimerActions = {
  CREATE: {},
  START: {
    action: 'startTimer',
    event: 'started the timer!'
  },
  PAUSE: {
    action: 'pauseTimer',
    event: 'paused the timer!'
  },
  RESET: {
    action: 'resetTimer',
    event: 'reset the timer!'
  }
}

function handleTimers(client, clientManager, roomManager) {
  const { handleTimerEvent } = makeHandleEvent(
    client,
    clientManager,
    roomManager
  )

  function handleStartTimer(roomKey, cb) {
    handleTimerEvent(roomKey, TimerActions.START)
      .then(cb(null))
      .catch(cb)
  }

  function handlePauseTimer(roomKey, cb) {
    handleTimerEvent(roomKey, TimerActions.PAUSE)
      .then(cb(null))
      .catch(cb)
  }

  function handleResetTimer(roomKey, cb) {
    handleTimerEvent(roomKey, TimerActions.RESET)
      .then(cb(null))
      .catch(cb)
  }

  return {
    handleStartTimer,
    handlePauseTimer,
    handleResetTimer
  }
}

module.exports = {
  TimerActions,
  handleTimers
}
