class logger{

  static logInfo(message) {
    console.debug(`%c ${message}`, 'color: green; font-weight:bold;');
  }

  static logDebug(message) {
    console.debug(`%c ${message}`, 'color: darkblue; font-weight:bold;');
  }

  static logError(message) {
    console.error(message);
  }
}

export default logger;

