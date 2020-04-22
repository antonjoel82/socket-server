const { makeHandleEvent, ensureExists } = require('./handle-events')

// interface Action {
// action: string
// event: string
// shouldTriggerMessage: boolean
// }

const TimerActions = {
  CREATE: {},
  START: {
    action: 'startTimer',
    event: 'started the timer!',
    shouldTriggerMessage: true,
  },
  PAUSE: {
    action: 'pauseTimer',
    event: 'paused the timer!',
    shouldTriggerMessage: true,
  },
  RESET: {
    action: 'resetTimer',
    event: 'reset the timer!',
    shouldTriggerMessage: true,
  },
}

function handleTimers(client, clientManager, roomManager) {
  const { handleTimerEvent } = makeHandleEvent(
    client,
    clientManager,
    roomManager
  )

  function handleStartTimer(roomKey, cb) {
    handleTimerEvent(roomKey, TimerActions.START).then(cb(null)).catch(cb)
  }

  function handlePauseTimer(roomKey, cb) {
    handleTimerEvent(roomKey, TimerActions.PAUSE).then(cb(null)).catch(cb)
  }

  function handleResetTimer(roomKey, cb) {
    handleTimerEvent(roomKey, TimerActions.RESET).then(cb(null)).catch(cb)
  }

  return {
    handleStartTimer,
    handlePauseTimer,
    handleResetTimer,
  }
}

module.exports = {
  TimerActions,
  handleTimers,
}
