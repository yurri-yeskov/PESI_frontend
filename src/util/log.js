import clientLog from '../api/clientLog'
import store from '../store'

const LogLevels = {
  'TRACE': 0,
  'DEBUG': 1,
  'INFO': 2,
  'WARN': 3,
  'ERROR': 4,
  'NONE': 5
};
const Levels = Object.keys(LogLevels);

let CurrentLevel = LogLevels.TRACE
let ServerAppender = false
let ConsoleAppender = false

function getConsole(level) {
  let target = console.log
  switch (level) {
    case 0:
      target = console.trace
      break
    case 1:
      target = console.debug
      break
    case 2:
      target = console.info
      break
    case 3:
      target = console.warn
      break
    case 4:
      target = console.error
      break
  }
  return target
}

function log(level, message, ...paramObjects) {
  if (CurrentLevel <= level) {
    let formattedMessage = message.replace(/{(\d+)}/g, (match, number) => typeof paramObjects[number] !== 'undefined' ? paramObjects[number] : match)
    let targetMessage = `[${Levels[level]}] - ${formattedMessage}`

    if (ConsoleAppender) {
      getConsole(level)(targetMessage)
    }

    if (ServerAppender) {
      clientLog.send(Levels[level], store.getters.isDe ? 'DE' : 'Conseiller', store.getters.deviceInformations.deviceName, store.getters.deviceInformations.serial,
        store.getters.deviceInformations.systemSoftware, store.getters.deviceInformations.mac,
        formattedMessage).catch(error => {
          if (ConsoleAppender) {
            getConsole(level)('Could not send message to server : ' + error)
          }
        })
    }
  }
}

export default {
  LogLevels: LogLevels,

  setLogLevel(level) {
    if (typeof level === 'string' && Levels.indexOf(level.toUpperCase()) >= LogLevels.TRACE) {
      CurrentLevel = Levels.indexOf(level.toUpperCase())
    } else if (typeof level === 'number' && level >= LogLevels.TRACE && level <= LogLevels.NONE) {
      CurrentLevel = level
    } else {
      console.error(`Unknown level '${level}'`)
    }
  },

  setLogToConsole(active) {
    ConsoleAppender = active
  },

  setLogToServer(active) {
    ServerAppender = active
  },

  trace(message, ...paramObjects) {
    log(LogLevels.TRACE, message, ...paramObjects)
  },

  debug(message, ...paramObjects) {
    log(LogLevels.DEBUG, message, ...paramObjects)
  },

  info(message, ...paramObjects) {
    log(LogLevels.INFO, message, ...paramObjects)
  },

  warn(message, ...paramObjects) {
    log(LogLevels.WARN, message, ...paramObjects)
  },

  error(message, ...paramObjects) {
    log(LogLevels.ERROR, message, ...paramObjects)
  }
}
