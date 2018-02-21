import remoteObject from './remoteObject';
import logger from './logger';
import { getJsNamespace, getRemoteObjectModel } from './helpers';

class sfRemoteObject {
  constructor(jsNamespace, remoteObjectModels) {
    logger.logInfo('Fake SF Remote Objects Active');
    for (let i = 0; i < remoteObjectModels.length; i++) {
      const remoteObjectModel = remoteObjectModels[i];
      logger.logInfo(`Setting up fake remote object - Namespace: ${jsNamespace} | SFType: '${remoteObjectModel.name}' | JsShorthand: '${remoteObjectModel.jsshorthand}' | Fields: '${remoteObjectModel.fields.join(';')}'`);
      this[remoteObjectModel.jsshorthand] = obj => new remoteObject(obj, remoteObjectModel.name, remoteObjectModel.jsshorthand, remoteObjectModel.fields);
    }
  }
}

function buildRemoteObjectController() {
  let jsNamespace = getJsNamespace();
  if (window[jsNamespace]) {
    throw new Error('Fake SF Objects is enabled on a deployed page! It should be removed from <scripts></scripts> before deploying!');
  }
  let remoteObjectModels = getRemoteObjectModel();
  window[jsNamespace] = new sfRemoteObject(jsNamespace, remoteObjectModels);
}

buildRemoteObjectController();

export default sfRemoteObjects;
