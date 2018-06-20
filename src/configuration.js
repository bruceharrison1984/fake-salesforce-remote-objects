class Configuration {
  constructor() {
    this.debugLevel = 1;
    this.requestDelay = 1000;
    this.errors = {
      create: false,
      retrieve: false,
      update: false
    };
  }
}

export default Configuration;
