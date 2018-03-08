class logger{

  static logInfo(message) {
    if (window.fakeRemoteConfig.debugLevel > 0) {
      console.debug(`%c [INFO] ${message}`, 'color: green; font-weight:bold;');
    }
  }

  static logDebug(message) {
    if (window.fakeRemoteConfig.debugLevel > 1) {
      console.debug(`%c [DEBUG] ${message}`, 'color: darkblue; font-weight:bold;');
    }
  }

  static logError(message) {
    console.error(`[ERROR] ${message}`);
  }
}

export default logger;

