class logger{

  static logInfo(message) {
    console.debug(`%c [INFO] ${message}`, 'color: green; font-weight:bold;');
  }

  static logDebug(message) {
    console.debug(`%c [DEBUG] ${message}`, 'color: darkblue; font-weight:bold;');
  }

  static logError(message) {
    console.error(`[ERROR] ${message}`);
  }
}

export default logger;

