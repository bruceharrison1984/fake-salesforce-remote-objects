import remoteObject from './remoteObject';
import logger from './logger';
import { getJsNamespace, getRemoteObjectModel } from './helpers';

class sfRemoteObject {
  constructor(jsNamespace, remoteObjectModels) {
    logger.logInfo('Fake SF Remote Objects Active');
    for (let i = 0; i < remoteObjectModels.length; i++) {
      const remoteObjectModel = remoteObjectModels[i];
      logger.logInfo(`Setting up fake remote object - Namespace: ${jsNamespace} | SFType: '${remoteObjectModel.name}' | JsShorthand: '${remoteObjectModel.jsshorthand}' | Fields: '${remoteObjectModel.fields.join(';')}'`);
      this[remoteObjectModel.name] = function (obj) {
        return new remoteObject(obj, remoteObjectModel.name, remoteObjectModel.jsshorthand, remoteObjectModel.fields);
      };
      if (remoteObjectModel.jsshorthand) {
        this[remoteObjectModel.jsshorthand] = function (obj) {
          return new remoteObject(obj, remoteObjectModel.name, remoteObjectModel.jsshorthand, remoteObjectModel.fields);
        };
      }
    }
  }
}

function buildRemoteObjectController() {
  let jsNamespace = getJsNamespace();
  if (jsNamespace === undefined) {
    logger.logDebug('No apex:remoteObjects could be found.\nThis typically means you have deployed fake-salesforce-remote-objects in to Salesforce.\nYour page will work normally, but you don\'t need to include this library when deploying.');
    return;
  }
  let remoteObjectModels = getRemoteObjectModel();
  window[jsNamespace] = new sfRemoteObject(jsNamespace, remoteObjectModels);
}

buildRemoteObjectController();

export default sfRemoteObject;
