import remoteObject from './src/remoteObject';
import logger from './src/logger';
import { getJsNamespace, getRemoteObjectModel } from './src/helpers';

class sfRemoteObject {
  constructor() {
    this.jsNamespace = getJsNamespace();
    if (this.jsNamespace === undefined) {
      logger.logDebug('No apex:remoteObjects could be found.\nThis typically means you have deployed fake-salesforce-remote-objects in to Salesforce.\nYour page will work normally, but you don\'t need to include this library when deploying.');
      return;
    }
    this.remoteObjectModels = getRemoteObjectModel();

    logger.logDebug('Fake SF Remote Objects Active');
    for (let i = 0; i < this.remoteObjectModels.length; i++) {
      const remoteObjectModel = this.remoteObjectModels[i];
      logger.logDebug(`Setting up fake remote object - Namespace: ${this.jsNamespace} | SFType: '${remoteObjectModel.sfObjectType}' | JsShorthand: '${remoteObjectModel.shorthandName}' \n Fields: ${JSON.stringify(remoteObjectModel.definedFields, null, 2)}`);
      this[remoteObjectModel.sfObjectType] = function (obj) {
        return new remoteObject(obj, remoteObjectModel);
      };
      if (remoteObjectModel.shorthandName) {
        this[remoteObjectModel.shorthandName] = function (obj) {
          return new remoteObject(obj, remoteObjectModel);
        };
      }
    }

    window[this.jsNamespace] = this;
  }
}

new sfRemoteObject();

export default sfRemoteObject;
