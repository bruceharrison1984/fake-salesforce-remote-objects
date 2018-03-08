import remoteObject from './src/remoteObject';
import logger from './src/logger';
import { getJsNamespace, getRemoteObjectModel } from './src/helpers';

class sfRemoteObject {
  constructor() {
    this._jsNamespace = getJsNamespace();
    if (this._jsNamespace === undefined) {
      logger.logDebug('No apex:remoteObjects could be found in DOM. Add them to your page to begin using fake-salesforce-remote-objects');
      return;
    }
    this._remoteObjectModels = getRemoteObjectModel();

    logger.logDebug('Fake SF Remote Objects Active');
    for (let i = 0; i < this._remoteObjectModels.length; i++) {
      const remoteObjectModel = this._remoteObjectModels[i];
      logger.logDebug(`Setting up fake remote object - Namespace: ${this._jsNamespace} | SFType: '${remoteObjectModel.sfObjectType}' | JsShorthand: '${remoteObjectModel.shorthandName}' \n Fields: ${JSON.stringify(remoteObjectModel.definedFields, null, 2)}`);
      this[remoteObjectModel.sfObjectType] = function (obj) {
        return new remoteObject(obj, remoteObjectModel);
      };
      if (remoteObjectModel.shorthandName) {
        this[remoteObjectModel.shorthandName] = function (obj) {
          return new remoteObject(obj, remoteObjectModel);
        };
      }
    }
    window[this._jsNamespace] = this;
  }
}

if (window.location.hostname.indexOf('force.com') > -1) {
  logger.logDebug('force.com domain detected, disabling fake-salesforce-remote-objects. You should remove this dependency when deploying!');
} else {
  new sfRemoteObject();
}

export default sfRemoteObject;
